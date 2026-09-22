# Entwicklung mit Microsoft Foundry — Workshop-Repo

Begleitmaterial zum Workshop. Drei Hands-on-Labs, rund 55 Minuten reine Lab-Zeit:

| Lab | Zeit | Ordner   | Darum geht es                                               |
| --- | ---- | -------- | ----------------------------------------------------------- |
| 1   | 15 min | `lab-01` | Setup, erster Modellaufruf, Streaming, strukturierte Ausgabe |
| 2   | 25 min | `lab-02` | Prompt Agent anlegen, Conversation führen, zweite Version     |
| 3   | 15 min | `lab-03` | Dem Agenten ein Werkzeug geben: eigene Function **oder** MCP  |

Alles in JavaScript (ESM), ohne Build-Schritt. Authentifiziert wird über Entra ID —
**es gehört kein API-Key in dieses Repo.**

## Voraussetzungen

- **Node 22 oder neuer** (`node -v`). Das Foundry SDK verlangt es; ältere Versionen
  scheitern mit unklaren Fehlern. Mit nvm: `nvm install 22 && nvm use 22`.
- **Azure CLI** (`az version`), angemeldet mit `az login`.
- Zugriff auf ein **Foundry-Projekt** mit mindestens der Rolle *Azure AI User*.
- Ein **Modell-Deployment** in diesem Projekt (z. B. `gpt-4.1-mini`).

## Setup — einmal zu Beginn von Lab 1

```bash
npm install
az login
cp .env.example .env     # dann PROJECT_ENDPOINT und MODEL_DEPLOYMENT eintragen
npm run doctor
```

`npm run doctor` prüft Node-Version, `.env`, Token und ob euer Deployment im Projekt
wirklich existiert. Wenn dort alles grün ist, läuft Lab 1.

Die beiden Werte aus der `.env` findet ihr im Portal:

| Variable           | Wo im Portal                                              | Form                                                          |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------- |
| `PROJECT_ENDPOINT` | Projektübersicht, "Azure AI Foundry project endpoint"      | `https://<resource>.services.ai.azure.com/api/projects/<projekt>` |
| `MODEL_DEPLOYMENT` | "Models + endpoints", Spalte **Name**                      | z. B. `gpt-4.1-mini`                                          |
| `AGENT_NAME`       | frei wählbar — bitte eindeutig, z. B. mit eurem Kürzel     | z. B. `workshop-agent-mb`                                     |

> Häufigster Fehler im Lab: In `MODEL_DEPLOYMENT` landet der **Modellname aus dem
> Katalog** statt des **Deployment-Namens**. Das Ergebnis ist ein 404.

## Befehle

| Befehl                    | Was passiert                                        |
| ------------------------- | --------------------------------------------------- |
| `npm run doctor`          | Setup-Check (Node, `.env`, Token, Deployment)        |
| `npm run lab1`            | Lab 1, Schritt 3: erster Aufruf                      |
| `npm run lab1:stream`     | Lab 1, Erweiterung: Streaming                        |
| `npm run lab1:json`       | Lab 1, Erweiterung: strukturierte Ausgabe            |
| `npm run lab2`            | Lab 2: Agent, Conversation, zweite Version           |
| `npm run lab3:a`          | Lab 3, Variante A: eigene Function                   |
| `npm run lab3:b`          | Lab 3, Variante B: MCP-Server                        |
| `npm run lab1:solution`   | Lösung zu Lab 1 (`-- 1`, `-- 2`, `-- 3` für einzelne Schritte) |
| `npm run lab2:solution`   | Lösung zu Lab 2                                      |
| `npm run lab3:solution`   | Lösung zu Lab 3 (`-- b` oder `-- beide`)             |
| `npm run cleanup`         | zeigt die Workshop-Agents; mit `-- --yes` löscht es sie |

Mehr Details zu einem Fehler: `DEBUG=1 npm run lab1`.

## Wie die Labs aufgebaut sind

Jeder Lab-Ordner enthält:

- eine **Start-Datei** mit TODO-Blöcken — hier schreibt ihr den Code,
- **`solution.js`** — die vollständige Lösung, falls ihr hängenbleibt oder
  hinterher noch einmal nachlesen wollt,
- ein **README** mit Ziel, Schritten, erwarteter Ausgabe und Stolperfallen.

Die TODO-Blöcke enthalten den Code als Kommentar. Abtippen ist erlaubt — der
Lerneffekt steckt nicht im Tippen, sondern in dem, was ihr danach damit macht.

## Die zwei Clients

Alle Labs nutzen `shared/foundry.js`. Dort steckt das Muster aus dem Vortrag:

```js
const project = new AIProjectClient(PROJECT_ENDPOINT, new DefaultAzureCredential());
const openai = project.getOpenAIClient();
```

- **`project`** — Projekt-Client: Agents verwalten, Deployments auflisten, Connections lesen.
- **`openai`** — OpenAI-kompatibler Client: Responses, Conversations, Agent-Läufe.

Merksatz: Projekt-Client für Setup und Konfiguration, OpenAI-Client für das Ausführen.

Dazu kommt ein kleiner Helfer `withAgent(agent)`: er bindet einen Lauf an einen
Agenten, statt ein Modell direkt aufzurufen.

```js
await openai.responses.create({ conversation: id, input: "..." }, withAgent(agent));
```

## Troubleshooting

| Symptom                                    | Ursache                                             | Lösung                                                   |
| ------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------- |
| `SyntaxError` beim Start, Node < 22        | zu alte Node-Version                                 | `nvm install 22 && nvm use 22`                           |
| 401                                        | kein oder abgelaufenes Token                         | `az login`                                               |
| 403                                        | Token gültig, Rolle fehlt                            | Rolle *Azure AI User* auf dem Projekt zuweisen lassen    |
| 404 / `DeploymentNotFound`                 | Modellname statt Deployment-Name in `MODEL_DEPLOYMENT` | `npm run doctor` zeigt die vorhandenen Deployments      |
| 429                                        | Rate Limit / Quota                                   | kurz warten, erneut starten                              |
| Endpoint nicht erreichbar                  | `PROJECT_ENDPOINT` unvollständig                     | muss auf `/api/projects/<projekt>` enden                 |
| falsche Subscription                       | mehrere Subscriptions im Account                     | `az account set --subscription "<name>"`                 |

## Nach dem Workshop

- **Aufräumen:** `npm run cleanup -- --yes` löscht die drei Agents, die hier entstanden sind.
- **Embeddings:** laufen *nicht* über den Projekt-Endpoint. Für RAG braucht ihr zusätzlich
  den Azure-OpenAI-Endpoint — zwei Endpoints, zwei Konfigurationspfade, von Anfang an einplanen.
- **Nie im Frontend:** `DefaultAzureCredential` gehört in ein Backend. Aus einer SPA oder
  App heraus würdet ihr das Credential ausliefern.
- **Weiterlesen:**
  [SDK-Referenz](https://learn.microsoft.com/javascript/api/overview/azure/ai-projects-readme) ·
  [SDK-Beispiele](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/ai/ai-projects/samples)

## Stand

Geschrieben und geprüft gegen `@azure/ai-projects` **2.7.0** (September 2026), Node 22.
Das SDK bewegt sich schnell: Wenn ein Aufruf hier abweicht von dem, was ihr in der
Dokumentation seht, hat meistens die Dokumentation recht.
