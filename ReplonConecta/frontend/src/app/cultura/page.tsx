import type { Metadata } from "next";

import { FeedCultura } from "@/components/FeedCultura";
import { Aviso } from "@/components/ui";
import { CULTURA } from "@/lib/cultura";

export const metadata: Metadata = {
	title: "Cultura de Repelón | Repelón Conecta",
	description:
		"Publicaciones con fotos y videos de la cultura del municipio de Repelón y sus alrededores.",
};

/*
 * Apartado "Cultura" (/cultura).
 *
 * Página de servidor con contenido estático (lib/cultura.ts): sin
 * llamadas al backend, así carga rápido y se cachea. El feed de
 * publicaciones es un componente cliente (tarjetas + lightbox + me
 * gusta/compartir) y los videos van embebidos de YouTube con dominio
 * sin cookies (youtube-nocookie.com) para no mandar cookies de
 * seguimiento antes de que el vecino los reproduzca.
 *
 * El aviso de "contenido de ejemplo" se borra de aquí cuando
 * lib/cultura.ts tenga el material real del municipio.
 */
export default function Cultura() {
	return (
		<article className="mx-auto max-w-2xl px-4 py-10">
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
				Repelón, Atlántico
			</p>
			<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
				{CULTURA.titulo}
			</h1>

			<div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/90">
				{CULTURA.descripcion.map((parrafo, i) => (
					<p key={i}>{parrafo}</p>
				))}
			</div>

			<div className="mt-5">
				<Aviso tono="info">
					Contenido de ejemplo: la descripción y las publicaciones son
					provisionales. Reemplázalas por el material real del municipio en{" "}
					<code>src/lib/cultura.ts</code>.
				</Aviso>
			</div>

			<section className="mt-10" aria-label="Publicaciones de cultura">
				<h2 className="font-display text-2xl font-semibold text-ink">
					Publicaciones
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Fotos, videos y oficios del municipio, como en un muro. Toca
					una foto para verla en gran tamaño.
				</p>
				<div className="mt-5">
					<FeedCultura publicaciones={CULTURA.publicaciones} />
				</div>
			</section>
		</article>
	);
}
