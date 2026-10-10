"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Aviso, Vacio } from "@/components/ui";

/*
 * Piezas compartidas del panel /admin — estilo dense dashboard.
 *
 * Reglas del skill (CRAFT=7, MOTION=3, DENSITY=9):
 *   - Grid de spacing 4/8px estricto: 4, 8, 12, 16, 24. Nunca 5/7/9/10.
 *   - Superficie: blanco + 1px border. Sin glass, sin sombra pesada.
 *   - Radio: 8px máximo (rounded-lg). Nada de rounded-2xl/3xl.
 *   - Botones y controles: h-9 (36px), no h-12 (48px).
 *   - Estados: dot de color semántico, no pill coloreado.
 *   - Números: tabular-nums. IDs y fechas: mono.
 *   - Loading: skeleton rows, no spinner genérico.
 */

/** Botón primario de acción (crear, guardar). */
export const BTN_PRIMARIO =
	"inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-azul px-3 text-[13px] font-medium text-white transition-colors hover:bg-azul/90 disabled:pointer-events-none disabled:opacity-50";

/** Botón secundario (editar, aprobar, cancelar…). */
export const BTN_SECUNDARIO =
	"inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

/** Campo de texto / select del panel. */
export const INPUT =
	"block h-9 w-full rounded-md border border-black/15 bg-white px-2.5 text-[13px] text-black placeholder:text-black/35 focus:border-azul focus:outline-none focus:ring-1 focus:ring-azul/30";

/** Tarjeta: blanco + borde de 1px, sin sombra. */
export const TARJETA = "rounded-lg border border-black/10 bg-white p-4";

/**
 * Dot de estado: 6px, color semántico, sin pill.
 * Regla del skill: "colored status dots (6px, not badges)".
 */
export function PuntoEstado({
	color,
	etiqueta,
}: {
	color: "exito" | "peligro" | "advertencia" | "info" | "neutro";
	etiqueta: string;
}) {
	const fondo =
		color === "exito"
			? "bg-exito"
			: color === "peligro"
				? "bg-peligro"
				: color === "advertencia"
					? "bg-advertencia"
					: color === "info"
						? "bg-info"
						: "bg-black/25";
	return (
		<span className="inline-flex items-center gap-1.5 text-[12px] text-black/70">
			<span className={`size-1.5 shrink-0 rounded-full ${fondo}`} aria-hidden />
			{etiqueta}
		</span>
	);
}

/**
 * Fila de skeleton que imita la estructura de una tabla.
 * Se pinta mientras carga; reemplaza al spinner genérico.
 */
export function SkeletonFila({ columnas = 4 }: { columnas?: number }) {
	return (
		<div className="flex items-center gap-4 border-b border-black/5 px-3 py-2.5">
			{Array.from({ length: columnas }, (_, i) => (
				<div
					key={i}
					className={`h-3 animate-pulse rounded bg-black/[.06] ${
						i === 0 ? "w-32" : i === columnas - 1 ? "ml-auto w-16" : "flex-1"
					}`}
				/>
			))}
		</div>
	);
}

/**
 * Encabezado de sección del panel.
 * Sentence case (nunca uppercase en headings del dashboard).
 */
export function SeccionAdmin({
	titulo,
	descripcion,
	children,
}: {
	titulo: string;
	descripcion?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="mt-6 first:mt-0">
			<h2 className="text-[15px] font-medium leading-tight text-black">{titulo}</h2>
			{descripcion && (
				<p className="mt-0.5 text-[12px] leading-snug text-black/50">{descripcion}</p>
			)}
			{children}
		</section>
	);
}

/**
 * Pila de avisos de una sección.
 */
export function AvisosSeccion({
	accion,
	exito,
	carga,
}: {
	accion?: string | null;
	exito?: string | null;
	carga?: string | null;
}) {
	if (!accion && !exito && !carga) return null;
	return (
		<div className="mt-2 space-y-1.5">
			{accion && <Aviso tono="error">{accion}</Aviso>}
			{exito && <Aviso tono="ok">{exito}</Aviso>}
			{carga && <Aviso tono="error">{carga}</Aviso>}
		</div>
	);
}

/**
 * Estado de una lista: skeleton mientras carga, vacío si no hay datos.
 */
