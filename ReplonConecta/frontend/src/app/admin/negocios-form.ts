import type { NegocioDetalle, Producto } from "@/lib/tipos";

/*
 * Piezas puras del módulo Negocios: el formulario del modal, su
 * conversión a cuerpo de API y los formularios vacíos. Vive fuera del
 * componente para poder leerlo sin atravesar 900 líneas de JSX.
 */

export type FiltroNegocios = "todos" | "pendientes" | "aprobados";

/** Datos del formulario del modal (compartido entre crear y editar). */
export type FormNegocio = {
	nombre: string;
	descripcion: string;
	direccion: string;
	barrio: string;
	latitud: string;
	longitud: string;
	telefono: string;
	whatsapp: string;
	horario: string;
	logoUrl: string;
};

export const FORM_VACIO: FormNegocio = {
	nombre: "",
	descripcion: "",
	direccion: "",
	barrio: "",
	latitud: "",
	longitud: "",
	telefono: "",
	whatsapp: "",
	horario: "",
	logoUrl: "",
};

/** Formulario de nuevo producto (dentro del modal de edición). */
export type FormProducto = {
	nombre: string;
	precio: string;
	unidad: string;
	descripcion: string;
	categoriaId: string;
	stock: string;
	imagenUrl: string;
};

export const PRODUCTO_VACIO: FormProducto = {
	nombre: "",
	precio: "",
	unidad: "KILO",
	descripcion: "",
	categoriaId: "",
	stock: "",
	imagenUrl: "",
};

/** Texto de un input numérico opcional a número o null. */
export function aNumero(texto: string): number | null {
	const t = texto.trim();
	if (!t) return null;
	const n = Number(t);
	return Number.isFinite(n) ? n : null;
}

/** Vuelca la ficha completa en el formulario de edición. */
export function formDesdeDetalle(d: NegocioDetalle): FormNegocio {
	return {
		nombre: d.nombre,
		descripcion: d.descripcion ?? "",
		direccion: d.direccion,
		barrio: d.barrio ?? "",
		latitud: d.latitud != null ? String(d.latitud) : "",
		longitud: d.longitud != null ? String(d.longitud) : "",
		telefono: d.telefono ?? "",
		whatsapp: d.whatsapp ?? "",
		horario: d.horario ?? "",
		logoUrl: d.logoUrl ?? "",
	};
}

/**
 * Cuerpo de POST/PUT del negocio. El logo solo viaja al crear: en la
 * edición tiene su propio campo y se guarda aparte con `aplicarLogo`
 * para no pisar la imagen si el usuario cambia otros datos.
 */
export function cuerpoNegocio(form: FormNegocio, conLogo: boolean): string {
	const cuerpo: Record<string, unknown> = {
		nombre: form.nombre.trim(),
		descripcion: form.descripcion.trim() || null,
		direccion: form.direccion.trim(),
		barrio: form.barrio.trim() || null,
		latitud: aNumero(form.latitud),
		longitud: aNumero(form.longitud),
		telefono: form.telefono.trim() || null,
		whatsapp: form.whatsapp.trim() || null,
		horario: form.horario.trim() || null,
	};

	if (conLogo) {
		cuerpo.logoUrl = form.logoUrl.trim() || null;
	}

	return JSON.stringify(cuerpo);
}

/** PUT de producto: reenvía todos los campos y cambia solo la foto. */
export function cuerpoFotoProducto(p: Producto, imagenUrl: string): string {
	return JSON.stringify({
		nombre: p.nombre,
		descripcion: p.descripcion,
		precio: p.precio,
		unidad: p.unidad,
		imagenUrl,
		categoriaId: p.categoriaId,
		disponible: p.disponible,
		stock: p.stock,
	});
}
