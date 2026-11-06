"use client";

import { useEffect } from "react";

import { useUbicacion } from "@/lib/ubicacion";
import { enlaceRutaDesde } from "@/lib/maps";
import type { LugarTuristico } from "@/lib/turismo";
import { FONDO_MOTIVO, MOTIVO_TRAZO } from "./contenido";

/*
 * La idea del botón flotante (estilo FAB de Gmail): al presionar la
 * ficha de un lugar se abre esta ventana con la info previa —foto o
 * ilustración, descripción y dirección— y de ahí el botón sale hacia
 * Google Maps. Se cierra con la X, con "Cerrar", tocando fuera o con
 * Escape; mientras está abierta la página de atrás no se mueve.
 */
export function VentanaLugar({
	lugar,
	onCerrar,
}: {
	lugar: LugarTuristico;
	onCerrar: () => void;
}) {
	useEffect(() => {
		const alPulsar = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onCerrar();
			}
		};
		document.addEventListener("keydown", alPulsar);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", alPulsar);
			document.body.style.overflow = "";
		};
	}, [onCerrar]);

	const { origen, pidiendo, preguntado, pedir } = useUbicacion();

	return (
		<div
			className="fixed inset-0 z-modal flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center"
			onClick={onCerrar}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={`Información de ${lugar.nombre}`}
				onClick={(e) => e.stopPropagation()}
				className="ventana-flotante glass max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl"
			>
				<div
					role="img"
					aria-label={
						lugar.imagen
							? `${lugar.nombre} (foto)`
							: `${lugar.nombre} (ilustración)`
					}
					className={`relative h-44 overflow-hidden rounded-t-3xl ${FONDO_MOTIVO[lugar.motivo]}`}
				>
					{lugar.imagen ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={lugar.imagen}
							alt={lugar.nombre}
							onError={(e) => {
								// URL caída: se apaga la foto y queda el fondo de la ficha
								e.currentTarget.style.display = "none";
							}}
							className="absolute inset-0 h-full w-full object-cover"
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
							className="absolute -bottom-8 -right-6 h-44 w-44 text-ink/15"
						>
							{MOTIVO_TRAZO[lugar.motivo]}
						</svg>
					)}
					<button
						type="button"
						onClick={onCerrar}
						aria-label="Cerrar"
						className="absolute right-3 top-3 size-9 rounded-full bg-white/85 text-ink shadow-float hover:bg-white"
					>
						✕
					</button>
				</div>

				<div className="p-5">
					<h3 className="font-display text-xl font-semibold text-ink">
						{lugar.nombre}
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						{lugar.descripcion}
					</p>
					<p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground/80">
						<svg
							viewBox="0 0 24 24"
							className="mt-0.5 size-4 shrink-0"
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
						<span>{lugar.direccion}</span>
					</p>

					{/* El origen de la ruta sale de la ubicación real si el
					    visitante ya la compartió; si no, del centro del pueblo.
					    El permiso se pide al pulsar, nunca al abrir la ficha. */}
					<a
						href={enlaceRutaDesde(origen.real ? origen : null, lugar)}
						target="_blank"
						rel="noreferrer"
						className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-azul px-4 py-3 text-sm font-semibold text-white"
					>
						<svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
							<path d="M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
						</svg>
						{origen.real ? "Cómo llegar desde aquí" : "Abrir en Google Maps"}
					</a>

					{/* Botón de permiso: solo aparece si aún no sabemos dónde
					    está la persona. En cuanto lo sabemos, se apaga solo. */}
					{!origen.real && !preguntado && (
						<button
							type="button"
							onClick={pedir}
							disabled={pidiendo}
							className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-ink disabled:opacity-60"
						>
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
								<circle cx="12" cy="12" r="3.2" />
								<circle cx="12" cy="12" r="7.5" />
								<path d="M12 1.5v2.6M12 19.9v2.6M22.5 12h-2.6M4.1 12H1.5" strokeLinecap="round" />
							</svg>
							{pidiendo ? "Buscando tu ubicación…" : "Usar mi ubicación para la ruta"}
						</button>
					)}

					{/* Si se denegó el permiso, el enlace de arriba ya salió igual
					    desde el centro del pueblo: no hace falta insistir. */}
					{!origen.real && preguntado && (
						<p className="mt-2 text-center text-xs text-muted-foreground/80">
							Ruta desde el centro del pueblo
						</p>
					)}

					<button
						type="button"
						onClick={onCerrar}
						className="glass-soft mt-2 min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-ink"
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
}
