"use client";

import { MapaNegocios } from "@/components/Mapa";
import { FichaMapa } from "./FichaMapa";
import type { InicioState } from "./useInicio";

/** Sección "El pueblo en el mapa": pines, zoom propio y ficha del elegido. */
export function SeccionMapa({ inicio }: { inicio: InicioState }) {
	const { catalogo, seleccion, setSeleccionId, controlRef, T } = inicio;

	return (
		<section className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10 md:pt-12">
			<div className="mb-4">
				<h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
					El pueblo en el mapa
				</h2>
				<p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					{T("inicio.mapa.texto")}
				</p>
			</div>

			<div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
				<div className="relative h-[240px] sm:h-[320px] md:h-[420px] lg:h-[480px]">
					<MapaNegocios
						negocios={catalogo}
						onSeleccionar={(n) => setSeleccionId(n.id)}
						seleccionadoId={seleccion?.id ?? null}
						controlRef={controlRef}
					/>

					<div className="pointer-events-none absolute right-3 top-3 z-mapa flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-sm">
						<button
							type="button"
							onClick={() => controlRef.current?.(1)}
							aria-label="Acercar el mapa"
							className="pointer-events-auto flex h-10 w-10 items-center justify-center text-lg font-medium text-ink/80 active:bg-black/5"
						>
							+
						</button>
						<span className="mx-2 h-px bg-black/10" aria-hidden />
						<button
							type="button"
							onClick={() => controlRef.current?.(-1)}
							aria-label="Alejar el mapa"
							className="pointer-events-auto flex h-10 w-10 items-center justify-center text-lg font-medium text-ink/80 active:bg-black/5"
						>
							−
						</button>
					</div>

					{!seleccion && catalogo.length > 0 && (
						<p className="pointer-events-none absolute bottom-3 left-3 z-mapa max-w-[calc(100%-5rem)] rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-ink/80 shadow-sm">
							Toca un punto del mapa para ver el comercio
						</p>
					)}

					{seleccion && (
						<div className="absolute inset-x-3 bottom-3 z-mapa max-w-md sm:inset-x-auto sm:left-3 sm:right-3 sm:max-w-sm">
							<FichaMapa n={seleccion} onCerrar={() => setSeleccionId(null)} />
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
