"use client";

import Link from "next/link";

import { RAZONES } from "./contenido";
import type { InicioState } from "./useInicio";

export function SeccionRazones({ inicio }: { inicio: InicioState }) {
	const { T } = inicio;

	return (
		<section className="w-full py-10 md:py-16" style={{ background: "#e5eeff" }}>
			<div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">

				{/* 3 beneficios */}
				<div className="mb-8 grid gap-4 sm:grid-cols-3">
					{RAZONES.map(({ titulo, texto, tono, icono }) => (
						<div key={titulo}
							className="flex items-center gap-4 rounded-xl p-5 shadow-sm"
							style={{ background: "#fff" }}>
							<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tono}`}>
								<svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
									{icono}
								</svg>
							</div>
							<div>
								<h4 className="text-[16px] font-bold" style={{ color: "#091c31" }}>{titulo}</h4>
								<p className="text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>{texto}</p>
							</div>
						</div>
					))}
				</div>

				{/* CTA final — banner verde */}
				<div className="flex flex-col items-center justify-between gap-6 rounded-2xl p-6 shadow-lg md:flex-row md:p-10"
					style={{ background: "#006d23" }}>
					<div className="max-w-xl text-center md:text-left">
						<p className="mb-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: "#6fdd79" }}>
							Únete a Repelón Conecta
						</p>
						<h3 className="mb-1 font-sans text-[1.5rem] font-bold text-white">
							{T("inicio.cta.titulo")}
						</h3>
						<p className="text-[14px]" style={{ color: "rgba(255,255,255,0.85)" }}>
							{T("inicio.cta.texto")} 100% gratuito.
						</p>
					</div>
					<Link href="/vendedor"
						className="inline-flex shrink-0 items-center gap-2 rounded-lg px-8 py-3.5 text-[14px] font-bold shadow-md transition hover:brightness-105"
						style={{ background: "#fff", color: "#006d23" }}>
						<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
							<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
							<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" /><circle cx="12" cy="12" r="2" />
						</svg>
						Crear mi tienda gratis
					</Link>
				</div>
			</div>
		</section>
	);
}
