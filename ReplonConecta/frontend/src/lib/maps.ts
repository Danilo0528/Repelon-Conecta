"use client";

/*
 * Enlaces y utilidades de mapa.
 *
 * Los mapas embebidos en la app (home, búsqueda, ficha de negocio y
 * selector del vendedor) son la API de JavaScript de Google Maps, que
 * se carga con la clave de GOOGLE_MAPS_API_KEY. Aquí viven las
 * utilidades que las pantallas comparten: la carga de esa API, el pin
 * de los negocios y los enlaces salientes (Google Maps para "Cómo
 * llegar", OpenStreetMap como alternativa que no pide nada).
 */

import { CENTRO_REPELON, GOOGLE_MAPS_API_KEY, mapasGoogleConfigurado } from "./env";

const OSM = "https://www.openstreetmap.org";

/** Dirección con la que se busca cualquier negocio fuera del mapa. */
function direccionDe(n: { direccion: string }): string {
	// Algunas direcciones (las de turismo) ya traen pueblo y
	// departamento: no hace falta repetirlos.
	return n.direccion.includes("Repelón")
		? `${n.direccion}, Colombia`
		: `${n.direccion}, Repelón, Atlántico, Colombia`;
}

/*
 * "Cómo llegar": ruta desde el centro del pueblo, abierta en Google Maps.
 *
 * El origen es el centro de Repelón, que es de donde sale casi todo el
 * mundo; el destino es la coordenada si el negocio la tiene y la dirección
 * escrita si no (Google geocodifica sola). Es el mismo Google Maps que el
 * mapa embebido y que la mayoría tiene en el celular, así que la ruta
 * continúa en la app de quien abre el enlace. Viaja en pestaña nueva como
 * los demás enlaces externos.
 *
 * `enlaceVerEnMapa` (más abajo) sigue siendo OpenStreetMap: es para quien
 * solo quiere mirar el punto sin que nadie le proponga una ruta.
 */
export function enlaceComoLlegar(n: {
	latitud: number | null;
	longitud: number | null;
	direccion: string;
}): string {
	return enlaceGoogleMaps(n);
}

/*
 * "Cómo llegar" en Google Maps: ruta desde el centro del pueblo.
 *
 * El mapa embebido de la app es Google Maps (con clave), pero este enlace
 * sale hacia la web pública de Google: no necesita clave ni pasar por la
 * API, solo abrir la URL con origen, destino y modo de viaje.
 */
export function enlaceGoogleMaps(n: {
	latitud: number | null;
	longitud: number | null;
	direccion: string;
}): string {
	const destino =
		n.latitud != null && n.longitud != null
			? `${n.latitud},${n.longitud}`
			: direccionDe(n);
	const origen = `${CENTRO_REPELON.lat},${CENTRO_REPELON.lng}`;
	return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}&travelmode=driving`;
}

/*
 * Ruta DESDE la ubicación real de quien mira la pantalla.
 *
 * Es lo mismo que `enlaceGoogleMaps` pero con el origen cambiante: si ya
 * sabemos dónde está la persona (useUbicacion) la ruta arranca en ese
 * punto y no en el centro del pueblo. Sin origen conocido se cae al
 * centro, que es el comportamiento de siempre.
 *
 * El destino con coordenadas gana sobre la dirección escrita, porque el
 * punto exacto es lo que hace que la navegación llegue a la puerta.
 */
export function enlaceRutaDesde(
	origen: { lat: number; lng: number } | null,
	n: { latitud: number | null; longitud: number | null; direccion: string },
): string {
	const destino =
		n.latitud != null && n.longitud != null
			? `${n.latitud},${n.longitud}`
			: direccionDe(n);
	const desde =
		origen != null
			? `${origen.lat},${origen.lng}`
			: `${CENTRO_REPELON.lat},${CENTRO_REPELON.lng}`;
	return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(desde)}&destination=${encodeURIComponent(destino)}&travelmode=driving`;
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
 * Pin como SVG en un data-URI: es lo que dibuja Google Maps en el mapa
 * y lo mismo que verá quien abra la imagen suelta en otra vista.
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

/* ====================================================================
 * Carga de la API de JavaScript de Google Maps
 * ==================================================================== */

export type MotivoFalloMapas = "sin-clave" | "sin-ventana" | "carga";

/**
 * Fallo de carga del mapa, con el motivo a mano para que la pantalla
 * pueda decirle al usuario qué salió mal en vez de dejar un hueco gris.
 */
export class ErrorMapas extends Error {
	readonly motivo: MotivoFalloMapas;

	constructor(motivo: MotivoFalloMapas) {
		super(
			motivo === "sin-clave"
				? "Falta la clave de Google Maps (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)."
				: motivo === "sin-ventana"
					? "Google Maps solo se carga en el navegador."
					: "No se pudo cargar la API de Google Maps.",
		);
		this.name = "ErrorMapas";
		this.motivo = motivo;
	}
}

const VERSION_API = "weekly";
const TIEMPO_ESPERA = 20000;
const CALL_MAPAS = "__repelonMapasCargado";

/** Única promesa de carga: si dos mapas piden la API a la vez, solo hay una petición. */
let promesaCarga: Promise<void> | null = null;

/**
 * Carga la API de Google Maps una sola vez, sin importar cuántos mapas
 * haya en la pantalla.
 *
 * La API toca `window` al cargarse, así que va por un `<script>` puesto
 * aquí y no por un import estático: estas pantallas también se pintan en
 * el servidor durante el prerender y ahí no hay `window`. El `callback`
 * es la forma que Google ofrece para saber cuándo quedó lista la API
 * (el simple `onload` puede llegar antes que `google.maps`), con un
 * reloj de seguridad por si el navegador se queda esperando.
 */
export function cargarGoogleMaps(): Promise<void> {
	if (!mapasGoogleConfigurado) return Promise.reject(new ErrorMapas("sin-clave"));
	if (typeof window === "undefined") return Promise.reject(new ErrorMapas("sin-ventana"));
	if (typeof google !== "undefined" && google.maps) return Promise.resolve();
	if (promesaCarga) return promesaCarga;

	promesaCarga = new Promise<void>((resolver, rechazar) => {
		const ventana = window as unknown as Record<string, unknown>;

		const limpiar = () => {
			window.clearTimeout(reloj);
			delete ventana[CALL_MAPAS];
		};

		const reloj = window.setTimeout(() => {
			limpiar();
			promesaCarga = null;
			rechazar(new ErrorMapas("carga"));
		}, TIEMPO_ESPERA);

		ventana[CALL_MAPAS] = () => {
			limpiar();
			resolver();
		};

		const script = document.createElement("script");
		script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
			GOOGLE_MAPS_API_KEY,
		)}&v=${VERSION_API}&callback=${CALL_MAPAS}`;
		script.async = true;
		script.defer = true;
		script.onerror = () => {
			limpiar();
			promesaCarga = null;
			rechazar(new ErrorMapas("carga"));
		};
		document.head.appendChild(script);
	});

	return promesaCarga;
}
