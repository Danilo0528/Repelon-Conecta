import type { Metadata } from "next";

import { GaleriaCultura } from "@/components/GaleriaCultura";
import { Aviso } from "@/components/ui";
import { CULTURA } from "@/lib/cultura";

export const metadata: Metadata = {
	title: "Cultura de Repelón | Repelón Conecta",
	description:
		"Fotos, videos y una breve descripción de la cultura del municipio de Repelón y sus alrededores.",
};

/*
 * Apartado "Cultura" (/cultura).
 *
 * Página de servidor con contenido estático (lib/cultura.ts): sin
 * llamadas al backend, así carga rápido y se cachea. La galería es un
 * componente cliente (grid + lightbox) y los videos van embebidos de
 * YouTube con dominio sin cookies (youtube-nocookie.com) para no
 * mandar cookies de seguimiento antes de que el vecino los reproduzca.
 *
 * El aviso de "contenido de ejemplo" se borra de aquí cuando
 * lib/cultura.ts tenga el material real del municipio.
 */
export default function Cultura() {
	return (
		<article className="mx-auto max-w-5xl px-4 py-10">
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
					Contenido de ejemplo: la descripción, las fotos y el video son
					provisionales. Reemplázalos por el material real del municipio en{" "}
					<code>src/lib/cultura.ts</code>.
				</Aviso>
			</div>

			<section className="mt-10">
				<h2 className="font-display text-2xl font-semibold text-ink">
					Galería
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Fotos del municipio y sus alrededores. Toca una para verla en
					gran tamaño.
				</p>
				<div className="mt-4">
					<GaleriaCultura fotos={CULTURA.fotos} />
				</div>
			</section>

			{CULTURA.videos.length > 0 && (
				<section className="mt-10">
					<h2 className="font-display text-2xl font-semibold text-ink">
						Videos
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Imágenes en movimiento de la vida del pueblo.
					</p>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						{CULTURA.videos.map((video) => (
							<figure
								key={video.id}
								className="overflow-hidden rounded-2xl border border-black/10 bg-black/[.04]"
							>
								<iframe
									src={`https://www.youtube-nocookie.com/embed/${video.id}`}
									title={video.titulo}
									loading="lazy"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
									className="aspect-video w-full"
								/>
								<figcaption className="px-3 py-2 text-xs text-muted-foreground">
									{video.titulo}
								</figcaption>
							</figure>
						))}
					</div>
				</section>
			)}
		</article>
	);
}
