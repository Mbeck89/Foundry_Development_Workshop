// Vorflugkontrolle: beantwortet in 10 Sekunden die Frage "läuft mein Setup?".
// Aufruf:  npm run doctor
//
// Prüft Node-Version, .env, Token und ob das eingetragene Deployment im Projekt
// wirklich existiert — genau die vier Dinge, an denen Lab 1 sonst hängenbleibt.

import { DefaultAzureCredential } from "@azure/identity";
import {
  AGENT_NAME,
  MODEL_DEPLOYMENT,
  PROJECT_ENDPOINT,
  createProject,
} from "../shared/foundry.js";

const OK = "  [ok] ";
const FAIL = "  [--] ";
let failed = false;

function ok(message) {
  console.log(OK + message);
}

function fail(message, hint) {
  failed = true;
  console.log(FAIL + message);
  if (hint) console.log(`       ${hint.replaceAll("\n", "\n       ")}`);
}

console.log("\nSetup-Check fuer den Foundry-Workshop\n");

// 1) Node
const major = Number(process.versions.node.split(".")[0]);
if (major >= 22) {
  ok(`Node ${process.versions.node}`);
} else {
  fail(
    `Node ${process.versions.node} ist zu alt`,
    "Das Foundry SDK verlangt Node 22 oder neuer.\nMit nvm:  nvm install 22 && nvm use 22",
  );
}

// 2) .env
if (!PROJECT_ENDPOINT) {
  fail("PROJECT_ENDPOINT fehlt", "cp .env.example .env  und den Endpoint aus dem Portal eintragen.");
} else if (!/^https:\/\/[^/]+\/api\/projects\/[^/]+$/.test(PROJECT_ENDPOINT.replace(/\/$/, ""))) {
  fail(
    `PROJECT_ENDPOINT sieht ungewoehnlich aus: ${PROJECT_ENDPOINT}`,
    "Erwartet wird die Form https://<resource>.services.ai.azure.com/api/projects/<projekt>",
  );
} else {
  ok(`PROJECT_ENDPOINT ${PROJECT_ENDPOINT}`);
}

if (!MODEL_DEPLOYMENT) {
  fail("MODEL_DEPLOYMENT fehlt", "Deployment-Name aus 'Models + endpoints', Spalte 'Name'.");
} else {
  ok(`MODEL_DEPLOYMENT ${MODEL_DEPLOYMENT}`);
}

ok(`AGENT_NAME ${AGENT_NAME}`);

// 3) Token
if (PROJECT_ENDPOINT) {
  try {
    const token = await new DefaultAzureCredential().getToken("https://ai.azure.com/.default");
    if (token?.token) {
      const expires = new Date(token.expiresOnTimestamp).toLocaleTimeString("de-DE");
      ok(`Token von DefaultAzureCredential (gueltig bis ${expires})`);
    } else {
      fail("Kein Token erhalten", "az login");
    }
  } catch (error) {
    fail(`Kein Token: ${error.message.split("\n")[0]}`, 'az login\naz account set --subscription "<Subscription>"');
  }
}

// 4) Projekt erreichbar + Deployment vorhanden
if (PROJECT_ENDPOINT && !failed) {
  try {
    const project = createProject();
    const names = [];
    for await (const deployment of project.deployments.list()) {
      names.push(deployment.name);
    }
    ok(`Projekt erreichbar, ${names.length} Deployment(s) gefunden`);

    if (MODEL_DEPLOYMENT && names.includes(MODEL_DEPLOYMENT)) {
      ok(`Deployment '${MODEL_DEPLOYMENT}' existiert`);
    } else if (MODEL_DEPLOYMENT) {
      fail(
        `Deployment '${MODEL_DEPLOYMENT}' gibt es in diesem Projekt nicht`,
        `Vorhanden sind:\n  - ${names.join("\n  - ") || "(keine)"}`,
      );
    }
  } catch (error) {
    const status = error?.status ?? error?.statusCode;
    fail(
      `Projekt nicht erreichbar${status ? ` (HTTP ${status})` : ""}: ${error.message.split("\n")[0]}`,
      status === 403
        ? "Das Token ist gueltig, aber die Rollenzuweisung fehlt: 'Azure AI User' auf dem Projekt."
        : "PROJECT_ENDPOINT pruefen und sicherstellen, dass ihr in der richtigen Subscription angemeldet seid.",
    );
  }
}

console.log(
  failed
    ? "\nNoch nicht startklar — die mit [--] markierten Punkte zuerst beheben.\n"
    : "\nAlles gruen. Viel Spass in Lab 1:  npm run lab1\n",
);
process.exitCode = failed ? 1 : 0;
