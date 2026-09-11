/* ===========================================================
   PM Sheets — gemeinsame Runtime (Motor für alle PM-Sheets)
   Baut ein PM-Sheet aus einem Datenschema (window.PM_SHEET) auf,
   verwaltet Status/Kommentare, Messwerte, Autospeichern, Fortschrittsanzeige
   und Drucken/Zurücksetzen.
   =========================================================== */

(function () {
  const ICONS = window.PM_ICONS;

  // Die vier möglichen Zustände für jeden Arbeitsschritt.
  const STATES = [
    { key: "pending", label: "Pending", icon: "dash" },
    { key: "ongoing", label: "Ongoing", icon: "clock" },
    { key: "done", label: "Done", icon: "check" },
    { key: "notneeded", label: "N/A", icon: "slash" },
  ];

  // Heutiges Datum als String (YYYY-MM-DD) für das Datumsfeld.
  function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  // Aktuelle Uhrzeit als String (HH:MM) für das Startzeit-Feld.
  function nowTimeStr() {
    const d = new Date();
    return d.toTimeString().slice(0, 5);
  }

  // Wandelt einen Text in einen URL-/ID-freundlichen "Slug" um (aktuell ungenutzt).
  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Baut den Schlüssel, unter dem der Fortschritt im localStorage gespeichert wird.
  // Pro Sheet und Datum ein eigener Schlüssel, damit sich verschiedene Tage nicht überschreiben.
  function storageKey(schema, dateValue) {
    return `pm-sheet::${schema.id}::${dateValue || "undated"}`;
  }

  // Kleine Helfer-Funktion zum Erzeugen eines HTML-Elements mit Klasse und Inhalt.
  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  // Eindeutige ID für einen Arbeitsschritt anhand von Abschnitt- und Schritt-Index.
  function buildStepId(sectionIdx, stepIdx) {
    return `s${sectionIdx}-${stepIdx}`;
  }

  // Eindeutige ID für eine einzelne Messwert-Zelle (Abschnitt + Zeile + Spalte).
  function buildReadingId(sectionIdx, rowIdx, colKey) {
    return `r${sectionIdx}-${rowIdx}-${colKey}`;
  }

  // Prüft einen eingegebenen Messwert gegen die Spezifikation einer Spalte/Zeile.
  // Gibt "ok" | "warn" | "bad" zurück, oder null wenn (noch) nichts sinnvoll geprüft werden kann.
  function evaluateRule(value, rule) {
    if (!rule || value === "" || value === undefined || value === null) return null;
    const num = parseFloat(value);
    if (Number.isNaN(num)) return null;

    if (rule.type === "max") {
      // z.B. Liner/Boot-Lebensdauer: grün bis warnRatio des Limits, dann orange, ab dem Limit rot.
      const warnRatio = rule.warnRatio ?? 0.9;
      if (num >= rule.limit) return "bad";
      if (num >= rule.limit * warnRatio) return "warn";
      return "ok";
    }
    if (rule.type === "min") {
      // z.B. Bubbler-Level: muss über einem Mindestwert liegen.
      return num >= rule.limit ? "ok" : "bad";
    }
    if (rule.type === "range") {
      // z.B. Bubbler-Temperatur: muss innerhalb +/- Toleranz um einen Zielwert liegen.
      return Math.abs(num - rule.target) <= rule.tolerance ? "ok" : "bad";
    }
    return null;
  }

  // Verschmilzt die Spalten-Regel mit einer eventuellen Zeilen-Überschreibung
  // (z.B. weil jede Maschine im "ASM Lifetime"-Abschnitt ein anderes Limit hat).
  // Liefert null, wenn für diese Zelle gar keine (vollständige) Regel gilt -> Zelle wird als "N/A" angezeigt.
  // Wichtig: eine Regel ohne Limit/Zielwert (z.B. weil eine Zeile kein Override dafür mitgibt)
  // gilt NICHT als gültig — sonst würde evaluateRule() sie faelschlich als "ok" durchgehen lassen.
  function resolveRule(column, row) {
    const override = row.overrides && row.overrides[column.key];
    if (override === null) return null; // Zeile sagt ausdrücklich: hier gibt es keinen Wert (N/A)
    const rule = override ? Object.assign({}, column.rule, override) : column.rule;
    if (!rule) return null;
    if ((rule.type === "max" || rule.type === "min") && typeof rule.limit !== "number") return null;
    if (rule.type === "range" && (typeof rule.target !== "number" || typeof rule.tolerance !== "number")) return null;
    return rule;
  }

  // Erstellt eine Runtime-Instanz für ein konkretes PM-Sheet (schema = Inhalt aus data.js).
  function createRuntime(schema) {
    // state hält alle vom Nutzer eingegebenen Daten: Kopfzeile, Status/Kommentare pro Schritt,
    // Messwerte in Tabellen-Abschnitten, und die allgemeinen Notizen.
    let state = {
      meta: {},
      steps: {}, // id -> { status, comment }
      readings: {}, // id -> Messwert als Text
      notes: "",
    };

    const root = document.getElementById("pm-root");
    let saveTimer = null;
    let hasSavedState = false; // true, wenn beim Laden bereits gespeicherte Daten gefunden wurden

    // Liefert den automatischen Startwert für ein Kopfzeilen-Feld (z.B. heutiges Datum,
    // oder ein fester Text wie "Weekly PM" über field.default).
    function defaultMetaValue(field) {
      if (field.auto === "today") return todayStr();
      if (field.auto === "now") return nowTimeStr();
      if (field.default !== undefined) return field.default;
      return "";
    }

    // Setzt den Zustand auf die Ausgangswerte zurück (alle Schritte = "pending", alle Messwerte leer).
    function initState() {
      schema.meta.forEach((f) => {
        state.meta[f.key] = defaultMetaValue(f);
      });
      schema.sections.forEach((section, si) => {
        if (section.type === "readings") {
          section.rows.forEach((row, ri) => {
            section.columns.forEach((col) => {
              state.readings[buildReadingId(si, ri, col.key)] = "";
            });
          });
        } else {
          section.steps.forEach((step, ti) => {
            state.steps[buildStepId(si, ti)] = { status: "pending", comment: "" };
          });
        }
      });
    }

    // Welches Datum gerade gilt (für den Speicher-Schlüssel) — entweder das eingetragene oder heute.
    function currentDateKey() {
      return state.meta.date || todayStr();
    }

    // Lädt einen zuvor gespeicherten Stand aus dem localStorage, falls vorhanden.
    function loadSaved() {
      const key = storageKey(schema, currentDateKey());
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }

    // Speichert den aktuellen Zustand im Browser (localStorage), damit nichts verloren geht.
    function persist(silent) {
      const key = storageKey(schema, currentDateKey());
      localStorage.setItem(key, JSON.stringify(state));
      if (!silent) flashSaveIndicator();
    }

    // Verzögertes Speichern: wartet 400ms nach der letzten Änderung, statt bei jedem Tastendruck zu speichern.
    function scheduleSave() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => persist(false), 400);
    }

    // Zeigt kurz "Saved just now" in der Aktionsleiste an.
    function flashSaveIndicator() {
      const ind = document.getElementById("save-indicator");
      if (!ind) return;
      ind.textContent = "Saved just now";
      ind.dataset.savedAt = Date.now();
    }

    // Berechnet den Fortschritt: wie viele Checklisten-Schritte nicht mehr "pending" sind.
    // (Messwert-Tabellen zählen bewusst nicht mit, die haben keinen einzelnen "erledigt"-Status.)
    function progress() {
      const ids = Object.keys(state.steps);
      const counted = ids.filter((id) => state.steps[id].status !== "pending");
      return {
        total: ids.length,
        done: counted.length,
        pct: ids.length ? Math.round((counted.length / ids.length) * 100) : 0,
      };
    }

    // Aktualisiert die Fortschrittsanzeige (Balken + Prozent) oben in der Kopfleiste.
    function updateProgressUI() {
      const { pct } = progress();
      const fill = document.getElementById("progress-fill");
      const pctLabel = document.getElementById("progress-pct");
      if (fill) fill.style.width = pct + "%";
      if (pctLabel) pctLabel.textContent = pct + "%";
    }

    // Baut die dunkle Kopfleiste mit Titel und Fortschrittsbalken.
    function renderTopbar() {
      const bar = el("header", "app-topbar");
      bar.innerHTML = `
        <div class="brand">
          ${window.PM_BRAND.markup()}
        </div>
        <div class="brand-text">
          <div class="sheet-title">${schema.title}</div>
          <div class="sheet-subtitle">${schema.pmType}</div>
        </div>
        <div class="topbar-progress">
          <div class="bar-track"><div class="bar-fill" id="progress-fill" style="width:0%"></div></div>
          <span class="pct" id="progress-pct">0%</span>
        </div>
      `;
      return bar;
    }

    // Baut die Kopfdaten-Karte (Name, System-ID, Datum, Start-/Endzeit) aus dem Schema.
    function renderMetaCard() {
      const card = el("div", "meta-card");
      schema.meta.forEach((field) => {
        const wrap = el("div", "meta-field" + (field.readonly ? " readonly" : ""));
        const label = el("label", null, field.label);
        label.setAttribute("for", "meta-" + field.key);
        wrap.appendChild(label);

        let input;
        if (field.type === "select") {
          // Dropdown-Feld (z.B. Namensliste oder Tool-IDs)
          input = el("select");
          const emptyOpt = el("option", null, "Select...");
          emptyOpt.value = "";
          input.appendChild(emptyOpt);
          field.options.forEach((opt) => {
            const o = el("option", null, opt.label || opt);
            o.value = opt.value || opt;
            input.appendChild(o);
          });
        } else {
          // Text-, Datum- oder Uhrzeit-Feld
          input = el("input");
          input.type = field.type === "date" ? "date" : field.type === "time" ? "time" : "text";
        }
        input.id = "meta-" + field.key;
        input.value = state.meta[field.key] || "";
        if (field.readonly) input.readOnly = true;

        // Bei jeder Eingabe/Änderung den Wert merken und (verzögert) speichern.
        input.addEventListener("input", () => {
          state.meta[field.key] = input.value;
          scheduleSave();
        });
        input.addEventListener("change", () => {
          state.meta[field.key] = input.value;
          scheduleSave();
        });

        wrap.appendChild(input);
        card.appendChild(wrap);
      });
      return card;
    }

    // Erzeugt die vier Status-Knöpfe (Pending/Ongoing/Done/N-A) für einen Schritt.
    function statusButtonMarkup(stepId, activeState) {
      return STATES.map(
        (s) => `
        <button type="button" class="status-btn${s.key === activeState ? " active" : ""}" data-state="${s.key}" data-step="${stepId}" title="${s.label}">
          ${ICONS[s.icon]}<span>${s.label}</span>
        </button>`
      ).join("");
    }

    // Liefert den lesbaren Text (Label) für einen Status-Schlüssel.
    function statusLabel(stateKey) {
      return STATES.find((s) => s.key === stateKey).label;
    }

    // Erzeugt das kleine Status-"Pill" (farbige Kapsel), das nur im PDF-Ausdruck sichtbar ist,
    // weil auf dem Bildschirm stattdessen die klickbaren Status-Knöpfe angezeigt werden.
    function statusPillMarkup(stepId, activeState) {
      return `<span class="status-pill" data-state="${activeState}" data-step-pill="${stepId}">${statusLabel(activeState)}</span>`;
    }

    // Baut eine einzelne Checklisten-Zeile — normal oder als hervorgehobener
    // Hinweis-Banner, wenn step.kind === "callout" (z.B. "Ensure production is informed").
    function renderStepRow(step, stepId) {
      const isCallout = step.kind === "callout";
      const row = el("div", "step-row" + (isCallout ? " step-row--callout" : ""));
      const main = el("div", "step-main");
      main.innerHTML = `
        <div class="step-text">${isCallout ? ICONS.alert : ""}<span>${step.text}</span></div>
        ${step.reference ? `<div class="step-reference">${ICONS.info}<span>${step.reference}</span></div>` : ""}
        <textarea class="step-comment" placeholder="Comment (optional)" data-step="${stepId}">${state.steps[stepId].comment || ""}</textarea>
      `;
      const controlWrap = el("div", "status-control");
      controlWrap.innerHTML = statusButtonMarkup(stepId, state.steps[stepId].status);

      row.appendChild(main);
      row.appendChild(controlWrap);
      // Das Pill wird zusätzlich eingefügt, aber per CSS nur beim Drucken sichtbar gemacht.
      row.insertAdjacentHTML("beforeend", statusPillMarkup(stepId, state.steps[stepId].status));
      return row;
    }

    // Kleine Hinweisleiste mit einer Spezifikation, die für den ganzen Abschnitt gilt
    // (z.B. "Check if the Drains are opening and closing correctly" für 6 Maschinen),
    // statt sie bei jedem einzelnen Schritt zu wiederholen.
    function renderLegend(text) {
      const legend = el("div", "section-legend");
      legend.innerHTML = `${ICONS.info}<span>${text}</span>`;
      return legend;
    }

    // Baut einen normalen Checklisten-Abschnitt (z.B. "Remove Tube") mit allen Arbeitsschritten.
    function renderChecklistSection(section, si) {
      const card = el("div", "section-card");
      const head = el("div", "section-head");
      head.innerHTML = `<h2>${section.title}</h2><span class="section-count">${section.steps.length} steps</span>`;
      card.appendChild(head);

      if (section.note) card.appendChild(renderLegend(section.note));

      section.steps.forEach((step, ti) => {
        card.appendChild(renderStepRow(step, buildStepId(si, ti)));
      });

      return card;
    }

    // Baut die Kopfzeile einer Messwert-Tabelle (Maschine + eine Spalte pro Messgröße).
    function readingsHeadRow(section) {
      const cols = section.columns.map((c) => `<th>${c.label}${c.suffix ? ` <span class="unit">(${c.suffix})</span>` : ""}</th>`).join("");
      return `<tr><th class="machine-col">Machine</th>${cols}</tr>`;
    }

    // Baut eine einzelne Zeile (eine Maschine) der Messwert-Tabelle.
    function readingsBodyRow(section, row, ri, si) {
      const cells = section.columns
        .map((col) => {
          const rule = resolveRule(col, row);
          const id = buildReadingId(si, ri, col.key);
          if (!rule) {
            return `<td class="reading-cell reading-cell--na">N/A</td>`;
          }
          const value = state.readings[id] || "";
          const status = evaluateRule(value, rule);
          return `<td class="reading-cell" data-reading-status="${status || ""}">
            <input type="number" inputmode="decimal" class="reading-input" data-reading="${id}" value="${value}">
          </td>`;
        })
        .join("");
      return `<tr><td class="machine-col">${row.machine}</td>${cells}</tr>`;
    }

    // Baut einen Messwert-Abschnitt (z.B. "ASM Lifetime", "Bubbler Check"): eine Tabelle mit
    // einer Zeile pro Maschine, die Zellen färben sich automatisch nach der Spezifikation ein.
    function renderReadingsSection(section, si) {
      const card = el("div", "section-card");
      const head = el("div", "section-head");
      head.innerHTML = `<h2>${section.title}</h2><span class="section-count">${section.rows.length} machines</span>`;
      card.appendChild(head);

      if (section.legend) card.appendChild(renderLegend(section.legend));

      const wrap = el("div", "readings-table-wrap");
      const table = el("table", "readings-table");
      table.innerHTML = `
        <thead>${readingsHeadRow(section)}</thead>
        <tbody>${section.rows.map((row, ri) => readingsBodyRow(section, row, ri, si)).join("")}</tbody>
      `;
      wrap.appendChild(table);
      card.appendChild(wrap);
      return card;
    }

    // Baut einen Abschnitt — Checkliste oder Messwert-Tabelle, je nach section.type.
    function renderSection(section, si) {
      return section.type === "readings" ? renderReadingsSection(section, si) : renderChecklistSection(section, si);
    }

    // Baut das freie Kommentarfeld am Ende des Sheets (allgemeine Notizen/Probleme).
    function renderNotes() {
      const card = el("div", "notes-card");
      card.innerHTML = `
        <h2>Comments / Issues</h2>
        <p class="hint">Anything worth flagging for the next PM or for the tool history.</p>
        <textarea id="global-notes" placeholder="e.g. Issue with tool computer/MSC...">${state.notes || ""}</textarea>
      `;
      return card;
    }

    // Baut die schwebende Aktionsleiste unten mit "Zurücksetzen" und "Als PDF exportieren".
    function renderActionBar() {
      const bar = el("div", "action-bar no-print");
      bar.innerHTML = `
        <span class="save-state" id="save-indicator">${hasSavedState ? "Restored from your last visit" : "Not saved yet"}</span>
        <button type="button" class="btn btn-ghost" id="btn-reset">${ICONS.refresh}<span>Reset</span></button>
        <button type="button" class="btn btn-primary" id="btn-print">${ICONS.printer}<span>Export PDF</span></button>
      `;
      return bar;
    }

    // Registriert alle Klick-/Eingabe-Ereignisse für die Bedienung des Sheets.
    function bindEvents(container) {
      // Klick auf einen Status-Knopf: Status merken, Knöpfe/Pill aktualisieren, speichern.
      container.addEventListener("click", (e) => {
        const btn = e.target.closest(".status-btn");
        if (!btn) return;
        const stepId = btn.dataset.step;
        state.steps[stepId].status = btn.dataset.state;
        container
          .querySelectorAll(`.status-btn[data-step="${stepId}"]`)
          .forEach((b) => b.classList.toggle("active", b.dataset.state === btn.dataset.state));
        const pill = container.querySelector(`[data-step-pill="${stepId}"]`);
        if (pill) {
          pill.dataset.state = btn.dataset.state;
          pill.textContent = statusLabel(btn.dataset.state);
        }
        updateProgressUI();
        scheduleSave();
      });

      // Eingabe in ein Kommentarfeld, das allgemeine Notizfeld, oder eine Messwert-Zelle übernehmen.
      container.addEventListener("input", (e) => {
        if (e.target.classList.contains("step-comment")) {
          const stepId = e.target.dataset.step;
          state.steps[stepId].comment = e.target.value;
          scheduleSave();
        }
        if (e.target.id === "global-notes") {
          state.notes = e.target.value;
          scheduleSave();
        }
        if (e.target.classList.contains("reading-input")) {
          const id = e.target.dataset.reading;
          state.readings[id] = e.target.value;
          // Nur die Farbe dieser einen Zelle neu berechnen, statt die ganze Seite neu zu bauen.
          updateReadingCellColor(e.target);
          scheduleSave();
        }
      });

      // Klicks auf die Aktionsleiste: Drucken/als PDF exportieren oder Sheet zurücksetzen.
      document.addEventListener("click", (e) => {
        if (e.target.closest("#btn-print")) {
          window.print();
        }
        if (e.target.closest("#btn-reset")) {
          if (confirm("Reset this PM sheet? All statuses and comments for this date will be cleared.")) {
            localStorage.removeItem(storageKey(schema, currentDateKey()));
            initState();
            render();
          }
        }
      });
    }

    // Berechnet für eine einzelne Messwert-Eingabe die passende Ampelfarbe neu
    // (grün/orange/rot je nach Spezifikation) und setzt sie auf die umgebende Zelle.
    function updateReadingCellColor(input) {
      const id = input.dataset.reading;
      const match = id.match(/^r(\d+)-(\d+)-(.+)$/);
      if (!match) return;
      const [, si, ri, colKey] = match;
      const section = schema.sections[Number(si)];
      const row = section.rows[Number(ri)];
      const col = section.columns.find((c) => c.key === colKey);
      const rule = resolveRule(col, row);
      const status = evaluateRule(input.value, rule);
      input.closest(".reading-cell").dataset.readingStatus = status || "";
    }

    // Baut die komplette Seite neu auf (wird beim Start und nach einem Reset aufgerufen).
    function render() {
      root.innerHTML = "";
      document.title = schema.title + " — PM Sheet";

      root.appendChild(renderTopbar());

      const main = el("main", "app-main");
      main.appendChild(renderMetaCard());
      schema.sections.forEach((section, si) => main.appendChild(renderSection(section, si)));
      main.appendChild(renderNotes());
      root.appendChild(main);

      root.appendChild(renderActionBar());

      updateProgressUI();
      bindEvents(root);
    }

    // Übernimmt einen gespeicherten Stand, aber nur für IDs, die es im aktuellen
    // Schema noch gibt. Schritt-IDs sind positionsbasiert (s0-3, r1-2-liner, ...) —
    // wenn später ein Schritt mitten in einem Abschnitt eingefügt/entfernt wird,
    // verschieben sich alle folgenden IDs. Ein blindes Object.assign würde dann
    // mit alten, nicht mehr passenden Daten abstürzen (siehe renderStepRow).
    function mergeSaved(saved) {
      if (saved.meta) Object.assign(state.meta, saved.meta);
      if (saved.steps) {
        Object.keys(state.steps).forEach((id) => {
          if (saved.steps[id]) state.steps[id] = saved.steps[id];
        });
      }
      if (saved.readings) {
        Object.keys(state.readings).forEach((id) => {
          if (saved.readings[id] !== undefined) state.readings[id] = saved.readings[id];
        });
      }
      if (typeof saved.notes === "string") state.notes = saved.notes;
    }

    // Startpunkt: Zustand initialisieren, gespeicherten Fortschritt laden (falls vorhanden), anzeigen.
    function boot() {
      initState();
      const saved = loadSaved();
      if (saved) {
        mergeSaved(saved);
        hasSavedState = true;
      }
      render();
      persist(true);
    }

    return { boot };
  }

  window.PM_RUNTIME = { createRuntime };
})();
