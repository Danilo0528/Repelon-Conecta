"use client";

import { SeccionComercios } from "./_inicio/SeccionComercios";
import { SeccionFondo } from "./_inicio/SeccionFondo";
import { SeccionHero } from "./_inicio/SeccionHero";
import { SeccionMapa } from "./_inicio/SeccionMapa";
import { SeccionRazones } from "./_inicio/SeccionRazones";
import { SeccionTurismo } from "./_inicio/SeccionTurismo";
import { useInicio } from "./_inicio/useInicio";

/*
 * Home de Repelón Conecta: puerta de entrada al pueblo digitalizado.
 *
 * El estado, los datos y los derivados viven en _inicio/useInicio, y
 * cada bloque visual en su propio archivo dentro de _inicio/ (carpeta
 * privada de Next: no genera ruta). Este archivo solo decide el orden
 * de las secciones, así que leerlo de arriba a abajo es leer el home.
 */
export default function Inicio() {
	const inicio = useInicio();

	return (
		<div className="m-0 p-0">
			<SeccionHero inicio={inicio} />
			<SeccionMapa inicio={inicio} />
			<SeccionTurismo inicio={inicio} />
			<SeccionComercios inicio={inicio} />
			<SeccionFondo inicio={inicio} />
			<SeccionRazones inicio={inicio} />
		</div>
	);
}
