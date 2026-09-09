# Adding a new PM sheet

Porting another Excel PM sheet into this app means writing one small data file
and one thin HTML shell — you don't need to touch the shared styling or the
runtime engine (`assets/styles.css`, `assets/sheet-runtime.js`, `assets/theme.js`,
`assets/icons.js`).

## 1. Create a folder for the sheet

```
AI_edition/sheets/<your-sheet-id>/
```

Use a short, URL-safe slug for `<your-sheet-id>` (lowercase, hyphens), e.g.
`sheets/asm-boat-exchange/`. Look at `sheets/asm-tubechange/` as a working example.

## 2. Write `data.js`

This is the only file where you actually transcribe the Excel content. It
defines one object, `window.PM_SHEET`:

```js
window.PM_SHEET = {
  id: "asm-boat-exchange",       // must match the folder name above
  title: "ASM Boat Exchange",    // shown as the big title in the header bar
  pmType: "ASM_BoatExchange",    // small subtitle under the title

  // meta = the fields at the top of the sheet (name, tool ID, date, times...)
  meta: [
    {
      key: "user",               // internal field key (used to store the answer)
      label: "User ID",          // label shown above the field
      type: "select",            // "select" | "text" | "date" | "time"
      options: [                 // only for type: "select"
        { value: "jonas", label: "Jonas Steinmann" },
        { value: "luke", label: "Luke Folan" },
        // ...same list as the other sheets, copy from an existing data.js
      ],
    },
    {
      key: "systemId",
      label: "System ID",
      type: "select",
      options: ["QD541.1", "QD541.2", "QD542.1"], // plain strings work too
    },
    { key: "date", label: "Date", type: "date", auto: "today" }, // auto-fills today's date
    { key: "startTime", label: "Start Time", type: "time", auto: "now" }, // auto-fills the current time
    { key: "endTime", label: "End Time", type: "time" }, // left empty, filled in manually
    // A fixed value instead of a real input — useful for sheets that always
    // cover the same thing (see sheets/diffusion-weekly-pm/data.js).
    { key: "note", label: "Note", type: "text", default: "Weekly PM", readonly: true },
  ],

  // sections = the work blocks of the PM, in the same order as the Excel sheet.
  // Two kinds of section exist: the default checklist, and "readings" tables
  // for per-machine measurements (see further down).
  sections: [
    {
      title: "Preparation",
      // "note" (optional) shows once under the section title instead of
      // repeating the same reference text on every single step.
      note: "Applies to all machines below",
      steps: [
        { text: "Prepare all parts." },
        // "reference" is optional — use it for setpoints/hints from the
        // Excel "Reference Data" column. It's shown as a small note under the step.
        { text: "Cooldown reactor", reference: "Cooldown Temperature: 25°C · Ramp: -2°C/min" },
        // kind: "callout" renders as a highlighted red banner instead of a
        // normal row — use it for the "before you start" / safety warnings
        // that were red-filled rows in the Excel sheet. Still has its own
        // status control and comment box like any other step.
        { kind: "callout", text: "Ensure production is informed of PM action" },
      ],
    },
    {
      title: "Next section...",
      steps: [
        { text: "..." },
      ],
    },
    // one object per Excel section, in order
  ],
};
```

Notes:
- Every step automatically gets the Pending / Ongoing / Done / N/A status control
  and a comment box — you don't declare those, the runtime adds them.
- There's no limit on the number of sections or steps.
- If a step has no reference data, just omit the `reference` key entirely.

### Measurement tables ("readings" sections)

Some Excel sheets are mostly a grid of per-machine numbers (lifetime counters,
bubbler level/temperature, etc.) rather than a linear checklist. For those,
use `type: "readings"` instead of a plain `steps` list — it renders a real
number-input table, and each cell automatically colors green/orange/red based
on a specification you define (no manual color-coding needed):

```js
{
  title: "Bubbler Check",
  type: "readings",
  legend: "Level > 15%  ·  Temp 20°C (± 0.5°C)", // shown once under the title
  columns: [
    // rule.type: "min" (value must be >= limit), "max" (value must stay
    // below limit — colors orange near it, red once reached/over), or
    // "range" (value must stay within +/- tolerance of a target).
    { key: "level", label: "Level", suffix: "%", rule: { type: "min", limit: 15 } },
    { key: "temp", label: "Temp", suffix: "°C", rule: { type: "range", target: 20, tolerance: 0.5 } },
  ],
  rows: [
    { machine: "QD521.2" },
    { machine: "QD521.3" },
    // ...one row per machine; no "overrides" needed since the spec is the same for all of them
  ],
}
```

If the limit is *different per machine* (like ASM tube/boot lifetime, which
depends on whether the tool runs Poly/Sipos/Nitride), leave the column's rule
without a `limit`/`target` and set it per row instead via `overrides`. A row
can also set a column to `null` to show "N/A" (no rule applies there at all):

```js
columns: [{ key: "liner", label: "Liner", rule: { type: "max", warnRatio: 0.9 } }],
rows: [
  { machine: "QD541.1", overrides: { liner: { limit: 115000 } } },       // Poly
  { machine: "QD542.1", overrides: { liner: { limit: 60000 } } },        // Sipos
  { machine: "QD541.2", overrides: { liner: null } },                    // no reading for this machine/column
],
```

See `sheets/diffusion-weekly-pm/data.js` for a complete real example of both
patterns (readings tables, callouts, and section notes).

## 3. Create `index.html`

Copy `sheets/asm-tubechange/index.html` into your new folder as-is — it's a
generic shell that loads the shared assets, your `data.js`, and then boots
the runtime. The only thing worth changing is the `<title>`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASM Boat Exchange — PM Sheet</title>
  <script>
    (function () {
      var t = localStorage.getItem("pm-theme") || "hitachi";
      if (t !== "industrial") document.documentElement.setAttribute("data-theme", t);
    })();
  </script>
  <link rel="stylesheet" href="../../assets/styles.css">
</head>
<body>
  <div id="pm-root" class="app-shell"></div>

  <script src="../../assets/icons.js"></script>
  <script src="data.js"></script>
  <script src="../../assets/sheet-runtime.js"></script>
  <script>
    window.PM_RUNTIME.createRuntime(window.PM_SHEET).boot();
  </script>
  <script src="../../assets/theme.js"></script>
</body>
</html>
```

## 4. Add a card on the landing page

Open `AI_edition/index.html` and add a new card inside `.sheet-grid`, pointing
at your new folder:

```html
<a class="sheet-card" href="sheets/asm-boat-exchange/index.html">
  <div class="card-icon" id="card-icon-2"></div>
  <h3>ASM Boat Exchange</h3>
  <p>One-line description of what this PM covers.</p>
</a>
```

Give the `card-icon` div a unique `id` (e.g. `card-icon-2`, `card-icon-3`, ...)
and set it in the inline script further down the same file:

```js
document.getElementById("card-icon-2").innerHTML = PM_ICONS.clipboard;
```

If you've added more real sheets than placeholder slots, just delete the
"More sheets coming" placeholder card once you no longer need it.

## 5. Test it

Open `AI_edition/index.html` in a browser (or host the `AI_edition` folder on
a static server / SharePoint). Check that:
- the new card shows up and links to the right sheet
- all sections/steps from the Excel sheet appear, in order
- the status buttons, comments, and the progress bar work
- reloading the page restores your in-progress answers (autosave)
- "Export PDF" produces a clean, readable printout

Nothing else needs to change — themes, the PDF export styling, and the theme
switcher all apply automatically to every sheet.
