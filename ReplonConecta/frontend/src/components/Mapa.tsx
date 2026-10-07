"use client";

import { useEffect, useRef, useState } from "react";

import { CENTRO_REPELON, mapasGoogleConfigurado } from "@/lib/env";
import { ErrorMapas, cargarGoogleMaps, iconoMarcador } from "@/lib/maps";
import type { MotivoFalloMapas } from "@/lib/maps";
import type { Negocio } from "@/lib/tipos";

/*
 * Mapas de la app con la API de JavaScript de Google Maps.
 *
 * Google Maps pide una clave (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, ver
 * `lib/env.ts`), se paga por uso y hay que restringirla por dominio,
 * pero da calles, satélite y rutas completas: es lo que el vecino ya
 * tiene en el celular. La clave viaja pública a propósito, igual que la
 * de Supabase.
 *
 * La API toca `window` al cargarse, así que se pide dentro de los
 * efectos y no arriba: estas pantallas también se pintan en el servidor
 * durante el prerender. El mapa se crea una sola vez y se destruye al
 * desmontar; los pines se rehacen cuando cambia la lista filtrada.
 *
 * Tres pantallas y una sección comparten este archivo: el mapa grande
 * con todos los negocios (home y búsqueda), el mapa chico de la ficha
 * y el selector arrastrable del vendedor. Todas reciben y devuelven lo
 * mismo, así que la pantalla que las monta no distingue un mapa de otro.
 */

/**
 * Lo mínimo que el mapa necesita para dibujar un pin: el negocio
 * completo (home) o el recorte que trae un resultado de búsqueda,
 * cumplen el mismo contrato y el componente no distingue.
 */
export type NegocioMapa = Pick<
	Negocio,
	"id" | "nombre" | "slug" | "abierto" | "barrio" | "direccion" | "latitud" | "longitud"
>;

const ZOOM_MIN = 11;
const ZOOM_MAX = 19;
const ZOOM_PIN = 16;

type Marcador = google.maps.Marker;

/*
 * Base común de los tres mapas: sin la interfaz de Google (los controles
 * los pinta la pantalla que monta el mapa, para que queden arriba del
 * todo y nunca debajo de la tarjeta), sin la rueda del ratón (le toca a
 * la página, no al mapa) y sin que un POI de Google se coma el click
 * que va para un pin.
 */
function mapaBase(center: google.maps.LatLngLiteral, zoom: number): google.maps.MapOptions {
	return {
		center,
		zoom,
		minZoom: ZOOM_MIN,
		maxZoom: ZOOM_MAX,
		disableDefaultUI: true,
		scrollwheel: false,
		clickableIcons: false,
	};
}

/*
 * El pin de `iconoMarcador` (verde si está abierto, gris si no, con la
 * tienda adentro) como icono de Google: `scaledSize` es el tamaño en
 * pantalla y `anchor` dónde se clava al suelo — la punta del pin, no el
 * centro de la imagen, o el pin queda flotando sobre la calle.
 */
function iconoDe(abierto: boolean, destacado: boolean): google.maps.Icon {
	const alto = destacado ? 50 : 40;
	const ancho = (28 * alto) / 40;
	return {
		url: iconoMarcador(abierto),
		scaledSize: new google.maps.Size(ancho, alto),
		anchor: new google.maps.Point(ancho / 2, alto),
	};
}

/*
 * Globo de hover de un pin: nombre, estado y barrio en una línea.
 *
 * Google lo pinta con el `title` del marcador, así que es texto plano y
 * no HTML armado a mano: el nombre viene de la base y no se le puede
 * inyectar nada. Es lo que se ve antes de tocar el pin: pasar el cursor
 * por ahí y saber qué tienda es.
 */
function tituloDe(n: {
	nombre: string;
	abierto: boolean;
	barrio?: string | null;
	direccion: string;
}): string {
	return `${n.nombre} · ${n.abierto ? "Abierto" : "Cerrado"} · ${n.barrio || n.direccion}`;
}

