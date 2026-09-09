/* ===========================================================
   PM Sheets — Theme-Umschalter
   Verwaltet das Farbschema (data-theme Attribut auf <html>) und baut den
   kleinen schwebenden Knopf unten rechts mit dem Auswahlfenster dafür.
   Die eigentlichen Farben stecken in styles.css als CSS-Variablen
   (siehe die :root[data-theme="..."]-Blöcke dort).
   =========================================================== */

(function () {
  const STORAGE_KEY = "pm-theme";
  const DEFAULT_THEME = "hitachi"; // Standard-Theme für neue Besucher (noch nichts gespeichert)

  // Liste aller verfügbaren Themes. "swatch" sind drei Beispielfarben
  // (Hintergrund, Akzent, Text), die als kleiner Farbkreis angezeigt werden.
  const THEMES = [
    { key: "hitachi", label: "Hitachi Energy", swatch: ["#0c0c0c", "#fa0011", "#ffffff"] },
    { key: "industrial", label: "Industrial Blue", swatch: ["#1c2530", "#2f6fed", "#f5f6f8"] },
    { key: "dark", label: "Dark", swatch: ["#12161c", "#4c8dff", "#e6eaf0"] },
    { key: "tokyonight", label: "Tokyo Night", swatch: ["#1a1b26", "#7aa2f7", "#c0caf5"] },
    { key: "catppuccin", label: "Catppuccin", swatch: ["#1e1e2e", "#cba6f7", "#cdd6f4"] },
  ];

  // Liefert das aktuell aktive Theme (ohne Attribut = Standard-Theme).
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
  }

  // Setzt das Theme-Attribut auf <html> und merkt sich die Wahl im Browser.
  function applyTheme(key) {
    if (key === "industrial") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", key);
    }
    localStorage.setItem(STORAGE_KEY, key);
    // Logo/Icon oben links sofort anpassen (z.B. echtes Hitachi-Logo beim Hitachi-Theme),
    // ohne dass die Seite neu geladen werden muss.
    if (window.PM_BRAND) window.PM_BRAND.refresh();
  }

  // Gespeichertes Theme (oder das Standard-Theme, falls noch nichts gewählt
  // wurde) sofort anwenden. Für die "richtige" Seite passiert das schon ganz
  // am Anfang von <head> (siehe index.html), damit beim Laden nicht kurz ein
  // falsches Theme aufblitzt — das hier ist nur eine zusätzliche Absicherung,
  // falls dieses Skript woanders eingebunden wird.
  applyTheme(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);

  // Baut den kleinen Farbkreis (3 Streifen) für eine Theme-Option.
  function swatchMarkup(colors) {
    return `<span class="theme-swatch">${colors.map((c) => `<span style="background:${c}"></span>`).join("")}</span>`;
  }

  // Baut eine einzelne Zeile im Auswahlfenster.
  function optionMarkup(theme) {
    const active = theme.key === currentTheme();
    return `
      <div class="theme-option${active ? " active" : ""}" data-theme-key="${theme.key}">
        ${swatchMarkup(theme.swatch)}
        <span>${theme.label}</span>
        <span class="check">${window.PM_ICONS.check}</span>
      </div>`;
  }

  // Baut den schwebenden Knopf + das Auswahlfenster und hängt beides ans Ende der Seite.
  function buildSwitcher() {
    const wrap = document.createElement("div");
    wrap.className = "theme-switcher no-print"; // no-print: beim PDF-Export ausgeblendet
    wrap.innerHTML = `
      <button type="button" class="theme-toggle-btn" id="theme-toggle-btn" title="Theme ändern" aria-label="Theme ändern">
        ${window.PM_ICONS.palette}
      </button>
      <div class="theme-panel" id="theme-panel">
        ${THEMES.map(optionMarkup).join("")}
      </div>
    `;
    document.body.appendChild(wrap);

    const panel = wrap.querySelector("#theme-panel");
    const toggleBtn = wrap.querySelector("#theme-toggle-btn");

    // Knopf klicken: Fenster auf-/zuklappen.
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });

    // Eine Theme-Option klicken: Theme anwenden, Häkchen aktualisieren, Fenster schließen.
    panel.addEventListener("click", (e) => {
      const opt = e.target.closest(".theme-option");
      if (!opt) return;
      applyTheme(opt.dataset.themeKey);
      panel.querySelectorAll(".theme-option").forEach((o) => o.classList.toggle("active", o === opt));
      panel.classList.remove("open");
    });

    // Außerhalb klicken oder Escape drücken schließt das Fenster wieder.
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) panel.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") panel.classList.remove("open");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSwitcher);
  } else {
    buildSwitcher();
  }
})();
