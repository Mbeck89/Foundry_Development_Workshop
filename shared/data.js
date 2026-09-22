// Beispieldaten für die Labs. Frei erfunden, aber nah genug an echten Tickets,
// dass die Ergebnisse etwas aussagen.

/** Eingangstext für Lab 1: eine Störungsmeldung, wie sie im Service Desk landet. */
export const STOERUNGSBERICHT = `
Betreff: Zugriff auf Angebotsordner seit heute Morgen nicht möglich

Guten Morgen,

seit heute ca. 07:40 Uhr kommen mehrere Kolleginnen und Kollegen aus dem Vertrieb
Innendienst nicht mehr an das Laufwerk V: (Angebote). Beim Öffnen erscheint nach
etwa einer Minute die Meldung "Auf V:\\ kann nicht zugegriffen werden". Betroffen
sind nach unserer Zählung mindestens acht Arbeitsplätze am Standort Neckarsulm,
im Home-Office über VPN tritt der Fehler ebenfalls auf.

Gestern Abend lief noch alles. Es sind heute drei Angebote mit Frist bis 12:00 Uhr
abzugeben, deshalb ist das gerade sehr unangenehm.

Viele Grüße
Service Desk, Ticket-Aufnahme
`.trim();

/** "Datenbank" für das Function Tool in Lab 3, Variante A. */
export const TICKETS = {
  "INC-1042": {
    status: "in Bearbeitung",
    prioritaet: "hoch",
    zugewiesen_an: "Team Storage",
    letztes_update: "2026-09-22T08:15:00+02:00",
    kurzbeschreibung: "Laufwerk V: am Standort Neckarsulm nicht erreichbar",
  },
  "INC-0815": {
    status: "wartet auf Rückmeldung",
    prioritaet: "mittel",
    zugewiesen_an: "Team Client",
    letztes_update: "2026-09-19T16:40:00+02:00",
    kurzbeschreibung: "Notebook startet nach Treiberupdate nicht mehr",
  },
  "INC-2311": {
    status: "geschlossen",
    prioritaet: "niedrig",
    zugewiesen_an: "Team Identity",
    letztes_update: "2026-09-12T11:05:00+02:00",
    kurzbeschreibung: "MFA-Token neu registriert",
  },
};
