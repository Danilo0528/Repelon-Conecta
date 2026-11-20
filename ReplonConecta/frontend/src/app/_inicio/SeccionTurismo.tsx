"use client";

import Link from "next/link";

import { SliderTurismo } from "@/components/SliderTurismo";
import { FONDO_MOTIVO, MOTIVO_TRAZO } from "./contenido";
import { VentanaLugar } from "./VentanaLugar";
import type { InicioState } from "./useInicio";

/** Turismo destacado en home: pocas tarjetas claras y bien espaciadas. */
export function SeccionTurismo({ inicio }: { inicio: InicioState }) {
	const { lugares, lugarVentana, setLugarVentana, T } = inicio;
	const destacados = lugares.slice(0, 3);

	return (
		<>
			{destacados.length > 0 && (
				<section
					id="turismo"
					className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-8 sm:pt-10 md:pt-12"
				>
					<div className="mb-4 flex items-end justify-between gap-3">
						<div>
							<h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
								Turismo en Repelón
							</h2>
							<p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
								{T("inicio.turismo.texto")}
							</p>
						</div>
						{lugares.length > destacados.length && (
							<Link
								href="/cultura"
								className="hidden min-h-11 shrink-0 items-center text-sm font-semibold text-leaf sm:inline-flex"
							>
								Ver más
							</Link>
						)}
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{destacados.map((lugar) => (
							<button
								key={`${lugar.nombre}|${lugar.direccion}`}
								type="button"
								onClick={() => setLugarVentana(lugar)}
								aria-haspopup="dialog"
								aria-label={`Ver información de ${lugar.nombre}`}
								className="flex w-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
							>
								<div
									role="img"
									aria-label={
										lugar.imagen
											? `${lugar.nombre} (fotos)`
											: `${lugar.nombre} (ilustración)`
									}
									className={`relative h-40 overflow-hidden sm:h-44 ${FONDO_MOTIVO[lugar.motivo]}`}
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
											className="absolute -bottom-6 -right-4 h-32 w-32 text-ink/15"
										>
											{MOTIVO_TRAZO[lugar.motivo]}
										</svg>
									)}
								</div>
								<div className="flex flex-1 flex-col p-4">
									<h3 className="font-display text-lg font-semibold text-ink">
										{lugar.nombre}
									</h3>
									<p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
										{lugar.descripcion}
									</p>
									<p className="mt-2 text-xs text-muted-foreground/80">
										{lugar.direccion}
									</p>
									<span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-azul/20 bg-azul/5 px-3 py-2 text-sm font-semibold text-azul">
										Ver cómo llegar
									</span>
								</div>
							</button>
						))}
					</div>

					{lugares.length > destacados.length && (
						<div className="mt-4 sm:hidden">
							<Link
								href="/cultura"
								className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
							>
								Ver más lugares
							</Link>
						</div>
					)}
				</section>
			)}

			{lugarVentana && (
				<VentanaLugar
					lugar={lugarVentana}
					onCerrar={() => setLugarVentana(null)}
				/>
			)}
		</>
	);
}
