/*
 * Alcance del proyecto: los rubros que el cliente decidio para la
 * plataforma (agricola, pesca y turismo). Ferreterias, droguerias y
 * tiendas quedan fuera.
 *
 * Definicion UNICA en el frontend: la busqueda, el home y los
 * listados leen de aqui en vez de repetir la lista. El backend tiene
 * la suya en config/Alcance.java (los dos lados estan escritos para
 * decir lo mismo; si cambia el alcance hay que cambiar los dos).
 */

/** Los tres slugs del alcance, en orden de importancia. */
export const SLUGS_ALCANCE = ["agro", "pesca", "turismo"] as const;

/** ¿Este slug pertenece al alcance del proyecto? */
export function enAlcance(slug: string): boolean {
	return (SLUGS_ALCANCE as readonly string[]).includes(slug);
}

/** Filtro de categoria del buscador: Todo + las tres familias. */
export const CATEGORIAS_BUSQUEDA: { slug: string | null; nombre: string }[] = [
	{ slug: null, nombre: "Todo" },
	{ slug: "agro", nombre: "Agro" },
	{ slug: "pesca", nombre: "Pesca" },
	{ slug: "turismo", nombre: "Turismo" },
];

/** Explicacion amable cuando la categoria no tiene productos (turismo). */
export const PISTA_SIN_PRODUCTOS: Record<string, string> = {
	turismo:
		"En Turismo no hay productos: son direcciones y zonas del pueblo. Pregúntale a la gente del lugar.",
};
