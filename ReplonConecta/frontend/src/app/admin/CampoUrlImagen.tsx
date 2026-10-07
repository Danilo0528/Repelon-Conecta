"use client";

import { useState } from "react";

import { BTN_PRIMARIO, BTN_SECUNDARIO } from "./ui-admin";

/*
 * Imagen por URL: pegan un enlace (Drive, Cloudinary, la web del
 * cliente…) y queda guardada igual que un archivo subido. Es la vía
 * rápida para cargar muchas imágenes sin tocar Supabase ni el código.
 * Si había una imagen y el campo queda vacío, "Quitar" la borra.
 *
 * Vive en el panel porque lo usan el bloque de negocios (logo y fotos
 * de productos) y puede seguir creciendo con otras pantallas admin.
 */
export function CampoUrlImagen({
	valor,
	etiqueta,
	onGuardar,
}: {
	valor: string | null;
	etiqueta: string;
	onGuardar: (url: string) => Promise<void>;
}) {
	const [abierto, setAbierto] = useState(false);
	const [texto, setTexto] = useState("");
	const [guardando, setGuardando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function guardar(url: string) {
		setError(null);
		setGuardando(true);
		try {
			await onGuardar(url);
			setAbierto(false);
			setTexto("");
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo guardar la imagen.");
		} finally {
			setGuardando(false);
		}
	}

	if (!abierto) {
		return (
			<button
				type="button"
				onClick={() => {
					setTexto(valor ?? "");
					setError(null);
					setAbierto(true);
				}}
				aria-label={`Poner URL (${etiqueta})`}
				className={BTN_SECUNDARIO}
			>
				Poner URL
			</button>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const url = texto.trim();
				if (url === "") {
					if (valor) {
						void guardar(""); // quitar la imagen
					} else {
						setError("Escribe una URL o cancela.");
					}
					return;
				}
				if (!/^https?:\/\/.+/.test(url)) {
					setError("La URL debe empezar con https://");
					return;
				}
				void guardar(url);
			}}
			className="flex w-full basis-full flex-wrap items-center gap-2"
		>
			<input
				type="text"
				inputMode="url"
				autoFocus
				maxLength={500}
				value={texto}
				onChange={(e) => setTexto(e.target.value)}
				placeholder="https://…/foto.jpg"
				aria-label={`URL (${etiqueta})`}
				className="min-h-12 min-w-0 flex-1 rounded-xl border border-black/15 px-3 py-2 text-sm"
			/>
			<button type="submit" disabled={guardando} className={BTN_PRIMARIO}>
				{guardando
					? "Guardando…"
					: texto.trim() === "" && valor
						? "Quitar"
						: "Guardar"}
			</button>
			<button
				type="button"
				onClick={() => {
					setAbierto(false);
					setError(null);
				}}
				disabled={guardando}
				className={BTN_SECUNDARIO}
			>
				Cancelar
			</button>
			{error && <p className="w-full text-xs text-red-600">{error}</p>}
		</form>
	);
}
