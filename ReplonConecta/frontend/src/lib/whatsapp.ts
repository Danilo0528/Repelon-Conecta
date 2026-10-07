/*
 * Enlaces de WhatsApp del flujo de intermediación: la app no vende ni
 * consulta, el trato se cierra en el chat del dueño. Todo enlace pasa
 * por aqui para que el numero se limpie igual en todas partes y el
 * mensaje precargado se escriba una sola vez.
 */

/** wa.me/<solo-digitos> con mensaje opcional ya codificado. */
export function enlaceWhatsApp(numero: string, mensaje?: string): string {
	const limpio = numero.replace(/\D/g, "");
	const base = `https://wa.me/${limpio}`;
	return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/**
 * Mensaje que el vecino manda al dueño. Si vino de un resultado de
 * búsqueda, el producto va nombrado: el dueño sabe de qué le hablan
 * antes de contestar.
 */
export function mensajeConsulta(
	negocio: string,
	producto?: string | null,
): string {
	if (producto) {
		return `Hola, vi "${producto}" en ${negocio} (Repelón Conecta). ¿Sigue disponible?`;
	}
	return `Hola, ¿me atienden? Les escribo por ${negocio} (Repelón Conecta).`;
}
