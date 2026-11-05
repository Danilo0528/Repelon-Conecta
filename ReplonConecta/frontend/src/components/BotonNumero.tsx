"use client";

import { useState } from "react";

import { CLASE_BOTON_NEUTRO } from "@/components/ui";

/*
 * "Mostrar número" del vendedor (ficha del negocio).
 *
 * El número NO se sirve visible en el HTML: mientras nadie lo pide,
 * el DOM solo tiene el botón, así los bots y el rastreo de índices
 * no recolectan teléfonos. Al tocar, se revela en el mismo sitio
 * (sin modal) con enlace `tel:` para llamar y botón de copiar.
 *
 * WhatsApp sigue siendo el canal principal; esto es el alternativo
 * para quien prefiera llamar. Si el negocio no tiene teléfono, no
 * se pinta nada.
 */
export function BotonNumero({ telefono }: { telefono: string | null }) {
	const [visible, setVisible] = useState(false);
	const [copiado, setCopiado] = useState(false);

	const numero = telefono?.trim() ?? "";
	if (!numero) return null;

	const enlaceTel = `tel:${numero.replace(/[^\d+]/g, "")}`;

	async function copiar() {
		try {
			await navigator.clipboard.writeText(numero);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2000);
		} catch {
			// Sin portapapeles (o permiso denegado): el número ya está a la vista.
		}
	}

	if (!visible) {
		return (
			<button
				type="button"
				className={CLASE_BOTON_NEUTRO}
				onClick={() => setVisible(true)}
			>
				<svg
					className="h-5 w-5 shrink-0"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden
				>
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
						strokeLinejoin="round"
					/>
				</svg>
				Mostrar número
			</button>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<a href={enlaceTel} className={`${CLASE_BOTON_NEUTRO} w-auto flex-1`}>
				<svg
					className="h-5 w-5 shrink-0"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden
				>
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
						strokeLinejoin="round"
					/>
				</svg>
				{numero}
			</a>
			<button
				type="button"
				onClick={copiar}
				className="min-h-12 shrink-0 rounded-xl border border-black/15 px-4 text-sm font-semibold transition hover:bg-black/[.04] active:scale-[.98]"
			>
				{copiado ? "¡Copiado!" : "Copiar"}
			</button>
		</div>
	);
}
