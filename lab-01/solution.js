/**
 * Lab 1 - Lösung.
 *
 * Start:  npm run lab1:solution           (alle drei Schritte)
 *         npm run lab1:solution -- 1      (nur der erste Aufruf)
 *         npm run lab1:solution -- 2      (nur Streaming)
 *         npm run lab1:solution -- 3      (nur strukturierte Ausgabe)
 */

import { createClients, MODEL_DEPLOYMENT, run, step } from "../shared/foundry.js";
import { STOERUNGSBERICHT } from "../shared/data.js";

const PROMPT = `Fasse diesen Störungsbericht in drei Sätzen zusammen:\n\n${STOERUNGSBERICHT}`;

const ticketSchema = {
  type: "object",
  properties: {
    kategorie: {
      type: "string",
      enum: ["Netzwerk", "Storage", "Client", "Identity", "Sonstiges"],
      description: "Fachliche Einordnung der Störung",
    },
    dringlichkeit: { type: "string", enum: ["niedrig", "mittel", "hoch"] },
    betroffene_nutzer: {
      type: "integer",
      description: "Geschätzte Anzahl betroffener Personen, 0 wenn unbekannt",
    },
    standort: { type: "string", description: "Standort oder 'unbekannt'" },
    zusammenfassung: { type: "string", description: "Ein Satz, der die Störung beschreibt" },
  },
  required: ["kategorie", "dringlichkeit", "betroffene_nutzer", "standort", "zusammenfassung"],
  additionalProperties: false,
};

/** Schritt 1: ein Aufruf, eine Antwort. */
async function ersterAufruf(openai) {
  step(`Schritt 1 - ein Aufruf gegen '${MODEL_DEPLOYMENT}'`);

  const response = await openai.responses.create({
    model: MODEL_DEPLOYMENT,
    input: PROMPT,
  });

  console.log(response.output_text);
  console.log(
    `\n(Tokens: ${response.usage?.input_tokens ?? "?"} rein, ${response.usage?.output_tokens ?? "?"} raus)`,
  );
}

/** Schritt 2: dieselbe Antwort, streamend. */
async function streamendeAntwort(openai) {
  step("Schritt 2 - dieselbe Antwort, streamend");

  const stream = await openai.responses.create({
    model: MODEL_DEPLOYMENT,
    input: PROMPT,
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      process.stdout.write(event.delta);
    } else if (event.type === "response.completed") {
      console.log("\n\n(Lauf abgeschlossen)");
    }
  }
}

/** Schritt 3: dieselbe Eingabe, aber als Objekt zurück. */
async function strukturierteAusgabe(openai) {
  step("Schritt 3 - Störungsbericht als Ticket-Objekt");

  const response = await openai.responses.create({
    model: MODEL_DEPLOYMENT,
    input: STOERUNGSBERICHT,
    text: {
      format: {
        type: "json_schema",
        name: "ticket",
        strict: true,
        schema: ticketSchema,
      },
    },
  });

  const ticket = JSON.parse(response.output_text);
  console.table(ticket);

  // Ab hier ist es normaler Code - kein Modell mehr im Spiel.
  if (ticket.dringlichkeit === "hoch") {
    console.log(`\n-> Eskalation: ${ticket.kategorie}, Standort ${ticket.standort}`);
  }
}

run(async () => {
  const { openai } = createClients();
  const auswahl = process.argv[2] ?? "all";

  if (auswahl === "1" || auswahl === "all") await ersterAufruf(openai);
  if (auswahl === "2" || auswahl === "all") await streamendeAntwort(openai);
  if (auswahl === "3" || auswahl === "all") await strukturierteAusgabe(openai);
});
