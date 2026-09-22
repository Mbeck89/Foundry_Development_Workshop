// Räumt die Agents auf, die in Lab 2 und Lab 3 entstanden sind.
//
// Anzeigen, was gelöscht würde:  npm run cleanup
// Wirklich löschen:              npm run cleanup -- --yes
//
// Betroffen sind ausschließlich die drei Namen, die aus eurem AGENT_NAME
// abgeleitet werden. Conversations verschwinden mit ihrem Agenten nicht
// automatisch, die Lab-Skripte löschen sie selbst.

import { AGENT_NAME, createProject, run } from "../shared/foundry.js";

const namen = [AGENT_NAME, `${AGENT_NAME}-tools`, `${AGENT_NAME}-mcp`];
const wirklich = process.argv.includes("--yes");

run(async () => {
  const project = createProject();

  console.log(`\nAgents aus diesem Workshop (Basis: '${AGENT_NAME}')\n`);

  for (const name of namen) {
    let versionen = 0;
    try {
      for await (const version of project.agents.listVersions(name)) {
        versionen += 1;
        void version;
      }
    } catch (error) {
      const status = error?.status ?? error?.statusCode;
      if (status === 404) {
        console.log(`  ${name}: nicht vorhanden`);
        continue;
      }
      throw error;
    }

    if (!wirklich) {
      console.log(`  ${name}: ${versionen} Version(en) - würde gelöscht`);
      continue;
    }

    await project.agents.delete(name);
    console.log(`  ${name}: gelöscht (${versionen} Version(en))`);
  }

  console.log(
    wirklich
      ? "\nFertig.\n"
      : "\nNichts gelöscht. Mit  npm run cleanup -- --yes  wird es ernst.\n",
  );
});
