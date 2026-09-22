/**
 * Lab 3 - Lösung, beide Varianten.
 *
 * Start:  npm run lab3:solution           (Variante A, eigene Function)
 *         npm run lab3:solution -- b      (Variante B, MCP-Server)
 *         npm run lab3:solution -- beide
 *
 * Die angelegten Agent-Versionen bleiben stehen. Aufräumen: npm run cleanup
 */

import {
  AGENT_NAME,
  MCP_SERVER_LABEL,
  MCP_SERVER_URL,
  MODEL_DEPLOYMENT,
  createClients,
  run,
  step,
  withAgent,
} from "../shared/foundry.js";
import { TICKETS } from "../shared/data.js";

// ---------------------------------------------------------------------------
// Variante A - eigene Function
// ---------------------------------------------------------------------------

function getTicketStatus(ticketId) {
  const ticket = TICKETS[ticketId.toUpperCase()];
  return ticket ?? { fehler: `Ticket ${ticketId} ist unbekannt.` };
}

const ticketStatusTool = {
  type: "function",
  name: "get_ticket_status",
  description:
    "Liefert Status, Priorität und Zuständigkeit zu einer Ticketnummer aus dem Service-Desk-System.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      ticket_id: { type: "string", description: "Die Ticketnummer, zum Beispiel INC-1042" },
    },
    required: ["ticket_id"],
    additionalProperties: false,
  },
};

async function varianteA(project, openai) {
  step("Variante A - eigene Function");

  const agent = await project.agents.createVersion(`${AGENT_NAME}-tools`, {
    kind: "prompt",
    model: MODEL_DEPLOYMENT,
    instructions:
      "Du bist die Ticket-Auskunft des IT-Service-Desks. " +
      "Nutze das Tool get_ticket_status, wenn nach einem konkreten Ticket gefragt wird. " +
      "Antworte kurz und nenne den Stand in eigenen Worten.",
    tools: [ticketStatusTool],
  });
  console.log(`Agent '${agent.name}', Version ${agent.version}\n`);

  const frage = "Was ist der aktuelle Stand von Ticket INC-1042 und wer bearbeitet es?";
  console.log(`Frage: ${frage}\n`);

  // Erster Lauf: die Antwort ist kein Text, sondern ein Auftrag an euch.
  const response = await openai.responses.create({ input: frage }, withAgent(agent));

  const ergebnisse = [];
  for (const item of response.output) {
    if (item.type === "function_call" && item.name === "get_ticket_status") {
      const args = JSON.parse(item.arguments);
      const ergebnis = getTicketStatus(args.ticket_id);
      console.log(`Modell ruft get_ticket_status(${args.ticket_id}) auf`);
      console.log(`Lokal ausgeführt, Ergebnis: ${JSON.stringify(ergebnis)}\n`);
      ergebnisse.push({
        type: "function_call_output",
        call_id: item.call_id,
        output: JSON.stringify(ergebnis),
      });
    }
  }

  if (ergebnisse.length === 0) {
    console.log("Kein Tool-Aufruf - das Modell hat direkt geantwortet:");
    console.log(response.output_text);
    return;
  }

  // Zweiter Lauf: mit den Ergebnissen im Gepäck formuliert das Modell die Antwort.
  const finale = await openai.responses.create(
    { input: ergebnisse, previous_response_id: response.id },
    withAgent(agent),
  );
  console.log("Antwort:");
  console.log(finale.output_text);

  // Gegenprobe: eine Frage, für die das Tool nicht passt.
  const ohneTool = await openai.responses.create(
    { input: "Wie beantrage ich einen zweiten Monitor?" },
    withAgent(agent),
  );
  const toolAufrufe = ohneTool.output.filter((item) => item.type === "function_call").length;
  console.log(`\nGegenprobe ohne passendes Ticket: ${toolAufrufe} Tool-Aufruf(e).`);
  console.log(ohneTool.output_text);
}

// ---------------------------------------------------------------------------
// Variante B - MCP-Server
// ---------------------------------------------------------------------------

async function varianteB(project, openai) {
  step("Variante B - MCP-Server");

  const agent = await project.agents.createVersion(`${AGENT_NAME}-mcp`, {
    kind: "prompt",
    model: MODEL_DEPLOYMENT,
    instructions:
      "Du beantwortest Fragen zu den Azure REST API Specifications. " +
      "Nutze dafür die Werkzeuge des angebundenen MCP-Servers.",
    tools: [
      {
        type: "mcp",
        server_label: MCP_SERVER_LABEL,
        server_url: MCP_SERVER_URL,
        require_approval: "always",
      },
    ],
  });
  console.log(`Agent '${agent.name}', Version ${agent.version}`);
  console.log(`MCP-Server: ${MCP_SERVER_LABEL} (${MCP_SERVER_URL})\n`);

  const conversation = await openai.conversations.create();
  const frage = "Fasse die Readme der Azure REST API Specifications in fünf Sätzen zusammen.";
  console.log(`Frage: ${frage}\n`);

  const response = await openai.responses.create(
    { conversation: conversation.id, input: frage },
    withAgent(agent),
  );

  // require_approval: "always" - der Dienst fragt, bevor er nach außen geht.
  const freigaben = [];
  for (const item of response.output) {
    if (item.type === "mcp_approval_request") {
      console.log(`Freigabe angefragt: ${item.server_label} -> ${item.name}`);
      freigaben.push({
        type: "mcp_approval_response",
        approval_request_id: item.id,
        approve: true,
      });
    }
  }

  if (freigaben.length === 0) {
    console.log("Keine Freigabe nötig gewesen. Antwort:");
    console.log(response.output_text);
  } else {
    console.log(`\n${freigaben.length} Freigabe(n) erteilt, zweiter Lauf...\n`);
    const finale = await openai.responses.create(
      { input: freigaben, previous_response_id: response.id },
      withAgent(agent),
    );
    console.log("Antwort:");
    console.log(finale.output_text);
  }

  await openai.conversations.delete(conversation.id);
}

// ---------------------------------------------------------------------------

run(async () => {
  const { project, openai } = createClients();
  const auswahl = (process.argv[2] ?? "a").toLowerCase();

  if (auswahl === "a" || auswahl === "beide") await varianteA(project, openai);
  if (auswahl === "b" || auswahl === "beide") await varianteB(project, openai);
});
