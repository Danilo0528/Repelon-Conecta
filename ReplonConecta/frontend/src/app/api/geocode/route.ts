import { NextResponse } from "next/server";

import { CENTRO_REPELON } from "@/lib/env";

/*
 * Proxy de geocodificación: Nominatim (OpenStreetMap).
 *
 * Nominatim no envía cabeceras CORS, así que el navegador no puede
 * pedirle las coordenadas directamente. Este route handler lo hace del
 * lado del servidor, con el identificador que su política de uso exige
 * y con caché de un día, para que la misma dirección no se consulte dos
 * veces.
 *
 * Se usa para los negocios que todavía no tienen latitud/longitud en la
 * base: sin esto el mapa sale sin pines.
 *
 * El encuadre (P1): `countrycodes=co` + `viewbox` alrededor del centro
 * de Repelón + `bounded=1` encierran la respuesta en el municipio —
 * una dirección ambigua no puede caer en el pueblo vecino. Si
 * Nominatim no encuentra nada dentro de la caja, devuelve vacío: el
 * negocio se queda sin pin y la dirección escrita sigue funcionando.
 *
 * Reversa (zonas turísticas del admin): con `lat` y `lon` en vez de
 * `q`, devuelve la dirección legible de ese punto. Nominatim no admite
 * `bounded` en la búsqueda inversa, así que la caja de Repelón se
 * chequea aquí mismo y un punto fuera del municipio se rechaza antes
 * de llamarlo.
 */

const NOMINATIM_BUSCAR = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSA = "https://nominatim.openstreetmap.org/reverse";
const IDENTIFICADOR = "RepelonConecta/1.0 (aplicación web de Repelón, Atlántico, Colombia)";
const REVALIDAR = 60 * 60 * 24;
const LARGO_MAXIMO = 200;
/** Máximo de sugerencias que devuelve una búsqueda (el panel elige una). */
const MAX_RESULTADOS = 5;

	/*
	 * Caja de Repelón: ±0.12° alrededor del casco urbano (~13 km de radio),
	 * suficiente para las veredas del municipio y lo bastante chica para
	 * que `bounded` no deje entrar a San Juan ni a la caleta de otro
	 * pueblo.
	 * Formato Nominatim: `izquierda,arriba,derecha,abajo` (lon,lat).
	 * Para los chequeos locales se usa min/max: así no importa si un
	 * eje viene invertido.
	 */
	const MARGEN = 0.12;
	const VIEWBOX = [
		CENTRO_REPELON.lng - MARGEN,
		CENTRO_REPELON.lat - MARGEN,
		CENTRO_REPELON.lng + MARGEN,
		CENTRO_REPELON.lat + MARGEN,
	].join(",");

export async function GET(request: Request) {
	const parametros = new URL(request.url).searchParams;
	const latParam = parametros.get("lat");
	const lonParam = parametros.get("lon");

	if (latParam !== null || lonParam !== null) {
		return reversa(latParam, lonParam);
	}

	const consulta = parametros.get("q")?.trim();

	if (!consulta) {
		return NextResponse.json({ error: "Falta el parámetro q" }, { status: 400 });
	}
	if (consulta.length > LARGO_MAXIMO) {
		return NextResponse.json({ error: "Consulta demasiado larga" }, { status: 400 });
	}

	// `n` pide varias coincidencias: el panel de administración las
	// muestra como lista para que se elija la exacta en vez de aceptar
	// la primera que devuelva el geocoder.
	const pedidos = Number(parametros.get("n") ?? "1");
	const limite = Number.isFinite(pedidos)
		? Math.min(MAX_RESULTADOS, Math.max(1, Math.round(pedidos)))
		: 1;

	try {
		const url = new URL(NOMINATIM_BUSCAR);
		url.searchParams.set("format", "jsonv2");
		url.searchParams.set("limit", String(limite));
		url.searchParams.set("addressdetails", "0");
		url.searchParams.set("countrycodes", "co");
		url.searchParams.set("viewbox", VIEWBOX);
		url.searchParams.set("bounded", "1");
		url.searchParams.set("accept-language", "es");
		url.searchParams.set("q", consulta);

		const respuesta = await fetch(url.toString(), {
			headers: { "User-Agent": IDENTIFICADOR, Accept: "application/json" },
			next: { revalidate: REVALIDAR },
		});

		if (!respuesta.ok) {
			return NextResponse.json(
				{ error: `Nominatim respondió ${respuesta.status}` },
				{ status: 502 },
			);
		}

		const datos = (await respuesta.json()) as {
			lat: string;
			lon: string;
			display_name?: string;
		}[];

		const resultados = datos
			.map((d) => {
				const lat = Number(d.lat);
				const lng = Number(d.lon);
				if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
				return {
					lat,
					lng,
					texto: (d.display_name ?? "").trim().slice(0, LARGO_MAXIMO) || null,
				};
			})
			.filter((x): x is { lat: number; lng: number; texto: string | null } => x !== null);

		// `punto` sigue siendo el primero: lo usan las pantallas que solo
		// necesitan "esta dirección está en Repelón y este es su pin".
		return NextResponse.json({ punto: resultados[0] ?? null, resultados });
	} catch {
		return NextResponse.json({ error: "No se pudo consultar Nominatim" }, { status: 502 });
	}
}

/*
 * Dirección legible para un punto exacto (la tomó el navegador del
 * estudiante con "Usar mi ubicación"). El punto primero se valida
 * contra la caja de Repelón: el GPS de un celular en otra ciudad no
 * debería poder guardar una zona turística del pueblo.
 */
async function reversa(latParam: string | null, lonParam: string | null) {
	const lat = Number(latParam);
	const lng = Number(lonParam);

	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return NextResponse.json({ error: "lat y lon deben ser números" }, { status: 400 });
	}
	if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
		return NextResponse.json({ error: "Coordenadas fuera de rango" }, { status: 400 });
	}

	const [a, b, c, d] = VIEWBOX.split(",").map(Number);
	const dentro =
		lng >= Math.min(a, c) &&
		lng <= Math.max(a, c) &&
		lat >= Math.min(b, d) &&
		lat <= Math.max(b, d);
	if (!dentro) {
		return NextResponse.json({ error: "La ubicación queda fuera de Repelón" }, { status: 400 });
	}

	try {
		const url = new URL(NOMINATIM_REVERSA);
		url.searchParams.set("format", "jsonv2");
		url.searchParams.set("lat", String(lat));
		url.searchParams.set("lon", String(lng));
		url.searchParams.set("zoom", "18");
		url.searchParams.set("addressdetails", "0");
		url.searchParams.set("countrycodes", "co");
		url.searchParams.set("accept-language", "es");

		const respuesta = await fetch(url.toString(), {
			headers: { "User-Agent": IDENTIFICADOR, Accept: "application/json" },
			next: { revalidate: REVALIDAR },
		});

		if (!respuesta.ok) {
			return NextResponse.json(
				{ error: `Nominatim respondió ${respuesta.status}` },
				{ status: 502 },
			);
		}

		const datos = (await respuesta.json()) as { display_name?: string };
		const direccion = datos.display_name?.trim().slice(0, LARGO_MAXIMO) || null;

		return NextResponse.json({ punto: { lat, lng }, direccion });
	} catch {
		return NextResponse.json({ error: "No se pudo consultar Nominatim" }, { status: 502 });
	}
}
