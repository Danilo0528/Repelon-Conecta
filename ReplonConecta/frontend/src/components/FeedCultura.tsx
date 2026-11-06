"use client";

import { useMemo, useState } from "react";

import { LightboxGaleria } from "@/components/LightboxGaleria";
import { Aviso, Foto, FuenteImagen, Vacio } from "@/components/ui";
import { api } from "@/lib/api";
import {
	aPublicacion,
	esYouTube,
	idYouTube,
	type FotoCultura,
	type MediaPublicacion,
	type PublicacionCultura,
	type PublicacionCulturaApi,
} from "@/lib/cultura";
import { useDatos } from "@/lib/useDatos";

/*
 * Feed de Cultura: las publicaciones del apartado /cultura.
 *
 * Los datos vienen del backend (GET /api/cultura/publicaciones), que es
 * lo que carga el admin desde su panel. Si el servidor no responde, el
 * feed cae en las publicaciones de ejemplo de lib/cultura.ts con un
 * aviso; si responde vacío, muestra el estado "aún no hay nada" — así
 * nunca queda una pantalla en blanco ni se confunde "sin conexión"
 * con "el admin todavía no subió nada".
 *
 * Cada entrada es una tarjeta con autor, lugar, fecha, pie, medio y una
 * fila de acciones (me gusta + compartir), igual que el muro de una red
 * social. La tarjeta es un <article> con id estable (#pub-…) para poder
 * enlazar una publicación concreta desde fuera.
 *
 * Las fotos se abren en el mismo lightbox de siempre, pero recorriendo
 * solo las publicaciones con foto (los videos no entran al lightbox).
 * El contador de "me gusta" es local: no hay backend detrás, así que
 * suma y resta en el navegador y vuelve al valor inicial al recargar.
 */

const esFoto = (media: MediaPublicacion): media is { tipo: "foto" } & FotoCultura =>
	media.tipo === "foto";

