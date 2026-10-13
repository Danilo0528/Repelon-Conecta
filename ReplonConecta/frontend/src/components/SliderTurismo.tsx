"use client";

import { useEffect, useState } from "react";

/**
 * Galería de una ficha turística. Solo avanza automáticamente mientras
 * el cursor está sobre la imagen; con movimiento reducido queda quieta.
 */
export function SliderTurismo({
	imagenes,
	nombre,
}: {
	imagenes: string[];
	nombre: string;
}) {
	const [activa, setActiva] = useState(0);
	const [encima, setEncima] = useState(false);
	const [movimientoReducido, setMovimientoReducido] = useState(false);
	const lista = imagenes.filter((imagen) => imagen.trim());

	useEffect(() => {
		const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
		const actualizar = () => setMovimientoReducido(consulta.matches);
		actualizar();
		consulta.addEventListener("change", actualizar);
		return () => consulta.removeEventListener("change", actualizar);
	}, []);

	useEffect(() => {
		if (!encima || movimientoReducido || lista.length < 2) return;
		const intervalo = window.setInterval(
			() => setActiva((actual) => (actual + 1) % lista.length),
			2200,
		);
		return () => window.clearInterval(intervalo);
	}, [encima, lista.length, movimientoReducido]);

	if (lista.length === 0) return null;
	const indice = activa % lista.length;

	return (
		<div
			role="img"
			aria-label={`${nombre}, ${lista.length} ${lista.length === 1 ? "foto" : "fotos"}`}
			className="absolute inset-0"
			onMouseEnter={() => setEncima(true)}
			onMouseLeave={() => setEncima(false)}
		>
			{lista.map((imagen, i) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					key={`${imagen}-${i}`}
					src={imagen}
					alt=""
					aria-hidden="true"
					onError={(e) => {
						e.currentTarget.style.display = "none";
					}}
					className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${
						i === indice ? "opacity-100" : "opacity-0"
					}`}
				/>
			))}
			{lista.length > 1 && (
				<span className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white">
					{indice + 1}/{lista.length}
				</span>
			)}
		</div>
	);
}
