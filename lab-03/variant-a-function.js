/**
 * Lab 3, Variante A - dem Agenten eine eigene Function geben.
 *
 * Start:  npm run lab3:a
 * Ziel:   Das Modell entscheidet selbst, wann es eure Funktion braucht.
 *         Ausgeführt wird sie bei euch, im eigenen Prozess.
 *
 * Folien: "Was ein Agent benutzen darf", "Eigene Function oder MCP-Server?".
 *
 * Der Ablauf hat vier Takte:
 *   1. Agent mit Tool-Definition anlegen
 *   2. Lauf starten - die Antwort enthält statt Text einen function_call
 *   3. Funktion lokal ausführen, Ergebnis als function_call_output zurückgeben
 *   4. Zweiter Lauf, jetzt kommt die Antwort in Worten
 */

import {
  AGENT_NAME,
  MODEL_DEPLOYMENT,
  createClients,
  run,
  step,
  withAgent,
} from "../shared/foundry.js";
import { TICKETS } from "../shared/data.js";

/** Das ist die Funktion, die wirklich läuft - ganz normaler Code, kein Modell. */
function getTicketStatus(ticketId) {
  const ticket = TICKETS[ticketId.toUpperCase()];
  return ticket ?? { fehler: `Ticket ${ticketId} ist unbekannt.` };
}

/** So beschreibt ihr diese Funktion für das Modell. */
const ticketStatusTool = {
  type: "function",
  name: "get_ticket_status",
  description:
    "Liefert Status, Priorität und Zuständigkeit zu einer Ticketnummer aus dem Service-Desk-System.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      ticket_id: {
        type: "string",
        description: "Die Ticketnummer, zum Beispiel INC-1042",
      },
    },
    required: ["ticket_id"],
    additionalProperties: false,
  },
};

const FRAGE = "Was ist der aktuelle Stand von Ticket INC-1042 und wer bearbeitet es?";

run(async () => {
  const { project, openai } = createClients();

  step("Variante A - eigene Function");

  // ---------------------------------------------------------------------------
  // TODO 1: Legt eine neue Version eures Agenten an, diesmal mit dem Tool.
  //
  //   const agent = await project.agents.createVersion(`${AGENT_NAME}-tools`, {
  //     kind: "prompt",
  //     model: MODEL_DEPLOYMENT,
  //     instructions:
  //       "Du bist die Ticket-Auskunft des IT-Service-Desks. " +
  //       "Nutze das Tool get_ticket_status, wenn nach einem konkreten Ticket gefragt wird.",
  //     tools: [ticketStatusTool],
  //   });
  //
  // TODO 2: Startet den Lauf und schaut in response.output, statt output_text zu lesen.
  //
  //   const response = await openai.responses.create({ input: FRAGE }, withAgent(agent));
  //   console.log(JSON.stringify(response.output, null, 2));
  //
  // TODO 3: Sammelt die Tool-Aufrufe ein, führt sie aus und verpackt die Ergebnisse.
  //
  //   const ergebnisse = [];
  //   for (const item of response.output) {
  //     if (item.type === "function_call" && item.name === "get_ticket_status") {
  //       const args = JSON.parse(item.arguments);
  //       ergebnisse.push({
  //         type: "function_call_output",
  //         call_id: item.call_id,
  //         output: JSON.stringify(getTicketStatus(args.ticket_id)),
  //       });
  //     }
  //   }
  //
  // TODO 4: Zweiter Lauf mit den Ergebnissen - previous_response_id hängt ihn an den ersten an.
  //
  //   const finale = await openai.responses.create(
  //     { input: ergebnisse, previous_response_id: response.id },
  //     withAgent(agent),
  //   );
  //   console.log(finale.output_text);
  //
  // TODO 5 (der eigentliche Punkt): Fragt etwas, wofür das Tool nicht passt,
  //         zum Beispiel "Wie beantrage ich einen neuen Monitor?".
  //         Das Modell ruft dann gar kein Tool auf - die Entscheidung liegt bei ihm.
  // ---------------------------------------------------------------------------

  console.log("\nNoch nichts passiert - die TODOs in lab-03/variant-a-function.js warten auf euch.");
  console.log(`Bekannte Tickets: ${Object.keys(TICKETS).join(", ")}`);
  console.log(`Frage: ${FRAGE}`);
});
