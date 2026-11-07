/*
 * Falla si docs/generated no coincide con lo que produce el codigo actual.
 *
 * - `git diff` detecta cambios/borrados sin stagear (compara working tree
 *   contra index). Si ya regeneraste y agregaste todo, no hay diff.
 * - `git ls-files --others` detecta archivos nuevos que aun no estan en
 *   git; `git diff` solo no los veria.
 */
import { execFileSync } from "node:child_process";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const changed = git(["diff", "--name-only", "--", "docs/generated"]);
const untracked = git([
  "ls-files",
  "--others",
  "--exclude-standard",
  "--",
  "docs/generated",
]);

if (changed || untracked) {
  console.error("");
  console.error(
    "Documentacion desactualizada: docs/generated no coincide con el codigo."
  );
  console.error("Corre 'npm run docs:gen' y agrega docs/generated al commit.");
  if (changed) {
    console.error("");
    console.error("Modificados sin stagear:");
    console.error(changed);
    console.error("");
    console.error("Resumen del diff:");
    console.error(git(["diff", "--numstat", "--", "docs/generated"]));
    // Muestra los primeros archivos para diagnosticar diferencias de entorno
    // (por ejemplo, Javadoc generado con otro JDK) sin inundar el log.
    for (const name of changed.split("\n").filter(Boolean).slice(0, 2)) {
      console.error("");
      console.error(`Diff de ${name}:`);
      const lines = git(["diff", "--unified=1", "--", name]).split("\n");
      console.error(lines.slice(0, 120).join("\n"));
      if (lines.length > 120) {
        console.error(`... (${lines.length - 120} lineas mas)`);
      }
    }
  }
  if (untracked) {
    console.error("");
    console.error("Nuevos sin trackear:");
    console.error(untracked);
  }
  process.exit(1);
}

console.log("docs:check: docs/generated esta al dia.");
