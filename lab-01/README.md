# Lab 1 — Setup und erster Aufruf

**15 Minuten.** Am Ende läuft Code auf eurem Rechner gegen euer Foundry-Projekt.

## Schritt 1 — Repo klonen, Pakete ziehen

```bash
npm install
az login
```

Falls ihr mehrere Subscriptions habt, muss die mit dem Foundry-Projekt die aktive sein:

```bash
az account list --output table
az account set --subscription "<Name oder ID>"
```

## Schritt 2 — `.env` füllen

```bash
cp .env.example .env
```

Zwei Werte aus dem Portal eintragen:

- `PROJECT_ENDPOINT` — Projektübersicht, Form
  `https://<resource>.services.ai.azure.com/api/projects/<projekt>`
- `MODEL_DEPLOYMENT` — "Models + endpoints", Spalte **Name**.
  Das ist der Deployment-Name, **nicht** der Modellname aus dem Katalog.

Dann:

```bash
npm run doctor
```

Der Check sagt euch in zehn Sekunden, ob Node, Token, Endpoint und Deployment stimmen.
Erst wenn er grün ist, lohnt sich Schritt 3.

## Schritt 3 — Erster Aufruf

Datei: **`lab-01/index.js`** — dort warten zwei TODOs.

```bash
npm run lab1
```

Erwartete Ausgabe: eine dreisätzige Zusammenfassung der Störungsmeldung aus
`shared/data.js`, dazu die Token-Zahlen.

Das sind die Zeilen von der Folie "Anatomie eines Aufrufs":

```js
const response = await openai.responses.create({
  model: MODEL_DEPLOYMENT,
  input: "...",
});
console.log(response.output_text);
```

`output_text` ist der bequeme Weg. Schaut euch einmal `response.output` an — darunter
liegen einzelne Items, und genau die wertet ihr in Lab 3 aus.

## Erweiterungen, wenn ihr früh fertig seid

**A — Streaming** (`lab-01/streaming.js`, `npm run lab1:stream`)

`stream: true` setzen und die Events lesen. Interessant: einmal alle `event.type`
ausgeben, die vorbeikommen. Dieselbe Event-Kette nutzen später die Agents.

**B — Strukturierte Ausgabe** (`lab-01/structured.js`, `npm run lab1:json`)

Das Schema ist vorgegeben. Ihr hängt es an den Aufruf und parst das Ergebnis.
Danach ist aus dem Modell eine Komponente geworden, die man in eine Automatisierung
hängen kann. Probiert ruhig aus, was passiert, wenn ihr das Schema aufweicht
(`strict: true` verlangt: jede Property in `required`, `additionalProperties: false`).

## Stolperfallen

| Fehler                          | Ursache                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| 404 / `DeploymentNotFound`      | Modellname statt Deployment-Name in `MODEL_DEPLOYMENT`        |
| 401                             | `az login` fehlt oder Token abgelaufen                        |
| 403                             | Rolle *Azure AI User* auf dem Projekt fehlt                   |
| `SyntaxError` direkt beim Start | Node älter als 22                                             |
| `PROJECT_ENDPOINT` nicht gesetzt | `.env` nicht angelegt oder im falschen Ordner                 |

## Lösung

`lab-01/solution.js` — alle drei Schritte:

```bash
npm run lab1:solution          # alles
npm run lab1:solution -- 2     # nur Streaming
```
