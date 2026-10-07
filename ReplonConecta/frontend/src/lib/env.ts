/*
 * Variables de entorno del frontend.
 *
 * NEXT_PUBLIC_* se incrusta en el bundle del navegador, así que aquí NUNCA
 * puede ir una clave secreta. La service_role de Supabase no se usa en el
 * frontend: la API de negocio es la única que escribe con privilegios.
 */

export const API_URL = (
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
/*
 * Supabase renombró la clave pública: antes "anon key", ahora
 * "publishable key" (sb_publishable_…). Aceptamos los dos nombres para no
 * romper proyectos viejos ni nuevos. Ambas son públicas y van al bundle.
 */
export const SUPABASE_ANON_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
	"";
export const SUPABASE_BUCKET =
	process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "productos";

/*
 * Si faltan las credenciales, la app arranca igual pero muestra un aviso
 * en vez de reventar en blanco: es más fácil de diagnosticar para quien
 * la despliega por primera vez.
 */
export const supabaseConfigurado =
	SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== "";

/*
 * Google Maps: los mapas embebidos de la app (home, búsqueda, ficha de
 * negocio y selector de ubicación del vendedor) usan la API de
 * JavaScript con esta clave.
 *
 * NEXT_PUBLIC_* se incrusta en el bundle, así que la clave es pública
 * por diseño: lo que hay que hacer es restringirla en Google Cloud
 * Console (Credenciales → restricciones de referrer) al dominio donde
 * corre la app; sin eso cualquiera que la lea del bundle gasta cuota
 * del proyecto.
 */
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
export const mapasGoogleConfigurado = GOOGLE_MAPS_API_KEY !== "";

/*
 * Centro del casco urbano de Repelón (Atlántico).
 *
 * Es el punto de partida de "Cómo llegar" cuando el negocio no tiene
 * coordenadas: la ruta nace en el pueblo, que es de donde sale todo
 * el mundo. También es el encuadre inicial del mapa, antes de que
 * entren los pines de los negocios.
 */
export const CENTRO_REPELON = { lat: 10.4944, lng: -75.1242 };
