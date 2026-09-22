/**
 * Lab 1 - Erweiterung A: dieselbe Antwort, nur streamend.
 *
 * Start:  npm run lab1:stream
 * Ziel:   Die Zusammenfassung erscheint Stück für Stück statt am Ende am Block.
 *
 * Folie: "Streaming".
 */

import { createClients, MODEL_DEPLOYMENT, run, step } from "../shared/foundry.js";
import { STOERUNGSBERICHT } from "../shared/data.js";

run(async () => {
  const { openai } = createClients();

  step("Streamende Antwort");

  // ---------------------------------------------------------------------------
  // TODO 1: Derselbe Aufruf wie in index.js, zusätzlich mit stream: true.
  //
  //   const stream = await openai.responses.create({
  //     model: MODEL_DEPLOYMENT,
  //     input: `Fasse diesen Störungsbericht in drei Sätzen zusammen:\n\n${STOERUNGSBERICHT}`,
  //     stream: true,
  //   });
  //
  // TODO 2: Lest die Events und schreibt nur die Text-Deltas auf die Konsole.
  //
  //   for await (const event of stream) {
  //     if (event.type === "response.output_text.delta") process.stdout.write(event.delta);
  //   }
  //   console.log();
  //
  // TODO 3 (optional): Gebt einmal alle event.type aus, die vorbeikommen.
  //         Dann seht ihr, wo ein Lauf beginnt, wo er fertig ist und was
  //         dazwischen passiert - dieselbe Event-Kette nutzen später die Agents.
  // ---------------------------------------------------------------------------

  console.log("\nNoch nichts passiert - die TODOs in lab-01/streaming.js warten auf euch.");
});
