/*
 * Fotos de los negocios del catálogo.
 *
 * La base de datos trae `logoUrl`, pero en la práctica la mayoría de los
 * comercios del pueblo todavía no sube logo: si la tarjeta se quedara
 * sin foto sería un hueco gris en la mitad de la pantalla. Aquí cada
 * negocio sin logo cae en una foto de su oficio (panadería, droguería,
 * ferretería…) y, si no se reconoce, en la de la tienda genérica.
 *
 * Las fotos viven en /public/img y vienen de la plantilla del diseño.
 */

const FALLAS: { prueba: RegExp; imagen: string }[] = [
	{ prueba: /panad|panader|\bpan\b/i, imagen: "/img/panaderia.jpg" },
	{ prueba: /drogu/i, imagen: "/img/drogueria.jpg" },
	{ prueba: /ferr/i, imagen: "/img/ferreteria.jpg" },
	{ prueba: /camp|agro|product|finca|huerta|frut/i, imagen: "/img/campo.jpg" },
	{ prueba: /servic|sal[oó]n|taller|lavander|repar|mec[aá]nic/i, imagen: "/img/servicios.jpg" },
];

const GENERICA = "/img/tienda.jpg";

/**
 * Normaliza URLs de imagen para que funcionen como <img src>.
 *
 * Imgur: "https://imgur.com/abc123" no sirve como imagen directa;
 * necesita "https://i.imgur.com/abc123.jpg". Las URLs que ya apuntan a
 * i.imgur.com o que no son de Imgur pasan sin tocar.
 */
export function normalizarUrlImagen(url: string): string {
	const t = url.trim();
	// https://imgur.com/XXXXX o http://imgur.com/XXXXX (sin /a/ ni /gallery/)
	const m = t.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
	if (m) return `https://i.imgur.com/${m[1]}.jpg`;
	return t;
}

/** Una URL solo cuenta como logo si es absoluta o una ruta pública. */
function esUrlDeImagen(url: string | null | undefined): url is string {
	const t = url?.trim();
	return Boolean(t && (/^https?:\/\//.test(t) || t.startsWith("/")));
}

/**
 * Foto de respaldo: la del oficio si se reconoce el nombre, la tienda
 * genérica si no. Es la que se usa cuando el negocio no tiene logo y
 * también cuando el logo existe pero la URL ya no responde.
 */
export function fotoRespaldo(nombre: string): string {
	const casa = FALLAS.find((f) => f.prueba.test(nombre));
	return casa?.imagen ?? GENERICA;
}

/**
 * Foto que le toca a un negocio: su logo si lo tiene, la foto de su
 * oficio si se reconoce el nombre, y la tienda genérica si no.
 */
export function fotoNegocio(n: {
	nombre: string;
	logoUrl?: string | null;
}): string {
	const logo = n.logoUrl?.trim();
	if (esUrlDeImagen(logo)) return normalizarUrlImagen(logo);

	return fotoRespaldo(n.nombre);
}

/**
 * Crédito del logo, solo cuando de verdad se está mostrando esa foto.
 * Si el negocio cayó en la foto de respaldo, el crédito del logo no
 * aplica y no debe aparecer.
 */
export function creditoNegocio(n: {
	nombre: string;
	logoUrl?: string | null;
	logoCredito?: string | null;
}): string | null {
	const credito = n.logoCredito?.trim();
	if (!credito || !esUrlDeImagen(n.logoUrl)) return null;
	return credito;
}
