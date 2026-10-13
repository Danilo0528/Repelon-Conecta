"use client";

import { useState, type ChangeEvent } from "react";

import { Foto } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/env";
import { subirImagen } from "@/lib/subirImagen";
import type { NegocioDetalle } from "@/lib/tipos";
import { BTN_SECUNDARIO, INPUT } from "./ui-admin";

const MAXIMO = 10;

const BTN_SUBIR =
	"inline-flex h-9 cursor-pointer items-center rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

const BTN_ICONO =
	"flex size-6 items-center justify-center rounded border border-black/10 text-[11px] leading-none text-black/60 transition-colors hover:bg-black/[.06] disabled:pointer-events-none disabled:opacity-30";

/*
 * Galería de la ficha del negocio: las fotos que se deslizan en
 * /negocios/{slug}.
 *
 * Cada cambio se guarda de inmediato, igual que el logo de arriba: no
 * hay un botón "Guardar fotos" aparte, así que cerrar el modal sin más
 * no pierde nada de lo cargado. Se manda la lista entera y en orden,
 * porque ese orden es el orden en que el visitante ve deslizar.
 *
 * Las dos vías que pidió el cliente viven juntas: subir el archivo al
 * bucket de Supabase, o pegar un enlace (Drive, Cloudinary, la web del
 * negocio) sin tocar Supabase.
 */
export function EditorGaleria({
	negocioId,
	imagenes,
	onCambio,
	onAviso,
	onError,
}: {
	negocioId: string;
	imagenes: string[];
	onCambio: (nuevas: string[]) => void;
	onAviso: (mensaje: string) => void;
	onError: (mensaje: string | null) => void;
}) {
	const [url, setUrl] = useState("");
	const [subiendo, setSubiendo] = useState(false);

	async function guardar(nuevas: string[]) {
		onError(null);
		const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${negocioId}`, {
			method: "PUT",
			body: JSON.stringify({ imagenes: nuevas }),
		});
		onCambio(actualizado.imagenes);
	}

	function lleno() {
		if (imagenes.length >= MAXIMO) {
			onError(`La galería admite hasta ${MAXIMO} fotos.`);
			return true;
		}
		return false;
	}

	async function subirArchivo(evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo || lleno()) return;
		setSubiendo(true);
		try {
			const subida = await subirImagen("negocios", negocioId, archivo);
			await guardar([...imagenes, subida]);
			onAviso("Foto agregada a la galería.");
		} catch (e) {
			onError(e instanceof Error ? e.message : "No se pudo subir la foto.");
		} finally {
			setSubiendo(false);
		}
	}

	function agregarPorUrl() {
		const limpia = url.trim();
		if (!limpia || lleno()) return;
		if (!/^https?:\/\/.+/.test(limpia)) {
			onError("La URL debe empezar con https://");
			return;
		}
		setUrl("");
		guardar([...imagenes, limpia]).catch((e: unknown) =>
			onError(e instanceof Error ? e.message : "No se pudo agregar la foto."),
		);
	}

	function quitar(indice: number) {
		guardar(imagenes.filter((_, i) => i !== indice)).catch((e: unknown) =>
			onError(e instanceof Error ? e.message : "No se pudo quitar la foto."),
		);
	}

	function mover(indice: number, delta: number) {
		const destino = indice + delta;
		if (destino < 0 || destino >= imagenes.length) return;
		const nuevas = [...imagenes];
		[nuevas[indice], nuevas[destino]] = [nuevas[destino], nuevas[indice]];
		guardar(nuevas).catch((e: unknown) =>
			onError(e instanceof Error ? e.message : "No se pudo reordenar la galería."),
		);
	}

	return (
		<div className="space-y-2">
			{!supabaseConfigurado && (
				<p className="text-[12px] text-black/50">
					Falta configurar Supabase para subir archivos; usa &quot;Agregar por URL&quot;.
				</p>
			)}

			{imagenes.length > 0 ? (
				<ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
					{imagenes.map((foto, i) => (
						<li key={`${foto}-${i}`} className="space-y-1">
							<Foto
								src={foto}
								alt={`Foto ${i + 1} de la galería`}
								className="aspect-[4/3] w-full rounded-md object-cover"
							/>
							<div className="flex items-center justify-between gap-1">
								<span className="text-[10px] text-black/40">{i + 1}</span>
								<div className="flex gap-0.5">
									<button
										type="button"
										onClick={() => mover(i, -1)}
										disabled={i === 0}
										aria-label={`Poner la foto ${i + 1} antes`}
										className={BTN_ICONO}
									>
										‹
									</button>
									<button
										type="button"
										onClick={() => mover(i, 1)}
										disabled={i === imagenes.length - 1}
										aria-label={`Poner la foto ${i + 1} después`}
										className={BTN_ICONO}
									>
										›
									</button>
									<button
										type="button"
										onClick={() => quitar(i)}
										aria-label={`Quitar la foto ${i + 1}`}
										className={BTN_ICONO}
									>
										✕
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className="text-[12px] text-black/45">
					Sin fotos todavía. Mientras no haya galería, la ficha del negocio
					muestra el logo.
				</p>
			)}

			<div className="flex flex-wrap items-center gap-2">
				<label className={BTN_SUBIR}>
					{subiendo ? "Subiendo…" : "Subir archivo"}
					<input
						type="file"
						accept="image/*"
						className="sr-only"
						disabled={!supabaseConfigurado || subiendo || imagenes.length >= MAXIMO}
						onChange={(e) => void subirArchivo(e)}
					/>
				</label>
				<input
					type="text"
					inputMode="url"
					maxLength={500}
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							agregarPorUrl();
						}
					}}
					placeholder="https://…/foto.jpg"
					aria-label="URL de la foto"
					className={`${INPUT} min-w-0 flex-1 basis-40`}
				/>
				<button
					type="button"
					onClick={agregarPorUrl}
					disabled={!url.trim() || imagenes.length >= MAXIMO}
					className={BTN_SECUNDARIO}
				>
					Agregar por URL
				</button>
			</div>

			<p className="text-[11px] text-black/40">
				{imagenes.length}/{MAXIMO} fotos · el orden de aquí es el del
				deslizamiento en la ficha.
			</p>
		</div>
	);
}
