"use client";

import { MapaNegocios } from "@/components/Mapa";
import { FichaMapa } from "./FichaMapa";
import type { InicioState } from "./useInicio";

/** Sección "El pueblo en el mapa": pines, zoom propio y ficha del elegido. */
export function SeccionMapa({ inicio }: { inicio: InicioState }) {
	const { catalogo, seleccion, setSeleccionId, controlRef, T } = inicio;

	return (
		<section className="mx-auto max-w-6xl px-4 pt-12">
			<div className="mb-5">
				<h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
					El pueblo en el mapa
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					{T("inicio.mapa.texto")}
				</p>
			</div>

			<div className="glass shadow-float relative overflow-hidden rounded-[28px] p-2">
				<div className="relative h-[420px] overflow-hidden rounded-[22px] md:h-[480px] lg:h-[540px]">
					<MapaNegocios
						negocios={catalogo}
						onSeleccionar={(n) => setSeleccionId(n.id)}
						seleccionadoId={seleccion?.id ?? null}
						controlRef={controlRef}
					/>

					{/* Etiqueta del pueblo + crédito de Google Maps */}
					<div className="pointer-events-none absolute left-3 top-3 z-mapa flex flex-col items-start gap-1">
						<span className="glass-soft flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink">
							<svg
								viewBox="0 0 24 24"
								className="size-3.5 text-leaf"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden
							>
								<path
									d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z"
									strokeLinejoin="round"
								/>
								<circle cx="12" cy="10" r="2.6" />
							</svg>
							Repelón, Atlántico
						</span>
						<a
							href="https://www.google.com/maps"
							target="_blank"
							rel="noreferrer"
							className="pointer-events-auto rounded-full bg-white/85 px-2 py-0.5 text-[10px] text-black/50 backdrop-blur-sm"
						>
							© Google Maps
						</a>
					</div>

					{/* Zoom, pintado aquí y no por Google, para que quede arriba */}
					<div className="absolute right-3 top-3 z-mapa flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white/85 shadow-sm backdrop-blur-sm">
						<button
							type="button"
							onClick={() => controlRef.current?.(1)}
							aria-label="Acercar el mapa"
							className="flex h-9 w-9 items-center justify-center text-lg font-medium text-ink/70 active:bg-black/5"
						>
							+
						</button>
						<span className="mx-2 h-px bg-black/10" aria-hidden />
						<button
							type="button"
							onClick={() => controlRef.current?.(-1)}
							aria-label="Alejar el mapa"
							className="flex h-9 w-9 items-center justify-center text-lg font-medium text-ink/70 active:bg-black/5"
						>
							−
						</button>
					</div>

					{/* Ficha del comercio elegido, o la tira para elegir uno */}
					{catalogo.length > 0 && (
						<div className="absolute inset-x-3 bottom-3 z-mapa">
							{seleccion ? (
								<FichaMapa
									n={seleccion}
									onCerrar={() => setSeleccionId(null)}
								/>
							) : (
								<div className="glass flex gap-2 overflow-x-auto rounded-2xl p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
									{catalogo.slice(0, 6).map((n) => (
										<button
											key={n.id}
											type="button"
											onClick={() => setSeleccionId(n.id)}
											className="flex shrink-0 items-center gap-2 rounded-xl p-1.5 pr-3 text-left hover:bg-white/70"
										>
											<span
												className={`size-2.5 shrink-0 rounded-full ${
													n.abierto ? "bg-leaf" : "bg-muted-foreground"
												}`}
												aria-hidden
											/>
											<span className="text-xs font-semibold text-ink">
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
		</section>
	);
}
