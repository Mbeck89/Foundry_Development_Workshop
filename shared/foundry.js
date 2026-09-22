// Gemeinsame Basis für alle drei Labs: .env laden, Clients bauen, Fehler übersetzen.
// Diese Datei müsst ihr nicht anfassen — ein Blick hinein lohnt sich trotzdem.

import { config } from "dotenv";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

// .env liegt im Wurzelverzeichnis des Repos, egal aus welchem Ordner ihr startet.
config({ path: new URL("../.env", import.meta.url), quiet: true });

export const PROJECT_ENDPOINT = process.env.PROJECT_ENDPOINT ?? "";
export const MODEL_DEPLOYMENT = process.env.MODEL_DEPLOYMENT ?? "";
export const AGENT_NAME = process.env.AGENT_NAME ?? "workshop-agent";
export const MCP_SERVER_LABEL = process.env.MCP_SERVER_LABEL ?? "api-specs";
export const MCP_SERVER_URL =
  process.env.MCP_SERVER_URL ?? "https://gitmcp.io/Azure/azure-rest-api-specs";

/**
 * Projekt-Client: alles, wofür OpenAI kein Gegenstück hat — Agents verwalten,
 * Deployments auflisten, Connections lesen.
 */
export function createProject() {
  requireEnv("PROJECT_ENDPOINT", PROJECT_ENDPOINT);
  return new AIProjectClient(PROJECT_ENDPOINT, new DefaultAzureCredential());
}

/**
 * Beide Clients auf einmal. Der OpenAI-kompatible Client kommt aus dem
 * Projekt-Client heraus: kein zweiter Endpoint, kein zweites Credential.
 *
 * Hinweis: getOpenAIClient() ist synchron, ein await ist nicht nötig.
 */
export function createClients({ requireModel = true } = {}) {
  const project = createProject();
  if (requireModel) requireEnv("MODEL_DEPLOYMENT", MODEL_DEPLOYMENT);
  return { project, openai: project.getOpenAIClient() };
}

/**
 * Request-Options, die einen Lauf an einen Agenten binden, statt ein Modell
 * direkt aufzurufen. Das SDK legt diesen Block in den Request-Body.
 *
 *   await openai.responses.create({ conversation: id, input: "..." }, withAgent(agent));
 */
export function withAgent(agent) {
  return { body: { agent_reference: { name: agent.name, type: "agent_reference" } } };
}

/** Wirft mit einem brauchbaren Satz, wenn eine Variable in der .env fehlt. */
export function requireEnv(name, value) {
  if (value) return value;
  throw new Error(
    `Die Umgebungsvariable ${name} ist nicht gesetzt.\n` +
      `   -> .env anlegen (cp .env.example .env) und ${name} eintragen.`,
  );
}

/** Überschrift auf der Konsole, damit mehrstufige Ausgaben lesbar bleiben. */
export function step(title) {
  console.log(`\n== ${title}`);
}

/**
 * Einstiegspunkt für jedes Lab-Skript: führt main() aus und übersetzt die
 * typischen Fehlerbilder in einen Satz, mit dem man etwas anfangen kann.
 */
export async function run(main) {
  try {
    await main();
  } catch (error) {
    console.error(`\nFehler: ${error?.message ?? error}`);
    const hint = explain(error);
    if (hint) console.error(`\n${hint}`);
    if (process.env.DEBUG) console.error(error);
    process.exitCode = 1;
  }
}

function explain(error) {
  const status = error?.status ?? error?.statusCode;
  const text = `${error?.name ?? ""} ${error?.message ?? ""} ${error?.code ?? ""}`;

  if (/CredentialUnavailable|DefaultAzureCredential failed|AADSTS/i.test(text)) {
    return [
      "Kein gültiges Token. Lokal kommt es aus eurem az-login:",
      "  az login",
      '  az account set --subscription "<Subscription mit dem Foundry-Projekt>"',
    ].join("\n");
  }
  if (status === 401) {
    return "401 - Token abgelaufen oder falscher Tenant. az login wiederholen.";
  }
  if (status === 403) {
    return [
      "403 - Das Token ist gültig, die Rolle fehlt.",
      "Ihr braucht auf dem Foundry-Projekt mindestens die Rolle 'Azure AI User'.",
    ].join("\n");
  }
  if (status === 404 || /DeploymentNotFound|not found/i.test(text)) {
    return [
      "404 - Endpoint oder Deployment stimmt nicht.",
      "Häufigste Ursache: in MODEL_DEPLOYMENT steht der Modellname aus dem Katalog",
      "statt des Deployment-Namens aus 'Models + endpoints' (Spalte 'Name').",
      "  npm run doctor   zeigt die Deployments, die es in eurem Projekt wirklich gibt.",
    ].join("\n");
  }
  if (status === 429) {
    return "429 - Rate Limit oder Quota erschöpft. Kurz warten, dann erneut versuchen.";
  }
  if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED/i.test(text)) {
    return "Netzwerk: Endpoint nicht erreichbar. PROJECT_ENDPOINT prüfen (inklusive /api/projects/<projekt>).";
  }
  return "Mehr Details mit:  DEBUG=1 npm run <script>";
}
