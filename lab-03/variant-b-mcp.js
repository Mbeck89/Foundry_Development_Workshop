/**
 * Lab 3, Variante B - einen MCP-Server als Tool eintragen.
 *
 * Start:  npm run lab3:b
 * Ziel:   Derselbe Agent, aber die Fähigkeit kommt aus einem Dienst, den ihr
 *         nicht selbst aufruft. Der Agent Service spricht direkt mit dem Server.
 *
 * Folien: "Was ein Agent benutzen darf", "Eigene Function oder MCP-Server?".
 *
 * Vorbereitet ist ein öffentlicher, lesender MCP-Server (siehe .env):
 *   MCP_SERVER_URL=https://gitmcp.io/Azure/azure-rest-api-specs
 *
 * Unterschied zu Variante A: ihr führt nichts aus. Ihr entscheidet nur, ob der
 * Zugriff erlaubt ist - das ist der Freigabe-Durchlauf mit require_approval.
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

const FRAGE = "Fasse die Readme der Azure REST API Specifications in fünf Sätzen zusammen.";

run(async () => {
  const { project, openai } = createClients();

  step("Variante B - MCP-Server");

  // ---------------------------------------------------------------------------
  // TODO 1: Legt eine Agent-Version mit dem MCP-Server als Tool an.
  //
  //   const agent = await project.agents.createVersion(`${AGENT_NAME}-mcp`, {
  //     kind: "prompt",
  //     model: MODEL_DEPLOYMENT,
  //     instructions:
  //       "Du beantwortest Fragen zu den Azure REST API Specifications. " +
  //       "Nutze dafür die Werkzeuge des angebundenen MCP-Servers.",
  //     tools: [
  //       {
  //         type: "mcp",
  //         server_label: MCP_SERVER_LABEL,
  //         server_url: MCP_SERVER_URL,
  //         require_approval: "always",
  //       },
  //     ],
  //   });
  //
  // TODO 2: Startet den Lauf in einer Conversation.
  //
  //   const conversation = await openai.conversations.create();
  //   const response = await openai.responses.create(
  //     { conversation: conversation.id, input: FRAGE },
  //     withAgent(agent),
  //   );
  //
  // TODO 3: Wegen require_approval: "always" kommt zuerst eine Freigabe-Anfrage
  //         zurück, noch keine Antwort. Sammelt sie ein und beantwortet sie.
  //
  //   const freigaben = [];
  //   for (const item of response.output) {
  //     if (item.type === "mcp_approval_request") {
  //       console.log(`Freigabe angefragt: ${item.server_label} -> ${item.name}`);
  //       freigaben.push({
  //         type: "mcp_approval_response",
  //         approval_request_id: item.id,
  //         approve: true,
  //       });
  //     }
  //   }
  //
  // TODO 4: Zweiter Lauf mit den Freigaben - jetzt darf der Dienst zugreifen.
  //
  //   const finale = await openai.responses.create(
  //     { input: freigaben, previous_response_id: response.id },
  //     withAgent(agent),
  //   );
  //   console.log(finale.output_text);
  //
  // TODO 5 (Diskussion, kein Code): Stellt require_approval auf "never" und
  //         überlegt, was das in eurem Umfeld bedeutet - wer entscheidet dann,
  //         welche Daten diesen Server erreichen?
  // ---------------------------------------------------------------------------

  console.log("\nNoch nichts passiert - die TODOs in lab-03/variant-b-mcp.js warten auf euch.");
  console.log(`MCP-Server: ${MCP_SERVER_LABEL} (${MCP_SERVER_URL})`);
  console.log(`Frage: ${FRAGE}`);
});
