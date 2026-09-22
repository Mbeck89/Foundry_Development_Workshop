# Lab 2 — Agent und Conversation

**25 Minuten.** Am Ende steht ein Agent in eurem Projekt, den ihr auch im Portal
seht — und ihr habt zwei Versionen davon verglichen.

Datei: **`lab-02/index.js`**, Start mit `npm run lab2`.

Tragt vorher in der `.env` einen eindeutigen `AGENT_NAME` ein (z. B. mit eurem
Kürzel). Sonst arbeiten im selben Projekt alle am selben Agenten.

## Schritt 1 — Agent anlegen

```js
const agent = await project.agents.createVersion(AGENT_NAME, {
  kind: "prompt",
  model: MODEL_DEPLOYMENT,
  instructions: "...",
});
```

`createVersion`, nicht `create`: Der Name ist stabil, jede Änderung erzeugt eine neue
Version. Verwaltet wird über den **Projekt-Client**, ausgeführt gleich über den
**OpenAI-Client**.

Nehmt für die Instructions einen Use Case aus eurem Alltag. Vorgegeben ist eine
Ticket-Annahme — das ist nur ein Vorschlag, euer eigener Fall ist lehrreicher.

Schaut danach ins Portal: Derselbe Agent ist dort sofort sichtbar. Ein Objekt,
zwei Zugänge.

## Schritt 2 — Conversation führen

```js
const conversation = await openai.conversations.create();   // speichert nur
const antwort = await openai.responses.create(              // führt aus
  { conversation: conversation.id, input: "..." },
  withAgent(agent),
);
```

Die Conversation ruft kein Modell auf. Sie ist ein Kontextspeicher; laufen lässt den
Agenten erst `responses.create()`.

Stellt zwei Fragen nacheinander, wobei die zweite das Thema nicht mehr nennt
("Und wie dringend ist das?"). Hält der Kontext?

**Gegenprobe:** dieselbe zweite Frage ohne `conversation`. Der Unterschied ist der
ganze Punkt dieses Schritts.

## Schritt 3 — Zweite Version

Hier steckt der Lerneffekt, dafür ruhig Zeit lassen.

Ändert die Instructions (z. B. "Antworte in genau drei Stichpunkten") und legt damit
eine zweite Version an — gleicher Name, neue Version. Stellt dann **dieselbe** Frage
noch einmal und vergleicht die beiden Antworten nebeneinander.

```js
for await (const version of project.agents.listVersions(AGENT_NAME)) {
  console.log(version.name, version.version);
}
```

Damit wird aus einer Prompt-Änderung ein nachvollziehbares Release: Staging, A/B und
Rollback laufen über die Versionsnummer statt über eine Datei in der Git-Historie.

Ein Lauf ohne Versionsangabe nutzt den Agenten in seinem aktuellen Stand. Welche
Version ein produktiver Endpoint bedient, konfiguriert ihr am Agent-Endpoint
(Version-Selector) — das ist der Baustein hinter Staging und A/B, aber nicht mehr
Teil dieses Labs.

## Wenn ihr zügig fertig seid

Öffnet denselben Agenten im Portal und testet ihn dort weiter. Im Code definierte und
im Portal geklickte Agents sind dasselbe Objekt — relevant für Teams, in denen nicht
alle Code schreiben.

## Stolperfallen

- **"Ich habe eine Conversation erzeugt, bekomme aber keine Antwort."** — Richtig so:
  eine Conversation ruft das Modell nicht auf.
- **Agent-Name schon vergeben** — in der `.env` einen eigenen `AGENT_NAME` setzen.
- **Die zweite Version verhält sich wie die erste** — Instructions wirklich geändert?
  `listVersions` zeigt, ob eine neue Version entstanden ist.

## Lösung

`lab-02/solution.js`, Start mit `npm run lab2:solution`.

Der Agent bleibt danach absichtlich stehen. Aufräumen am Ende des Workshops:
`npm run cleanup -- --yes`.
