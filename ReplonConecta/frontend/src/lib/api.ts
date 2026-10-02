import { API_URL } from "./env";
import { supabase } from "./supabase";

/*
 * Cliente HTTP contra la API Spring.
 *
 * El token lo pone Supabase: el backend valida el JWT contra el mismo
 * secreto, así que no hay que inventar una capa de sesión propia. Cuando
 * `auth` está activo y hay sesión, se adjunta el Bearer.
 */
export class ErrorApi extends Error {
	constructor(
		public readonly estado: number,
		mensaje: string,
	) {
		super(mensaje);
		this.name = "ErrorApi";
	}
}

type Opciones = RequestInit & { auth?: boolean };

async function tokenActual(): Promise<string | null> {
	const { data } = await supabase.auth.getSession();
	return data.session?.access_token ?? null;
}

export async function api<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
	const { auth = false, headers, ...resto } = opciones;

	const cabeceras = new Headers(headers);
	cabeceras.set("Accept", "application/json");
	if (resto.body != null && !cabeceras.has("Content-Type")) {
		cabeceras.set("Content-Type", "application/json");
	}

	if (auth) {
		const token = await tokenActual();
		if (token) {
			cabeceras.set("Authorization", `Bearer ${token}`);
		}
	}

	let respuesta: Response;
	try {
		respuesta = await fetch(`${API_URL}${ruta}`, { ...resto, headers: cabeceras });
	} catch {
		// Sin red o backend caído: se distingue del error de negocio para
		// que la UI pueda decir "no hay conexión" en vez de un error raro.
		throw new ErrorApi(0, "No se pudo conectar con el servidor.");
	}

	if (respuesta.status === 204) {
		return undefined as T;
	}

	const texto = await respuesta.text();
	let cuerpo: unknown = null;
	if (texto) {
		try {
			cuerpo = JSON.parse(texto);
		} catch {
			cuerpo = null;
		}
	}

	if (!respuesta.ok) {
		const mensaje =
			(cuerpo as { message?: string; error?: string } | null)?.message ??
			(cuerpo as { error?: string } | null)?.error ??
			`Error ${respuesta.status}`;
		throw new ErrorApi(respuesta.status, mensaje);
	}

	return cuerpo as T;
}

/** Atajo para las rutas que exigen sesión. */
export function apiConSesion<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
	return api<T>(ruta, { ...opciones, auth: true });
}

export async function apiJson<T>(
	ruta: string,
	metodo: string,
	cuerpo: unknown,
	opciones: Opciones = {},
): Promise<T> {
	return api<T>(ruta, {
		...opciones,
		method: metodo,
		body: JSON.stringify(cuerpo),
	});
}
