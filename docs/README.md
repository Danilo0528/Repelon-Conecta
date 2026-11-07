# Documentación

Este directorio separa tres cosas que antes se mezclaban:

| Ruta         | Qué es                                                                                                     | Se edita a mano                         |
| ------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `generated/` | Referencia generada desde el código (TypeDoc, Javadoc) e índice de especificaciones extraído de los tests. | **No**                                  |
| `archive/`   | Documentos históricos escritos antes de la documentación viva.                                             | No, salvo corregir una errata histórica |
| `README.md`  | Esta guía.                                                                                                 | Sí                                      |

## Comandos

```powershell
npm run docs:gen       # regenera todo docs/generated
npm run docs:check     # valida reglas + regenera + falla si hay diff
```

`docs:check` corre en `.husky/pre-commit` y en el job `docs` de `.github/workflows/ci.yml`. Los tests corren en un job aparte (`tests`) para que su feedback no dependa de la generación de documentación.

## JDK fijado (Javadoc reproducible)

`.java-version` fija **Temurin 21.0.13+9** y CI lo instala con `java-version-file`. El doclet de Javadoc cambia entre vendors y parches (Oracle y Temurin no generan el mismo HTML, y 21.0.13 movió `aria-labelledby`), así que otro JDK produce un diff que no viene del código.

- `npm run docs:gen:backend` busca ese build exacto en `JAVA_HOME`, `~/.jdks`, `/usr/lib/jvm` y las carpetas típicas de Windows. Si no lo encuentra, falla con instrucciones; no usa el `java` del PATH.
- Para instalarlo: descarga Temurin 21.0.13+9 y descomprímelo en `~/.jdks/temurin-21.0.13+9`.
- Para subir de JDK: cambia `.java-version`, instala ese build, corre `npm run docs:gen` y commitea todo `docs/generated` en el mismo commit.

Los archivos que Javadoc copia del JDK (`docs/generated/api/backend/apidocs/legal/`) están en `.gitignore`: dependen del vendor y ningún HTML generado los referencia.

## Por qué la revisión de TypeDoc está fija

`typedoc.json` fija `gitRevision` en `main`. Con el valor por defecto, TypeDoc
incrusta el SHA del último commit en cada enlace "Defined in"; como la
documentación se genera antes de que exista el commit, CI siempre encontraría un
diff (el SHA viejo contra el nuevo). Con `main`, los enlaces son estables entre
máquinas, sistemas operativos y commits.

## Reglas de negocio

No viven en Markdown. Viven en los tests:

- Frontend: `ReplonConecta/frontend/src/**/*.test.ts(x)`.
- Backend: `ReplonConecta/ReplonConecta/src/test/java/**/*.java`.

`docs/generated/specs/functional-spec.md` solo indexa sus nombres legibles. Si una regla cambia, cambia su test; si el test se renombra, `docs:check` obliga a regenerar el índice. Si la regla se rompe, falla el test en pre-push/CI.

Para que el índice se lea bien:

- En Java, usar `@DisplayName("...")` en cada test de negocio.
- En TypeScript, usar un título literal en `it("...")` o `test("...")`.
