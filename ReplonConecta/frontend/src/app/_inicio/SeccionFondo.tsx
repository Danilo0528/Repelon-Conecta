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
		<section id="fondo-emprender" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-6 sm:pt-8 md:pt-12">
			<div className="glass rounded-3xl bg-gradient-to-br from-azul/10 via-glass/40 to-leaf/10 p-4 sm:p-6 md:p-8">
				<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
					<span className="rounded-full bg-azul/15 px-2.5 py-1 text-[11px] font-semibold text-azul sm:text-xs">
						Programa del SENA
					</span>
					<span className="rounded-full bg-leaf/15 px-2.5 py-1 text-[11px] font-semibold text-leaf sm:text-xs">
						Sin intereses
					</span>
				</div>

				<h2 className="mt-2 font-display text-xl font-semibold text-ink sm:mt-3 sm:text-2xl md:text-3xl">
					{T("inicio.fondo.titulo")}
				</h2>
				<p className="mt-1.5 max-w-2xl text-sm leading-snug text-muted-foreground sm:mt-2 sm:leading-relaxed">
					{T("inicio.fondo.texto")}
				</p>

				<div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4">
					{FONDO_EMPRENDER.map(({ titulo, texto, icono }) => (
						<div key={titulo} className="rounded-2xl bg-glass/70 p-3.5 sm:p-4">
							<div className="grid size-9 place-items-center rounded-xl bg-azul/10 text-azul sm:size-10">
								<svg
									viewBox="0 0 24 24"
									className="size-4 sm:size-5"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden
								>
									{icono}
								</svg>
							</div>
							<h3 className="mt-2 font-display text-[15px] font-semibold text-ink sm:mt-3 sm:text-base">
								{titulo}
							</h3>
							<p className="mt-0.5 text-[13px] leading-snug text-muted-foreground sm:mt-1 sm:text-sm sm:leading-relaxed">
								{texto}
							</p>
						</div>
					))}
				</div>

				<div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:gap-3">
					<Link
						href="/fondo-emprender"
						className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-azul px-4 py-2.5 text-center text-sm font-semibold text-white sm:min-h-12 sm:px-5 sm:py-3 sm:text-base"
					>
						Conocer el Fondo Emprender
					</Link>
					<a
						href="https://www.fondoemprender.com/"
						target="_blank"
						rel="noreferrer"
						className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-azul/30 px-4 py-2.5 text-center text-sm font-semibold text-azul sm:min-h-12 sm:px-5 sm:py-3 sm:text-base"
					>
						Sitio oficial del SENA
					</a>
					<p className="text-xs leading-relaxed text-muted-foreground sm:max-w-xs">
						La postulación es directamente con el SENA: aquí no se
						cobra nada por postular.
					</p>
				</div>
			</div>
		</section>
	);
}
