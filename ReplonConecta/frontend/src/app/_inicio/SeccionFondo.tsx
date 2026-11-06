"use client";

import Link from "next/link";

import { FONDO_EMPRENDER } from "./contenido";
import type { InicioState } from "./useInicio";

/**
 * La ayuda del SENA, contada en la casa: no es un trámite de la
 * plataforma (eso vive en /fondo-emprender) pero el que está por montar
 * su negocio tiene que enterarse acá.
 */
export function SeccionFondo({ inicio }: { inicio: InicioState }) {
	const { T } = inicio;

	return (
		<section id="fondo-emprender" className="mx-auto max-w-6xl px-4 pt-12">
			<div className="glass rounded-3xl bg-gradient-to-br from-azul/10 via-glass/40 to-leaf/10 p-6 md:p-8">
				<div className="flex flex-wrap items-center gap-2">
					<span className="rounded-full bg-azul/15 px-2.5 py-1 text-xs font-semibold text-azul">
						Programa del SENA
					</span>
					<span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold text-leaf">
						Sin intereses
					</span>
				</div>

				<h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
					{T("inicio.fondo.titulo")}
				</h2>
				<p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
					{T("inicio.fondo.texto")}
				</p>

				<div className="mt-5 grid gap-4 sm:grid-cols-3">
					{FONDO_EMPRENDER.map(({ titulo, texto, icono }) => (
						<div key={titulo} className="rounded-2xl bg-glass/70 p-4">
							<div className="grid size-10 place-items-center rounded-xl bg-azul/10 text-azul">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden
								>
									{icono}
								</svg>
							</div>
							<h3 className="mt-3 font-display text-base font-semibold text-ink">
								{titulo}
							</h3>
							<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
								{texto}
							</p>
						</div>
					))}
				</div>

				<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
					<Link
						href="/fondo-emprender"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-azul px-5 py-3 text-center font-semibold text-white"
					>
						Conocer el Fondo Emprender
					</Link>
					<a
						href="https://www.fondoemprender.com/"
						target="_blank"
						rel="noreferrer"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-azul/30 px-5 py-3 text-center font-semibold text-azul"
					>
						Sitio oficial del SENA
					</a>
					<p className="text-xs leading-relaxed text-muted-foreground">
						La postulación es directamente con el SENA: aquí no se
						cobra nada por postular.
					</p>
				</div>
			</div>
		</section>
	);
}
