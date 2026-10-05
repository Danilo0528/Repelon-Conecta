"use client";

import { useEffect, useRef, useState } from "react";

import { CENTRO_REPELON } from "@/lib/env";
import { iconoMarcador } from "@/lib/maps";
import type { Negocio } from "@/lib/tipos";

import "leaflet/dist/leaflet.css";

/*
 * Mapas de la app con Leaflet y teselas de OpenStreetMap.
 *
 * Se usa Leaflet y no la API de Google porque OpenStreetMap no pide
 * clave ni registro: la app abre y hay calles de verdad sin configurar
 * nada. Leaflet se importa dentro de los efectos (y no arriba) porque
 * toca `window` al cargar y estas pantallas también se pintan en el
 * servidor durante el prerender.
 *
 * Los pines no son los cuadros azules de Leaflet: es el pin de
 * `iconoMarcador` (verde si está abierto, gris si no, con la tienda
 * adentro) metido en un divIcon, que es la forma que tiene Leaflet de
 * dibujar lo que uno quiera en la coordenada.
 */

type Leaflet = typeof import("leaflet");
type MapaLeaflet = import("leaflet").Map;
type MarcadorLeaflet = import("leaflet").Marker;
type CapaLeaflet = import("leaflet").LayerGroup;

const TESELAS = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ZOOM_MIN = 11;
const ZOOM_MAX = 19;

async function cargarLeaflet(): Promise<Leaflet> {
	const modulo = (await import("leaflet")) as unknown as { default?: Leaflet } & Leaflet;
	return modulo.default ?? modulo;
}

function pin(L: Leaflet, abierto: boolean, destacado: boolean): import("leaflet").DivIcon {
	const escala = destacado ? 1.25 : 1;
	return L.divIcon({
		// Sin la clase por defecto: si no, Leaflet le pinta un cuadro
		// blanco con borde detrás del pin.
		className: "",
		iconSize: [28, 40],
		iconAnchor: [14, 40],
		html: `<img src="${iconoMarcador(abierto)}" alt="" width="28" height="40" style="display:block;transform:scale(${escala});transform-origin:50% 100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">`,
	});
}

function territorio(L: Leaflet, mapa: MapaLeaflet) {
	L.tileLayer(TESELAS, { minZoom: ZOOM_MIN, maxZoom: ZOOM_MAX }).addTo(mapa);
}

/*
 * Globo de hover de un pin: nombre del negocio, estado y barrio.
 *
 * Se arma con nodos de verdad y no con un string armado a mano por dos
 * motivos: el nombre del negocio viene de la base y no se le va a
 * inyectar HTML, y `textContent` hace el escape solo. Es lo que se ve
 * antes de tocar el pin: pasar el dedo por ahí y saber qué tienda es.
 */
function tooltipDe(n: {
	nombre: string;
	abierto: boolean;
	barrio?: string | null;
	direccion: string;
}): string {
	const caja = document.createElement("div");

	const nombre = document.createElement("span");
	nombre.className = "tn-nombre";
	nombre.textContent = n.nombre;
	caja.appendChild(nombre);

	const fila = document.createElement("span");
	fila.className = "tn-fila";
	const punto = document.createElement("span");
	punto.className = n.abierto ? "tn-punto abierto" : "tn-punto";
	punto.setAttribute("aria-hidden", "true");
	fila.appendChild(punto);
	fila.append(`${n.abierto ? "Abierto" : "Cerrado"} · ${n.barrio || n.direccion}`);
	caja.appendChild(fila);

	return caja.outerHTML;
}

function controlDeZoom(mapa: MapaLeaflet): (direccion: 1 | -1) => void {
	return (direccion) => {
		const actual = mapa.getZoom();
		mapa.setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, actual + direccion)));
	};
}

/* ====================================================================
 * Mapa con todos los negocios (pantalla principal "/")
 * ==================================================================== */

