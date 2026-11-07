/*
 * Fuerza la regeneracion de Javadoc.
 *
 * maven-javadoc-plugin 3.12 decide si saltarse la generacion comparando un
 * archivo de estado (target/maven-javadoc-plugin-stale-data.txt) que solo
 * guarda las opciones y los jars, no el contenido ni las fechas de las
 * fuentes. Con el HTML ya versionado en docs/generated, un cambio de
 * Javadoc no alteraba las opciones y el plugin se saltaba la corrida:
 * docs:check daba falso verde.
 *
 * Borrar ese archivo antes de cada corrida obliga al plugin a generar. Se
 * borra tambien el HTML anterior para que clases renombradas o eliminadas
 * no dejen paginas huerfanas en el arbol versionado.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const stale = path.join(
  root,
  "ReplonConecta",
  "ReplonConecta",
  "target",
  "maven-javadoc-plugin-stale-data.txt"
);
const apidocs = path.join(
  root,
  "docs",
  "generated",
  "api",
  "backend",
  "apidocs"
);

fs.rmSync(stale, { force: true });
fs.rmSync(apidocs, { recursive: true, force: true });

console.log("docs:gen:backend: estado de Javadoc reiniciado.");
