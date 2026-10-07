/*
 * Sección de Turismo del home.
 *
 * Turismo es una de las tres familias del alcance, pero no vende
 * productos con precio: sus fichas muestran direcciones y zonas, y el
 * "camino" termina en Google Maps (botón dentro de la ventana flotante
 * que se abre al presionar la ficha) o en preguntar en el pueblo.
 *
 * LAS ZONAS VIVEN EN LA BASE (tabla `zonas_turisticas`): el home las
 * lee de GET /api/zonas y el admin las crea/edita/borra desde su
 * panel, usando su ubicación actual para dejar la dirección exacta.
 * LUGARES_TURISMO queda como RESPALDO: si el backend no responde
 * (carga o error) se muestra igual la lista inicial, y si la base
 * queda vacía a propósito la sección no se pinta. Ojo: una zona
 * recién guardada se ve recién al refrescar el home, no en caliente.
 *
 * Las 6 zonas de referencia (VisitAtlántico y prensa local) están en
 * el seed del backend; esta copia es solo el respaldo offline.
 *
 * FOTOS: mientras no lleguen las del cliente, cada ficha muestra una
 * ilustración de fondo según su `motivo`. Cuando haya foto real se
 * pone su dirección en `imagenUrl`: acepta una URL completa
 * (`https://…/foto.jpg`) o un archivo local (`/turismo/foto.jpg`) y
 * la ilustración se apaga sola. Para estudiantes lo más fácil es
 * pegar la URL en el panel; no hay que subir ni editar nada más.
 */

import { enlaceGoogleMaps } from "./maps";
import type { ZonaTuristica } from "./tipos";

/** Tema de la ilustración de respaldo (ver FONDO_MOTIVO en el home). */
export type MotivoTurismo =
	| "agua"
	| "barco"
	| "aves"
	| "naturaleza"
	| "parque"
	| "pueblo";

const MOTIVOS_VALIDOS: readonly string[] = [
	"agua",
	"barco",
	"aves",
	"naturaleza",
	"parque",
	"pueblo",
];

export type LugarTuristico = {
	nombre: string;
	descripcion: string;
	/** Sin precios: acá solo importa dónde queda. */
	direccion: string;
	latitud: number | null;
	longitud: number | null;
	/** Ruta pública de la foto; null = ilustración de respaldo. */
	imagen: string | null;
	motivo: MotivoTurismo;
};

export const LUGARES_TURISMO: LugarTuristico[] = [
	{
		nombre: "Embalse del Guájaro",
		descripcion:
			"El espejo de agua del pueblo: paisaje, pesca artesanal y aves a orillas de Repelón.",
		direccion: "Vía al embalse del Guájaro, oriente de Repelón, Atlántico",
		latitud: null,
		longitud: null,
		imagen: null,
		motivo: "agua",
	},
	{
		nombre: "Caleta de pescadores",
		descripcion:
			"Donde los pescadores desembarcan el día: pescado fresco y canoas sobre el agua.",
		direccion: "Embarcadero de pescadores, embalse del Guájaro, Repelón, Atlántico",
		latitud: null,
		longitud: null,
		imagen: null,
		motivo: "barco",
	},
	{
		nombre: "Avistamiento de aves",
		descripcion:
			"Humedales y ciénagas llenas de aves residentes y migrantes, sobre todo al amanecer.",
		direccion: "Humedales del embalse del Guájaro, Repelón, Atlántico",
		latitud: null,
		longitud: null,
		imagen: null,
		motivo: "aves",
	},
	{
		nombre: "Banco Totumo Bijibana",
		descripcion:
			"Experiencia de reconexión con la naturaleza, impulsada por la alcaldía junto al FOMINDETER.",
		direccion: "Bijibana, Repelón, Atlántico",
		latitud: null,
		longitud: null,
		imagen: null,
		motivo: "naturaleza",
	},
	{
		nombre: "Parque principal",
		descripcion:
			"El centro del pueblo: la plaza, las palmeras y el punto de encuentro de todos los días.",
		direccion: "Parque principal, Centro, Repelón, Atlántico",
		latitud: null,
		longitud: null,
		imagen: null,
		motivo: "parque",
	},
	{
		nombre: "Villa Rosa y San Roque",
		descripcion:
			"El corregimiento de Villa Rosa y sus fiestas patronales en honor a San Roque.",
		direccion: "Villa Rosa, Repelón, Atlántico",
		latitud: null,
		longitud: null,
		imagen: null,
		motivo: "pueblo",
	},
];

/** Enlace "Cómo llegar" de una ficha turística (Google Maps). */
export function enlaceLugar(lugar: LugarTuristico): string {
	return enlaceGoogleMaps(lugar);
}

/**
 * Zona cargada por el estudiante en el panel → ficha del home.
 *
 * `motivo` llega como texto de la base: lo que no coincida con una
 * ilustración conocida (o venga vacío) cae en "pueblo" para que la
 * ficha siempre tenga fondo dibujado.
 */
export function zonaALugar(zona: ZonaTuristica): LugarTuristico {
	const motivo = MOTIVOS_VALIDOS.includes(zona.motivo ?? "")
		? (zona.motivo as MotivoTurismo)
		: "pueblo";

	return {
		nombre: zona.nombre,
		descripcion: zona.descripcion ?? "",
		direccion: zona.direccion,
		latitud: zona.latitud,
		longitud: zona.longitud,
		imagen: zona.imagenUrl,
		motivo,
	};
}