export function MapaNegocios({
	negocios,
	onSeleccionar,
	seleccionadoId = null,
	controlRef,
}: {
	negocios: Negocio[];
	onSeleccionar: (n: Negocio) => void;
	seleccionadoId?: string | null;
	/*
	 * Los controles de zoom no los pinta Leaflet: los pinta la pantalla
	 * que monta el mapa, para que queden arriba del todo y nunca debajo
	 * de la ficha. Este ref es la mano que esos controles le tienden al
	 * mapa cuando ya existe.
	 */
	controlRef?: { current: ((direccion: 1 | -1) => void) | null };
}) {
	const contenedorRef = useRef<HTMLDivElement>(null);
	const leafletRef = useRef<Leaflet | null>(null);
	const mapaRef = useRef<MapaLeaflet | null>(null);
	const capaRef = useRef<CapaLeaflet | null>(null);
	const marcadoresRef = useRef<Record<string, MarcadorLeaflet>>({});
	const alSeleccionarRef = useRef(onSeleccionar);
	const [error, setError] = useState(false);

	useEffect(() => {
		alSeleccionarRef.current = onSeleccionar;
	}, [onSeleccionar]);

	/* El mapa se crea una sola vez y se destruye al desmontar. */
	useEffect(() => {
		let vivo = true;

		cargarLeaflet()
			.then((L) => {
				if (!vivo || !contenedorRef.current || mapaRef.current) return;

				const mapa = L.map(contenedorRef.current, {
					center: [CENTRO_REPELON.lat, CENTRO_REPELON.lng],
					zoom: 15,
					zoomControl: false,
					attributionControl: false,
					// Sin zoom con la rueda: la hoja de abajo y el scroll
					// de la página compiten con el mapa, y el mapa pierde.
					scrollWheelZoom: false,
					minZoom: ZOOM_MIN,
					maxZoom: ZOOM_MAX,
				});
				territorio(L, mapa);

				leafletRef.current = L;
				mapaRef.current = mapa;
				capaRef.current = L.layerGroup().addTo(mapa);
				if (controlRef) controlRef.current = controlDeZoom(mapa);
			})
			.catch(() => {
				if (vivo) setError(true);
			});

		return () => {
			vivo = false;
			if (controlRef) controlRef.current = null;
			mapaRef.current?.remove();
			mapaRef.current = null;
			capaRef.current = null;
			leafletRef.current = null;
			marcadoresRef.current = {};
		};
	}, [controlRef]);

	/* Pines y encuadre: se rehacen cuando cambia la lista filtrada. */
	useEffect(() => {
		const L = leafletRef.current;
		const mapa = mapaRef.current;
		const capa = capaRef.current;
		if (!L || !mapa || !capa) return;

		capa.clearLayers();
		marcadoresRef.current = {};

		const puntos: [number, number][] = [];
		for (const n of negocios) {
			if (n.latitud == null || n.longitud == null) continue;
			const posicion: [number, number] = [n.latitud, n.longitud];
			const marcador = L.marker(posicion, {
				icon: pin(L, n.abierto, false),
				keyboard: true,
			});
			marcador.on("click", () => {
				/*
				 * En celular tocar el pin también abre el globo: Leaflet
				 * asocia `click`, no solo `mouseover`. La hoja de abajo ya
				 * trae toda esa información, así que el globo se cierra en
				 * cuanto se abre la hoja para que no quede una tarjeta
				 * pegada sobre el mapa. Va con setTimeout: Leaflet abre el
				 * suyo después de los listeners del click.
				 */
				window.setTimeout(() => marcador.closeTooltip(), 0);
				alSeleccionarRef.current(n);
			});
			// Hover: el globo con el nombre y el estado, 34 px por encima
			// del pin para que no lo tape la punta. Va sin `title` en el
			// marcador a propósito: si no, además del globo este aparece
			// el tooltip nativo del navegador y salen dos.
			marcador.bindTooltip(tooltipDe(n), {
				direction: "top",
				offset: [0, -34],
				className: "tooltip-negocio",
			});
			marcador.addTo(capa);
			marcadoresRef.current[n.id] = marcador;
			puntos.push(posicion);
		}

		if (puntos.length === 1) {
			mapa.setView(puntos[0], 16, { animate: false });
		} else if (puntos.length > 1) {
			// El padding de abajo es el alto de la ficha del comercio: sin
			// él, los pines del sur quedan debajo de la tarjeta y parecen
			// perdidos.
			mapa.fitBounds(L.latLngBounds(puntos), {
				paddingTopLeft: [36, 70],
				paddingBottomRight: [36, 170],
				animate: false,
			});
		}
	}, [negocios]);

	/*
	 * Resalte y desplazamiento al negocio elegido. Va aparte del efecto
	 * de arriba a propósito: recrear los pines para agrandar uno
	 * reharía el fitBounds y devolvería la cámara al pueblo entero,
	 * justo lo contrario de lo que se quiere al tocar un pin.
	 */
	useEffect(() => {
		const L = leafletRef.current;
		const mapa = mapaRef.current;
		if (!L || !mapa) return;

		const porId = new Map(negocios.map((n) => [n.id, n]));

		for (const [id, marcador] of Object.entries(marcadoresRef.current)) {
			const negocio = porId.get(id);
			if (!negocio) continue;
			const destacado = id === seleccionadoId;
			marcador.setIcon(pin(L, negocio.abierto, destacado));
			marcador.setZIndexOffset(destacado ? 1000 : negocio.abierto ? 100 : 0);
		}

		if (seleccionadoId) {
			const elegido = porId.get(seleccionadoId);
			if (elegido?.latitud != null && elegido.longitud != null) {
				mapa.setView(
					[elegido.latitud, elegido.longitud],
					Math.max(mapa.getZoom(), 16),
					{ animate: true },
				);
			}
		}
	}, [negocios, seleccionadoId]);

	if (error) {
		return (
			<div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-black/60">
				No se pudieron cargar las teselas de OpenStreetMap. Revisa la conexión a
				internet.
			</div>
		);
	}

	return <div ref={contenedorRef} className="h-full w-full" />;
}

