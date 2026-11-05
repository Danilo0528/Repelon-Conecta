/*
 * Créditos / derechos de autor de las imágenes de terceros.
 *
 * Aquí se registran las fotos que no son nuestras: las que salieron
 * de Google u otra fuente, con su autor y de dónde se sacaron. El
 * pie siempre muestra el aviso general de derechos; el crédito
 * puntual de cada imagen aparece (en el hero y en el pie) solo
 * cuando está puesto aquí. Una imagen sin entrada no muestra nada.
 *
 * Cómo agregar uno: copia la clave exacta de la imagen (la ruta en
 * /public/img o la URL completa tal cual se carga) y escribe el
 * crédito entre comillas:
 *
 *   "/img/hero.jpg": "Foto: María López · Google Images",
 */

export const CREDITOS_IMAGENES: Record<string, string> = {
	// "/img/hero.jpg": "",
	// "/img/campo.jpg": "",
};

/** Crédito de una imagen, o null si no tiene (o quedó vacío). */
export function creditoImagen(src: string): string | null {
	const texto = CREDITOS_IMAGENES[src]?.trim();
	return texto ? texto : null;
}

/** Todos los créditos registrados, para listarlos en el pie. */
export function listaCreditos(): { imagen: string; credito: string }[] {
	return Object.entries(CREDITOS_IMAGENES)
		.map(([imagen, credito]) => ({ imagen, credito: credito.trim() }))
		.filter(({ credito }) => credito !== "");
}
