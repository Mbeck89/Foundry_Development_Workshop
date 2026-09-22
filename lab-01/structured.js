/**
 * Lab 1 - Erweiterung B: strukturierte Ausgabe.
 *
 * Start:  npm run lab1:json
 * Ziel:   Aus dem Störungsbericht wird ein Objekt, das ihr ohne Parser-Bastelei
 *         weiterverarbeiten könnt - ein Ticket, das in ein Zielsystem passt.
 *
 * Folie: "Strukturierte Ausgaben".
 */

import { createClients, MODEL_DEPLOYMENT, run, step } from "../shared/foundry.js";
import { STOERUNGSBERICHT } from "../shared/data.js";

// Das Schema ist vorgegeben - daran müsst ihr nichts ändern.
// Wichtig für strict: true: jede Property steht in "required" und
// additionalProperties ist false.
const ticketSchema = {
  type: "object",
  properties: {
    kategorie: {
      type: "string",
      enum: ["Netzwerk", "Storage", "Client", "Identity", "Sonstiges"],
      description: "Fachliche Einordnung der Störung",
    },
    dringlichkeit: {
      type: "string",
      enum: ["niedrig", "mittel", "hoch"],
    },
    betroffene_nutzer: {
      type: "integer",
      description: "Geschätzte Anzahl betroffener Personen, 0 wenn unbekannt",
    },
    standort: {
      type: "string",
      description: "Standort oder 'unbekannt'",
    },
    zusammenfassung: {
      type: "string",
      description: "Ein Satz, der die Störung beschreibt",
    },
  },
  required: ["kategorie", "dringlichkeit", "betroffene_nutzer", "standort", "zusammenfassung"],
  additionalProperties: false,
};

run(async () => {
  const { openai } = createClients();

  step("Störungsbericht als Ticket-Objekt");

  // ---------------------------------------------------------------------------
  // TODO 1: Hängt das Schema an den Aufruf.
  //
  //   const response = await openai.responses.create({
  //     model: MODEL_DEPLOYMENT,
  //     input: STOERUNGSBERICHT,
  //     text: {
  //       format: {
  //         type: "json_schema",
  //         name: "ticket",
  //         strict: true,
  //         schema: ticketSchema,
  //       },
  //     },
  //   });
  //
  // TODO 2: output_text ist jetzt JSON. Parst es und arbeitet mit dem Objekt.
  //
  //   const ticket = JSON.parse(response.output_text);
  //   console.table(ticket);
  //   if (ticket.dringlichkeit === "hoch") console.log("-> eskalieren");
  //
  // TODO 3 (optional): Nehmt eine Property aus "required" heraus oder erlaubt
  //         additionalProperties - und schaut, was der Dienst dazu sagt.
  // ---------------------------------------------------------------------------

  console.log("\nNoch nichts passiert - die TODOs in lab-01/structured.js warten auf euch.");
  console.log(`Das Schema hat ${Object.keys(ticketSchema.properties).length} Felder.`);
});
