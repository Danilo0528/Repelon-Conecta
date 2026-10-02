"use client";

import { CLASE_ESTADO, ETIQUETA_ESTADO } from "@/lib/format";
import type { EstadoPedido } from "@/lib/tipos";

/** Piezas de interfaz pequeñas y repetidas en varias pantallas. */

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
			{children && <div className="mt-4">{children}</div>}
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
