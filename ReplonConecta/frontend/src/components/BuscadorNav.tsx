"use client";

/*
 * Buscador de la cabecera.
 *
 * Es el atajo al buscador que ya existe en /buscar, no un buscador
 * nuevo: al enviar, arma la URL con los mismos parametros que lee esa
 * pantalla (ver app/buscar/page.tsx) y navega. Asi hay un solo sitio
 * donde se decide que es una coincidencia.
 *
 * POR QUE EN LA CABECERA Y NO EN LA BARRA DE ABAJO:
 * la barra inferior es la navegacion del pulgar en movil —seis
 * destinos, siempre visible— y ya esta llena. El buscador es una
 * accion, no un destino: va arriba, en la banda util, y en movil se
 * reduce a un icono que abre la fila completa.
 *
 * LA ETIQUETA VA EN UN <label class="sr-only">, no en el placeholder:
 * un input sin etiqueta solo se anuncia con lo que el navegador deduce
 * del placeholder, y el placeholder desaparece al escribir. Ademas se
 * nota en el DOM y no se repite el mismo texto en la etiqueta visible.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export default function BuscadorNav() {
	const router = useRouter();
	const [texto, setTexto] = useState("");
	const [abierto, setAbierto] = useState(false);

	function buscar(e: FormEvent) {
		e.preventDefault();
		const limpio = texto.trim();
		if (!limpio) return;
		setAbierto(false);
		router.push(`/buscar?q=${encodeURIComponent(limpio)}`);
	}

	return (
		<>
			{/* Ancha: la fila completa, a la izquierda de los iconos. */}
			<form
				onSubmit={buscar}
				role="search"
				className="relative ml-auto hidden w-full max-w-xs lg:block"
			>
				<label htmlFor="buscador-nav" className="sr-only">
					Buscar comercio o producto
				</label>
				<svg
					viewBox="0 0 24 24"
					className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					aria-hidden
				>
					<circle cx="11" cy="11" r="7" />
					<path d="m16.2 16.2 4.3 4.3" strokeLinecap="round" />
				</svg>
				<input
					id="buscador-nav"
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Busca un comercio o producto"
					className="min-h-10 w-full rounded-xl border border-black/10 bg-white/60 pl-9 pr-3 text-sm text-ink placeholder:text-muted-foreground focus-visible:border-azul focus-visible:ring-2 focus-visible:ring-azul/40 focus-visible:outline-none"
				/>
			</form>

			{/* Movil: icono que despliega la fila sobre la cabecera. */}
			<button
				type="button"
				onClick={() => setAbierto((v) => !v)}
				aria-expanded={abierto}
				aria-label={abierto ? "Cerrar buscador" : "Buscar comercio o producto"}
				className="glass-soft ml-auto grid size-10 shrink-0 place-items-center rounded-xl text-ink transition-colors hover:text-leaf lg:hidden"
			>
				<svg
					viewBox="0 0 24 24"
					className="h-[21px] w-[21px]"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					aria-hidden
				>
					<circle cx="11" cy="11" r="7" />
					<path d="m16.2 16.2 4.3 4.3" strokeLinecap="round" />
				</svg>
			</button>

			{/* Fila desplegada en movil: ocupa todo el ancho de la pastilla. */}
			{abierto && (
				<form
					onSubmit={buscar}
					role="search"
					className="absolute inset-x-3 top-full mt-2 lg:hidden"
				>
					<label htmlFor="buscador-nav-movil" className="sr-only">
						Buscar comercio o producto
					</label>
					<div className="glass shadow-float flex items-center gap-2 rounded-2xl px-3 py-2">
						<svg
							viewBox="0 0 24 24"
							className="size-4 shrink-0 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							aria-hidden
						>
							<circle cx="11" cy="11" r="7" />
							<path d="m16.2 16.2 4.3 4.3" strokeLinecap="round" />
						</svg>
						<input
							id="buscador-nav-movil"
							type="search"
							autoFocus
							value={texto}
							onChange={(e) => setTexto(e.target.value)}
							placeholder="Yuca, pescado, palma…"
							className="min-h-10 w-full bg-transparent text-sm text-ink placeholder:text-muted-foreground focus-visible:outline-none"
						/>
						<button
							type="submit"
							className="min-h-10 shrink-0 rounded-lg bg-azul px-3 text-sm font-semibold text-white"
						>
							Buscar
						</button>
					</div>
				</form>
			)}
		</>
	);
}