import type { ReactNode } from "react";

import type { MotivoTurismo } from "@/lib/turismo";

/*
 * Contenido estático del home: las tarjetas de "Para quién sirve", las
 * del Fondo Emprender y los trazos decorativos de las fichas de
 * turismo. Son datos de presentación; viven fuera de page.tsx para que
 * las secciones solo se ocupen del layout.
 */

export const RAZONES = [
	{
		titulo: "Publica tu negocio",
		texto: "Muestra tus productos, precios y fotos a los vecinos.",
		tono: "bg-leaf/10 text-leaf",
		icono: (
			<>
				<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
				<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
				<path d="M9.5 20v-5.5h5V20" strokeLinejoin="round" />
			</>
		),
	},
	{
		titulo: "Habla directamente",
		texto: "Los vecinos pueden consultarte por WhatsApp desde cada tarjeta.",
		tono: "bg-azul/10 text-azul",
		icono: (
			<>
				<rect x="6.5" y="2.5" width="11" height="19" rx="2.5" strokeLinejoin="round" />
				<path d="M10.5 18.5h3" strokeLinecap="round" />
			</>
		),
	},
	{
		titulo: "Encuentra comercios cercanos",
		texto: "Consulta el mapa para saber dónde queda cada negocio.",
		tono: "bg-cielo/25 text-azul",
		icono: (
			<>
				<circle cx="6" cy="17" r="3.2" strokeLinejoin="round" />
				<circle cx="18" cy="17" r="3.2" strokeLinejoin="round" />
				<path d="M9 17h6l-2.5-7H8" strokeLinejoin="round" />
				<path d="M12.5 10 14.5 6h3" strokeLinecap="round" strokeLinejoin="round" />
			</>
		),
	},
];

/**
 * Las tres promesas de la sección Fondo Emprender: qué ofrece el fondo
 * del SENA en una tarjeta cada una (el detalle largo vive en
 * /fondo-emprender, acá solo se cuenta qué es).
 */
export const FONDO_EMPRENDER = [
	{
		titulo: "Capital semilla",
		texto: "Recursos para crear o fortalecer tu negocio. Si cumples las metas, se condonan: no devuelves nada.",
		icono: (
			<>
				<circle cx="12" cy="12" r="8.2" />
				<path d="M12 7.4v9.2M14.4 9.6c-.6-.6-1.4-.9-2.4-.9-1.3 0-2.4.7-2.4 1.8 0 2.5 4.9 1.3 4.9 3.9 0 1.1-1.1 1.8-2.4 1.8-1 0-1.9-.3-2.5-1" strokeLinecap="round" />
			</>
		),
	},
	{
		titulo: "Ruta Emprendedora",
		texto: "Te acompañan paso a paso para idear el negocio y formular tu plan, sin costo y con orientadores del SENA.",
		icono: (
			<>
				<circle cx="6.5" cy="6.5" r="2.4" />
				<circle cx="17.5" cy="17.5" r="2.4" />
				<path d="M8.9 6.5h5.1a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.1" strokeLinecap="round" />
			</>
		),
	},
	{
		titulo: "Postulas desde aquí",
		texto: "Individual o en grupo. Repelón Conecta te sirve para mostrar tu catálogo mientras formules el proyecto.",
		icono: (
			<>
				<path d="M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" strokeLinejoin="round" />
				<path d="M13 3.5V9h5M8.5 13.5h7M8.5 17h4.5" strokeLinecap="round" />
			</>
		),
	},
];

/**
 * Fondo pastel de la ilustración de respaldo de cada ficha turística.
 * Si la ficha tiene `imagen`, el fondo no se pinta (la foto lo tapa).
 */
export const FONDO_MOTIVO: Record<MotivoTurismo, string> = {
	agua: "bg-gradient-to-br from-blob-3 via-cielo/40 to-blob-2",
	barco: "bg-gradient-to-br from-cielo/50 via-blob-3 to-blob-2/70",
	aves: "bg-gradient-to-br from-blob-1/80 via-blob-3/60 to-cielo/40",
	naturaleza: "bg-gradient-to-br from-blob-1 via-mist to-blob-3/60",
	parque: "bg-gradient-to-br from-blob-1/90 via-cielo/30 to-blob-3",
	pueblo: "bg-gradient-to-br from-blob-3/80 via-blob-1/60 to-mist",
};

/** Trazo decorativo del motivo; va tenue a un costado de la banda. */
export const MOTIVO_TRAZO: Record<MotivoTurismo, ReactNode> = {
	agua: (
		<>
			<circle cx="17" cy="7" r="3" />
			<path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
			<path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
			<path d="M3 21c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
		</>
	),
	barco: (
		<>
			<path d="M12 4v10" />
			<path d="M12.8 5.5 18 14h-5.2z" />
			<path d="M4.5 15.5h15l-2 4H6.5z" />
		</>
	),
	aves: (
		<>
			<path d="M3 9c2-3 4-3 6 0" />
			<path d="M11 9c2-3 4-3 6 0" />
			<path d="M7 15c1.5-2 3-2 4.5 0" />
			<path d="M14 15c1.5-2 3-2 4.5 0" />
		</>
	),
	naturaleza: (
		<>
			<path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" />
			<path d="M5 19 14 10" />
		</>
	),
	parque: (
		<>
			<circle cx="12" cy="9" r="5.5" />
			<path d="M12 14.5V21" />
			<path d="M7.5 21h9" />
		</>
	),
	pueblo: (
		<>
			<path d="M3.5 20.5v-6l4-3 4 3v6" />
			<path d="M13 20.5v-8l4.5-3 4.5 3v8" />
			<path d="M17.5 9.5V6.5" />
			<path d="M16.4 7.7h2.2" />
			<path d="M2 20.5h20" />
		</>
	),
};
