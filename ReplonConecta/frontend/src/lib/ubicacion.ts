"use client";

/*
 * Ubicación actual de quien está mirando la app.
 *
 * Se usa para que "Cómo llegar" abra la ruta DESDE donde está el
 * visitante y no desde el centro del pueblo. Antes de este módulo el
 * origen era siempre CENTRO_REPELON, que sirve de referencia pero no
 * ayuda a alguien que ya está en otro punto del municipio.
 *
 * DECISIONES:
 *
 * - Se pide UNA vez y se guarda en localStorage 6 horas. El permiso de
 *   geolocalización del navegador cuesta un parpadeo en la UI y en
 *   Chrome vuelve a preguntar por cada origen si no hay respuesta
 *   guardada. Con 6 horas basta para un usos normal de la tarde y
 *   respeta que la gente no quiere que le rastreen de forma continua.
 *
 * - NUNCA se pide en la home ni en la lista: solo cuando alguien abre
 *   la ficha de un lugar y pulsa "Cómo llegar". Pedir la ubicación al
 *   entrar espanta y no aporta nada todavia.
 *
 * - Si el navegador no da permiso, no hay soporte o falla, se usa el
 *   centro del pueblo como origen. El enlace SIEMPRE funciona; solo
 *   cambia desde donde sale la ruta.
 */

import { useCallback, useEffect, useState } from "react";

import { CENTRO_REPELON } from "./env";

export type OrigenRuta = {
	lat: number;
	lng: number;
	/** True si vino del GPS y no del centro por defecto. */
	real: boolean;
};

const CLAVE = "repelon-conecta:ubicacion:v1";
const VALIDEZ_MS = 6 * 60 * 60 * 1000; // 6 horas
const TIEMPO_MAXIMO_MS = 10000; // 10 s: si no responde, secede

type Guardado = { lat: number; lng: number; guardadoEn: number };

function leerGuardado(): Guardado | null {
	if (typeof window === "undefined") return null;
	try {
		const crudo = window.localStorage.getItem(CLAVE);
		if (!crudo) return null;
		const dato = JSON.parse(crudo) as unknown;
		if (
			typeof dato !== "object" ||
			dato === null ||
			Array.isArray(dato)
		) {
			return null;
		}
		const { lat, lng, guardadoEn } = dato as Record<string, unknown>;
		if (
			typeof lat !== "number" ||
			typeof lng !== "number" ||
			typeof guardadoEn !== "number" ||
			!Number.isFinite(lat) ||
			!Number.isFinite(lng)
		) {
			return null;
		}
		if (Date.now() - guardadoEn > VALIDEZ_MS) return null;
		return { lat, lng, guardadoEn };
	} catch {
		// Cuota llena o modo privado: se sigue sin ubicacion guardada.
		return null;
	}
}

function guardar(lat: number, lng: number): void {
	try {
		const dato: Guardado = { lat, lng, guardadoEn: Date.now() };
		window.localStorage.setItem(CLAVE, JSON.stringify(dato));
	} catch {
		// Sin espacio o sin permiso de almacenamiento: el enlace igual
		// sirve con el origen por defecto.
	}
}

const CENTRO: OrigenRuta = {
	lat: CENTRO_REPELON.lat,
	lng: CENTRO_REPELON.lng,
	real: false,
};

/**
 * Ubicación actual, o el centro del pueblo mientras no se sepa.
 *
 * Devuelve tambien `pidiendo` y `preguntado` para que la pantalla pueda
 * explicar en vez de dejar el boton igual. `pidiendo` evita el segundo
 * permiso si el usuario pulsa otra vez mientras la primera peticion
 * sigue en vuelo.
 */
export function useUbicacion(): {
	origen: OrigenRuta;
	pidiendo: boolean;
	preguntado: boolean;
	pedir: () => void;
} {
	const [origen, setOrigen] = useState<OrigenRuta>(CENTRO);
	const [pidiendo, setPidiendo] = useState(false);
	const [preguntado, setPreguntado] = useState(false);

	// Al montar se recupera lo que ya se sepa, sin pedir permiso otra vez.
	useEffect(() => {
		const guardado = leerGuardado();
		if (guardado) {
			setOrigen({ lat: guardado.lat, lng: guardado.lng, real: true });
			setPreguntado(true);
		}
	}, []);

	const pedir = useCallback(() => {
		if (pidiendo) return;
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			setPreguntado(true);
			return;
		}

		setPidiendo(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				// La cache evita repetir la peticion en cada ficha abierta.
				guardar(latitude, longitude);
				setOrigen({ lat: latitude, lng: longitude, real: true });
				setPreguntado(true);
				setPidiendo(false);
			},
			() => {
				// Permiso denegado o error: se queda el centro del pueblo.
				// No es un fallo que haya que mostrar, solo una ruta que
				// arranca desde el punto de referencia del pueblo.
				setPreguntado(true);
				setPidiendo(false);
			},
			{ enableHighAccuracy: false, timeout: TIEMPO_MAXIMO_MS, maximumAge: VALIDEZ_MS },
		);
	}, [pidiendo]);

	return { origen, pidiendo, preguntado, pedir };
}