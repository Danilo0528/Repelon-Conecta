"use client";

import { useEffect } from "react";

import type { FotoCultura } from "@/lib/cultura";

/*
 * Lightbox: la foto a pantalla completa, con flechas y cierre.
 *
 * Es un `role="dialog"` fijo encima de todo (z-modal). Se cierra con
 * Escape, con el botón "Cerrar" o tocando el fondo; se navega con las
 * flechas del teclado o con los botones laterales. Mientras está
 * abierto no se desplaza la página de atrás (overflow del body).
 *
 * El crédito de la foto (si tiene) va debajo de la imagen: es el
 * lugar donde se hace visible el derecho de autor registrado en
 * src/lib/creditos.ts o en el propio listado de cultura.
 */
export function LightboxGaleria({
	fotos,
	indice,
	onIndice,
	onCerrar,
}: {
	fotos: FotoCultura[];
	indice: number;
	onIndice: (siguiente: number) => void;
	onCerrar: () => void;
}) {
	const total = fotos.length;
	const foto = fotos[indice];

	/* Teclado: Escape cierra, flechas cambian de foto (con vuelta). */
	useEffect(() => {
		const mover = (delta: number) =>
			onIndice((((indice + delta) % total) + total) % total);

		function alPulsar(e: KeyboardEvent) {
			if (e.key === "Escape") onCerrar();
			else if (e.key === "ArrowRight") mover(1);
			else if (e.key === "ArrowLeft") mover(-1);
		}

		window.addEventListener("keydown", alPulsar);
		return () => window.removeEventListener("keydown", alPulsar);
	}, [indice, total, onIndice, onCerrar]);

	/* Congela el scroll de la página de fondo mientras se ve la foto. */
	useEffect(() => {
		const previo = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previo;
		};
	}, []);

	if (!foto) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Foto ampliada"
			className="fixed inset-0 z-modal flex flex-col bg-black/95 p-3 sm:p-5"
			onClick={onCerrar}
		>
			{/* Barra superior: contador + cerrar */}
			<div className="flex items-center justify-between gap-3 text-white">
				<p className="text-sm tabular-nums text-white/75">
					{indice + 1}/{total}
				</p>
				<button
					type="button"
					aria-label="Cerrar"
					onClick={(e) => {
						e.stopPropagation();
						onCerrar();
					}}
					className="flex min-h-11 items-center gap-1.5 rounded-xl border border-white/30 px-3 text-sm font-semibold transition hover:bg-white/10"
				>
					<svg
						className="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
					</svg>
					Cerrar
				</button>
			</div>

			{/* Foto con flechas a los lados */}
			<div
				className="flex min-h-0 flex-1 items-center justify-center gap-2 py-3 sm:gap-4"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					aria-label="Anterior"
					onClick={() =>
						onIndice((((indice - 1) % total) + total) % total)
					}
					className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={foto.src}
					alt={foto.alt}
					className="max-h-full min-w-0 flex-1 rounded-lg object-contain"
				/>

				<button
					type="button"
					aria-label="Siguiente"
					onClick={() => onIndice((indice + 1) % total)}
					className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>

			{/* Descripción + crédito de autor, si la foto lo tiene */}
			<div
				className="min-h-8 text-center text-white"
				onClick={(e) => e.stopPropagation()}
			>
				<p className="text-xs text-white/75">{foto.alt}</p>
				{foto.credito && (
					<p className="mt-0.5 text-xs font-medium text-white/90">
						Foto: {foto.credito}
					</p>
				)}
			</div>
		</div>
	);
}
