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
	if (logo && (/^https?:\/\//.test(logo) || logo.startsWith("/"))) return logo;

	return fotoRespaldo(n.nombre);
}
