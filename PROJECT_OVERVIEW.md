# PM Sheets — Project Overview

This repo is porting our Excel PM (preventive maintenance) checklists into
standalone, static webapps. The finished work lives entirely under
**`AI_edition/`** — the files in the repo root (`index.html`, `style.css`,
`script.js`, `PM SHEET PDF.pdf`) are the original first-pass prototype and
Excel exports, left untouched on purpose so nothing gets mixed up.

## Quick start

Open `AI_edition/index.html` in a browser (works straight off disk, or host
the `AI_edition` folder on any static server / SharePoint doc library — no
build step, no dependencies). From there you pick a PM sheet, fill it out,
and use the **Export PDF** button to print/save it.

## What's in `AI_edition/`

```
AI_edition/
  index.html                     <- landing page, lists all PM sheets
  ADDING_A_NEW_PM_SHEET.md       <- step-by-step guide for porting the next Excel sheet
  assets/
    styles.css                   <- shared design system + all 5 themes + print rules
    sheet-runtime.js             <- the engine: renders any sheet from its data.js
    theme.js                     <- theme switcher (the floating palette button)
    icons.js                     <- inline SVG icons + the Hitachi Energy logo swap
  sheets/
    asm-tubechange/              <- ASM CVD Tubechange PM (linear checklist)
    diffusion-weekly-pm/         <- Diffusion Weekly PM (measurement tables + callouts)
```

Each sheet is just a `data.js` (the actual PM content) + a thin `index.html`
shell. Porting the next Excel sheet means writing a new `data.js`, not
touching any shared code — see `AI_edition/ADDING_A_NEW_PM_SHEET.md` for the
exact schema and examples.

## Features

- **No backend.** Pure static files. Each person fills out their own sheet in
  their browser; in-progress answers autosave to `localStorage` (per sheet +
  date) so a refresh doesn't lose anything.
- **Export PDF** via the browser's print dialog, with a dedicated print
  stylesheet — compact (matches the original Excel's page count), always
  renders light/readable regardless of which theme is active on screen.
- **Themes** — a small palette button (bottom-right) switches between:
  - **Hitachi Energy** (default) — built from real colors pulled out of
    `hitachienergy.com`'s own CSS, including the actual "HITACHI" wordmark
    logo in the header (swapped in only for this theme).
  - Industrial Blue (the original default look)
  - Dark
  - Tokyo Night
  - Catppuccin (Mocha)
  
  Status colors (Done = green, Ongoing = orange) stay identical across every
  theme on purpose, so they're always recognizable.
- **Two section types** in a sheet's `data.js`:
  - normal checklist steps (status control + comment box), optionally styled
    as a highlighted red **callout** banner for safety/prep warnings
  - **readings tables** — real number inputs per machine that auto-color
    green/orange/red against a specification you define (used for lifetime
    counters, bubbler level/temp, etc.)

## Sheets ported so far

1. **ASM CVD Tubechange** — the original linear procedure PM.
2. **Diffusion Weekly PM** — mostly per-machine measurement tables rather
   than a linear procedure; introduced the readings-table and callout
   features above.

## Things worth knowing before editing further

- **Step/reading IDs are positional** (`s{section}-{step}`, `r{section}-{row}-{col}`).
  Inserting a row in the middle of a section shifts every ID after it. This
  used to crash the page for anyone with an old sheet already saved in their
  browser — `boot()` in `sheet-runtime.js` now merges saved data key-by-key
  against the current schema instead of overwriting wholesale, so this is
  safe now, but keep it in mind if the state shape changes again.
- **`--bar-bg` vs `--ink-800`** are deliberately separate CSS variables: the
  dark header/section bars stay dark in every theme, while `--ink-800` (body
  text) flips light/dark per theme. Don't merge them back together.
- **Print always resets theme colors to fixed light values** at the top of
  the `@media print` block in `styles.css` (with `!important`, since a themed
  `:root[data-theme="..."]` selector otherwise wins on specificity). Without
  that reset, printing while a dark theme is active would produce a broken
  PDF (light text on a forced-white page).
- **Readings tables use `table-layout: fixed`** and `.app-main` has
  `min-width: 0` — both are load-bearing. Removing either reintroduces a bug
  where one column's colored background balloons across the row.

## Not done yet / ideas

- Only 2 of the full set of Excel PM sheets are ported.
- No shared/server storage — by design for now (SharePoint hosting, everyone
  exports their own PDF as the record).
