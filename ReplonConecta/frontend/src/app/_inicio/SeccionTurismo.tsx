"use client";

import Link from "next/link";

import { SliderTurismo } from "@/components/SliderTurismo";
import { FONDO_MOTIVO, MOTIVO_TRAZO } from "./contenido";
import { VentanaLugar } from "./VentanaLugar";
import type { InicioState } from "./useInicio";

export function SeccionTurismo({ inicio }: { inicio: InicioState }) {
	const { lugares, lugarVentana, setLugarVentana } = inicio;

	return (
		<>
			{lugares.length > 0 && (
				<section id="turismo" className="scroll-mt-24 w-full py-10 md:py-16"
					style={{ background: "#fbfbf9" }}>
					<div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">

						{/* Encabezado */}
						<div className="mb-8 max-w-3xl">
							<div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold"
								style={{ background: "#d2e4ff", color: "#004880" }}>
								<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
									<path d="M12 21s7-6 7-11a7 7 0 00-14 0c0 5 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
									<circle cx="12" cy="10" r="2.5" />
								</svg>
								Destinos Comunitarios
							</div>
							<h2 className="font-sans text-[2rem] font-extrabold tracking-tight md:text-[2.25rem]"
								style={{ color: "#091c31" }}>
								Turismo en Repelón
							</h2>
							<p className="mt-1 text-[16px]" style={{ color: "#3e4a3d" }}>
								Lugares y zonas del pueblo: el camino termina en el mapa y la calidez de su gente.
							</p>
						</div>

						{/* Rejilla */}
						<div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
							{lugares.map((lugar) => (
								<button
									key={`${lugar.nombre}|${lugar.direccion}`}
									type="button"
									onClick={() => setLugarVentana(lugar)}
									aria-haspopup="dialog"
									aria-label={`Ver información de ${lugar.nombre}`}
									className="group flex w-full flex-col overflow-hidden text-left transition-all duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#006d23] focus-visible:ring-offset-2"
									style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(7,27,47,0.06)" }}
								>
									{/* Foto */}
									<div className={`relative h-52 w-full overflow-hidden ${FONDO_MOTIVO[lugar.motivo]}`}>
										{lugar.imagenes.length > 0 ? (
											<SliderTurismo imagenes={lugar.imagenes} creditos={lugar.creditos} nombre={lugar.nombre} />
										) : (
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
												className="absolute -bottom-6 -right-4 h-36 w-36 opacity-15">
												{MOTIVO_TRAZO[lugar.motivo]}
											</svg>
										)}
										{/* Overlay badge */}
										<div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,28,49,0.65) 0%, transparent 55%)" }} />
									</div>

									{/* Info */}
									<div className="flex flex-1 flex-col p-4">
										<div className="mb-1.5 flex items-center gap-1 text-[12px]" style={{ color: "#1660a3" }}>
											<svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
												<path d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z" strokeLinejoin="round" />
												<circle cx="12" cy="10" r="2.5" />
											</svg>
											{lugar.direccion}
										</div>
										<h3 className="font-sans text-[18px] font-bold leading-snug" style={{ color: "#091c31" }}>
											{lugar.nombre}
										</h3>
										<p className="mt-2 flex-1 text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>
											{lugar.descripcion}
										</p>
										<div className="mt-4 flex items-center justify-between">
											<span className="flex items-center gap-1 text-[12px] font-bold" style={{ color: "#0b8544" }}>
												<span className="h-2 w-2 rounded-full" style={{ background: "#0b8544" }} aria-hidden />
												Acceso Libre
											</span>
											<span className="flex items-center gap-1 text-[14px] font-bold transition-colors group-hover:underline" style={{ color: "#006d23" }}>
												Cómo llegar
												<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
													<path d="M5 12h14M12 5l7 7-7 7" />
												</svg>
											</span>
										</div>
									</div>
								</button>
							))}
						</div>

						<div className="mt-8 flex justify-center">
							<Link href="/#turismo"
								className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-[14px] font-semibold shadow-sm transition hover:bg-[#e5eeff]"
								style={{ background: "#fff", color: "#091c31", border: "1px solid #dbe9ff" }}>
								Ver los {lugares.length} lugares turísticos
								<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					</div>
				</section>
			)}

			{lugarVentana && (
				<VentanaLugar lugar={lugarVentana} onCerrar={() => setLugarVentana(null)} />
			)}
		</>
	);
}
