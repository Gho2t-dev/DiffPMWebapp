/* PM sheet schema — Diffusion Weekly PM
   Transcribed from "Weekly PM Diffusion Area.pdf". Unlike the Tubechange
   sheet, most of this one is per-machine measurement tables ("readings"
   sections) rather than a linear procedure, plus two highlighted warning
   banners ("callout" steps). */
window.PM_SHEET = {
  id: "diffusion-weekly-pm",
  title: "Diffusion Weekly PM",
  pmType: "Weekly PM",

  meta: [
    {
      key: "user",
      label: "User ID",
      type: "select",
      options: [
        { value: "jonas", label: "Jonas Steinmann" },
        { value: "luke", label: "Luke Folan" },
        { value: "eskan", label: "Eskan Osman" },
        { value: "fabian", label: "Fabian Harrab" },
        { value: "colin", label: "Colin Jones" },
        { value: "elias", label: "Elias Erbel" },
        { value: "senad", label: "Senad Kavazovic" },
      ],
    },
    // Diese PM deckt einen ganzen Bereich ab, kein einzelnes Tool — daher ein
    // fester Text statt einer Tool-ID-Auswahl.
    { key: "systemId", label: "System ID", type: "text", default: "Weekly PM", readonly: true },
    { key: "date", label: "Date", type: "date", auto: "today" },
    { key: "startTime", label: "Start Time", type: "time", auto: "now" },
    { key: "endTime", label: "End Time", type: "time" },
  ],

  sections: [
    {
      title: "Pre-PM Check",
      steps: [{ kind: "callout", text: "Ensure production is informed of PM action" }],
    },

    // Reading-Tabelle: Lebensdauer-Zähler pro Maschine. Die Limits sind je
    // Prozesstyp verschieden (Poly / Sipos / Nitride), darum pro Zeile über
    // "overrides" gesetzt statt einmal pro Spalte.
    {
      title: "ASM Lifetime",
      type: "readings",
      legend: "Poly: Liner 115'000 · Boat 55'000  |  Sipos: Liner 60'000 · Boat 15'000  |  Nitride: Liner 58'000 · Boat 15'000 · Cold Trap 18'000",
      columns: [
        { key: "liner", label: "Liner", rule: { type: "max", warnRatio: 0.9 } },
        { key: "bootA", label: "Boot A", rule: { type: "max", warnRatio: 0.9 } },
        { key: "bootB", label: "Boot B", rule: { type: "max", warnRatio: 0.9 } },
        { key: "coolTrap", label: "Cool Trap", rule: { type: "max", warnRatio: 0.9 } },
      ],
      rows: [
        { machine: "QD541.1", overrides: { liner: { limit: 115000 }, bootA: { limit: 55000 }, bootB: { limit: 55000 }, coolTrap: null } },
        { machine: "QD541.2", overrides: { liner: { limit: 115000 }, bootA: { limit: 55000 }, bootB: { limit: 55000 }, coolTrap: null } },
        { machine: "QD542.1", overrides: { liner: { limit: 60000 }, bootA: { limit: 15000 }, bootB: { limit: 15000 }, coolTrap: null } },
        { machine: "QD542.2", overrides: { liner: { limit: 58000 }, bootA: { limit: 15000 }, bootB: { limit: 15000 }, coolTrap: { limit: 18000 } } },
        { machine: "QD543.1", overrides: { liner: { limit: 60000 }, bootA: { limit: 15000 }, bootB: { limit: 15000 }, coolTrap: null } },
        { machine: "QD543.2", overrides: { liner: { limit: 58000 }, bootA: { limit: 15000 }, bootB: { limit: 15000 }, coolTrap: { limit: 18000 } } },
      ],
    },

    {
      title: "Spray Pattern Check on Zeta and Mercury",
      note: "Check spray pattern as described on instruction",
      steps: [
        { text: "QD506" },
        { text: "QD507" },
        { text: "QD508" },
        { text: "QD509" },
        { text: "QD510" },
        { text: "QD511" },
        { text: "QD512" },
      ],
    },

    {
      title: "Drain Check on Zeta and Mercury",
      note: "Check if the Drains are opening and closing correctly",
      steps: [
        { text: "QD506" },
        { text: "QD507" },
        { text: "QD508" },
        { text: "QD509" },
        { text: "QD510" },
        { text: "QD511" },
        { text: "QD512" },
      ],
    },

    // Reading-Tabelle: Level/Temperatur pro Bubbler. Hier ist die Spezifikation
    // für jede Maschine gleich, darum reicht eine Regel pro Spalte.
    {
      title: "Bubbler Check",
      type: "readings",
      legend: "Level > 15%  ·  Temp 20°C (± 0.5°C)",
      columns: [
        { key: "level", label: "Level", suffix: "%", rule: { type: "min", limit: 15 } },
        { key: "temp", label: "Temp", suffix: "°C", rule: { type: "range", target: 20, tolerance: 0.5 } },
      ],
      rows: [
        { machine: "QD521.2" },
        { machine: "QD521.3" },
        { machine: "QD521.4" },
        { machine: "QD525.1" },
        { machine: "QD525.2" },
        { machine: "QD525.3" },
        { machine: "QD525.4" },
        { machine: "QD525.5" },
        { machine: "QD526.1" },
        { machine: "QD526.2" },
        { machine: "QD526.3" },
        { machine: "QD526.4" },
        { machine: "QD540.1" },
        { machine: "QD540.2" },
        { machine: "QD545.1" },
        { machine: "QD545.2" },
        { machine: "QD527.1" },
        { machine: "QD527.2" },
        { machine: "QD527.3" },
        { machine: "QD527.4" },
      ],
    },

    {
      title: "Machine Panel Check",
      note: "All maschine panels are in place",
      steps: [
        { text: "QD521" },
        { text: "QD525" },
        { text: "QD526" },
        { text: "QD527" },
        { text: "QD540" },
        { text: "QD541" },
        { text: "QD542" },
        { text: "QD543" },
        { text: "QD544" },
        { text: "QD545" },
        { text: "Koyo" },
      ],
    },

    {
      title: "Clean Umhorder and Port Area",
      note: "Clean Port area and Umhorder with the vacuum",
      steps: [{ text: "QD521" }, { text: "QD525" }, { text: "QD526" }, { text: "QD527" }],
    },

    {
      title: "Check Centrotherm Boats",
      // Kommentarfeld pro Zeile wird hier als "Date of change"-Feld genutzt.
      note: "Check Boats for visible contamination. If yes, note the date of change in the comment box.",
      steps: [
        { text: "QD521.2" },
        { text: "QD521.3" },
        { text: "QD521.4" },
        { text: "QD521.5" },
        { text: "QD525.2" },
        { text: "QD525.3" },
        { text: "QD525.4" },
        { text: "QD525.5" },
        { text: "QD526.1" },
        { text: "QD526.2" },
        { text: "QD526.3" },
        { text: "QD526.4" },
        { text: "QD527.1" },
        { text: "QD527.2" },
        { text: "QD527.3" },
        { text: "QD527.4" },
      ],
    },

    {
      title: "Vacuumwand check",
      steps: [{ kind: "callout", text: "Control all vacuum wands in the area for damages. Replace if needed" }],
    },
  ],
};
