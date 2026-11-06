/*
 * Contenido del apartado "Cultura" (/cultura).
 *
 * El apartado se presenta como un FEED de publicaciones: cada entrada
 * es un post (autor, lugar, fecha, texto, foto o video) igual que en
 * una red social, en orden del más reciente al más antiguo.
 *
 * ⚠ CONTENIDO DE EJEMPLO: la descripción y las publicaciones de abajo
 * son de relleno para que la página se vea funcionando. Para publicar
 * de verdad:
 *   1. Reescribe la descripción real del municipio.
 *   2. Cambia cada `media` por imágenes propias (/public o Supabase) y
 *      agrega el `credito` de cada foto si sale de una fuente externa.
 *   3. Reemplaza cada `id` de video por el ID real de YouTube (la
 *      parte de la URL después de "v=").
 *   4. Ajusta autor, lugar, fecha y texto de cada publicación.
 *   5. Borra el <Aviso> de ejemplo en src/app/cultura/page.tsx.
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

/** El medio de una publicación: una foto o un video de YouTube. */
export type MediaPublicacion =
	| ({ tipo: "foto" } & FotoCultura)
	| ({ tipo: "video" } & VideoCultura);

/** Una publicación del feed de cultura. */
export type PublicacionCultura = {
	/** ID estable: se usa como ancla (#pub-…) y como clave de "me gusta". */
	id: string;
	/** Quién publica, p. ej. "Repelón Conecta" o una escuela/organización. */
	autor: string;
	/** Lugar o contexto. Si no hay, solo se muestra autor y fecha. */
	lugar?: string;
	/** Fecha de publicación en ISO (yyyy-mm-dd). */
	fecha: string;
	/** Pie de la publicación. */
	texto: string;
	media: MediaPublicacion;
	/** Contador de "me gusta" de partida. */
	meGusta: number;
};

/**
 * Lo que devuelve GET /api/cultura/publicaciones (panel de admin →
 * backend Spring). El feed lo traduce con `aPublicacion` para no
 * mezclar el contrato del servidor con el modelo de pintura.
 */
export type PublicacionCulturaApi = {
	id: string;
	autor: string;
	lugar: string | null;
	/** yyyy-mm-dd. */
	fecha: string;
	texto: string;
	/** "FOTO" o "VIDEO". */
	tipo: string;
	/** URL de la foto, o ID/enlace de YouTube, o URL de archivo .mp4. */
	mediaUrl: string;
	credito: string | null;
};

/** ¿La fuente de video es YouTube (enlace o ID pelado) o un archivo suelto? */
export function esYouTube(fuente: string): boolean {
	const t = fuente.trim();
	return /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(t) || /^[\w-]{6,20}$/.test(t);
}

/** ID de YouTube a partir de un enlace (v=, youtu.be, shorts, embed) o del ID pelado. */
export function idYouTube(fuente: string): string {
	const m = fuente.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,20})/);
	return m ? m[1] : fuente.trim();
}

/** Fila del backend → publicación lista para pintar. */
export function aPublicacion(p: PublicacionCulturaApi): PublicacionCultura {
	return {
		id: p.id,
		autor: p.autor,
		lugar: p.lugar ?? undefined,
		fecha: p.fecha,
		texto: p.texto,
		// El backend no guarda "me gusta": el contador nace en 0 y crece
		// en el navegador de quien pulsa el corazón.
		meGusta: 0,
		media:
			p.tipo === "VIDEO"
				? { tipo: "video", id: p.mediaUrl, titulo: p.texto }
				: {
						tipo: "foto",
						src: p.mediaUrl,
						alt: p.texto,
						credito: p.credito ?? undefined,
					},
	};
}

export const CULTURA = {
	titulo: "Cultura de Repelón",
	descripcion: [
		"Repelón vive en el campo y en la plaza: el agro marca el calendario, la música y la danza se heredan de generación en generación, y las fiestas reúnen a los vecinos del municipio y de sus alrededores.",
		"Este feed reúne fotos y videos de esa vida cotidiana —oficios, celebraciones y tradiciones— para que quien llegue conozca un poco el pueblo antes de recorrerlo.",
	],

	/* PUBLICACIONES DE EJEMPLO: el más reciente va primero. */
	publicaciones: [
		{
			id: "fiesta-junina",
			autor: "Repelón Conecta",
			lugar: "Plaza del municipio",
			fecha: "2026-06-27",
			texto:
				"Noche de fiestas juninas en la plaza: la cuadrilla de danza del pueblo cerró la velada con la herencia que se baila de generación en generación.",
			media: {
				tipo: "foto",
				src: "/img/hero-campo.png",
				alt: "Paisaje rural del municipio durante la temporada de fiestas (foto de ejemplo)",
			},
			meGusta: 48,
		},
		{
			id: "panaderia-amanecer",
			autor: "Repelón Conecta",
			lugar: "Casco urbano",
			fecha: "2026-06-14",
			texto:
				"Antes de que amanezca, la panadería del pueblo ya huele a pan. El oficio empieza de madrugada para que el desayuno del vecino nunca falte.",
			media: {
				tipo: "foto",
				src: "/img/panaderia.jpg",
				alt: "Oficio de la panadería del pueblo (foto de ejemplo)",
			},
			meGusta: 35,
		},
		{
			id: "video-campo",
			autor: "Repelón Conecta",
			lugar: "Veredas de Repelón",
			fecha: "2026-06-02",
			texto:
				"Así se ve el campo en movimiento: una mirada rápida a la vida del municipio y sus alrededores.",
			media: {
				tipo: "video",
				id: "jNQXAC9IVRw",
				titulo: "Video de ejemplo (reemplazar)",
			},
			meGusta: 27,
		},
		{
			id: "siembra-campo",
			autor: "Repelón Conecta",
			lugar: "Afueras de Repelón",
			fecha: "2026-05-21",
			texto:
				"El calendario del pueblo lo marca la siembra. Cultivos en las afueras, como cada temporada.",
			media: {
				tipo: "foto",
				src: "/img/campo.jpg",
				alt: "Cultivos del campo a las afueras de Repelón (foto de ejemplo)",
			},
			meGusta: 41,
		},
		{
			id: "comercio-casco",
			autor: "Repelón Conecta",
			lugar: "Centro",
			fecha: "2026-05-10",
			texto:
				"La tienda del centro es también lugar de encuentro: aquí se comenta el día y se arma la vecindad.",
			media: {
				tipo: "foto",
				src: "/img/tienda.jpg",
				alt: "Comercio del casco urbano (foto de ejemplo)",
			},
			meGusta: 22,
		},
		{
			id: "taller-servicios",
			autor: "Repelón Conecta",
			lugar: "Repelón",
			fecha: "2026-04-28",
			texto:
				"Oficios que mantienen el pueblo en marcha: el taller de servicios del municipio.",
			media: {
				tipo: "foto",
				src: "/img/servicios.jpg",
				alt: "Taller de servicios del municipio (foto de ejemplo)",
			},
			meGusta: 19,
		},
	] satisfies PublicacionCultura[],
};
