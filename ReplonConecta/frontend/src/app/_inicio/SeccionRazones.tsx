"use client";

import Link from "next/link";

import { RAZONES } from "./contenido";
import type { InicioState } from "./useInicio";

/** Tarjetas de "Para quién sirve" y el cierre con la llamada a registrar. */
export function SeccionRazones({ inicio }: { inicio: InicioState }) {
	const { T } = inicio;

	return (
		<section className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8 md:pt-12">
			<div className="grid gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6">
				{RAZONES.map(({ titulo, texto: descripcion, tono, icono }) => (
					<div key={titulo} className="glass rounded-3xl p-4 sm:p-5 md:p-6">
						<div
							className={`grid size-10 place-items-center rounded-2xl sm:size-11 ${tono}`}
						>
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
						<h3 className="mt-3 font-display text-base font-semibold text-ink sm:mt-4 sm:text-lg">
							{titulo}
						</h3>
						<p className="mt-1 text-[13px] leading-snug text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-relaxed">
							{descripcion}
						</p>
					</div>
				))}
			</div>

			<div className="glass mt-4 flex flex-col items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-leaf/10 via-glass/40 to-azul/10 p-4 text-center sm:mt-6 sm:gap-4 sm:p-5 md:mt-8 md:flex-row md:p-6 md:text-left">
				<div>
					<h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
						{T("inicio.cta.titulo")}
					</h3>
					<p className="mt-0.5 text-sm text-muted-foreground">
						{T("inicio.cta.texto")}
					</p>
				</div>
				<Link
					href="/vendedor"
					className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-white shadow-leaf sm:min-h-12 sm:w-auto sm:px-5 sm:py-3 sm:text-base"
				>
					Crear mi tienda gratis
				</Link>
			</div>
		</section>
	);
}
