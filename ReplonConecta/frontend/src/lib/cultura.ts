/*
 * Contenido del apartado "Cultura" (/cultura).
 *
 * ⚠ CONTENIDO DE EJEMPLO: la descripción, las fotos y el video de
 * abajo son de relleno para que la página se vea funcionando. Para
 * publicar de verdad:
 *   1. Reescribe la descripción real del municipio.
 *   2. Cambia `fotos` por imágenes propias (/public/img o Supabase) y
 *      agrega el `credito` de cada una si sale de una fuente externa.
 *   3. Reemplaza cada `id` de video por el ID real de YouTube (la
 *      parte de la URL después de "v=").
 *   4. Borra el <Aviso> de ejemplo en src/app/cultura/page.tsx.
 */

/** Una foto de la galería de cultura. */
export type FotoCultura = {
	src: string;
	alt: string;
	/** Autor/fuente de la foto. Si no hay, no se muestra crédito. */
	credito?: string;
};

/** Un video embebido de YouTube (por ID, no por URL completa). */
export type VideoCultura = {
	id: string;
	titulo: string;
};

export const CULTURA = {
	titulo: "Cultura de Repelón",
	descripcion: [
		"Repelón vive en el campo y en la plaza: el agro marca el calendario, la música y la danza se heredan de generación en generación, y las fiestas reúnen a los vecinos del municipio y de sus alrededores.",
		"Este apartado reúne fotos y videos de esa vida cotidiana —oficios, celebraciones y tradiciones— para que quien llegue conozca un poco el pueblo antes de recorrerlo.",
	],

	/* FOTOS DE EJEMPLO: son las imágenes que ya trae el proyecto. */
	fotos: [
		{
			src: "/img/campo.jpg",
			alt: "Cultivos del campo a las afueras de Repelón (foto de ejemplo)",
		},
		{
			src: "/img/hero-campo.png",
			alt: "Paisaje rural del municipio (foto de ejemplo)",
		},
		{
			src: "/img/panaderia.jpg",
			alt: "Oficio de la panadería del pueblo (foto de ejemplo)",
		},
		{
			src: "/img/tienda.jpg",
			alt: "Comercio del casco urbano (foto de ejemplo)",
		},
		{
			src: "/img/servicios.jpg",
			alt: "Taller de servicios del municipio (foto de ejemplo)",
		},
	] satisfies FotoCultura[],

	/* VIDEO DE EJEMPLO: reemplazar por videos reales del municipio. */
	videos: [
		{ id: "jNQXAC9IVRw", titulo: "Video de ejemplo (reemplazar)" },
	] satisfies VideoCultura[],
};