/*
 * "Tú estás aquí": azul con borde blanco, para que no se confunda con
 * los verdes/grises de los negocios.
 *
 * Va en una función y no en una constante del módulo:
 * `google.maps.SymbolPath` solo existe DESPUÉS de cargar la API, y este
 * archivo también se evalúa en el servidor, donde `google` todavía no
 * existe — leerlo arriba de todo revienta cada pantalla que monta un mapa.
 */
function pinYo(): google.maps.Symbol {
	return {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 8,
		fillColor: "#2563eb",
		fillOpacity: 1,
		strokeColor: "#ffffff",
		strokeWeight: 3,
	};
}

function encuadrar(mapa: google.maps.Map, puntos: google.maps.LatLngLiteral[]) {
	if (puntos.length === 1) {
		mapa.setCenter(puntos[0]);
		mapa.setZoom(ZOOM_PIN);
		return;
	}
	if (puntos.length < 2) return;

	const limites = new google.maps.LatLngBounds();
	for (const punto of puntos) limites.extend(punto);

	/*
	 * El padding de abajo es el alto de la tarjeta del comercio: sin él,
	 * los pines del sur quedan debajo de la tarjeta y parecen perdidos.
	 */
	mapa.fitBounds(limites, { top: 70, bottom: 170, left: 36, right: 36 });
}

/* ====================================================================
 * Mapa con todos los negocios (home y pantalla de búsqueda)
 * ==================================================================== */

