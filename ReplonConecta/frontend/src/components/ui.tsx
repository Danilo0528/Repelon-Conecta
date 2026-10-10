"use client";

import { useState } from "react";

import { CLASE_ESTADO, ETIQUETA_ESTADO } from "@/lib/format";
import type { EstadoPedido } from "@/lib/tipos";

/** Piezas de interfaz pequeñas y repetidas en varias pantallas. */

/*
 * Clases de los botones de acción.
 *
 * Se exportan como constantes y no como componente porque las dos cosas
 * que se pintan con ellas son un <button> y un <Link> de Next, y un
 * componente que devuelve cualquiera de los dos se complica por nada.
 *
 * `min-h-12` son 48 px: el mínimo que la app se compromete a respetar en
 * todo botón, porque se usa con el pulgar y a veces sin mirar.
 */
export const CLASE_BOTON_AZUL =
	"flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-azul px-4 py-3 text-center font-semibold text-white disabled:opacity-50";

export const CLASE_BOTON_NEUTRO =
	"flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-black/15 px-4 py-3 text-center font-semibold disabled:opacity-50";

/*
 * Botón verde principal: el de WhatsApp en la ficha del vendedor. Es la
 * ÚLTIMA acción de toda la app (ahí cierra el trato), así que lleva el
 * verde de la marca y sombra para que se vea como lo que es: el botón
 * grande de la pantalla.
 */
export const CLASE_BOTON_VERDE =
	"flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-leaf px-4 py-3 text-center font-semibold text-white shadow-leaf disabled:opacity-50";

/*
 * Botones de la fila de acciones de la hoja del mapa ("Ver negocio" /
 * "Cómo llegar"): van alineados a la derecha y miden lo que dicen, no
 * el ancho de la pantalla, así que no llevan `w-full`. El alto sigue
 * siendo `min-h-12` (48 px), el mínimo que la app se compromete a
 * respetar en todo lo que se toca con el pulgar.
 */
export const CLASE_BOTON_AZUL_ANCHO =
	"flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-azul px-4 text-sm font-semibold text-white disabled:opacity-50";

export const CLASE_BOTON_AZUL_CONTORNO_ANCHO =
	"flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-azul bg-white px-4 text-sm font-semibold text-azul disabled:opacity-50";

/*
 * Chip de filtro: "Todos", una categoría, "Abiertos ahora".
 *
 * Vive en la tira que va debajo del buscador (home) y se repite en la
 * lista, así que el color del estado activo está en un solo sitio. Lleva
 * `shadow-sm` porque sobre el mapa el blanco sin sombra se pierde entre
 * losuces de las calles; en la lista, sobre blanco, casi no se nota.
 *
 * `icono` va aparte de `children` para que el icono no dependa del texto
 * y para poder alinearlos siempre igual, tenga o no el chip dos líneas.
 */
export function Chip({
	activo,
	onClick,
	icono,
	children,
}: {
	activo: boolean;
	onClick: () => void;
	icono?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={activo}
			className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium shadow-sm ${
				activo ? "bg-verde text-white" : "border border-black/10 bg-white text-black/70"
			}`}
		>
			{icono && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icono}</span>}
			{children}
		</button>
	);
}

export function Cargando({ texto = "Cargando…" }: { texto?: string }) {
	return (
		<div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-black/60">
			<span className="h-4 w-4 animate-spin rounded-full border-2 border-verde border-t-transparent" />
			{texto}
		</div>
	);
}

export function Aviso({
	tono = "error",
	children,
}: {
	tono?: "error" | "ok" | "info";
	children: React.ReactNode;
}) {
	const clases =
		tono === "error"
			? "border-black/15 bg-black/[.04] text-black"
			: tono === "ok"
				? "border-verde bg-verde/10 text-black"
				: "border-azul bg-azul/10 text-black";

	return (
		<div className={`rounded-xl border px-3 py-2 text-sm ${clases}`} role="status">
			{children}
		</div>
	);
}

export function Vacio({
	titulo,
	texto,
	children,
}: {
	titulo: string;
	texto?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="px-6 py-16 text-center">
			<p className="text-base font-semibold">{titulo}</p>
			{texto && <p className="mx-auto mt-1 max-w-xs text-sm text-black/60">{texto}</p>}
			{/* En PC el botón no se estira al ancho de la pantalla. */}
			{children && <div className="mx-auto mt-4 max-w-sm">{children}</div>}
		</div>
	);
}

export function EtiquetaEstado({ estado }: { estado: EstadoPedido }) {
	return (
		<span
			className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${CLASE_ESTADO[estado]}`}
		>
			{ETIQUETA_ESTADO[estado]}
		</span>
	);
}

