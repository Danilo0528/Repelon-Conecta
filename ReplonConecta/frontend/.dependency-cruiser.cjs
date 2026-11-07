/*
 * Reglas de arquitectura del frontend.
 *
 * La direccion permitida es: app -> components -> lib.
 * app puede importar components y lib; components puede importar lib;
 * lib no debe depender de capas de UI. Asi el grafo no se convierte en
 * un circulo y los modulos de dominio siguen siendo testeables solos.
 */
module.exports = {
  forbidden: [
    {
      name: "lib-no-importa-app",
      severity: "error",
      comment: "src/lib no puede depender de rutas de src/app.",
      from: { path: "^src/lib/", pathNot: "\\.test\\.(ts|tsx)$" },
      to: { path: "^src/app/" },
    },
    {
      name: "lib-no-importa-components",
      severity: "error",
      comment: "src/lib no puede depender de componentes de UI.",
      from: { path: "^src/lib/", pathNot: "\\.test\\.(ts|tsx)$" },
      to: { path: "^src/components/" },
    },
    {
      name: "components-no-importa-app",
      severity: "error",
      comment: "src/components no puede depender de rutas de src/app.",
      from: { path: "^src/components/" },
      to: { path: "^src/app/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
  },
};
