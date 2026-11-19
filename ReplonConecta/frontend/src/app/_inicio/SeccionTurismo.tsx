"use client";

import { SliderTurismo } from "@/components/SliderTurismo";
import { FONDO_MOTIVO, MOTIVO_TRAZO } from "./contenido";
import { VentanaLugar } from "./VentanaLugar";
import type { InicioState } from "./useInicio";

/*
 * Fichas sin precios: una de las tres familias del alcance no vende
 * productos, solo muestra dónde queda cada lugar. El contenido vive en
 * la base (`zonas_turisticas`, cargadas desde /admin; lib/turismo.ts
 * solo respalda) y el "camino" cierra en Google Maps: al presionar la
 * ficha se abre una ventana flotante con la info previa del lugar y
 * desde ahí el botón sale hacia el mapa, nunca a un chat de pedido.
 * Con la base vacía no hay ancla "Turismo" que mostrar. El id es el
 * ancla del nav y el scroll-mt deja que el título no quede bajo la
 * pastilla de vidrio.
 */
export function SeccionTurismo({ inicio }: { inicio: InicioState }) {
	const { lugares, lugarVentana, setLugarVentana, T } = inicio;

	return (
		<>
			{lugares.length > 0 && (
				<section
					id="turismo"
					className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-6 sm:pt-8 md:pt-12"
				>
					<div className="mb-3 sm:mb-4 md:mb-5">
						<h2 className="font-display text-xl font-semibold text-ink sm:text-2xl md:text-3xl">
							Turismo en Repelón
						</h2>
						<p className="mt-1 text-sm leading-snug text-muted-foreground sm:leading-normal">
							{T("inicio.turismo.texto")}
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
						{lugares.map((lugar) => (
						<button
							key={`${lugar.nombre}|${lugar.direccion}`}
							type="button"
							onClick={() => setLugarVentana(lugar)}
							aria-haspopup="dialog"
							aria-label={`Ver información de ${lugar.nombre}`}
							className="glass flex w-full flex-col rounded-3xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2 sm:p-5"
						>
							{/*
							 * Banda superior: foto real si existe; si no,
							 * ilustración de respaldo (gradiente pastel +
							 * trazo del motivo). El desbordamiento (-m*) la
							 * lleva al borde de la tarjeta.
							 */}
							<div
								role="img"
								aria-label={lugar.imagen
									? `${lugar.nombre} (fotos)`
									: `${lugar.nombre} (ilustración)`}
								className={`relative -mx-4 -mt-4 mb-3 h-28 overflow-hidden rounded-t-3xl sm:-mx-5 sm:-mt-5 sm:mb-4 sm:h-36 ${FONDO_MOTIVO[lugar.motivo]}`}
							>
								{lugar.imagenes.length > 0 ? (
									<SliderTurismo
										imagenes={lugar.imagenes}
										creditos={lugar.creditos}
										nombre={lugar.nombre}
									/>
								) : (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden
										className="absolute -bottom-6 -right-4 h-32 w-32 text-ink/15 sm:h-36 sm:w-36"
									>
										{MOTIVO_TRAZO[lugar.motivo]}
									</svg>
								)}
							</div>
							<div className="flex items-center gap-2">
									<span className="grid size-8 place-items-center rounded-xl bg-cielo/25 text-azul sm:size-9">
										<svg
											viewBox="0 0 24 24"
											className="size-4 sm:size-5"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
											aria-hidden
										>
											<path
												d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z"
												strokeLinejoin="round"
											/>
											<circle cx="12" cy="10.4" r="2.4" />
										</svg>
									</span>
									<h3 className="font-display text-[15px] font-semibold text-ink sm:text-base">
										{lugar.nombre}
									</h3>
								</div>
								<p className="mt-2 text-[13px] leading-snug text-muted-foreground sm:mt-3 sm:text-sm sm:leading-relaxed">
									{lugar.descripcion}
								</p>
								<p className="mt-1.5 text-[11px] text-muted-foreground/80 sm:mt-2 sm:text-xs">
									{lugar.direccion}
								</p>
							<span className="glass-soft mt-3 inline-flex min-h-10 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-ink sm:mt-4 sm:min-h-11 sm:py-2.5">
								Cómo llegar
							</span>
						</button>
					))}
					</div>
				</section>
			)}

			{/* Ventana flotante del lugar turístico elegido */}
			{lugarVentana && (
				<VentanaLugar
					lugar={lugarVentana}
					onCerrar={() => setLugarVentana(null)}
				/>
			)}
		</>
	);
}
