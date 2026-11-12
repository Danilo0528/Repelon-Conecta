"use client";

import { SliderTurismo } from "@/components/SliderTurismo";
import { FONDO_MOTIVO, MOTIVO_TRAZO } from "./contenido";
import { VentanaLugar } from "./VentanaLugar";
import type { InicioState } from "./useInicio";

/** Escaparate turístico y fichas reales administradas desde el panel. */
export function SeccionTurismo({ inicio }: { inicio: InicioState }) {
	const { lugares, lugarVentana, setLugarVentana, T } = inicio;
	const lugarPrincipal = lugares[0];

	return (
		<>
			{lugarPrincipal && (
				<section id="turismo" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-8 sm:px-6 sm:pt-12">
					<button
						type="button"
						onClick={() => setLugarVentana(lugarPrincipal)}
						aria-label={`Explorar turismo: ${lugarPrincipal.nombre}`}
						aria-haspopup="dialog"
						className="group relative flex min-h-48 w-full items-end overflow-hidden rounded-2xl bg-[#12366a] text-left shadow-[0_12px_28px_-18px_rgba(16,45,70,.65)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] sm:min-h-64 sm:rounded-3xl"
					>
						<div className="absolute inset-0 overflow-hidden" aria-hidden>
							{lugarPrincipal.imagenes.length > 0 ? (
								<SliderTurismo
									imagenes={lugarPrincipal.imagenes}
									creditos={lugarPrincipal.creditos}
									nombre={lugarPrincipal.nombre}
								/>
							) : (
								<img
									src="/img/repelon-turismo-banner.png"
									alt=""
									className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
								/>
							)}
						</div>
						<div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#062a51]/90 via-[#062a51]/55 to-transparent" />
						<div className="relative z-10 max-w-[34rem] p-5 text-white sm:p-8">
							<p className="font-display text-3xl italic leading-none sm:text-5xl">Vive Repelón</p>
							<p className="mt-2 max-w-[32ch] text-xs font-semibold leading-snug text-white/95 sm:mt-3 sm:text-lg">
								Paisajes, cultura y experiencias junto al Guájaro
							</p>
							<span className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-3.5 text-xs font-bold text-[#12366a] transition group-hover:bg-[#eaf5ef] sm:mt-5 sm:min-h-11 sm:px-5 sm:text-sm">
								<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
									<path d="M4 8h16v12H4zM8 8l1.5-3h5L16 8" strokeLinejoin="round" />
									<circle cx="12" cy="14" r="3" />
								</svg>
								Explorar turismo
								<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
									<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
						</div>
					</button>

					{lugares.length > 1 && (
						<div className="mt-6 sm:mt-8">
							<div className="mb-3">
								<h2 className="font-display text-lg font-semibold text-ink sm:text-2xl">Más lugares para conocer</h2>
								<p className="mt-1 text-xs text-muted-foreground sm:text-sm">{T("inicio.turismo.texto")}</p>
							</div>
							<div className="grid gap-3 min-[390px]:grid-cols-2 lg:grid-cols-3 sm:gap-5">
								{lugares.slice(1).map((lugar) => (
									<button
										key={`${lugar.nombre}|${lugar.direccion}`}
										type="button"
										onClick={() => setLugarVentana(lugar)}
										aria-haspopup="dialog"
										aria-label={`Ver información de ${lugar.nombre}`}
										className="group flex w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] sm:rounded-3xl sm:p-5"
									>
										<div
											role="img"
											aria-label={lugar.imagen ? `${lugar.nombre}, fotografía` : `${lugar.nombre}, ilustración`}
											className={`relative -mx-3 -mt-3 mb-3 h-28 overflow-hidden rounded-t-2xl sm:-mx-5 sm:-mt-5 sm:mb-4 sm:h-36 sm:rounded-t-3xl ${FONDO_MOTIVO[lugar.motivo]}`}
										>
											{lugar.imagenes.length > 0 ? (
												<SliderTurismo imagenes={lugar.imagenes} creditos={lugar.creditos} nombre={lugar.nombre} />
											) : (
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="absolute -bottom-6 -right-4 h-36 w-36 text-ink/15">
													{MOTIVO_TRAZO[lugar.motivo]}
												</svg>
											)}
										</div>
										<h3 className="font-display text-sm font-semibold text-ink sm:text-base">{lugar.nombre}</h3>
										<p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{lugar.descripcion}</p>
										<span className="mt-3 inline-flex min-h-9 items-center justify-center rounded-xl bg-[#f4f6fc] px-3 text-xs font-semibold text-[#12366a]">Cómo llegar</span>
									</button>
								))}
							</div>
						</div>
					)}
				</section>
			)}

			{lugarVentana && <VentanaLugar lugar={lugarVentana} onCerrar={() => setLugarVentana(null)} />}
		</>
	);
}
