/* PM sheet schema ASM CVD Tubechange
   innhalt kopiert aus tubechange PM Excel sheet */
window.PM_SHEET = {
  id: "fsi-zeta-spraypattern-check", // muss zum Ordnernamen unter sheets/ passen (wird auch als Speicher-Schlüssel genutzt)
  title: "Diffusion Weekly Spray Pattern Check on FSI ZETA tools", // Titel, wird oben in der Kopfleiste angezeigt
  pmType: "verify and adjust the spray pattern in the chamber", // kleiner Untertitel unter dem Titel

  // meta = die Felder in der Kopfzeile (Name, Tool-ID, Datum, Uhrzeiten).
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
    {
      key: "systemId",
      label: "System ID",
      type: "select",
      options: ["QD506", "QD507", "QD508"],
    },
    { key: "date", label: "Date", type: "date", auto: "today" },
    { key: "startTime", label: "Start Time", type: "time", auto: "now" },
    { key: "endTime", label: "End Time", type: "time" },
  ],

  // sections = die einzelnen Arbeitsblöcke des PM-Sheets, in der Reihenfolge wie im Excel.
  // Jeder Schritt (step) hat einen Text und optional "reference" (Sollwerte/Hinweise,
  // werden als kleine graue Notiz unter dem Text angezeigt).
  sections: [
    {
      title: "1. Preparation",
      steps: [
        { text: "Inform Operators that you're taking the tool out of production for PM" },
        { text: "Ensure that there is no production running" },
        { text: "Open the chamber cover" },
        { text: "Retrieve the thick clear perspex cover from the reflow area" },
        { text: "place the perspex cover securely over the chamber" },
      ],
    },
    {
      title: "2. Spray pattern check",
      steps: [
        { text: "Navigate to the maintenance window" },
        { text: "Press on the DI button" },
        { text: "Select Cld Chbr Rns"},
        { text: "Return to maintenance screen" },
        { text: "Toggle the outputs ON and observe the spray pattern through the perspex cover", reference: "reference images in Sharepoint under maintenance/diff_fsi&Zeta_wartung" },
        { text: "Toggle the outputs OFF" },
        { text: "Lift the perspex cover and adjust the spray nozzles as needed" },
        { text: "Repeat until the spray pattern is satisfactory" },
        { text: "Once complete, ensure that outputs are set back to OFF" },
      ],
    },
    {
      title: "3. Spray pattern with turntable rotation",
      steps: [
        { text: "Navigate to Motor settings" },
        { text: "Set Motor Speed = 60" },
        { text: "Toggle outputs ON (The turntable will now rotate with water running" },
        { text: "Observe rotation and spray behaviour" },
        { text: "Set Motor Speed = 0" },
        { text: "Toggle outputs OFF" },
        { text: "Both Motor and Water will stop" },
        { text: "Make adjustments if required and repeat the steps until satisfactory" },
      ],
    },
    {
      title: "4. Completion",
      steps: [
        { text: "Remove the perspex cover" },
        { text: "clean up any remaining water" },
        { text: "Press Abort to clear the selected outputs" },
        { text: "Return the Tool to Production and let them run daily tests" },
      ],
    },
  ],
};
