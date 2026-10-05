import { NextResponse } from "next/server";

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
 * base: sin esto el mapa de OpenStreetMap sale sin pines.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const IDENTIFICADOR = "RepelonConecta/1.0 (aplicación web de Repelón, Atlántico, Colombia)";
const REVALIDAR = 60 * 60 * 24;
const LARGO_MAXIMO = 200;

export async function GET(request: Request) {
	const consulta = new URL(request.url).searchParams.get("q")?.trim();

	if (!consulta) {
		return NextResponse.json({ error: "Falta el parámetro q" }, { status: 400 });
	}
	if (consulta.length > LARGO_MAXIMO) {
		return NextResponse.json({ error: "Consulta demasiado larga" }, { status: 400 });
	}

	try {
		const respuesta = await fetch(
			`${NOMINATIM}?format=jsonv2&limit=1&addressdetails=0&q=${encodeURIComponent(consulta)}`,
			{
				headers: { "User-Agent": IDENTIFICADOR, Accept: "application/json" },
				next: { revalidate: REVALIDAR },
			},
		);

		if (!respuesta.ok) {
			return NextResponse.json(
				{ error: `Nominatim respondió ${respuesta.status}` },
				{ status: 502 },
			);
		}

		const datos = (await respuesta.json()) as { lat: string; lon: string }[];
		const primero = datos[0];

		if (!primero) {
			return NextResponse.json({ punto: null });
		}

		const lat = Number(primero.lat);
		const lng = Number(primero.lon);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			return NextResponse.json({ punto: null });
		}

		return NextResponse.json({ punto: { lat, lng } });
	} catch {
		return NextResponse.json({ error: "No se pudo consultar Nominatim" }, { status: 502 });
	}
}
