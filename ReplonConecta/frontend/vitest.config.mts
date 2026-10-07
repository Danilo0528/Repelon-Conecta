import path from "node:path";

import { defineConfig } from "vitest/config";

/*
 * Vitest para el frontend (P2, fila 14).
 *
 * - jsdom: los componentes se renderizan sin navegador.
 * - alias "@": los mismos alias de tsconfig.json.
 * - El archivo va en .mts porque package.json no tiene "type":
 *   "module" (convención de Next) y con .ts vitest lo cargaría como
 *   CommonJS.
 */
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "src"),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		include: ["src/**/*.test.{ts,tsx}"],
	},
});
