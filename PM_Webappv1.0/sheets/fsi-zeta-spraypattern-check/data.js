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
        { text: "" },
      ],
    },
    {
      title: "Remove Tube",
      steps: [
        { text: "Turn off cooling water" },
        { text: "Turn off element on ECP" },
        { text: "Switch off toxic gasses, element power and control and LO/TO", reference: "The 3 red switches in the back" },
        { text: "Swing out reactor and disconnect water lines.", reference: "watch for water spills if no quick-connectors are present" },
        { text: "Pull back spike T/C's from housing." },
        { text: "Disconnect Paddle T/C and remove Liner, injector and paddle T/C" },
        { text: "Remove Tube" },
        { text: "Remove all O-rings from Gas dividing ring and lower seal." },
      ],
    },
    {
      title: "Clean Parts",
      steps: [
        { text: "Clean Gas dividing ring" },
        { text: "Clean Boat and Pedestal housing." },
        { text: "Clean Liner suspension ring" },
        { text: "Clean Tube housing ring." },
      ],
    },
    {
      title: "Rebuild Tube",
      steps: [
        { text: "Rebuild tube" },
        { text: "Rebuild Liner and components" },
        { text: "Reconnect water lines" },
        { text: "Reset spike T/Cs in housing" },
        { text: "Swing in reactor and drop onto gas dividing ring" },
        { text: "Check that the lift is free from set down position" },
        { text: "Install clean door plates in the correct orientation. Use level to check the door plate is seated correctly" },
        { text: "Insert pedestals and boats in the correct orientation. Use level to check pedestal and boats are seated correctly" },
      ],
    },
    {
      title: "Calibrate Boat / Test Leakrate",
      steps: [
        { text: "Remove LO/TO" },
        { text: "insert TC Calibration data from the supplied Cal-Sheets on sharepoint" },
        { text: "Carry out Boat Calibration for both boats (if changed)" },
        { text: "Insert one boat into the reactor using the Elevator commands." },
        { text: "Pump reactor down to standby pressure and let it stabilize for 5 mins." },
        {
          text: "Carry out Cold Leak Check — if good continue with next step, if not, find and resolve the issue.",
          reference: "Possible sources: outgassing, valve error (internal leak), external leak. BP: < 10 mTorr · LR: < 5 mTorr/min",
        },
        {
          text: "Ramp reactor to standby temperature",
          reference: "SBY Temperature: Poly 550°C · Sipos 620°C · Nitride 700°C · Ramp: 2°C/min",
        },
        {
          text: "Carry out Hot Leak Check — if good continue with next step, if not, find and resolve the issue.",
          reference: "Possible sources: outgassing, valve error (internal leak), external leak. BP: < 10 mTorr · LR: < 5 mTorr/min",
        },
        { text: "If all checks are good, batch and queue a coating run." },
        { text: "Run coating runs on both boats (if changed)" },
        { text: "Run pump curve" },
      ],
    },
    {
      title: "Qualification Tasks (partly done by operators)",
      steps: [
        { text: "Run profile — ask operators to do this task" },
        { text: "Upload data to MSC" },
        { text: "Run thickness test — ask operators to do this task" },
        { text: "Run particle test — ask operators to do this task" },
        { text: "If all tests are good, change status in Si-View and hand back to production." },
      ],
    },
  ],
};
