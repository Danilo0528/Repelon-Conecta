"use client";

import Link from "next/link";

import { RAZONES } from "./contenido";
import type { InicioState } from "./useInicio";

/** Tarjetas de "Para quién sirve" y el cierre con la llamada a registrar. */
export function SeccionRazones({ inicio }: { inicio: InicioState }) {
	const { T } = inicio;

	return (
		<section className="mx-auto max-w-6xl px-4 pt-12">
			<div className="grid gap-6 md:grid-cols-3">
				{RAZONES.map(({ titulo, texto: descripcion, tono, icono }) => (
					<div key={titulo} className="glass rounded-3xl p-6">
						<div
							className={`grid size-11 place-items-center rounded-2xl ${tono}`}
						>
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
						<h3 className="mt-4 font-display text-lg font-semibold text-ink">
							{titulo}
						</h3>
						<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
							{descripcion}
						</p>
					</div>
				))}
			</div>

			<div className="glass mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-leaf/10 via-glass/40 to-azul/10 p-6 md:flex-row">
				<div>
					<h3 className="font-display text-xl font-semibold text-ink">
						{T("inicio.cta.titulo")}
					</h3>
					<p className="text-sm text-muted-foreground">
						{T("inicio.cta.texto")}
					</p>
				</div>
				<Link
					href="/vendedor"
					className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-leaf px-5 py-3 font-semibold text-white shadow-leaf"
				>
					Crear mi tienda gratis
				</Link>
			</div>
		</section>
	);
}