export function MapaNegocios({
	negocios,
	onSeleccionar,
	seleccionadoId = null,
	controlRef,
	resaltar = false,
	miUbicacion = null,
}: {
	negocios: NegocioMapa[];
	onSeleccionar: (n: NegocioMapa) => void;
	seleccionadoId?: string | null;
	/*
	 * Los controles de zoom no los pinta Google: los pinta la pantalla
	 * que monta el mapa, para que queden arriba del todo y nunca debajo
	 * de la ficha. Este ref es la mano que esos controles le tienden al
	 * mapa cuando ya existe.
	 */
	controlRef?: { current: ((direccion: 1 | -1) => void) | null };
	/*
	 * En la pantalla de búsqueda TODOS los pines son resultados: con
	 * esto se pintan un poco más grandes que los del mapa general, que
	 * muestran el pueblo entero.
	 */
	resaltar?: boolean;
	/*
	 * "Tú estás aquí" (botón Usar mi ubicación de /buscar). Va fuera de
	 * la capa de negocios para que refiltrar la lista no lo borre.
	 */
	miUbicacion?: { lat: number; lng: number } | null;
}) {
	const contenedorRef = useRef<HTMLDivElement>(null);
	const mapaRef = useRef<google.maps.Map | null>(null);
	const marcadoresRef = useRef<Record<string, Marcador>>({});
	const yoRef = useRef<Marcador | null>(null);
	const alSeleccionarRef = useRef(onSeleccionar);

	/*
	 * `listo` es la señal de que el mapa ya existe. La API de Google se
	 * carga en segundo plano, así que sin este estado el primer efecto de
	 * pines correría antes de tener mapa y se quedaría sin pintar hasta
	 * la siguiente vez que cambie la lista (justo lo que no se quiere en
	 * una pantalla que filtra en vivo).
	 */
	const [listo, setListo] = useState(false);
	/*
	 * Si falta la clave no se intenta cargar nada: el motivo se calcula
	 * al pintar, no con un setState dentro del efecto.
	 */
	const [falloDeCarga, setFalloDeCarga] = useState<ErrorMapas | null>(null);
	const motivoFallo: MotivoFalloMapas | null = mapasGoogleConfigurado
		? (falloDeCarga?.motivo ?? null)
		: "sin-clave";

	useEffect(() => {
		alSeleccionarRef.current = onSeleccionar;
	}, [onSeleccionar]);

	useEffect(() => {
		if (!mapasGoogleConfigurado) return;
		let vivo = true;

		cargarGoogleMaps()
			.then(() => {
				if (!vivo || !contenedorRef.current || mapaRef.current) return;

				const mapa = new google.maps.Map(contenedorRef.current, mapaBase(CENTRO_REPELON, 15));
				mapaRef.current = mapa;

				if (controlRef) {
					controlRef.current = (direccion) => {
						const actual = mapa.getZoom() ?? 15;
						mapa.setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, actual + direccion)));
					};
				}
				setListo(true);
			})
			.catch((error: unknown) => {
				if (vivo) setFalloDeCarga(error instanceof ErrorMapas ? error : new ErrorMapas("carga"));
			});

		return () => {
			vivo = false;
			if (controlRef) controlRef.current = null;
			for (const marcador of Object.values(marcadoresRef.current)) marcador.setMap(null);
			marcadoresRef.current = {};
			yoRef.current?.setMap(null);
			yoRef.current = null;
			mapaRef.current = null;
		};
	}, [controlRef]);

	/* Pines y encuadre: se rehacen cuando cambia la lista filtrada. */
	useEffect(() => {
		const mapa = mapaRef.current;
		if (!listo || !mapa) return;

		for (const marcador of Object.values(marcadoresRef.current)) marcador.setMap(null);
		marcadoresRef.current = {};

		const puntos: google.maps.LatLngLiteral[] = [];
		for (const n of negocios) {
			if (n.latitud == null || n.longitud == null) continue;
			const posicion = { lat: n.latitud, lng: n.longitud };
			const marcador = new google.maps.Marker({
				position: posicion,
				map: mapa,
				icon: iconoDe(n.abierto, resaltar),
				title: tituloDe(n),
				zIndex: resaltar ? 1000 : n.abierto ? 100 : 0,
			});
			/*
			 * Al tocar el pin se abre la tarjeta del negocio (el globo de
			 * hover no hace falta: la hoja de abajo ya trae esa misma
			 * información y queda pegada al mapa).
			 */
			marcador.addListener("click", () => alSeleccionarRef.current(n));
			marcadoresRef.current[n.id] = marcador;
			puntos.push(posicion);
		}

		encuadrar(mapa, puntos);
	}, [negocios, resaltar, listo]);

	/*
	 * Resalte y desplazamiento al negocio elegido. Va aparte del efecto
	 * de arriba a propósito: recrear los pines para agrandar uno
	 * reharía el encuadre y devolvería la cámara al pueblo entero,
	 * justo lo contrario de lo que se quiere al tocar un pin.
	 */
	useEffect(() => {
		const mapa = mapaRef.current;
		if (!listo || !mapa) return;

		const porId = new Map(negocios.map((n) => [n.id, n]));

		for (const [id, marcador] of Object.entries(marcadoresRef.current)) {
			const negocio = porId.get(id);
			if (!negocio) continue;
			const destacado = resaltar || id === seleccionadoId;
			marcador.setIcon(iconoDe(negocio.abierto, destacado));
			marcador.setZIndex(destacado ? 1000 : negocio.abierto ? 100 : 0);
		}

		if (seleccionadoId) {
			const elegido = porId.get(seleccionadoId);
			if (elegido?.latitud != null && elegido.longitud != null) {
				mapa.panTo({ lat: elegido.latitud, lng: elegido.longitud });
				if ((mapa.getZoom() ?? 15) < ZOOM_PIN) mapa.setZoom(ZOOM_PIN);
			}
		}
	}, [negocios, seleccionadoId, resaltar, listo]);

	/*
	 * El pin del usuario: aparte del efecto de arriba a propósito.
	 * Refiltra la lista (nuevos negocios) y el pin sigue ahí; si
	 * quitamos la ubicación, se borra solo.
	 */
	useEffect(() => {
		const mapa = mapaRef.current;
		if (!listo || !mapa) return;

		yoRef.current?.setMap(null);
		yoRef.current = null;
		if (!miUbicacion) return;

		yoRef.current = new google.maps.Marker({
			position: miUbicacion,
			map: mapa,
			icon: pinYo(),
			title: "Tu ubicación",
			zIndex: 2000,
		});
		mapa.panTo(miUbicacion);
		if ((mapa.getZoom() ?? 15) < ZOOM_PIN) mapa.setZoom(ZOOM_PIN);
	}, [miUbicacion, listo]);

	if (motivoFallo) {
		return (
			<div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-black/60">
				{motivoFallo === "sin-clave"
					? "El mapa no está configurado: falta la clave de Google Maps en .env.local."
					: "No se pudo cargar Google Maps. Revisa la conexión a internet."}
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
		if (!mapasGoogleConfigurado) return;
		let vivo = true;
		let mapa: google.maps.Map | null = null;
		let marcador: Marcador | null = null;

		cargarGoogleMaps()
			.then(() => {
				if (!vivo || !contenedorRef.current) return;
				const opciones = mapaBase({ lat, lng }, ZOOM_PIN);
				// En la ficha los controles de Google sí ayudan: no hay
				// tarjeta que los tape y el mapa es chico.
				opciones.disableDefaultUI = false;
				opciones.zoomControl = true;
				mapa = new google.maps.Map(contenedorRef.current, opciones);
				marcador = new google.maps.Marker({
					position: { lat, lng },
					map: mapa,
					icon: iconoDe(abierto ?? true, true),
					title: nombre,
				});
			})
			.catch(() => {
				// Sin mapa la ficha se queda con la dirección escrita.
			});

		return () => {
			vivo = false;
			marcador?.setMap(null);
			mapa = null;
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
	const mapaRef = useRef<google.maps.Map | null>(null);
	const marcadorRef = useRef<Marcador | null>(null);
	const alCambiarRef = useRef(onCambiar);

	useEffect(() => {
		alCambiarRef.current = onCambiar;
	}, [onCambiar]);

	useEffect(() => {
		if (!mapasGoogleConfigurado) return;
		let vivo = true;

		cargarGoogleMaps()
			.then(() => {
				if (!vivo || !contenedorRef.current || mapaRef.current) return;

				const opciones = mapaBase(
					{ lat: lat ?? CENTRO_REPELON.lat, lng: lng ?? CENTRO_REPELON.lng },
					lat != null ? ZOOM_PIN : 15,
				);
				opciones.disableDefaultUI = false;
				opciones.zoomControl = true;
				const mapa = new google.maps.Map(contenedorRef.current, opciones);

				const marcador = new google.maps.Marker({
					position: { lat: lat ?? CENTRO_REPELON.lat, lng: lng ?? CENTRO_REPELON.lng },
					map: mapa,
					icon: iconoDe(true, true),
					draggable: true,
					title: "Arrastra el pin a tu negocio",
				});

				marcador.addListener("dragend", () => {
					const punto = marcador.getPosition();
					if (punto) alCambiarRef.current(punto.lat(), punto.lng());
				});
				mapa.addListener("click", (evento: google.maps.MapMouseEvent) => {
					if (!evento.latLng) return;
					marcador.setPosition(evento.latLng);
					alCambiarRef.current(evento.latLng.lat(), evento.latLng.lng());
				});

				mapaRef.current = mapa;
				marcadorRef.current = marcador;
			})
			.catch(() => {
				// Sin mapa se guarda igual la dirección escrita.
			});

		return () => {
			vivo = false;
			marcadorRef.current?.setMap(null);
			mapaRef.current = null;
			marcadorRef.current = null;
		};
		// Solo se monta una vez: mover el pin no debe recrear el mapa.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const marcador = marcadorRef.current;
		if (!marcador) return;
		// "Quitar pin" deja el punto vacío: el marcador se esconde para
		// que el mapa no muestre una coordenada que ya no existe.
		if (lat == null || lng == null) {
			marcador.setMap(null);
			return;
		}
		marcador.setMap(mapaRef.current);
		marcador.setPosition({ lat, lng });
	}, [lat, lng]);

	return <div ref={contenedorRef} className="h-56 w-full rounded-2xl bg-black/[.03]" />;
}