/** Iniciales del autor para el avatar: "Repelón Conecta" -> "RC". */
function iniciales(autor: string): string {
	return autor
		.split(/\s+/)
		.map((palabra) => palabra[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/*
 * Fecha del feed sin hora: el backend manda "yyyy-mm-dd" (medianoche
 * UTC) y formatear eso en hora de Bogotá correría el día para atrás
 * (las 7 p.m. del día anterior). Se formatea en UTC para que el día en
 * pantalla sea el día que escribió el admin.
 */
function fechaCorta(iso: string): string {
	const fecha = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
	return new Intl.DateTimeFormat("es-CO", {
		dateStyle: "medium",
		timeZone: "UTC",
	}).format(fecha);
}

export function FeedCultura({ ejemplos }: { ejemplos: PublicacionCultura[] }) {
	const { datos, cargando, error } = useDatos<PublicacionCulturaApi[]>(() =>
		api<PublicacionCulturaApi[]>("/api/cultura/publicaciones"),
	);

	const [abierta, setAbierta] = useState<number | null>(null);
	const [meGusta, setMeGusta] = useState<Record<string, boolean>>({});
	const [copiado, setCopiado] = useState<string | null>(null);

	/* Mientras carga o si el servidor falla, se ve el feed de ejemplo. */
	const usandoEjemplos = datos == null;
	const publicaciones = useMemo(
		() => (datos ? datos.map(aPublicacion) : ejemplos),
		[datos, ejemplos],
	);

	/* Solo las publicaciones con foto, en orden, para el lightbox. */
	const fotos = useMemo(
		() =>
			publicaciones
				.filter((pub) => esFoto(pub.media))
				.map((pub) => pub.media as { tipo: "foto" } & FotoCultura),
		[publicaciones],
	);

	if (cargando) {
		return (
			<div className="space-y-6" role="status" aria-live="polite">
				{Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="glass animate-pulse rounded-3xl">
						<div className="flex items-center gap-3 p-4">
							<div className="size-10 rounded-full bg-black/10" />
							<div className="h-3 w-32 rounded bg-black/10" />
						</div>
						<div className="mx-4 mb-4 aspect-[4/3] rounded-2xl bg-black/10" />
					</div>
				))}
				<span className="sr-only">Cargando publicaciones…</span>
			</div>
		);
	}

	/* El servidor respondió y no hay nada: el admin aún sube contenido. */
	if (!usandoEjemplos && publicaciones.length === 0) {
		return (
			<div className="rounded-3xl border border-black/10 bg-white">
				<Vacio
					titulo="Aún no hay publicaciones"
					texto="El apartado de Cultura se llena desde el panel de administración."
				/>
			</div>
		);
	}

	const alternarGusto = (id: string) =>
		setMeGusta((previo) => ({ ...previo, [id]: !previo[id] }));

	const compartir = async (id: string) => {
		const url = `${window.location.origin}/cultura#pub-${id}`;
		try {
			if (navigator.share) {
				await navigator.share({ title: "Cultura de Repelón", url });
				return;
			}
			await navigator.clipboard.writeText(url);
			setCopiado(id);
			setTimeout(() => setCopiado((actual) => (actual === id ? null : actual)), 2000);
		} catch {
			/* Compartir cancelado o portapapeles no disponible: no pasa nada. */
		}
	};

	return (
		<>
			{error && (
				<div className="mb-5">
					<Aviso tono="info">
						No se pudo conectar con el servidor: se muestran publicaciones de
						ejemplo de <code>src/lib/cultura.ts</code>.
					</Aviso>
				</div>
			)}

			<ul className="space-y-6">
				{publicaciones.map((pub) => {
					const media = pub.media;
					const conFoto = esFoto(media);
					const indiceFoto = conFoto
						? fotos.indexOf(media as { tipo: "foto" } & FotoCultura)
						: -1;
					const gusto = Boolean(meGusta[pub.id]);
					const totalGustos = pub.meGusta + (gusto ? 1 : 0);

					return (
						<li key={pub.id}>
							<article
								id={`pub-${pub.id}`}
								className="glass scroll-mt-24 overflow-hidden rounded-3xl"
							>
								{/* Cabecera: avatar + autor + lugar · fecha */}
								<header className="flex items-center gap-3 px-4 pt-4">
									<span
										aria-hidden
										className="flex size-10 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-sm font-semibold text-leaf"
									>
										{iniciales(pub.autor)}
									</span>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-ink">
											{pub.autor}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{pub.lugar ? `${pub.lugar} · ` : ""}
											{fechaCorta(pub.fecha)}
										</p>
									</div>
								</header>

								{/* Pie de la publicación */}
								<p className="px-4 pt-3 text-sm leading-relaxed text-ink/90">
									{pub.texto}
								</p>

								{/* Medio: foto (abre lightbox) o video (YouTube o archivo) */}
								<div className="mt-3">
									{media.tipo === "foto" ? (
										<>
											<button
												type="button"
												onClick={() => setAbierta(indiceFoto)}
												aria-label={`Ampliar: ${media.alt}`}
												className="block w-full transition hover:opacity-95 active:scale-[.995]"
											>
												<Foto
													src={media.src}
													alt={media.alt}
													className="aspect-[4/3] w-full"
												/>
											</button>
											<FuenteImagen
												credito={media.credito}
												className="mt-1.5 px-4"
											/>
										</>
									) : media.tipo === "video" ? (
										esYouTube(media.id) ? (
											<figure className="aspect-video w-full bg-black">
												<iframe
													src={`https://www.youtube-nocookie.com/embed/${idYouTube(media.id)}`}
													title={media.titulo}
													loading="lazy"
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
													allowFullScreen
													className="h-full w-full"
												/>
											</figure>
										) : (
											/* Archivo suelto (mp4/webm) subido al bucket. */
											<video
												src={media.id}
												controls
												loop
												playsInline
												preload="metadata"
												className="aspect-video w-full bg-black object-contain"
											/>
										)
									) : null}
								</div>

								{/* Acciones: me gusta + compartir */}
								<div className="flex items-center gap-1 px-2 py-2">
									<button
										type="button"
										aria-pressed={gusto}
										aria-label={`Me gusta: ${totalGustos} ${
											gusto ? "(incluye el tuyo)" : ""
										}`.trim()}
										onClick={() => alternarGusto(pub.id)}
										className={`flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition hover:bg-black/5 active:scale-95 ${
											gusto ? "text-peligro" : "text-muted-foreground"
										}`}
									>
										<svg
											className="h-5 w-5"
											viewBox="0 0 24 24"
											fill={gusto ? "currentColor" : "none"}
											stroke="currentColor"
											strokeWidth="1.8"
											aria-hidden
										>
											<path
												d="M12 21s-7.5-4.7-9.6-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.6 12c-2.1 4.3-9.6 9-9.6 9z"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="tabular-nums">{totalGustos}</span>
									</button>

									<button
										type="button"
										onClick={() => compartir(pub.id)}
										className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-black/5 active:scale-95"
									>
										<svg
											className="h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
											aria-hidden
										>
											<path
												d="M10 13a5 5 0 0 0 7.1.1l2.8-2.8a5 5 0 0 0-7.1-7.1L11.5 4.5"
												strokeLinecap="round"
											/>
											<path
												d="M14 11a5 5 0 0 0-7.1-.1l-2.8 2.8a5 5 0 0 0 7.1 7.1l1.3-1.3"
												strokeLinecap="round"
											/>
										</svg>
										{copiado === pub.id ? "Copiado" : "Compartir"}
									</button>
								</div>
							</article>
						</li>
					);
				})}
			</ul>

			{abierta != null && (
				<LightboxGaleria
					fotos={fotos}
					indice={abierta}
					onIndice={setAbierta}
					onCerrar={() => setAbierta(null)}
				/>
			)}
		</>
	);
}
