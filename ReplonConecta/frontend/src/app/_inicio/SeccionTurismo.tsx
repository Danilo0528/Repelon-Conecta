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
					className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-12"
				>
					<div className="mb-5">
						<h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
							Turismo en Repelón
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							{T("inicio.turismo.texto")}
						</p>
					</div>

					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{lugares.map((lugar) => (
						<button
							key={`${lugar.nombre}|${lugar.direccion}`}
							type="button"
							onClick={() => setLugarVentana(lugar)}
							aria-haspopup="dialog"
							aria-label={`Ver información de ${lugar.nombre}`}
							className="glass flex w-full flex-col rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
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
								className={`relative -mx-5 -mt-5 mb-4 h-36 overflow-hidden rounded-t-3xl ${FONDO_MOTIVO[lugar.motivo]}`}
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
										className="absolute -bottom-6 -right-4 h-36 w-36 text-ink/15"
									>
										{MOTIVO_TRAZO[lugar.motivo]}
									</svg>
								)}
							</div>
							<div className="flex items-center gap-2">
									<span className="grid size-9 place-items-center rounded-xl bg-cielo/25 text-azul">
										<svg
											viewBox="0 0 24 24"
											className="size-5"
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
									<h3 className="font-display font-semibold text-ink">
										{lugar.nombre}
									</h3>
								</div>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									{lugar.descripcion}
								</p>
								<p className="mt-2 text-xs text-muted-foreground/80">
									{lugar.direccion}
								</p>
							<span className="glass-soft mt-4 inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-ink">
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
