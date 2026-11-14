"use client";

import { MapaNegocios } from "@/components/Mapa";
import { FichaMapa } from "./FichaMapa";
import type { InicioState } from "./useInicio";

export function SeccionMapa({ inicio }: { inicio: InicioState }) {
	const { catalogo, seleccion, setSeleccionId, controlRef, T } = inicio;

	return (
		<section className="w-full py-10 md:py-16" style={{ background: "#eff4ff" }}>
			<div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">

				{/* Encabezado */}
				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="mb-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: "#1660a3" }}>
							Cartografía Viva
						</p>
						<h2 className="font-sans text-[2rem] font-extrabold tracking-tight md:text-[2.25rem]"
							style={{ color: "#091c31" }}>
							El pueblo en el mapa
						</h2>
						<p className="mt-1 text-[16px]" style={{ color: "#3e4a3d" }}>
							{T("inicio.mapa.texto")}
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-1 rounded-lg p-1 shadow-sm" style={{ background: "#fff" }}>
						<span className="flex items-center gap-1 rounded px-3 py-1.5 text-[12px] font-bold text-white"
							style={{ background: "#078930" }}>
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
								<line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
							</svg>
							Mapa
						</span>
						<span className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold"
							style={{ color: "#3e4a3d" }}>
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
							</svg>
							Satélite
						</span>
					</div>
				</div>

				{/* Mapa */}
				<div className="overflow-hidden rounded-xl shadow-md" style={{ background: "#fff" }}>
					<div className="relative h-[460px] overflow-hidden md:h-[520px]">
						<MapaNegocios
							negocios={catalogo}
							onSeleccionar={(n) => setSeleccionId(n.id)}
							seleccionadoId={seleccion?.id ?? null}
							controlRef={controlRef}
						/>

						{/* Badge localización */}
						<div className="absolute left-4 top-4 z-mapa flex flex-col items-start gap-1">
							<div className="flex items-center gap-2 rounded-lg px-3.5 py-2 shadow-md"
								style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
								<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="#006d23" strokeWidth="2" aria-hidden>
									<path d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z" strokeLinejoin="round" />
									<circle cx="12" cy="10" r="2.5" />
								</svg>
								<div>
									<p className="text-[14px] font-bold leading-none" style={{ color: "#091c31" }}>
										Repelón, Atlántico
									</p>
									<p className="text-[11px]" style={{ color: "#3e4a3d" }}>
										Embalse del Guájaro · Sector Centro
									</p>
								</div>
							</div>
							<a href="https://www.google.com/maps" target="_blank" rel="noreferrer"
								className="rounded-full px-2 py-0.5 text-[10px]"
								style={{ background: "rgba(255,255,255,0.85)", color: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
								© Google Maps
							</a>
						</div>

						{/* Zoom */}
						<div className="absolute right-4 top-4 z-mapa flex flex-col overflow-hidden rounded-xl shadow-sm"
							style={{ background: "rgba(255,255,255,0.90)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,.08)" }}>
							<button type="button" onClick={() => controlRef.current?.(1)} aria-label="Acercar el mapa"
								className="flex h-9 w-9 items-center justify-center text-lg font-medium active:bg-black/5"
								style={{ color: "rgba(9,28,49,0.7)" }}>+</button>
							<span className="mx-2 h-px" style={{ background: "rgba(0,0,0,0.1)" }} aria-hidden />
							<button type="button" onClick={() => controlRef.current?.(-1)} aria-label="Alejar el mapa"
								className="flex h-9 w-9 items-center justify-center text-lg font-medium active:bg-black/5"
								style={{ color: "rgba(9,28,49,0.7)" }}>−</button>
						</div>

						{/* Ficha / tira de negocios */}
						{catalogo.length > 0 && (
							<div className="absolute inset-x-3 bottom-3 z-mapa">
								{seleccion ? (
									<FichaMapa n={seleccion} onCerrar={() => setSeleccionId(null)} />
								) : (
									<div className="flex gap-2 overflow-x-auto rounded-2xl p-2 shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
										style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>
										{catalogo.slice(0, 6).map((n) => (
											<button key={n.id} type="button" onClick={() => setSeleccionId(n.id)}
												className="flex shrink-0 items-center gap-2 rounded-xl p-1.5 pr-3 text-left hover:bg-black/5 transition-colors">
												<span className="size-2.5 shrink-0 rounded-full"
													style={{ background: n.abierto ? "#0b8544" : "#6e7a6b" }} aria-hidden />
												<span className="text-[12px] font-bold" style={{ color: "#091c31" }}>
													{n.nombre}
												</span>
											</button>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
