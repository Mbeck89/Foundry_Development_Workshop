/**
 * Lab 1 - Schritt 3: der erste Modellaufruf.
 *
 * Start:  npm run lab1
 * Ziel:   Der Störungsbericht aus shared/data.js wird zusammengefasst und
 *         die Antwort steht auf eurer Konsole.
 *
 * Alles, was ihr braucht, stand auf der Folie "Anatomie eines Aufrufs".
 * Wenn ihr hängt: lab-01/solution.js.
 */

import { createClients, MODEL_DEPLOYMENT, run, step } from "../shared/foundry.js";
import { STOERUNGSBERICHT } from "../shared/data.js";

run(async () => {
  // Projekt-Client und OpenAI-kompatibler Client. Der zweite kommt aus dem ersten.
  const { openai } = createClients();

  step(`Ein Aufruf gegen das Deployment '${MODEL_DEPLOYMENT}'`);

  // ---------------------------------------------------------------------------
  // TODO 1: Ruft das Modell über die Responses API auf.
  //
  //   const response = await openai.responses.create({
  //     model: MODEL_DEPLOYMENT,          // der Deployment-Name, nicht der Modellname
  //     input: `Fasse diesen Störungsbericht in drei Sätzen zusammen:\n\n${STOERUNGSBERICHT}`,
  //   });
  //
  // TODO 2: Gebt die Antwort aus. Der bequeme Weg ist response.output_text.
  //
  //   console.log(response.output_text);
  //
  // TODO 3 (wenn ihr neugierig seid): Schaut euch an, was sonst noch zurückkommt.
  //
  //   console.log(JSON.stringify(response.output, null, 2));
  //   console.log(response.usage);
  // ---------------------------------------------------------------------------

  console.log(
    "\nNoch nichts passiert - die TODOs in lab-01/index.js warten auf euch.\n" +
      "Der Störungsbericht steht bereit, er ist " +
      STOERUNGSBERICHT.length +
      " Zeichen lang.",
  );
});
