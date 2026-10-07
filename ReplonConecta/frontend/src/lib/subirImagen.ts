import { SUPABASE_BUCKET, supabaseConfigurado } from "./env";
import { supabase } from "./supabase";

/*
 * Subida de fotos al bucket de Supabase Storage.
 *
 * Quien sube es el estudiante (rol ADMIN) desde su panel, con su
 * sesión de Supabase Auth — decisión 5 del cuestionario. El navegador
 * habla directo con Storage usando la clave pública (nunca la
 * service_role) y las políticas RLS del bucket son la reja: solo
 * usuarios autenticados pueden escribir en "productos".
 *
 * Adjuntar la URL a un negocio o producto sí pasa por el backend
 * (PUT /api/negocios/{id} y PUT /api/productos/{id}, que exigen ser
 * dueño o admin): el upload solo produce el archivo, el enlace a la
 * base se gana con la sesión de la app.
 *
 * Antes de subir la imagen se redimensiona en el navegador (lado
 * máximo 1280 px, JPEG 82%): un celular moderno saca fotos de 12 MP y
 * sin esto el bucket se llena de archivos que la lista no necesita.
 */

export type CarpetaFotos = "negocios" | "productos";

const LADO_MAXIMO = 1280;
const PESO_MAXIMO = 5 * 1024 * 1024;
const CALIDAD = 0.82;

async function redimensionar(archivo: File): Promise<{ cuerpo: Blob; tipo: string }> {
	try {
		const bitmap = await createImageBitmap(archivo);
		const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));

		if (escala === 1 && archivo.size < 400 * 1024) {
			// Ya es pequeña: se sube tal cual, sin tocar el formato.
			return { cuerpo: archivo, tipo: archivo.type || "image/jpeg" };
		}

		const lienzo = document.createElement("canvas");
		lienzo.width = Math.max(1, Math.round(bitmap.width * escala));
		lienzo.height = Math.max(1, Math.round(bitmap.height * escala));
		const contexto = lienzo.getContext("2d");
		if (!contexto) throw new Error("sin canvas");
		contexto.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
		bitmap.close();

		const cuerpo = await new Promise<Blob | null>((resolver) =>
			lienzo.toBlob(resolver, "image/jpeg", CALIDAD),
		);
		if (!cuerpo) throw new Error("sin blob");
		return { cuerpo, tipo: "image/jpeg" };
	} catch {
		// HEIC u otro formato que el navegador no puede decodificar:
		// se sube el archivo original y que Supabase diga si puede.
		return { cuerpo: archivo, tipo: archivo.type || "image/jpeg" };
	}
}

function extension(tipo: string): string {
	if (tipo.includes("png")) return "png";
	if (tipo.includes("webp")) return "webp";
	return "jpg";
}

/**
 * Sube `archivo` al bucket y devuelve su URL pública.
 *
 * Lanza Error con mensaje listo para mostrarle al estudiante: cada
 * fallo posible (sin configurar, sin sesión, bucket inexistente, RLS)
 * dice qué hacer, no un código crudo de Supabase.
 */
export async function subirImagen(
	carpeta: CarpetaFotos,
	id: string,
	archivo: File,
): Promise<string> {
	if (!supabaseConfigurado) {
		throw new Error(
			"Supabase no está configurado en .env.local (faltan NEXT_PUBLIC_SUPABASE_URL y la clave pública).",
		);
	}
	if (!archivo.type.startsWith("image/")) {
		throw new Error("El archivo debe ser una imagen (JPG, PNG o WebP).");
	}
	if (archivo.size > PESO_MAXIMO) {
		throw new Error("La imagen pesa más de 5 MB: redúcela antes de subirla.");
	}

	const { cuerpo, tipo } = await redimensionar(archivo);
	const ruta = `${carpeta}/${id}/${Date.now()}.${extension(tipo)}`;

	const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(ruta, cuerpo, {
		contentType: tipo,
		cacheControl: "31536000",
		upsert: false,
	});

	if (error) {
		const texto = error.message.toLowerCase();
		if (texto.includes("bucket")) {
			throw new Error(
				`El bucket "${SUPABASE_BUCKET}" no existe en Supabase: créalo como público y repite la subida.`,
			);
		}
		if (texto.includes("row-level security") || texto.includes("policy")) {
			throw new Error(
				"Supabase rechazó la subida: faltan las políticas RLS de escritura del bucket (SQL de las notas del ticket 02).",
			);
		}
		if (texto.includes("unauthorized") || texto.includes("401")) {
			throw new Error("La sesión expiró: sal y vuelve a entrar al panel.");
		}
		throw new Error(`No se pudo subir la imagen: ${error.message}`);
	}

	const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(ruta);
	return data.publicUrl;
}
