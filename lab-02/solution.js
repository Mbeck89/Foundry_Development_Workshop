/**
 * Lab 2 - Lösung.
 *
 * Start:  npm run lab2:solution
 *
 * Der Agent bleibt am Ende absichtlich stehen, damit ihr ihn im Portal
 * anschauen und dort weitertesten könnt. Aufräumen später mit: npm run cleanup
 */

import {
  AGENT_NAME,
  MODEL_DEPLOYMENT,
  createClients,
  run,
  step,
  withAgent,
} from "../shared/foundry.js";

const FRAGE = "Wie melde ich einen Ausfall des Laufwerks V:?";
const NACHFRAGE = "Und wie dringend ist das?";

const INSTRUCTIONS_V1 = `
Du bist die Ticket-Annahme eines internen IT-Service-Desks.
Du beantwortest Fragen von Kolleginnen und Kollegen zu Störungen und Anträgen.
Antworte kurz und in ganzen Sätzen.
`.trim();

const INSTRUCTIONS_V2 = `${INSTRUCTIONS_V1}
Antworte in genau drei Stichpunkten, ohne Fließtext.
Nenne im letzten Stichpunkt immer, welche Angaben das Ticket enthalten muss.`;

run(async () => {
  const { project, openai } = createClients();

  // --- Schritt 1: Agent anlegen -------------------------------------------
  step("Schritt 1 - Agent anlegen");

  const agent = await project.agents.createVersion(AGENT_NAME, {
    kind: "prompt",
    model: MODEL_DEPLOYMENT,
    instructions: INSTRUCTIONS_V1,
  });
  console.log(`Agent '${agent.name}', Version ${agent.version} (id: ${agent.id})`);
  console.log("Derselbe Agent ist ab jetzt im Portal sichtbar.");

  // --- Schritt 2: Conversation führen -------------------------------------
  step("Schritt 2 - Conversation führen");

  // Die Conversation ist ein Kontextspeicher. Hier passiert noch nichts.
  const conversation = await openai.conversations.create();
  console.log(`Conversation ${conversation.id}\n`);

  // Erst responses.create() lässt den Agenten laufen.
  const antwort1 = await openai.responses.create(
    { conversation: conversation.id, input: FRAGE },
    withAgent(agent),
  );
  console.log(`Frage:   ${FRAGE}`);
  console.log(`Antwort: ${antwort1.output_text}\n`);

  // Die Nachfrage nennt das Thema nicht mehr - der Kontext kommt aus der Conversation.
  const antwort2 = await openai.responses.create(
    { conversation: conversation.id, input: NACHFRAGE },
    withAgent(agent),
  );
  console.log(`Frage:   ${NACHFRAGE}`);
  console.log(`Antwort: ${antwort2.output_text}\n`);

  // Gegenprobe ohne Conversation: derselbe Agent, aber ohne Historie.
  const ohneKontext = await openai.responses.create({ input: NACHFRAGE }, withAgent(agent));
  console.log("Dieselbe Nachfrage ohne Conversation:");
  console.log(ohneKontext.output_text);

  // --- Schritt 3: zweite Version ------------------------------------------
  step("Schritt 3 - zweite Version, gleicher Name");

  const agentV2 = await project.agents.createVersion(AGENT_NAME, {
    kind: "prompt",
    model: MODEL_DEPLOYMENT,
    instructions: INSTRUCTIONS_V2,
  });
  console.log(`Aus Version ${agent.version} wurde Version ${agentV2.version}.`);
  console.log("Der Name ist stabil geblieben - referenziert wird über Name und Version.\n");

  const antwortV2 = await openai.responses.create({ input: FRAGE }, withAgent(agentV2));

  console.log(`Frage an beide Versionen: ${FRAGE}\n`);
  console.log(`--- Version ${agent.version} ---`);
  console.log(antwort1.output_text);
  console.log(`\n--- Version ${agentV2.version} ---`);
  console.log(antwortV2.output_text);

  step("Alle Versionen dieses Agenten");
  for await (const version of project.agents.listVersions(AGENT_NAME)) {
    console.log(`  ${version.name}  Version ${version.version}`);
  }

  // Conversation aufräumen, Agent bewusst stehen lassen (siehe Kopf der Datei).
  await openai.conversations.delete(conversation.id);
  console.log(`\nConversation ${conversation.id} gelöscht.`);
  console.log(`Der Agent '${AGENT_NAME}' bleibt bestehen - schaut ihn euch im Portal an.`);
});