/*
 * Si el negocio está abierto o cerrado.
 *
 * Sale en la tarjeta del home, en la ficha, en la lista y en el panel
 * del vendedor: cuatro pantallas deben decirlo igual, así que el color
 * y el texto viven en un solo sitio. Va en pastilla suave (verde sobre
 * verde muy claro, gris sobre gris) como en la plantilla: un punto de
 * color se lee antes que un bloque macizo.
 */
export function InsigniaAbierto({ abierto }: { abierto: boolean }) {
	return (
		<span
			className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
				abierto ? "bg-leaf/10 text-leaf" : "bg-black/5 text-muted-foreground"
			}`}
		>
			<span
				className={`h-1.5 w-1.5 rounded-full ${abierto ? "bg-leaf" : "bg-muted-foreground"}`}
				aria-hidden
			/>
			{abierto ? "Abierto" : "Cerrado"}
		</span>
	);
}

/**
 * Normaliza URLs de imagen para que funcionen como <img src>.
 *
 * Imgur: "https://imgur.com/abc123" no sirve como imagen directa;
 * necesita "https://i.imgur.com/abc123.jpg". Las URLs que ya apuntan a
 * i.imgur.com o que no son de Imgur pasan sin tocar.
 */
export function normalizarUrlImagen(url: string): string {
	const t = url.trim();
	// https://imgur.com/XXXXX o http://imgur.com/XXXXX (sin /a/ ni /gallery/)
	const m = t.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
	if (m) return `https://i.imgur.com/${m[1]}.jpg`;
	return t;
}

/*
 * Foto de producto o logo del negocio.
 *
 * Va con <img> y no con next/image a propósito: las fotos viven en el
 * bucket de Supabase, cuyo dominio cambia según la instalación, y no hay
 * forma de declararlo en next.config.ts sin conocer la URL al compilar.
 * Con <img> la foto sale siempre; con next/image, si el patrón no calza,
 * sale un hueco roto en la mitad de la pantalla.
 */
export function Foto({
	src,
	alt,
	className = "",
}: {
	src: string | null;
	alt: string;
	className?: string;
}) {
	/*
	 * Si la URL dejó de servir (foto subida hace rato, archivo borrado,
	 * dominio que cambió) el navegador dibujaría el icono de imagen
	 * rota. Acá se cae en el mismo "sin foto" que cuando no hay URL,
	 * y se recuerda cuál falló: si más adelante llega otra foto, se
	 * vuelve a intentar con ella.
	 */
	const [fallaEn, setFallaEn] = useState<string | null>(null);

	const url = src ? normalizarUrlImagen(src) : null;

	if (!url || fallaEn === url) {
		return (
			<div
				className={`flex items-center justify-center bg-black/[.05] ${className}`}
				role="img"
				aria-label={`${alt} (sin foto)`}
			>
				<svg
					className="h-1/3 w-1/3 text-black/20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					aria-hidden
				>
					<path d="M4 8h16l-1 12H5L4 8z" strokeLinejoin="round" />
					<path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" strokeLinecap="round" />
				</svg>
			</div>
		);
	}

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={url}
			alt={alt}
			loading="lazy"
			onError={() => setFallaEn(url)}
			className={`object-cover ${className}`}
		/>
	);
}
