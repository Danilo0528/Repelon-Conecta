/*
 * Genera el indice de especificaciones funcionales a partir de los tests.
 *
 * No ejecuta los tests: los tests son la fuente de verdad y se ejecutan en
 * pre-push/CI. Este script solo extrae sus nombres legibles para que la
 * documentacion funcional no se escriba ni se mantenga a mano.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(
  root,
  "docs",
  "generated",
  "specs",
  "functional-spec.md"
);

function walk(dir, predicate, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, predicate, files);
    } else if (predicate(full)) {
      files.push(full);
    }
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function unescape(value) {
  return value.replace(/\\(["'`\\])/g, "$1");
}

function testsFromFrontend(file) {
  const source = fs.readFileSync(file, "utf8");
  const tests = [];
  const pattern =
    /\b(?:it|test)(?:\.\w+)?\s*\(\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
  for (const match of source.matchAll(pattern)) {
    tests.push(unescape(match[1] ?? match[2] ?? match[3]));
  }
  return tests;
}

function testsFromJava(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const tests = [];
  let pendingTest = false;
  let pendingDisplayName = null;

  for (const line of lines) {
    if (
      /@(Test|ParameterizedTest|RepeatedTest|TestFactory|TestTemplate)\b/.test(
        line
      )
    ) {
      pendingTest = true;
    }

    const displayName = line.match(/@DisplayName\(\s*"((?:[^"\\]|\\.)*)"\s*\)/);
    if (displayName) {
      pendingDisplayName = displayName[1].replace(/\\"/g, '"');
    }

    const method = line.match(/\bvoid\s+(\w+)\s*\(/);
    if (method) {
      if (pendingTest) {
        tests.push(pendingDisplayName ?? method[1]);
      }
      pendingTest = false;
      pendingDisplayName = null;
    }
  }

  return tests;
}

const frontendFiles = walk(
  path.join(root, "ReplonConecta", "frontend", "src"),
  (file) => /\.(test\.ts|test\.tsx)$/.test(file)
).sort();

const backendFiles = walk(
  path.join(root, "ReplonConecta", "ReplonConecta", "src", "test", "java"),
  (file) => file.endsWith(".java")
).sort();

const frontend = frontendFiles
  .map((file) => ({ file: relative(file), tests: testsFromFrontend(file) }))
  .filter((entry) => entry.tests.length > 0);

const backend = backendFiles
  .map((file) => ({ file: relative(file), tests: testsFromJava(file) }))
  .filter((entry) => entry.tests.length > 0);

const total =
  frontend.reduce((sum, entry) => sum + entry.tests.length, 0) +
  backend.reduce((sum, entry) => sum + entry.tests.length, 0);

const lines = [
  "# Especificaciones funcionales",
  "",
  "> Generado desde los tests por `npm run docs:gen`. No editar a mano.",
  "> Cada test es la especificación ejecutable; este archivo solo las indexa.",
  "",
  `Total: **${total}** tests (${frontend.reduce((s, e) => s + e.tests.length, 0)} frontend, ${backend.reduce((s, e) => s + e.tests.length, 0)} backend).`,
  "",
  "## Frontend",
  "",
];

for (const entry of frontend) {
  lines.push(`### \`${entry.file}\``, "");
  for (const test of entry.tests) lines.push(`- ${test}`);
  lines.push("");
}

lines.push("## Backend", "");

for (const entry of backend) {
  lines.push(`### \`${entry.file}\``, "");
  for (const test of entry.tests) lines.push(`- ${test}`);
  lines.push("");
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${lines.join("\n").replace(/\n+$/, "")}\n`, "utf8");

console.log(`docs:gen: ${relative(outFile)} (${total} tests)`);
