/*
 * Textos editables del home (P2, fila 13 — alcance "rápido").
 *
 * Estos valores son los que la app muestra NADIE ha tocado el panel.
 * El backend guarda solo los cambios (overrides) en /api/inicio/textos;
 * lo que no viene de ahí cae en estos defectos, así que borrar un
 * override en el panel restaura exactamente este texto.
 */

/**
 * Imágenes del deslizamiento del hero. Mientras nadie toque el panel
 * el home usa estas, que son las que siempre estuvieron ahí.
 */
const IMAGENES_HERO_POR_DEFECTO = [
	"/img/hero-campo.png",
	"/img/hero.jpg",
	"/img/campo.jpg",
	"/img/tienda.jpg",
	"/img/servicios.jpg",
];

/** La lista de imágenes del slider vive en la misma tabla que los textos. */
export const CLAVE_IMAGENES_HERO = "inicio.hero.imagenes";

export const TEXTO_INICIO = {
	"inicio.hero.titulo1": "Todo el pueblo,",
	"inicio.hero.titulo2": "a un toque de tu celular.",
	"inicio.hero.texto":
		"Descubre los productores del agro, la pescadería y los rincones de Repelón. Consulta precios y habla directamente con tus vecinos.",
	[CLAVE_IMAGENES_HERO]: JSON.stringify(IMAGENES_HERO_POR_DEFECTO),
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

/**
 * El slider guarda sus imágenes como un array JSON de URLs dentro de
 * la misma lista de claves que los textos. Si ese valor llega roto —
 * un JSON escrito a mano, una versión vieja del panel — el hero vuelve
 * a las imágenes de arriba en vez de quedar sin fondo.
 */
export function imagenesInicio(
	guardado: Record<string, string> | null | undefined,
): string[] {
	const crudo = guardado?.[CLAVE_IMAGENES_HERO] ?? TEXTO_INICIO[CLAVE_IMAGENES_HERO];
	try {
		const lista: unknown = JSON.parse(crudo);
		if (Array.isArray(lista)) {
			const urls = lista.filter(
				(url): url is string => typeof url === "string" && url.trim() !== "",
			);
			if (urls.length > 0) return urls;
		}
	} catch {
		// JSON inválido: el defecto de abajo evita el hueco.
	}
	return [...IMAGENES_HERO_POR_DEFECTO];
}
