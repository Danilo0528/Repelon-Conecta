"use client";

import Link from "next/link";

import type { InicioState } from "./useInicio";

export function SeccionFondo({ inicio }: { inicio: InicioState }) {
	const { T } = inicio;

	return (
		<section id="fondo-emprender" className="w-full py-10 md:py-16" style={{ background: "#fbfbf9" }}>
			<div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">

				{/* Contenedor institucional */}
				<div className="relative overflow-hidden rounded-2xl p-6 shadow-md md:p-10"
					style={{ background: "linear-gradient(135deg, #eff4ff 0%, #e5eeff 50%, #dbe9ff 100%)" }}>

					{/* Icono de marca de agua */}
					<svg viewBox="0 0 24 24" className="pointer-events-none absolute -bottom-10 -right-10 size-64 opacity-5 select-none" fill="none" stroke="#006d23" strokeWidth="1" aria-hidden>
						<circle cx="12" cy="12" r="8" /><path d="M12 7v5M12 16h.01" strokeLinecap="round" />
					</svg>

					{/* Badges */}
					<div className="mb-4 flex flex-wrap items-center gap-2">
						<span className="rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-white"
							style={{ background: "#078930" }}>
							Programa Oficial del SENA
						</span>
						<span className="rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider"
							style={{ background: "#ffdea7", color: "#271900" }}>
							Recursos Condonables · Sin intereses
						</span>
					</div>

					<h2 className="mb-2 max-w-3xl font-sans text-[1.75rem] font-extrabold tracking-tight md:text-[2rem]"
						style={{ color: "#091c31" }}>
						{T("inicio.fondo.titulo")}
					</h2>
					<p className="mb-8 max-w-2xl text-[16px] leading-relaxed" style={{ color: "#3e4a3d" }}>
						{T("inicio.fondo.texto")} Si cumples los objetivos acordados, no devuelves el dinero.
					</p>

					{/* 3 pilares */}
					<div className="mb-8 grid gap-4 sm:grid-cols-3">
						{[
							{
								titulo: "Capital semilla",
								texto: "Recursos para maquinaria, herramientas o insumos. Cumpliendo las metas, se condonan en su totalidad.",
								bg: "#d2e4ff", icon: "💰",
							},
							{
								titulo: "Ruta Emprendedora",
								texto: "Orientadores certificados del SENA te acompañan paso a paso para formular tu plan, sin costo.",
								bg: "#8bfb92", icon: "🗺️",
							},
							{
								titulo: "Postulas desde aquí",
								texto: "Individual o en asociación. Repelón Conecta es tu vitrina digital activa mientras formulas el proyecto.",
								bg: "#ffdea7", icon: "📄",
							},
						].map(({ titulo, texto, bg, icon }) => (
							<div key={titulo} className="rounded-xl p-5 shadow-sm" style={{ background: "#fff" }}>
								<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
									style={{ background: bg }}>
									{icon}
								</div>
								<h3 className="mb-1 text-[16px] font-bold" style={{ color: "#091c31" }}>{titulo}</h3>
								<p className="text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>{texto}</p>
							</div>
						))}
					</div>

					{/* CTAs */}
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div className="flex flex-wrap gap-3">
							<a href="https://www.fondoemprender.com/" target="_blank" rel="noreferrer"
								className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-95"
								style={{ background: "#1660a3" }}>
								Conocer el Fondo Emprender
							</a>
							<Link href="/vendedor"
								className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[14px] font-semibold shadow-sm transition hover:bg-[#e5eeff]"
								style={{ background: "#fff", color: "#091c31" }}>
								{T("inicio.cta.titulo")}
							</Link>
						</div>
						<p className="flex items-center gap-1.5 text-[13px] italic" style={{ color: "#3e4a3d" }}>
							<svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="#006d23" strokeWidth="2" aria-hidden>
								<circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" />
							</svg>
							La postulación es directa con el SENA: nunca te cobrarán por participar.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
