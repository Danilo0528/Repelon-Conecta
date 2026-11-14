import type { Metadata } from "next";

import { FeedCultura } from "@/components/FeedCultura";
import { CULTURA } from "@/lib/cultura";

export const metadata: Metadata = {
	title: "Cultura de Repelón | Repelón Conecta",
	description:
		"Publicaciones con fotos y videos de la cultura del municipio de Repelón y sus alrededores.",
};

/*
 * Apartado "Cultura" (/cultura).
 *
 * Página de servidor para el encabezado (título y descripción, estáticos
 * en lib/cultura.ts). El feed de publicaciones es un componente cliente
 * que las pide a la API (GET /api/cultura/publicaciones): todo lo que se
 * ve aquí lo sube el admin desde /admin/contenido. Si el backend no
 * responde, el feed cae en las publicaciones de ejemplo con un aviso;
 * si responde y está vacío, muestra "aún no hay publicaciones".
 *
 * Los videos van embebidos de YouTube con dominio sin cookies
 * (youtube-nocookie.com) o, cuando son archivos subidos al bucket, se
 * reproducen directo con <video>.
 */
export default function Cultura() {
	return (
		<article className="mx-auto max-w-2xl px-4 py-10">
			<p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#006d23" }}>
				Repelón, Atlántico
			</p>
			<h1 className="mt-2 font-sans text-3xl font-extrabold tracking-tight" style={{ color: "#091c31" }}>
				{CULTURA.titulo}
			</h1>

			<div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "#3e4a3d" }}>
				{CULTURA.descripcion.map((parrafo, i) => (
					<p key={i}>{parrafo}</p>
				))}
			</div>

			<section className="mt-10" aria-label="Publicaciones de cultura">
				<h2 className="font-sans text-2xl font-bold" style={{ color: "#091c31" }}>
					Publicaciones
				</h2>
				<p className="mt-1 text-sm" style={{ color: "#3e4a3d" }}>
					Fotos, videos y oficios del municipio, como en un muro. Toca
					una foto para verla en gran tamaño.
				</p>
				<div className="mt-5">
					<FeedCultura ejemplos={CULTURA.publicaciones} />
				</div>
			</section>
		</article>
	);
}
