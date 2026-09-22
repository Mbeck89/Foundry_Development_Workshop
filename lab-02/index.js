/**
 * Lab 2 - Agent und Conversation.
 *
 * Start:  npm run lab2
 * Ziel:   Ein Agent in eurem Projekt, eine Conversation mit Gedächtnis und
 *         eine zweite Version desselben Agenten zum Vergleich.
 *
 * Folien: "Einen Prompt Agent anlegen", "Conversation speichert. Response führt aus.",
 *         "Versionierung ist der eigentliche Gewinn".
 *
 * Merksatz: project.agents verwaltet, openai.responses führt aus.
 */

import {
  AGENT_NAME,
  MODEL_DEPLOYMENT,
  createClients,
  run,
  step,
  withAgent,
} from "../shared/foundry.js";

// Nehmt hier einen Use Case aus eurem Alltag - je konkreter, desto mehr sagt
// der Vergleich in Schritt 3 aus.
const INSTRUCTIONS_V1 = `
Du bist die Ticket-Annahme eines internen IT-Service-Desks.
Du beantwortest Fragen von Kolleginnen und Kollegen zu Störungen und Anträgen.
Antworte kurz und in ganzen Sätzen.
`.trim();

run(async () => {
  const { project, openai } = createClients();

  // ---------------------------------------------------------------------------
  // TODO 1: Legt den Agenten an. Der Name bleibt stabil, jede Änderung an der
  //         Definition erzeugt eine neue Version.
  //
  //   const agent = await project.agents.createVersion(AGENT_NAME, {
  //     kind: "prompt",
  //     model: MODEL_DEPLOYMENT,
  //     instructions: INSTRUCTIONS_V1,
  //   });
  //   console.log(`Agent ${agent.name}, Version ${agent.version}`);
  //
  // Schaut danach ins Portal: derselbe Agent ist dort sofort sichtbar.
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // TODO 2: Erzeugt eine Conversation und stellt zwei Fragen nacheinander.
  //         Die Conversation speichert nur - laufen lässt das Modell erst
  //         responses.create().
  //
  //   const conversation = await openai.conversations.create();
  //
  //   const antwort1 = await openai.responses.create(
  //     { conversation: conversation.id, input: "Wie melde ich einen Ausfall des Laufwerks V:?" },
  //     withAgent(agent),
  //   );
  //   console.log(antwort1.output_text);
  //
  //   const antwort2 = await openai.responses.create(
  //     { conversation: conversation.id, input: "Und wie dringend ist das?" },
  //     withAgent(agent),
  //   );
  //   console.log(antwort2.output_text);
  //
  // Die zweite Frage nennt das Thema nicht mehr. Hält der Kontext?
  // Gegenprobe: dieselbe zweite Frage ohne conversation - was kommt dann?
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // TODO 3: Das ist der eigentliche Lerneffekt. Ändert die Instructions und legt
  //         damit eine zweite Version an - gleicher Name, neue Version.
  //         Stellt dann dieselbe Frage noch einmal und vergleicht.
  //
  //   const agentV2 = await project.agents.createVersion(AGENT_NAME, {
  //     kind: "prompt",
  //     model: MODEL_DEPLOYMENT,
  //     instructions: INSTRUCTIONS_V1 + "\nAntworte in genau drei Stichpunkten, ohne Fließtext.",
  //   });
  //   console.log(`Neue Version: ${agentV2.version}`);
  //
  //   const antwortV2 = await openai.responses.create(
  //     { input: "Wie melde ich einen Ausfall des Laufwerks V:?" },
  //     withAgent(agentV2),
  //   );
  //   console.log(antwortV2.output_text);
  //
  //   for await (const version of project.agents.listVersions(AGENT_NAME)) {
  //     console.log(version.name, version.version);
  //   }
  // ---------------------------------------------------------------------------

  console.log(
    `\nNoch nichts passiert - die TODOs in lab-02/index.js warten auf euch.\n` +
      `Agent-Name aus der .env: ${AGENT_NAME}\n` +
      `Modell-Deployment:      ${MODEL_DEPLOYMENT}\n` +
      `Bereitstehende Clients: project (verwaltet), openai (führt aus), withAgent (verbindet beides)`,
  );
});