/* ====================================================================
 * Mapa pequeño de la ficha de un negocio
 * ==================================================================== */

export function MapaMini({
	lat,
	lng,
	nombre,
	abierto,
}: {
	lat: number;
	lng: number;
	nombre: string;
	abierto?: boolean;
}) {
	const contenedorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let vivo = true;
		let mapa: MapaLeaflet | null = null;

		cargarLeaflet()
			.then((L) => {
				if (!vivo || !contenedorRef.current) return;
				mapa = L.map(contenedorRef.current, {
					center: [lat, lng],
					zoom: 16,
					scrollWheelZoom: false,
					minZoom: ZOOM_MIN,
					maxZoom: ZOOM_MAX,
				});
				territorio(L, mapa);
				L.marker([lat, lng], {
					icon: pin(L, abierto ?? true, true),
					title: nombre,
				}).addTo(mapa);
			})
			.catch(() => {
				// Sin mapa la ficha se queda con la dirección escrita.
			});

		return () => {
			vivo = false;
			mapa?.remove();
		};
		// El mapa se rehace solo si cambian los datos del pin.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lat, lng, nombre]);

	return <div ref={contenedorRef} className="h-52 w-full rounded-2xl bg-black/[.03]" />;
}

/* ====================================================================
 * Selector arrastrable (registro/edición de negocio)
 * ==================================================================== */

export function MapaSelector({
	lat,
	lng,
	onCambiar,
}: {
	lat: number | null;
	lng: number | null;
	onCambiar: (lat: number, lng: number) => void;
}) {
	const contenedorRef = useRef<HTMLDivElement>(null);
	const mapaRef = useRef<MapaLeaflet | null>(null);
	const marcadorRef = useRef<MarcadorLeaflet | null>(null);
	const alCambiarRef = useRef(onCambiar);

	useEffect(() => {
		alCambiarRef.current = onCambiar;
	}, [onCambiar]);

	useEffect(() => {
		let vivo = true;

		cargarLeaflet()
			.then((L) => {
				if (!vivo || !contenedorRef.current || mapaRef.current) return;

				const centro: [number, number] = [
					lat ?? CENTRO_REPELON.lat,
					lng ?? CENTRO_REPELON.lng,
				];
				const mapa = L.map(contenedorRef.current, {
					center: centro,
					zoom: lat != null ? 17 : 15,
					scrollWheelZoom: false,
					minZoom: ZOOM_MIN,
					maxZoom: ZOOM_MAX,
				});
				territorio(L, mapa);

				const marcador = L.marker(centro, {
					icon: pin(L, true, true),
					draggable: true,
					title: "Arrastra el pin a tu negocio",
				}).addTo(mapa);

				marcador.on("dragend", () => {
					const punto = marcador.getLatLng();
					alCambiarRef.current(punto.lat, punto.lng);
				});
				mapa.on("click", (evento: { latlng: { lat: number; lng: number } }) => {
					marcador.setLatLng(evento.latlng);
					alCambiarRef.current(evento.latlng.lat, evento.latlng.lng);
				});

				mapaRef.current = mapa;
				marcadorRef.current = marcador;
			})
			.catch(() => {
				// Sin mapa se guarda igual la dirección escrita.
			});

		return () => {
			vivo = false;
			mapaRef.current?.remove();
			mapaRef.current = null;
			marcadorRef.current = null;
		};
		// Solo se monta una vez: mover el pin no debe recrear el mapa.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (lat == null || lng == null || !marcadorRef.current) return;
		marcadorRef.current.setLatLng([lat, lng]);
	}, [lat, lng]);

	return <div ref={contenedorRef} className="h-56 w-full rounded-2xl bg-black/[.03]" />;
}
