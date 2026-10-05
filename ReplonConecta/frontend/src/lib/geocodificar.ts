"use client";

import { useEffect, useState } from "react";

/*
 * Coordenadas de los negocios que todavía no las tienen.
 *
 * Los negocios de la base de datos llegan con `latitud` y `longitud` en
 * NULL, así que un mapa real no tendría ni un pin que poner. Aquí se le
 * pregunta a Nominatim (vía /api/geocode, porque Nominatim no deja
 * pedirle desde el navegador) dónde queda la dirección escrita de cada
 * negocio, y se devuelve el mapa id -> punto para que el mapa y la ficha
 * no tengan que saber nada de esto.
 *
 * Las dos reglas de la política de uso de Nominatim, que es lo único que
 * hay que respetar:
 *   - una consulta por segundo: entre peticiones reales se espera 1,1 s;
 *   - no repetir la misma consulta: el resultado se guarda en el
 *     navegador, así quien abre la app tres veces solo consulta una.
 *
 * Una dirección que Nominatim no encuentra (las veredas rara vez están
 * bien geocodificadas) simplemente no deja pin: la hoja y el enlace de
 * "Cómo llegar" siguen funcionando con el texto escrito.
 */

export type Punto = { lat: number; lng: number };

/*
 * Lo mínimo que hace falta para resolver un punto: identificador,
 * dirección y las coordenadas (casi siempre vacías). Se define por
 * estructura y no con `Negocio` porque la ficha detallada
 * (NegocioDetalle) no comparte tipo con la lista, aunque sí trae estos
 * tres campos.
 */
export type ConDireccion = {
	id: string;
	direccion: string;
	latitud: number | null;
	longitud: number | null;
};

const CLAVE_CACHE = "repelon-conecta:geocodificacion:v1";
const SUFIJO = "Repelón, Atlántico, Colombia";
const ESPERA_MS = 1100;
const LARGO_MAXIMO = 200;

type Cache = Record<string, Punto | null>;
type Pendiente = [id: string, consulta: string];

function consultaDe(direccion: string): string {
	return `${direccion}, ${SUFIJO}`.slice(0, LARGO_MAXIMO);
}

function leerCache(): Cache {
	try {
		const crudo = window.localStorage.getItem(CLAVE_CACHE);
		const datos = crudo ? (JSON.parse(crudo) as unknown) : null;
		return datos && typeof datos === "object" && !Array.isArray(datos)
			? (datos as Cache)
			: {};
	} catch {
		return {};
	}
}

function guardarCache(cache: Cache): void {
	try {
		window.localStorage.setItem(CLAVE_CACHE, JSON.stringify(cache));
	} catch {
		// Cuota llena o modo privado: se sigue sin caché, no es grave.
	}
}

/** Última petición real a Nominatim, para respetar su límite de 1/s. */
let ultimaPeticion = 0;

async function consultar(consulta: string): Promise<Punto | null> {
	const desdeUltima = Date.now() - ultimaPeticion;
	if (desdeUltima < ESPERA_MS) {
		await new Promise((resolver) => setTimeout(resolver, ESPERA_MS - desdeUltima));
	}

	try {
		ultimaPeticion = Date.now();
		const respuesta = await fetch(`/api/geocode?q=${encodeURIComponent(consulta)}`);
		if (!respuesta.ok) return null;
		const datos = (await respuesta.json()) as { punto: Punto | null };
		return datos.punto ?? null;
	} catch {
		return null;
	}
}

/**
 * Mapa `id del negocio -> coordenada` para los que no la tienen.
 *
 * El valor solo cambia cuando aparece una coordenada nueva, así que el
 * mapa no vuelve a encuadrar en cada tecla que se teclea.
 */
export function useCoordenadas(negocios: ConDireccion[]): Record<string, Punto> {
	const [coordenadas, setCoordenadas] = useState<Record<string, Punto>>({});

	/*
	 * El efecto no depende del arreglo (que es nuevo en cada petida de
	 * datos, y repetiría el efecto sin fin), sino de esta cadena JSON
	 * con lo que de verdad hay que consultar: solo cambia cuando cambia
	 * el conjunto de direcciones pendientes.
	 */
	const pendientes = JSON.stringify(
		negocios
			.filter((n) => n.latitud == null || n.longitud == null)
			.map((n): Pendiente => [n.id, consultaDe(n.direccion)]),
	);

	useEffect(() => {
		const cola = JSON.parse(pendientes) as Pendiente[];
		if (cola.length === 0) return;

		let vivo = true;

		(async () => {
			const cache = leerCache();

			for (const [id, consulta] of cola) {
				let punto = cache[consulta];
				if (punto === undefined) {
					punto = await consultar(consulta);
					cache[consulta] = punto;
					guardarCache(cache);
				}

				if (!vivo) return;

				// const, no let: el tipo se mantiene cerrado dentro del
				// estado que se actualiza.
				const encontrado: Punto | null = punto;
				if (encontrado) {
					setCoordenadas((actuales) =>
						actuales[id] ? actuales : { ...actuales, [id]: encontrado },
					);
				}
			}
		})();

		return () => {
			vivo = false;
		};
	}, [pendientes]);

	return coordenadas;
}

/**
 * Devuelve la lista con las coordenadas recién resueltas ya puestas en
 * cada negocio. Los que ya traían latitud/lng de la base no se tocan.
 */
export function conCoordenadas<T extends ConDireccion>(
	negocios: T[],
	coordenadas: Record<string, Punto>,
): T[] {
	if (Object.keys(coordenadas).length === 0) return negocios;
	return negocios.map((n) => {
		const punto = coordenadas[n.id];
		if (!punto || n.latitud != null || n.longitud != null) return n;
		return { ...n, latitud: punto.lat, longitud: punto.lng };
	});
}
