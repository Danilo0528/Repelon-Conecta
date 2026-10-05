"use client";

/*
 * Enlaces y utilidades de mapa.
 *
 * El mapa de la app es OpenStreetMap (Leaflet + teselas de
 * tile.openstreetmap.org): no lleva clave, no lleva factura y no exige
 * registrar un proyecto para ver calles reales. Aquí viven solo las
 * utilidades que las pantallas comparten: el pin de los negocios y los
 * dos enlaces que salen hacia OpenStreetMap.
 */

import { CENTRO_REPELON } from "./env";

const OSM = "https://www.openstreetmap.org";

/** Dirección con la que se busca cualquier negocio fuera del mapa. */
function direccionDe(n: { direccion: string }): string {
	return `${n.direccion}, Repelón, Atlántico, Colombia`;
}

/*
 * "Cómo llegar": ruta en OpenStreetMap.
 *
 * El origen es el centro del pueblo, que es de donde sale casi todo el
 * mundo en Repelón; el destino es la coordenada si el negocio la tiene y
 * la dirección escrita si no (OpenStreetMap geocodifica sola). El origen
 * se puede editar en la página a la que llega, así que quien venga de
 * otro lado cambia un campo y listo.
 */
export function enlaceComoLlegar(n: {
	latitud: number | null;
	longitud: number | null;
	direccion: string;
}): string {
	const destino =
		n.latitud != null && n.longitud != null
			? `${n.latitud},${n.longitud}`
			: direccionDe(n);
	const origen = `${CENTRO_REPELON.lat},${CENTRO_REPELON.lng}`;
	return `${OSM}/directions?from=${encodeURIComponent(origen)}&to=${encodeURIComponent(destino)}`;
}

/*
 * "Ver en OpenStreetMap": el negocio centrado en el mapa, sin ruta.
 * Con coordenadas abre el mapa en la ubicación; sin ellas, la búsqueda
 * de la dirección, que es donde OpenStreetMap deja el resultado.
 */
export function enlaceVerEnMapa(n: {
	latitud: number | null;
	longitud: number | null;
	direccion: string;
}): string {
	if (n.latitud != null && n.longitud != null) {
		return `${OSM}/#map=17/${n.latitud}/${n.longitud}`;
	}
	return `${OSM}/search?query=${encodeURIComponent(direccionDe(n))}`;
}

/* ====================================================================
 * Pin del mapa
 * ==================================================================== */

/*
 * Pin como SVG en un data-URI, usado por Leaflet (divIcon) y por
 * cualquier otra vista que quiera el mismo marcador.
 *
 * Antes de tocar un pin hay que leer una cosa: si el negocio está
 * abierto. Por eso el color es el dato, no un adorno: verde si está
 * abierto, gris si está cerrado. Adentro del círculo blanco va la
 * silueta de una tienda, porque el catálogo no tiene categoría por
 * negocio (la categoría es del producto) y un icono genérico de tienda
 * es el que nunca miente.
 */
const COLOR_PIN_ABIERTO = "#16a34a";
const COLOR_PIN_CERRADO = "#6b7280";

function pinSvg(color: string): string {
	const svg = [
		'<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">',
		`<path fill="${color}" stroke="#ffffff" stroke-width="2" d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14c0 9.3 10.9 23.4 12.4 24.9a2.2 2.2 0 0 0 3.2 0C18.6 37.4 26.5 23.3 26.5 14 26.5 7.1 20.9 1.5 14 1.5z"/>`,
		'<circle cx="14" cy="14" r="6.5" fill="#ffffff"/>',
		`<path fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M9.5 12.4 14 9.6l4.5 2.8M9.8 12.7h8.4M10.9 12.7v5.1h6.2v-5.1"/>`,
		"</svg>",
	].join("");
	return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function iconoMarcador(abierto: boolean): string {
	return pinSvg(abierto ? COLOR_PIN_ABIERTO : COLOR_PIN_CERRADO);
}
