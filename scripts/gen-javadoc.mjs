/*
 * Genera el Javadoc con el JDK exacto fijado en .java-version.
 *
 * El doclet de Javadoc cambia entre vendors y parches: Oracle 21.0.12+7 y
 * Temurin 21.0.13+9 no producen el mismo HTML (aria-labelledby, cabeceras de
 * licencia en los assets). Generar con otro JDK hace que docs:check falle por
 * un diff que no viene del codigo. Este script busca el JDK exacto y falla con
 * instrucciones si no esta instalado, para que local y CI generen lo mismo.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const required = fs
  .readFileSync(path.join(root, ".java-version"), "utf8")
  .split(/\r?\n/)[0]
  .trim();

if (!required) {
  console.error(".java-version esta vacio.");
  process.exit(1);
}

function javaBin(home) {
  return path.join(
    home,
    "bin",
    process.platform === "win32" ? "java.exe" : "java"
  );
}

function javaVersion(home) {
  const bin = javaBin(home);
  if (!fs.existsSync(bin)) return null;
  const result = spawnSync(bin, ["-version"], { encoding: "utf8" });
  if (result.status !== 0) return null;
  return `${result.stdout}\n${result.stderr}`;
}

const candidates = new Set();
if (process.env.JAVA_HOME) candidates.add(process.env.JAVA_HOME);

const bases = [
  path.join(os.homedir(), ".jdks"),
  "/usr/lib/jvm",
  "/Library/Java/JavaVirtualMachines",
  "C:\\Program Files\\Eclipse Adoptium",
  "C:\\Program Files\\Java",
  "C:\\Program Files\\Microsoft",
];

for (const base of bases) {
  if (!fs.existsSync(base)) continue;
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(base, entry.name);
    candidates.add(full);
    // macOS guarda el JDK dentro de <nombre>.jdk/Contents/Home.
    candidates.add(path.join(full, "Contents", "Home"));
  }
}

const matches = [...candidates].filter((home) => {
  const version = javaVersion(home);
  return version?.includes(required);
});

if (matches.length === 0) {
  console.error(`No encuentro un JDK ${required}.`);
  console.error(
    "Instala Temurin 21.0.13+9 en ~/.jdks/temurin-21.0.13+9 o define JAVA_HOME."
  );
  console.error("Ver docs/README.md, seccion 'JDK fijado'.");
  process.exit(1);
}

// Puede haber varios JDK instalados; prefiere Temurin sobre otras builds.
const jdkHome =
  matches.find((home) => /temurin/i.test(javaVersion(home) ?? "")) ??
  matches[0];

console.log(`docs:gen:backend: usando JDK ${required} (${jdkHome})`);

const reset = spawnSync(
  process.execPath,
  [path.join(root, "scripts", "reset-javadoc-stale.mjs")],
  { stdio: "inherit" }
);
if (reset.status !== 0) process.exit(reset.status ?? 1);

const env = { ...process.env, JAVA_HOME: jdkHome };
const pathKey =
  Object.keys(env).find((key) => key.toUpperCase() === "PATH") ?? "PATH";
env[pathKey] = `${path.join(jdkHome, "bin")}${path.delimiter}${
  env[pathKey] ?? ""
}`;

const pom = path.join(root, "ReplonConecta", "ReplonConecta", "pom.xml");
const mvn = spawnSync(`mvn -q -f "${pom}" javadoc:javadoc`, {
  stdio: "inherit",
  env,
  shell: true,
});

process.exit(mvn.status ?? 1);
