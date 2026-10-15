// Local, bundled translations. User input and protocol evidence are never translated.
const KEY='arcdrake-tools-language';
let language='en';
const explicit=new URL(location.href).searchParams.get('lang');
let saved;try{saved=localStorage.getItem(KEY);}catch{}
language=['de','en'].includes(explicit)?explicit:['de','en'].includes(saved)?saved:navigator.language.toLowerCase().startsWith('de')?'de':'en';
const sources=new WeakMap(), attributes=new WeakMap();
const entries=[
 [
  "Choose a delay greater than 0 to test {0}. {1} is unavailable for the whole event. Blocked steps cannot proceed; their times and finish are estimates.",
  "Wähle eine Verspätung größer als 0 für {0}. {1} fehlt während der gesamten Veranstaltung. Blockierte Schritte können nicht stattfinden; ihre Zeiten und das Ende sind Schätzwerte."
 ],
 [
  "Choose a delay greater than 0 to test {0}. Everyone is available.",
  "Wähle eine Verspätung größer als 0 für {0}. Alle sind verfügbar."
 ],
 [
  "{0} starts {1} minutes late. {2} is unavailable for the whole event. Blocked steps cannot proceed; their times and finish are estimates.",
  "{0} beginnt {1} Minuten später. {2} fehlt während der gesamten Veranstaltung. Blockierte Schritte können nicht stattfinden; ihre Zeiten und das Ende sind Schätzwerte."
 ],
 [
  "{0} starts {1} minutes late. Everyone is available.",
  "{0} beginnt {1} Minuten später. Alle sind verfügbar."
 ],
 [
  "No start delay applied. {0} is unavailable for the whole event. Blocked steps cannot proceed; their times and finish are estimates.",
  "Keine Startverspätung. {0} fehlt während der gesamten Veranstaltung. Blockierte Schritte können nicht stattfinden; ihre Zeiten und das Ende sind Schätzwerte."
 ],
 [
  "No start delay applied. Everyone is available.",
  "Keine Startverspätung. Alle sind verfügbar."
 ],
 [
  "● Event data stays in your browser",
  "● Veranstaltungsdaten bleiben in deinem Browser"
 ],
 [
  "EVENT RUN-OF-SHOW PLANNER",
  "ABLAUFPLANER FÜR VERANSTALTUNGEN"
 ],
 [
  "Plan your event.",
  "Plane deine Veranstaltung."
 ],
 [
  "See what a delay changes.",
  "Erkenne die Folgen einer Verspätung."
 ],
 [
  "Rehearsal helps event organizers build a timed running order, assign people, and spot what slips when a step runs late. Export a clear run sheet for the day.",
  "Mit Rehearsal planst du den zeitlichen Ablauf, teilst Personen ein und erkennst, was sich bei Verspätungen verschiebt. Exportiere einen übersichtlichen Ablaufplan für den Veranstaltungstag."
 ],
 [
  "For workshops, live demos, product launches, and community events.",
  "Für Workshops, Live-Demos, Produkteinführungen und Gemeinschaftsveranstaltungen."
 ],
 [
  "Go to the event editor below ↓",
  "Zum Veranstaltungseditor weiter unten ↓"
 ],
 [
  "Show a 10-minute delay in the example",
  "Im Beispiel 10 Minuten Verspätung zeigen"
 ],
 [
  "The editor is on this page. No account needed.",
  "Der Editor ist auf dieser Seite. Kein Konto erforderlich."
 ],
 [
  "TRY IT / PRODUCT LAUNCH EXAMPLE",
  "AUSPROBIEREN / BEISPIEL PRODUKTEINFÜHRUNG"
 ],
 [
  "The live demo starts late.",
  "Die Live-Demo beginnt später."
 ],
 [
  "What happens next?",
  "Was passiert danach?"
 ],
 [
  "Add a 10-minute delay and watch the rest of this example move.",
  "Füge 10 Minuten Verspätung hinzu und beobachte, wie sich der restliche Ablauf verschiebt."
 ],
 [
  "On time",
  "Pünktlich"
 ],
 [
  "＋ 10-minute delay",
  "＋ 10 Minuten Verspätung"
 ],
 [
  "An interactive example. Your event below stays separate.",
  "Ein interaktives Beispiel. Deine Veranstaltung unten bleibt davon unabhängig."
 ],
 [
  "How Rehearsal works",
  "So funktioniert Rehearsal"
 ],
 [
  "Build the running order",
  "Den Ablauf aufbauen"
 ],
 [
  "Add steps, durations, people, and what must happen first.",
  "Schritte, Dauer, Personen und Voraussetzungen hinzufügen."
 ],
 [
  "Test the setbacks",
  "Störungen durchspielen"
 ],
 [
  "Try a delay or an unavailable person. See revised times and blocked steps.",
  "Eine Verspätung oder fehlende Person testen. Geänderte Zeiten und blockierte Schritte erkennen."
 ],
 [
  "Take the run sheet",
  "Den Ablaufplan mitnehmen"
 ],
 [
  "Export the visible schedule as HTML, then print or save it as a PDF.",
  "Den sichtbaren Zeitplan als HTML exportieren, dann drucken oder als PDF speichern."
 ],
 [
  "YOUR WORKSPACE",
  "DEIN ARBEITSBEREICH"
 ],
 [
  "Build and rehearse your event schedule",
  "Veranstaltungsablauf planen und durchspielen"
 ],
 [
  "On first opening, a five-step product launch is shown as an example. Edit it, or choose",
  "Beim ersten Öffnen erscheint eine Produkteinführung mit fünf Schritten als Beispiel. Bearbeite es oder wähle"
 ],
 [
  "Start empty event",
  "Leere Veranstaltung starten"
 ],
 [
  "to start your own. Your saved event is only loaded when you choose",
  "für einen eigenen Plan. Deine gespeicherte Veranstaltung lädst du über folgende Schaltfläche:"
 ],
 [
  "Open browser save",
  "Browserspeicherung öffnen"
 ],
 [
  ".",
  "."
 ],
 [
  "Event actions",
  "Veranstaltungsaktionen"
 ],
 [
  "Choose a starting point",
  "Einen Ausgangspunkt wählen"
 ],
 [
  "Edit the example already loaded, or start with an empty event.",
  "Bearbeite das geladene Beispiel oder beginne mit einer leeren Veranstaltung."
 ],
 [
  "Replace with example",
  "Durch Beispiel ersetzen"
 ],
 [
  "Keep editing in this browser",
  "In diesem Browser weiterarbeiten"
 ],
 [
  "Save your event and simulation here for next time. One saved event per browser. Save manually before leaving; saving again replaces that copy.",
  "Speichere Veranstaltung und Simulation für das nächste Mal. Eine Speicherung je Browser. Vor dem Verlassen manuell speichern; erneutes Speichern ersetzt diese Kopie."
 ],
 [
  "Save in this browser",
  "In diesem Browser speichern"
 ],
 [
  "Back up or move your editable event",
  "Bearbeitbare Veranstaltung sichern oder übertragen"
 ],
 [
  "Download a JSON file with all steps and simulation settings. Open it here to keep editing, including on another device.",
  "Lade eine JSON-Datei mit allen Schritten und Simulationseinstellungen herunter. Öffne sie hier zum Weiterarbeiten, auch auf einem anderen Gerät."
 ],
 [
  "Download editable event (.json)",
  "Bearbeitbare Veranstaltung herunterladen (.json)"
 ],
 [
  "Open event file (.json)",
  "Veranstaltungsdatei öffnen (.json)"
 ],
 [
  "Share or print the run sheet",
  "Ablaufplan teilen oder drucken"
 ],
 [
  "The run sheet contains the schedule and simulation currently shown, with times, people, and notes.",
  "Der Ablaufplan enthält den aktuell angezeigten Zeitplan und die Simulation mit Zeiten, Personen und Notizen."
 ],
 [
  "Download run sheet (.html)",
  "Ablaufplan herunterladen (.html)"
 ],
 [
  "A readable schedule to share or open in a browser. Use the JSON backup to edit the event again.",
  "Ein lesbarer Plan zum Teilen oder Öffnen im Browser. Zum erneuten Bearbeiten die JSON-Sicherung verwenden."
 ],
 [
  "Print / Save as PDF",
  "Drucken / Als PDF speichern"
 ],
 [
  "Opens your browser’s print dialog for the current run sheet. Choose a printer or Save as PDF.",
  "Öffnet den Druckdialog des Browsers für den aktuellen Ablaufplan. Drucker oder „Als PDF speichern“ wählen."
 ],
 [
  "01 / Edit event steps",
  "01 / Veranstaltungsschritte bearbeiten"
 ],
 [
  "Changes update the schedule",
  "Änderungen aktualisieren den Zeitplan"
 ],
 [
  "A step is one activity, such as a welcome or a talk. Set its duration, who it needs, and which activities must finish first. Step numbers are editor references; the schedule shows the calculated time order.",
  "Ein Schritt ist eine Aktivität wie eine Begrüßung oder ein Vortrag. Lege Dauer, benötigte Personen und vorher abzuschließende Aktivitäten fest. Die Nummern dienen der Orientierung im Editor; der Zeitplan zeigt die berechnete Reihenfolge."
 ],
 [
  "Event name",
  "Name der Veranstaltung"
 ],
 [
  "Event start time",
  "Beginn der Veranstaltung"
 ],
 [
  "People involved",
  "Beteiligte Personen"
 ],
 [
  "Separate names with commas, then leave this field to apply. Removing a name also removes their step assignments.",
  "Namen durch Kommas trennen und das Feld verlassen. Beim Entfernen eines Namens werden auch dessen Zuordnungen zu Schritten entfernt."
 ],
 [
  "How timing works:",
  "So werden Zeiten berechnet:"
 ],
 [
  "steps can overlap unless they need the same person or you select a step that must finish first. Adding a step does not automatically put it after the previous one.",
  "Schritte können sich überschneiden, sofern sie nicht dieselbe Person benötigen oder ein anderer Schritt zuerst enden muss. Ein neuer Schritt folgt nicht automatisch auf den vorherigen."
 ],
 [
  "＋ Add a step",
  "＋ Schritt hinzufügen"
 ],
 [
  "02 / Test changes & view schedule",
  "02 / Änderungen testen und Zeitplan ansehen"
 ],
 [
  "Updates as you edit",
  "Aktualisiert sich beim Bearbeiten"
 ],
 [
  "Try one delayed step and one unavailable person at a time. This changes the schedule shown below; it does not change step durations or notify anyone.",
  "Teste jeweils einen verspäteten Schritt und eine fehlende Person. Dies ändert den angezeigten Zeitplan, weder die Schrittdauer noch werden Personen benachrichtigt."
 ],
 [
  "Step that starts late",
  "Schritt mit verspätetem Beginn"
 ],
 [
  "Start delay (minutes)",
  "Startverspätung (Minuten)"
 ],
 [
  "Adds waiting time before the selected step starts. To make the activity itself longer, edit its duration in the event steps.",
  "Fügt Wartezeit vor dem ausgewählten Schritt hinzu. Soll die Aktivität selbst länger dauern, ändere ihre Dauer im Editor."
 ],
 [
  "Unavailable for the whole event",
  "Während der gesamten Veranstaltung abwesend"
 ],
 [
  "Steps needing this person, and steps waiting on them, cannot proceed. Their displayed times are estimates until you adjust the plan.",
  "Schritte mit dieser Person und davon abhängige Schritte können nicht stattfinden. Ihre Zeiten sind Schätzwerte, bis du den Plan anpasst."
 ],
 [
  "Clear delay & restore everyone",
  "Verspätung löschen und alle wieder einplanen"
 ],
 [
  "Steps run as soon as their required earlier steps have finished and their assigned people are free. A person cannot be in two steps at once. “Unassigned” means no person is required for scheduling. Times marked (+1d) fall on the next day.",
  "Schritte starten, sobald ihre Voraussetzungen erfüllt und die zugeteilten Personen frei sind. Eine Person kann nicht in zwei Schritten gleichzeitig sein. „Ohne Zuordnung“ bedeutet, dass keine Person für die Planung benötigt wird. Zeiten mit (+1d) liegen am Folgetag."
 ],
 [
  "A few things to know before event day",
  "Wissenswertes vor dem Veranstaltungstag"
 ],
 [
  "What is a run of show?",
  "Was ist ein Ablaufplan?"
 ],
 [
  "A run of show is the working schedule for an event: what happens, when it happens, who is involved, and the notes they need. Rehearsal turns those steps into a timed run sheet.",
  "Ein Ablaufplan ist der Arbeitsplan einer Veranstaltung: Was geschieht wann, wer ist beteiligt und welche Notizen werden benötigt? Rehearsal erstellt daraus einen Zeitplan."
 ],
 [
  "How does Rehearsal help when plans change?",
  "Wie hilft Rehearsal bei Planänderungen?"
 ],
 [
  "Set a delay to see how later steps and the finish time move. Mark someone unavailable to find the steps that need a replacement or a change of plan. Simulations help you prepare; they do not notify your team.",
  "Stelle eine Verspätung ein, um Verschiebungen späterer Schritte und des Endes zu sehen. Markiere fehlende Personen, um Schritte mit Ersatz- oder Änderungsbedarf zu finden. Simulationen helfen bei der Vorbereitung; sie benachrichtigen dein Team nicht."
 ],
 [
  "How do I save or share my event?",
  "Wie speichere oder teile ich meine Veranstaltung?"
 ],
 [
  "Choose Save in this browser to keep your editable event and simulation here, and Open browser save to restore that copy. Changes are not saved automatically. Download editable event creates a portable JSON backup you can open here later. Download run sheet creates a readable HTML schedule for sharing. Print / Save as PDF opens the browser print dialog for the current schedule.",
  "„In diesem Browser speichern“ sichert Veranstaltung und Simulation, „Browserspeicherung öffnen“ stellt sie wieder her. Änderungen werden nicht automatisch gespeichert. „Bearbeitbare Veranstaltung herunterladen“ erstellt eine übertragbare JSON-Sicherung. „Ablaufplan herunterladen“ erstellt einen lesbaren HTML-Zeitplan zum Teilen. „Drucken / Als PDF speichern“ öffnet den Druckdialog für den aktuellen Zeitplan."
 ],
 [
  "Where is my event data stored?",
  "Wo werden meine Veranstaltungsdaten gespeichert?"
 ],
 [
  "Your event is processed in your browser, with no event upload. Local saves stay in this browser on this device. Download a backup before clearing browser data or switching devices.",
  "Deine Veranstaltung wird im Browser verarbeitet und nicht hochgeladen. Lokale Speicherungen bleiben in diesem Browser auf diesem Gerät. Lade vor dem Löschen von Browserdaten oder einem Gerätewechsel eine Sicherung herunter."
 ],
 [
  "Keep current event",
  "Aktuelle Veranstaltung behalten"
 ],
 [
  "No account. No event upload. Save your work before closing.",
  "Kein Konto. Kein Upload von Veranstaltungsdaten. Vor dem Schließen speichern."
 ],
 [
  "Current event and test settings match your browser save.",
  "Veranstaltung und Testeinstellungen entsprechen der Browserspeicherung."
 ],
 [
  "Current event has not been saved, or has changes since your last save. Choose Save in this browser to keep it.",
  "Die Veranstaltung wurde noch nicht gespeichert oder seit der letzten Speicherung geändert. Wähle „In diesem Browser speichern“, um sie zu behalten."
 ],
 [
  "{0} · 10 min late",
  "{0} · 10 Min. verspätet"
 ],
 [
  "Finish moves 10 minutes later",
  "Ende verschiebt sich um 10 Minuten"
 ],
 [
  "Planned finish",
  "Geplantes Ende"
 ],
 [
  "Replace event?",
  "Veranstaltung ersetzen?"
 ],
 [
  "Open browser save?",
  "Browserspeicherung öffnen?"
 ],
 [
  "Remove step?",
  "Schritt entfernen?"
 ],
 [
  "Replace with example?",
  "Durch Beispiel ersetzen?"
 ],
 [
  "Start empty event?",
  "Leere Veranstaltung starten?"
 ],
 [
  "Open event file?",
  "Veranstaltungsdatei öffnen?"
 ],
 [
  "Keep step",
  "Schritt behalten"
 ],
 [
  "Remove step",
  "Schritt entfernen"
 ],
 [
  "Step {0} name",
  "Name von Schritt {0}"
 ],
 [
  "Remove {0}",
  "{0} entfernen"
 ],
 [
  "Remove",
  "Entfernen"
 ],
 [
  "Duration (minutes)",
  "Dauer (Minuten)"
 ],
 [
  "People needed for this step",
  "Für diesen Schritt benötigte Personen"
 ],
 [
  "Add names under People involved above, then leave that field to assign them here.",
  "Trage oben unter „Beteiligte Personen“ Namen ein und verlasse das Feld, um sie hier zuzuordnen."
 ],
 [
  "Notes for the run sheet",
  "Notizen für den Ablaufplan"
 ],
 [
  "Select every step that must finish before this one starts. Leave unchecked to allow overlap when people are free.",
  "Wähle alle Schritte, die vorher enden müssen. Ohne Auswahl sind Überschneidungen möglich, wenn die Personen frei sind."
 ],
 [
  "Must wait for these steps",
  "Muss auf diese Schritte warten"
 ],
 [
  "Untitled step",
  "Unbenannter Schritt"
 ],
 [
  "No other steps yet. This step can start at the event start time.",
  "Noch keine weiteren Schritte. Dieser Schritt kann zum Veranstaltungsbeginn starten."
 ],
 [
  "No delay",
  "Keine Verspätung"
 ],
 [
  "Everyone available",
  "Alle verfügbar"
 ],
 [
  "Untitled event",
  "Unbenannte Veranstaltung"
 ],
 [
  "Schedule paused — fix these event steps",
  "Zeitplan pausiert — diese Schritte korrigieren"
 ],
 [
  "The schedule will return when the issues above are fixed.",
  "Der Zeitplan erscheint wieder, sobald die oben genannten Probleme behoben sind."
 ],
 [
  "{0} starts {1} minutes late. {2}",
  "{0} beginnt {1} Minuten später. {2}"
 ],
 [
  "Choose a delay greater than 0 to test {0}. {1}",
  "Wähle eine Verspätung größer als 0 für {0}. {1}"
 ],
 [
  "No start delay applied. Everyone is available.",
  "Keine Startverspätung. Alle sind verfügbar."
 ],
 [
  "No start delay applied. {0} is unavailable for the whole event. Blocked steps cannot proceed; their times and finish are estimates.",
  "Keine Startverspätung. {0} fehlt während der gesamten Veranstaltung. Blockierte Schritte können nicht stattfinden; ihre Zeiten und das Ende sind Schätzwerte."
 ],
 [
  "Estimated finish",
  "Geschätztes Ende"
 ],
 [
  "Event finishes at",
  "Veranstaltung endet um"
 ],
 [
  "Includes blocked steps; resolve them before relying on this time.",
  "Enthält blockierte Schritte; vor Verwendung dieser Zeit deren Ursachen beheben."
 ],
 [
  "End of the last scheduled step.",
  "Ende des letzten geplanten Schritts."
 ],
 [
  "Time from start to finish",
  "Zeit vom Beginn bis zum Ende"
 ],
 [
  "Includes waiting and delays; overlapping steps count once.",
  "Mit Wartezeiten und Verspätungen; Überschneidungen zählen einmal."
 ],
 [
  "Estimated change to finish",
  "Geschätzte Verschiebung des Endes"
 ],
 [
  "Change to finish time",
  "Verschiebung des Endes"
 ],
 [
  "Compared with {0} without test changes.",
  "Verglichen mit {0} ohne Teständerungen."
 ],
 [
  "Steps that cannot proceed",
  "Schritte, die nicht stattfinden können"
 ],
 [
  "Need the missing person or a step that is blocked.",
  "Benötigen die fehlende Person oder einen blockierten Schritt."
 ],
 [
  "No steps blocked by an unavailable person.",
  "Keine durch eine fehlende Person blockierten Schritte."
 ],
 [
  "to {0}",
  "bis {0}"
 ],
 [
  "{0} min · Unassigned (no person required)",
  "{0} Min. · Ohne Zuordnung (keine Person benötigt)"
 ],
 [
  "Cannot proceed · missing person or earlier step",
  "Nicht durchführbar · Person oder vorheriger Schritt fehlt"
 ],
 [
  "+{0} min later than without test changes",
  "+{0} Min. später als ohne Teständerungen"
 ],
 [
  "Wait {0} min for assigned people to be free",
  "{0} Min. warten, bis zugeteilte Personen frei sind"
 ],
 [
  "Simulated delay {0} min",
  "Simulierte Verspätung: {0} Min."
 ],
 [
  "No steps yet. Choose",
  "Noch keine Schritte. Wähle"
 ],
 [
  "Add a step",
  "Schritt hinzufügen"
 ],
 [
  "in the editor, name the activity, and set its duration. Your schedule will appear here.",
  "im Editor, benenne die Aktivität und lege ihre Dauer fest. Der Zeitplan erscheint hier."
 ],
 [
  "Resolve the schedule errors before exporting.",
  "Behebe vor dem Export die Fehler im Zeitplan."
 ],
 [
  "Saved in this browser. Use Download editable event (.json) for a backup or another device.",
  "In diesem Browser gespeichert. Für Sicherung oder Gerätewechsel „Bearbeitbare Veranstaltung herunterladen (.json)“ verwenden."
 ],
 [
  "This browser could not save. Choose Download editable event (.json) to keep a copy.",
  "Dieser Browser konnte nicht speichern. Lade eine bearbeitbare Veranstaltung (.json) herunter, um eine Kopie zu behalten."
 ],
 [
  "No saved event in this browser yet.",
  "In diesem Browser gibt es noch keine gespeicherte Veranstaltung."
 ],
 [
  "This opens your browser save in place of the event and test settings shown. Unsaved changes will be lost.",
  "Die Browserspeicherung ersetzt die angezeigte Veranstaltung und Testeinstellungen. Ungespeicherte Änderungen gehen verloren."
 ],
 [
  "Browser save opened.",
  "Browserspeicherung geöffnet."
 ],
 [
  "Saved event could not be read. Your current event is still here.",
  "Die gespeicherte Veranstaltung konnte nicht gelesen werden. Deine aktuelle Veranstaltung ist weiterhin vorhanden."
 ],
 [
  "Remove {0} from the event?{1} This does not change your browser save.",
  "{0} aus der Veranstaltung entfernen?{1} Die Browserspeicherung wird dadurch nicht geändert."
 ],
 [
  "This event has reached the 100-step limit.",
  "Diese Veranstaltung hat die Grenze von 100 Schritten erreicht."
 ],
 [
  "New step",
  "Neuer Schritt"
 ],
 [
  "Test changes cleared. Step names, durations, people, and order are unchanged.",
  "Teständerungen gelöscht. Schrittnamen, Dauer, Personen und Reihenfolge bleiben erhalten."
 ],
 [
  "The example will replace the event and test settings shown. Save or download a copy first to keep unsaved work.",
  "Das Beispiel ersetzt die angezeigte Veranstaltung und Testeinstellungen. Sichere vorher ungespeicherte Arbeit im Browser oder als Datei."
 ],
 [
  "Example loaded. Try delaying the live demo by 10 minutes.",
  "Beispiel geladen. Teste eine Verspätung der Live-Demo um 10 Minuten."
 ],
 [
  "Start with no steps or people. This replaces the event shown, including test settings. Save or download a copy first to keep unsaved work.",
  "Beginne ohne Schritte oder Personen. Dies ersetzt die aktuelle Veranstaltung mit Testeinstellungen. Sichere vorher ungespeicherte Arbeit im Browser oder als Datei."
 ],
 [
  "My event",
  "Meine Veranstaltung"
 ],
 [
  "Empty event ready. Set its name and start time, add people, then choose Add a step.",
  "Leere Veranstaltung bereit. Name und Beginn festlegen, Personen hinzufügen und „Schritt hinzufügen“ wählen."
 ],
 [
  "Editable event download requested (.json). Open event file (.json) restores its steps and test settings. This does not update your browser save.",
  "Download der bearbeitbaren Veranstaltung (.json) angefordert. „Veranstaltungsdatei öffnen (.json)“ stellt Schritte und Testeinstellungen wieder her. Die Browserspeicherung wird nicht aktualisiert."
 ],
 [
  "Run sheet download requested (.html), including the test settings shown. Open it in a browser to read, share, or print. This does not save an editable event.",
  "Ablaufplan-Download (.html) einschließlich Testeinstellungen angefordert. Zum Lesen, Teilen oder Drucken im Browser öffnen. Dies speichert keine bearbeitbare Veranstaltung."
 ],
 [
  "Resolve the schedule errors before printing.",
  "Behebe vor dem Drucken die Fehler im Zeitplan."
 ],
 [
  "Event file must be under 1 MB.",
  "Die Veranstaltungsdatei muss kleiner als 1 MB sein."
 ],
 [
  "This file will replace the event and test settings shown. Save or download a copy first to keep unsaved work.",
  "Diese Datei ersetzt Veranstaltung und Testeinstellungen. Sichere vorher ungespeicherte Arbeit im Browser oder als Datei."
 ],
 [
  "Open event file",
  "Veranstaltungsdatei öffnen"
 ],
 [
  "Editable event file opened. Choose Save in this browser to keep this copy here.",
  "Bearbeitbare Veranstaltungsdatei geöffnet. Wähle „In diesem Browser speichern“, um diese Kopie hier zu behalten."
 ],
 [
  "Could not open this event file. Choose a Rehearsal editable event (.json), not an HTML run sheet or PDF. Your current event is unchanged. {0}",
  "Veranstaltungsdatei konnte nicht geöffnet werden. Wähle eine bearbeitbare Rehearsal-Datei (.json), keinen HTML-Ablaufplan oder ein PDF. Die aktuelle Veranstaltung bleibt erhalten. {0}"
 ],
 [
  "Unsupported or invalid event file.",
  "Nicht unterstützte oder ungültige Veranstaltungsdatei."
 ],
 [
  "Event fields are invalid or exceed limits (100 steps, 50 people).",
  "Veranstaltungsfelder sind ungültig oder überschreiten die Grenzen (100 Schritte, 50 Personen)."
 ],
 [
  "A step has invalid fields.",
  "Ein Schritt enthält ungültige Felder."
 ],
 [
  "Choose a valid start time.",
  "Wähle eine gültige Startzeit."
 ],
 [
  "Step IDs must be unique.",
  "Schritt-IDs müssen eindeutig sein."
 ],
 [
  "Every step needs a name.",
  "Jeder Schritt benötigt einen Namen."
 ],
 [
  "{0}: duration must be 1–1440 minutes.",
  "{0}: Die Dauer muss 1–1440 Minuten betragen."
 ],
 [
  "{0}: unknown person.",
  "{0}: unbekannte Person."
 ],
 [
  "{0}: dependency is missing.",
  "{0}: Voraussetzung fehlt."
 ],
 [
  "Circular step order (dependency cycle): two or more steps are waiting for each other. Uncheck a step under “Must wait for these steps” to break the loop.",
  "Zyklische Reihenfolge: Mindestens zwei Schritte warten aufeinander. Entferne eine Auswahl unter „Muss auf diese Schritte warten“, um den Kreis zu lösen."
 ],
 [
  "Unsupported event version.",
  "Nicht unterstützte Veranstaltungsversion."
 ],
 [
  "Invalid simulation.",
  "Ungültige Simulation."
 ],
 [
  "Invalid simulation: choose known steps/people and a delay of 0–1440 minutes.",
  "Ungültige Simulation: bekannte Schritte/Personen und eine Verspätung von 0–1440 Minuten wählen."
 ],
 [
  "Product launch rehearsal",
  "Probe der Produkteinführung"
 ],
 [
  "Welcome & sound check",
  "Begrüßung und Tonprobe"
 ],
 [
  "Live product demo",
  "Live-Produktdemo"
 ],
 [
  "Audience questions",
  "Publikumsfragen"
 ],
 [
  "Partner handoff",
  "Übergabe an Partner"
 ],
 [
  "Closing & next steps",
  "Abschluss und nächste Schritte"
 ],
 [
  "Check handheld mic and house lights.",
  "Handmikrofon und Saalbeleuchtung prüfen."
 ],
 [
  "Open the demo environment before doors.",
  "Demo-Umgebung vor dem Einlass öffnen."
 ],
 [
  "Keep the final two minutes for one last question.",
  "Die letzten zwei Minuten für eine letzte Frage freihalten."
 ],
 [
  "Switch slides and pass the clicker.",
  "Folien wechseln und Präsentationsfernbedienung übergeben."
 ],
 [
  "Show the contact link.",
  "Kontaktlink zeigen."
 ],
 [
  "run sheet",
  "Ablaufplan"
 ],
 [
  "Estimated run sheet — blocked steps need attention",
  "Geschätzter Ablaufplan — blockierte Schritte prüfen"
 ],
 [
  "Run sheet",
  "Ablaufplan"
 ],
 [
  "Test changes:",
  "Teständerungen:"
 ],
 [
  "Print this run sheet",
  "Diesen Ablaufplan drucken"
 ],
 [
  "Time",
  "Zeit"
 ],
 [
  "Step",
  "Schritt"
 ],
 [
  "People",
  "Personen"
 ],
 [
  "Notes / status",
  "Notizen / Status"
 ],
 [
  "BLOCKED · time is an estimate",
  "BLOCKIERT · Zeit ist ein Schätzwert"
 ],
 [
  "Created with Rehearsal by Arcdrake. (+1d) means the next day. Blocked steps cannot proceed until the plan is adjusted; their times are estimates.",
  "Erstellt mit Rehearsal von Arcdrake. (+1d) bedeutet Folgetag. Blockierte Schritte können erst nach Anpassung des Plans stattfinden; ihre Zeiten sind Schätzwerte."
 ],
 [
  "{0} — run sheet",
  "{0} — Ablaufplan"
 ],
 [
  "Run sheet · {0} · {1} minutes",
  "Ablaufplan · {0} · {1} Minuten"
 ],
 [
  "Estimated run sheet — blocked steps need attention · {0} · {1} minutes",
  "Geschätzter Ablaufplan — blockierte Schritte prüfen · {0} · {1} Minuten"
 ],
 [
  "Test changes: No delay · Everyone available",
  "Teständerungen: Keine Verspätung · Alle verfügbar"
 ],
 [
  "Test changes: {0} delayed {1} minutes before starting · Everyone available",
  "Teständerungen: {0} startet {1} Minuten später · Alle verfügbar"
 ],
 [
  "Test changes: No delay · {0} unavailable for the whole event",
  "Teständerungen: Keine Verspätung · {0} fehlt während der gesamten Veranstaltung"
 ],
 [
  "Test changes: {0} delayed {1} minutes before starting · {2} unavailable for the whole event",
  "Teständerungen: {0} startet {1} Minuten später · {2} fehlt während der gesamten Veranstaltung"
 ],
 [
  "Event Run-of-Show Planner & Delay Simulator | Rehearsal by Arcdrake",
  "Veranstaltungsablauf und Verspätungen planen | Rehearsal von Arcdrake"
 ],
 [
  "Plan your event's running order, assign people, and see how delays affect the schedule. Rehearsal creates a printable run sheet in your browser. No account needed.",
  "Plane den Ablauf deiner Veranstaltung, teile Personen ein und erkenne die Folgen von Verspätungen. Rehearsal erstellt einen druckbaren Ablaufplan im Browser. Kein Konto nötig."
 ],
 [
  "by Arcdrake",
  "von Arcdrake"
 ],
 [
  "{0} · 10 min late",
  "{0} · 10 Min. verspätet"
 ],
 [
  "Could not open this event file. Choose a Rehearsal editable event (.json), not an HTML run sheet or PDF. Your current event is unchanged.",
  "Veranstaltungsdatei konnte nicht geöffnet werden. Wähle eine bearbeitbare Rehearsal-Datei (.json), keinen HTML-Ablaufplan oder ein PDF. Die aktuelle Veranstaltung bleibt erhalten."
 ]
];
const patterns=entries.filter(([s])=>s.includes('{0}')).map(([s,t])=>[new RegExp('^'+s.split(/(\{\d+\})/).map(v=>/^\{\d+\}$/.test(v)?'(.*?)':v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$','s'),t]);
const exact=new Map(entries);
export function translate(value){const raw=String(value);if(language!=='de')return raw;const s=raw.trim();if(!s)return raw;let output=exact.get(s);if(output===undefined){for(const [pattern,target] of patterns){const match=s.match(pattern);if(match){output=target.replace(/\{(\d+)\}/g,(_,i)=>match[Number(i)+1]);break;}}}return output===undefined?raw:raw.replace(s,()=>output);}
export const getLanguage=()=>language;
export function translateHTML(html){const doc=new DOMParser().parseFromString(html,'text/html');const walker=doc.createTreeWalker(doc.documentElement,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement.closest('style,script,[data-l10n-raw]:not([data-l10n-raw="false"])'))continue;const v=n.nodeValue.trim();if(v)n.nodeValue=n.nodeValue.replace(v,()=>translate(v));}doc.documentElement.lang=language;return '<!doctype html>'+doc.documentElement.outerHTML;}
function text(node){const old=sources.get(node);const value=node.nodeValue;if(old&&value===old.output){node.nodeValue=language==='de'?old.output:old.source;old.output=node.nodeValue;if(language==='de')old.output=node.nodeValue=translate(old.source);return;}const trimmed=value.trim();if(!trimmed)return;const translated=translate(trimmed);const output=value.replace(trimmed,()=>translated);sources.set(node,{source:value,output});node.nodeValue=output;}
function refresh(){observer.disconnect();const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement.closest('script,style,textarea,pre,[data-l10n-raw]:not([data-l10n-raw="false"]),.arcdrake-collection-nav'))text(n);}for(const el of document.querySelectorAll('[aria-label],[placeholder],meta[name="description"]')){if(el.closest('[data-l10n-raw]:not([data-l10n-raw="false"]),.arcdrake-collection-nav'))continue;let saved=attributes.get(el);if(!saved){saved={};attributes.set(el,saved);}for(const attr of ['aria-label','placeholder',...(el.matches('meta')?['content']:[])]){if(!el.hasAttribute(attr))continue;const value=el.getAttribute(attr);const old=saved[attr];const source=old&&value===old.output?old.source:value;const output=translate(source);saved[attr]={source,output};el.setAttribute(attr,output);}}document.documentElement.lang=language;for(const b of document.querySelectorAll('[data-app-language]'))b.setAttribute('aria-pressed',String(b.dataset.appLanguage===language));observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});}
const observer=new MutationObserver(refresh);
function setLanguage(next,announce=false){if(!['de','en'].includes(next))return;language=next;try{localStorage.setItem(KEY,next);}catch{}try{const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(history.state,'',url);}catch{}refresh();if(announce)window.dispatchEvent(new CustomEvent('arcdrake-language-change',{detail:{language:next}}));}
const control=document.createElement('nav');control.className='language-switch';control.setAttribute('aria-label','Language / Sprache');control.innerHTML='<button type="button" data-app-language="en" lang="en">English</button><button type="button" data-app-language="de" lang="de">Deutsch</button>';
document.querySelector('header').append(control);control.addEventListener('click',e=>{if(e.target.dataset.appLanguage)setLanguage(e.target.dataset.appLanguage,true);});
window.addEventListener('arcdrake-language-change',e=>setLanguage(e.detail?.language));
refresh();
