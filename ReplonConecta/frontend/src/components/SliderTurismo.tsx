"use client";

import { useEffect, useState } from "react";

import { FuenteImagen } from "@/components/ui";

/**
 * Galería de una ficha turística. Solo avanza automáticamente mientras
 * el cursor está sobre la imagen; con movimiento reducido queda quieta.
 *
 * `creditos` va alineado por índice con `imagenes`: al filtrar una foto
 * vacía se lleva su crédito, para que nunca se muestre la fuente de otra.
 */
export function SliderTurismo({
	imagenes,
	creditos = [],
	nombre,
}: {
	imagenes: string[];
	creditos?: string[];
	nombre: string;
}) {
	const [activa, setActiva] = useState(0);
	const [encima, setEncima] = useState(false);
	const [movimientoReducido, setMovimientoReducido] = useState(false);
	const lista = imagenes
		.map((imagen, i) => ({
			imagen: imagen.trim(),
			credito: creditos[i]?.trim() ?? "",
		}))
		.filter((item) => item.imagen);

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
	const credito = lista[indice]?.credito ?? "";

	return (
		<div
			role="img"
			aria-label={`${nombre}, ${lista.length} ${lista.length === 1 ? "foto" : "fotos"}`}
			className="absolute inset-0"
			onMouseEnter={() => setEncima(true)}
			onMouseLeave={() => setEncima(false)}
		>
			{lista.map((foto, i) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					key={`${foto.imagen}-${i}`}
					src={foto.imagen}
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
			{credito && (
				<FuenteImagen
					credito={credito}
					oscuro
					className="absolute bottom-2 left-2 z-10 max-w-[calc(100%-5rem)] truncate rounded bg-black/45 px-2 py-1 text-white/85"
				/>
			)}
			{lista.length > 1 && (
				<span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white">
					{indice + 1}/{lista.length}
				</span>
			)}
		</div>
	);
}
