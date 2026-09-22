# Lab 3 — Dem Agenten ein Werkzeug geben

**15 Minuten. Variante wählen.** Beide liegen fertig im Repo — auch die, die ihr
nicht nehmt.

| Variante | Datei                      | Start            | Worum es geht                                        |
| -------- | -------------------------- | ---------------- | ---------------------------------------------------- |
| **A**    | `variant-a-function.js`    | `npm run lab3:a` | Eigene Funktion als Tool. **Ihr** führt sie aus.      |
| **B**    | `variant-b-mcp.js`         | `npm run lab3:b` | MCP-Server als Tool. **Der Dienst** ruft ihn auf.     |

Genau darin liegt die Trennlinie aus dem Vortrag: Die ersten sieben Tool-Arten laufen
beim Dienst, eigene Functions bei euch. Das entscheidet über Netzwerkfreigaben,
Datenabfluss und Betriebsaufwand — nicht über die Funktionalität.

## Variante A — Eigene Function

Vier Takte:

1. Agent-Version mit der Tool-Definition anlegen (`tools: [ticketStatusTool]`).
2. Lauf starten. Die Antwort enthält keinen Text, sondern einen `function_call`.
3. Die Funktion lokal ausführen und das Ergebnis als `function_call_output` zurückgeben.
4. Zweiter Lauf mit `previous_response_id` — jetzt kommt die Antwort in Worten.

```js
for (const item of response.output) {
  if (item.type === "function_call") {
    const args = JSON.parse(item.arguments);
    // ... eure Logik ...
  }
}
```

Die "Datenbank" sind drei Tickets in `shared/data.js` (`INC-1042`, `INC-0815`, `INC-2311`).

**Der eigentliche Punkt kommt zum Schluss:** Fragt etwas, wofür das Tool nicht passt
("Wie beantrage ich einen zweiten Monitor?"). Das Modell ruft dann gar kein Tool auf.
Ihr beschreibt die Fähigkeit, die Entscheidung über den Aufruf liegt beim Modell.

## Variante B — MCP-Server anbinden

Vorbereitet ist ein öffentlicher, lesender MCP-Server (in der `.env`):

```
MCP_SERVER_URL=https://gitmcp.io/Azure/azure-rest-api-specs
```

```js
tools: [
  {
    type: "mcp",
    server_label: MCP_SERVER_LABEL,
    server_url: MCP_SERVER_URL,
    require_approval: "always",
  },
]
```

Ihr führt hier nichts aus. Weil `require_approval: "always"` gesetzt ist, kommt aus dem
ersten Lauf statt einer Antwort ein `mcp_approval_request` zurück; ihr schickt eine
`mcp_approval_response` und der Dienst arbeitet weiter.

**Diskussionspunkt statt Code:** Stellt euch `require_approval: "never"` vor. Wer
entscheidet dann, welche Daten diesen Server erreichen? Genau an dieser Stelle wird die
Auth-Zeile aus der Vergleichstabelle konkret.

## Wann was

| Kriterium        | Function Calling                      | MCP-Server                                  |
| ---------------- | ------------------------------------- | ------------------------------------------- |
| Wiederverwendung | an eure Anwendung gebunden            | einmal gebaut, von jedem Client nutzbar     |
| Betrieb          | läuft in eurem Prozess mit            | eigener Dienst mit eigenem Lebenszyklus     |
| Auth             | erbt den Kontext eurer Anwendung      | braucht ein eigenes Konzept                 |
| Passt für        | eine Handvoll Aufrufe in einem Projekt | Fähigkeiten, die mehrere Teams brauchen    |

Pragmatisch: mit Function Calling anfangen, auf MCP wechseln, wenn dieselbe Fähigkeit
im zweiten Projekt gebraucht wird.

## Stolperfallen

- **`response.output_text` ist leer** — richtig so: im ersten Lauf steht dort kein Text,
  sondern in `response.output` ein `function_call` bzw. ein `mcp_approval_request`.
- **Der zweite Lauf kennt den ersten nicht** — `previous_response_id` vergessen.
- **Kein Tool-Aufruf** — die Frage passt nicht zur Tool-Beschreibung, oder die
  Instructions sagen nicht, wann das Tool zu nutzen ist.
- **Variante B hängt** — der MCP-Server ist öffentlich und gelegentlich langsam;
  bei Firewall-Einschränkungen im Kundennetz greift Variante A.

## Lösung

```bash
npm run lab3:solution            # Variante A
npm run lab3:solution -- b       # Variante B
npm run lab3:solution -- beide
```

Die angelegten Agent-Versionen (`<AGENT_NAME>-tools`, `<AGENT_NAME>-mcp`) bleiben stehen.
Aufräumen: `npm run cleanup -- --yes`.
