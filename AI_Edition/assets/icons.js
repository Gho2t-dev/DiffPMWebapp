/* Kleine Sammlung von SVG-Icons als Inline-Code (kein Icon-Font, keine Emojis).
   Jeder Eintrag ist einfach ein fertiges <svg>-Element als Text, das direkt
   ins HTML eingefügt werden kann. */
window.PM_ICONS = {
  logo: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z"/><path d="M9 12l2 2 4-4"/></svg>`, // Schild-Logo oben links
  clipboard: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V2.6c0-.3.3-.6.6-.6h4.8c.3 0 .6.3.6.6V4"/><path d="M9 11h6"/><path d="M9 15h6"/></svg>`, // Klemmbrett-Symbol für die Sheet-Karten
  info: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>`, // Info-Symbol vor den Referenzwerten
  check: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`, // Haken für Status "Done"
  clock: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`, // Uhr für Status "Ongoing"
  slash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>`, // Durchgestrichener Kreis für Status "N/A"
  dash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`, // Leerer Kreis für Status "Pending"
  printer: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><path d="M6 17v4h12v-4"/></svg>`, // Drucker-Symbol für den "Export PDF"-Knopf
  refresh: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></svg>`, // Rundpfeil für den "Reset"-Knopf
  arrowRight: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`, // Pfeil nach rechts (aktuell ungenutzt, für spätere Links gedacht)
  palette: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2s-.5-1.4-.5-2.4c0-1.1 1-2.1 2-2.1h1.7A3.3 3.3 0 0 0 20.5 11c0-4.4-3.8-8-8.5-8Z"/><circle cx="7.3" cy="10.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="7.8" r="1.1" fill="currentColor" stroke="none"/></svg>`, // Palette-Symbol für den Theme-Umschalter
  alert: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>`, // Warndreieck für Hinweis-Banner (kind: "callout")

  // Das echte "HITACHI"-Logo, so wie es auf hitachienergy.com im
  // Header verwendet wird (direkt von dort übernommen). "fill" wurde von
  // fest #0C0C0C auf currentColor umgestellt, damit es sich automatisch an
  // die Textfarbe seines Containers anpasst (z.B. Weiss auf der dunklen Kopfleiste).
  hitachiWordmark: `<svg viewBox="0 0 105 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9166 6.76793H4.27096V0.292969H0V16.4656H4.27096V9.33125H12.9166V16.4656H17.2098V0.292969H12.9166V6.76793Z" fill="currentColor"/><path d="M25.067 0.292969H20.7441V16.4693H25.067V0.292969Z" fill="currentColor"/><path d="M105.001 0.292969H100.678V16.4693H105.001V0.292969Z" fill="currentColor"/><path d="M43.4357 0.292969H26.6445V2.98593H32.9195V16.4656H37.1608V2.98593H43.4357V0.292969Z" fill="currentColor"/><path d="M47.4138 0.318848L39.7461 16.4655H44.543L46.047 12.8428H54.137L55.6149 16.4655H60.4378L52.822 0.318848H47.4175H47.4138ZM47.1249 10.2832L50.1031 3.06737L53.0553 10.2832H47.1249Z" fill="currentColor"/><path d="M69.3423 14.38C67.6828 14.38 64.2823 14.0355 64.2304 8.43477C64.1786 3.14886 67.2864 2.40801 69.3423 2.40801C71.3722 2.43394 73.4021 3.38593 73.428 5.78996H77.8027C77.7471 2.85622 75.2208 0.0558388 69.3423 0.000275629C64.9676 -0.0256539 59.6706 1.77089 59.6446 8.35328C59.6187 14.8801 65.0231 16.9174 69.3423 16.81C73.3206 16.6766 77.7508 15.5691 77.936 10.6536L73.5354 10.6795C73.4021 13.7466 70.9536 14.3541 69.346 14.38H69.3423Z" fill="currentColor"/><path d="M92.9578 6.76793H84.3122V0.292969H80.0449V16.4656H84.3122V9.33125H92.9578V16.4656H97.2251V0.292969H92.9578V6.76793Z" fill="currentColor"/></svg>`,
};

// Baut die Marke oben links passend zum aktuellen Theme: normalerweise das
// generische Schild-Icon, beim Hitachi-Energy-Theme das echte Firmenlogo.
window.PM_BRAND = {
  // Liefert das fertige <span>...</span> für die erste Anzeige (z.B. beim Aufbau der Kopfleiste).
  markup: function () {
    var isHitachi = document.documentElement.getAttribute("data-theme") === "hitachi";
    var cls = "brand-mark" + (isHitachi ? " brand-mark--logo" : "");
    var icon = isHitachi ? window.PM_ICONS.hitachiWordmark : window.PM_ICONS.logo;
    return '<span class="' + cls + '" data-brand-mark>' + icon + "</span>";
  },
  // Aktualisiert alle schon vorhandenen Marken auf der Seite — wird vom
  // Theme-Umschalter aufgerufen, damit sich das Logo ohne Neuladen anpasst.
  refresh: function () {
    var isHitachi = document.documentElement.getAttribute("data-theme") === "hitachi";
    document.querySelectorAll("[data-brand-mark]").forEach(function (el) {
      el.className = "brand-mark" + (isHitachi ? " brand-mark--logo" : "");
      el.innerHTML = isHitachi ? window.PM_ICONS.hitachiWordmark : window.PM_ICONS.logo;
    });
  },
};
