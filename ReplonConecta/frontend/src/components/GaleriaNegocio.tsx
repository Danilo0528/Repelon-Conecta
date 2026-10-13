"use client";

import { useEffect, useRef, useState } from "react";

import { Foto } from "@/components/ui";

/*
 * Galería de la ficha del negocio: las fotos que el panel admin cargó.
 *
 * Con una sola foto se queda tal cual, sin controles ni puntos: no hay
 * nada que deslizar y los botones solo ensucian. Con dos o más pasa a
 * carrusel con crossfade automático, puntos y flechas, y deslizar con
 * el dedo en móvil.
 *
 * Pinta solo el área de fotos. El degradado con el nombre, el estado y
 * la dirección lo pone la página encima, igual que con la foto única de
 * antes.
 */
export function GaleriaNegocio({ fotos, alt }: { fotos: string[]; alt: string }) {
	const lista = fotos.map((f) => f.trim()).filter(Boolean);
	const [activo, setActivo] = useState(0);
	const [sinMovimiento, setSinMovimiento] = useState(false);
	const toque = useRef<number | null>(null);

	/*
	 * Quien pidió reducir el movimiento no debe recibir fotos que solas
	 * se van cambiando: el carrusel queda quieto y solo avanza a mano.
	 */
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const aplicar = () => setSinMovimiento(mq.matches);
		aplicar();
		mq.addEventListener("change", aplicar);
		return () => mq.removeEventListener("change", aplicar);
	}, []);

	/*
	 * El temporizador se reconstruye en cada cambio de foto, así que
	 * moverse a mano (flecha, punto o dedo) reinicia la cuenta de 5s y
	 * la foto elegida tiene tiempo de leerse antes de que siga sola.
	 */
	useEffect(() => {
		if (lista.length < 2 || sinMovimiento) return;
		const id = window.setInterval(
			() => setActivo((i) => (i + 1) % lista.length),
			5000,
		);
		return () => window.clearInterval(id);
	}, [activo, lista.length, sinMovimiento]);

	if (lista.length <= 1) {
		return (
			<Foto
				src={lista[0] ?? null}
				alt={alt}
				className="h-52 w-full object-cover sm:h-64 md:h-80"
			/>
		);
	}

	// Índice siempre dentro de rango, aunque la lista cambie a mitad de
	// camino (el admin borra una foto y se vuelve a montar la página).
	const indice = activo % lista.length;
	const ir = (destino: number) =>
		setActivo(((destino % lista.length) + lista.length) % lista.length);

	return (
		<div
			role="group"
			aria-roledescription="carrusel"
			aria-label={`Fotos de ${alt}`}
			className="relative h-52 w-full overflow-hidden bg-black/[.05] sm:h-64 md:h-80"
			onTouchStart={(e) => {
				toque.current = e.changedTouches[0].clientX;
			}}
			onTouchEnd={(e) => {
				if (toque.current == null) return;
				const delta = e.changedTouches[0].clientX - toque.current;
				toque.current = null;
				// Menos de 40px es un temblor de la mano, no un deslizamiento.
				if (Math.abs(delta) < 40) return;
				ir(indice + (delta < 0 ? 1 : -1));
			}}
		>
			{lista.map((foto, i) => (
				<div
					key={`${foto}-${i}`}
					className={`absolute inset-0 transition-opacity duration-700 ${i === indice ? "opacity-100" : "opacity-0"}`}
					aria-hidden={i !== indice}
				>
					<Foto src={foto} alt={i === indice ? alt : ""} className="h-full w-full object-cover" />
				</div>
			))}

			{/* Flechas: solo de escritorio. En el celular manda el dedo. */}
			<button
				type="button"
				onClick={() => ir(indice - 1)}
				aria-label="Foto anterior"
				className="absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:flex"
			>
				<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
			<button
				type="button"
				onClick={() => ir(indice + 1)}
				aria-label="Foto siguiente"
				className="absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:flex"
			>
				<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>

			{/* Puntos arriba a la derecha: abajo vive el texto del negocio. */}
			<div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-1.5 backdrop-blur-sm">
				{lista.map((foto, i) => (
					<button
						key={`punto-${foto}-${i}`}
						type="button"
						onClick={() => ir(i)}
						aria-label={`Ver foto ${i + 1} de ${lista.length}`}
						aria-current={i === indice}
						// Área táctil mínima sin ensanchar el punto: el padding
						// estira el golpe y el punto sigue midiendo 6px.
						className="size-6 rounded-full p-1.5"
					>
						<span
							className={`block size-3 rounded-full transition ${i === indice ? "bg-white" : "bg-white/45"}`}
						/>
					</button>
				))}
			</div>

			<p className="sr-only">
				Foto {indice + 1} de {lista.length}
			</p>
		</div>
	);
}