export function BloqueEstado({
	cargando,
	vacio,
	vacioTitulo,
	skeletonColumnas = 4,
	children,
}: {
	cargando: boolean;
	vacio?: boolean;
	vacioTitulo?: string;
	skeletonColumnas?: number;
	children: ReactNode;
}) {
	if (cargando) {
		return (
			<div className="mt-3 overflow-hidden rounded-lg border border-black/10 bg-white">
				{Array.from({ length: 5 }, (_, i) => (
					<SkeletonFila key={i} columnas={skeletonColumnas} />
				))}
			</div>
		);
	}
	if (vacio) {
		return (
			<div className="mt-3">
				<Vacio titulo={vacioTitulo ?? "No hay registros"} />
			</div>
		);
	}
	return <>{children}</>;
}

/**
 * Envoltorio de tabla densa: overflow-x, borde, fondo blanco.
 * La thead sticky se pone dentro, en cada tabla.
 */
export function TablaDensa({ children }: { children: ReactNode }) {
	return (
		<div className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-white">
			{children}
		</div>
	);
}

/**
 * Fila de tabla con hover sutil (80ms, sin translate).
 */
export function FilaTabla({
	children,
	onAccion,
}: {
	children: ReactNode;
	onAccion?: () => void;
}) {
	return (
		<tr
			onClick={onAccion}
			className={`border-b border-black/5 transition-colors last:border-b-0 hover:bg-black/[.03] ${
				onAccion ? "cursor-pointer" : ""
			}`}
		>
			{children}
		</tr>
	);
}

/**
 * Celda de tabla: px-3 py-2, 13px.
 * `num` alinea a la derecha y activa tabular-nums.
 * `mono` usa la fuente monoespaciada para IDs / timestamps.
 */
export function CeldaTabla({
	children,
	num,
	mono,
	className = "",
}: {
	children: ReactNode;
	num?: boolean;
	mono?: boolean;
	className?: string;
}) {
	return (
		<td
			className={`px-3 py-2 text-[13px] leading-snug ${
				num ? "text-right tabular" : ""
			} ${mono ? "font-mono text-[12px] text-black/60" : ""} ${className}`}
		>
			{children}
		</td>
	);
}

/**
 * Encabezado de columna: sentence case, 500, secondary color.
 * Nunca uppercase (regla del skill).
 */
export function ThDensa({
	children,
	num,
	className = "",
}: {
	children: ReactNode;
	num?: boolean;
	className?: string;
}) {
	return (
		<th
			scope="col"
			className={`px-3 py-2 text-[12px] font-medium text-black/50 ${
				num ? "text-right" : "text-left"
			} ${className}`}
		>
			{children}
		</th>
	);
}

/**
 * Ventana flotante para crear/editar.
 * Radio 8px, sin glass, sin sombra pesada.
 */
export function VentanaAdmin({
	abierto,
	onCerrar,
	titulo,
	ancho = "normal",
	children,
}: {
	abierto: boolean;
	onCerrar: () => void;
	titulo: string;
	ancho?: "normal" | "ancho";
	children: ReactNode;
}) {
	const panel = useRef<HTMLDivElement>(null);
	const alCerrar = useRef(onCerrar);
	const quienAbrio = useRef<HTMLElement | null>(null);

	useEffect(() => {
		alCerrar.current = onCerrar;
	}, [onCerrar]);

	useEffect(() => {
		if (!abierto) return;
		quienAbrio.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const alPulsar = (e: KeyboardEvent) => {
			if (e.key === "Escape") alCerrar.current();
		};
		document.addEventListener("keydown", alPulsar);
		document.body.style.overflow = "hidden";
		panel.current?.focus();
		return () => {
			document.removeEventListener("keydown", alPulsar);
			document.body.style.overflow = "";
			quienAbrio.current?.focus();
			quienAbrio.current = null;
		};
	}, [abierto]);

	if (!abierto) return null;

	return (
		<div className="fixed inset-0 z-[900] flex items-end justify-center bg-black/40 p-4 sm:items-center">
			<div
				ref={panel}
				role="dialog"
				aria-modal="true"
				aria-label={titulo}
				tabIndex={-1}
				className={`max-h-[85vh] w-full overflow-y-auto rounded-lg border border-black/10 bg-white outline-none ${
					ancho === "ancho" ? "max-w-2xl" : "max-w-lg"
				}`}
			>
				<div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-2.5">
					<h3 className="text-[15px] font-medium">{titulo}</h3>
					<button
						type="button"
						onClick={onCerrar}
						aria-label="Cerrar ventana"
						className="flex size-7 shrink-0 items-center justify-center rounded-md text-black/50 transition-colors hover:bg-black/[.05] hover:text-black"
					>
						✕
					</button>
				</div>
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
}
