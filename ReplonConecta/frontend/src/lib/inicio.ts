/*
 * Textos editables del home (P2, fila 13 — alcance "rápido").
 *
 * Estos valores son los que la app muestra NADIE ha tocado el panel.
 * El backend guarda solo los cambios (overrides) en /api/inicio/textos;
 * lo que no viene de ahí cae en estos defectos, así que borrar un
 * override en el panel restaura exactamente este texto.
 */

export const TEXTO_INICIO = {
	"inicio.hero.titulo1": "Todo el pueblo,",
	"inicio.hero.titulo2": "a un toque de tu celular.",
	"inicio.hero.texto":
		"Descubre los productores del agro, la pescadería y los rincones de Repelón. Consulta precios y habla directamente con tus vecinos.",
	"inicio.mapa.texto": "Toca un pin para ver el comercio y cómo llegar.",
	"inicio.turismo.texto":
		"Lugares y zonas del pueblo, sin precios: el camino termina en el mapa.",
	"inicio.fondo.titulo": "Fondo Emprender, la ayuda del SENA para tu negocio",
	"inicio.fondo.texto":
		"Capital semilla para crear o fortalecer tu emprendimiento, con acompañamiento para formular el plan. Si cumples las metas, no devuelves nada.",
	"inicio.cta.titulo": "¿Tienes un negocio en Repelón?",
	"inicio.cta.texto": "Muestra tus productos a todo el pueblo.",
} as const;

export type ClaveTextoInicio = keyof typeof TEXTO_INICIO;

/** Mezcla los overrides del servidor con los defectos de arriba. */
export function textoInicio(
	guardado: Record<string, string> | null | undefined,
	clave: ClaveTextoInicio,
): string {
	const valor = guardado?.[clave];
	return valor != null && valor.trim() !== "" ? valor : TEXTO_INICIO[clave];
}
