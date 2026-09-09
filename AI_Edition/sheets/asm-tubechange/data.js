/* PM sheet schema ASM CVD Tubechange
   innhalt kopiert aus tubechange PM Excel sheet */
window.PM_SHEET = {
  id: "asm-tubechange", // muss zum Ordnernamen unter sheets/ passen (wird auch als Speicher-Schlüssel genutzt)
  title: "ASM CVD Tubechange", // Titel, wird oben in der Kopfleiste angezeigt
  pmType: "ASM_Tubechange", // kleiner Untertitel unter dem Titel

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
      options: ["QD541.1", "QD541.2", "QD542.1", "QD542.2", "QD543.1", "QD543.2"],
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
      title: "Preparation of the Tube Change",
      steps: [
        { text: "Prepare all parts for tube change.", reference: "Tube, Quartzparts, O-Rings and T/C" },
        { text: "Inform Operators that you're taking the tube for PM" },
        { text: "Do a Leak Check for Reference" },
        { text: "Put reactor into Maintenance mode and download maint recipe." },
        { text: "Start Maint recipe, use Control commands to flow N2 and open Manifolds." },
        {
          text: "Cooldown reactor and purge with N2 / attach Logout Tagout if applicable",
          reference: "Cooldown Temperature: 25°C · Ramp: -2°C/min",
        },
      ],
    },
    {
      title: "Change the Boat (optional)",
      steps: [
        { text: "Prepare polyflow for parts cleaning" },
        { text: "Remove Boat and Pedestal from loading/maintenance station." },
        { text: "Move Boat from Reactor to Cooling Station to cool." },
        { text: "Once cooled, remove boat through Maintenance Door." },
      ],
    },
    {
      title: "Remove Tube",
      steps: [
        { text: "Turn off cooling water" },
        { text: "Swing out reactor and disconnect water lines." },
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
        { text: "Check lift is free from set down position" },
        { text: "Install clean door plates in the correct orientation. Use level to check the door plate is situated correctly" },
        { text: "Insert pedestals and boats in the correct orientation. Use level to check pedestal and boats are situated correctly" },
      ],
    },
    {
      title: "Calibrate Boat / Test Leakrate",
      steps: [
        { text: "Carry out Boat Calibration for both boats (if changed)" },
        { text: "Remove Logout Tagout if applicable." },
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
      title: "Afterchange Tasks (partly done by operators)",
      steps: [
        { text: "Run profile — ask operators to do this task" },
        { text: "Upload data to MSC", reference: "Difference should be the new calibration data on the machine" },
        { text: "Run thickness test — ask operators to do this task" },
        { text: "Run particle test — ask operators to do this task" },
        { text: "If all tests are good, change status of Si View and hand back to production." },
      ],
    },
  ],
};
