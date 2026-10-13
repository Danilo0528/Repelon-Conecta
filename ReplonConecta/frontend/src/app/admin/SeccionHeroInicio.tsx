"use client";

import { useState, type ChangeEvent } from "react";

import { Foto } from "@/components/ui";
import { api, apiConSesion } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/env";
import { CLAVE_IMAGENES_HERO, imagenesInicio } from "@/lib/inicio";
import { subirImagen } from "@/lib/subirImagen";
import { useDatos } from "@/lib/useDatos";
import {
	AvisosSeccion,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	INPUT,
	SeccionAdmin,
	VentanaAdmin,
} from "./ui-admin";

const MAXIMO = 10;

const BTN_SUBIR =
	"inline-flex h-9 cursor-pointer items-center rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

const BTN_ICONO =
	"flex size-6 items-center justify-center rounded border border-black/10 text-[11px] leading-none text-black/60 transition-colors hover:bg-black/[.06] disabled:pointer-events-none disabled:opacity-30";

/*
 * Sección "Imágenes del inicio": el deslizamiento que rota solo detrás
 * del titular del home. Siempre estuvo hardcodeado en el código; ahora
 * el panel lo guarda en la misma lista de claves que los textos del
 * home, así que cambiarlo no toca el repo ni vuelve a desplegar.
 *
 * Guarda en el momento, igual que la galería de un negocio: no hay un
 * botón "Guardar fotos" aparte. Vaciar la lista y guardar RESTAURA las
 * cinco imágenes de siempre, porque el backend borra la clave en vez
 * de guardar una lista vacía.
 */
export function SeccionHeroInicio() {
	const { datos, cargando, error, setDatos } = useDatos<Record<string, string>>(
		() => api<Record<string, string>>("/api/inicio/textos"),
	);

	const [ventana, setVentana] = useState(false);
	const [subiendo, setSubiendo] = useState(false);
	const [url, setUrl] = useState("");
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	// Lo que el home pinta hoy: los overrides del servidor o las
	// imágenes por defecto, ya parseadas. Cada cambio se guarda de
	// inmediato, así que no hay una copia local que sincronizar.
	const lista = imagenesInicio(datos);

	async function guardar(nuevas: string[]) {
		setErrorAccion(null);
		setAviso(null);
		try {
			// Lista vacía = clave en blanco = el backend la borra y el
			// home vuelve a las imágenes por defecto.
			const cuerpo = nuevas.length
				? JSON.stringify(nuevas)
				: "";
			const guardados = await apiConSesion<Record<string, string>>(
				"/api/inicio/textos",
				{ method: "PUT", body: JSON.stringify({ [CLAVE_IMAGENES_HERO]: cuerpo }) },
			);
			setDatos(guardados);
			setAviso(
				nuevas.length
					? "Guardado. La portada ya rota estas imágenes."
					: "Restauradas las imágenes por defecto de la portada.",
			);
		} catch (e) {
			setErrorAccion(
				e instanceof Error ? e.message : "No se pudieron guardar las imágenes.",
			);
		}
	}

	function lleno(): boolean {
		if (lista.length >= MAXIMO) {
			setErrorAccion(`El deslizamiento admite hasta ${MAXIMO} imágenes.`);
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
			const subida = await subirImagen("inicio", "hero", archivo);
			await guardar([...lista, subida]);
		} catch (e) {
			setErrorAccion(
				e instanceof Error ? e.message : "No se pudo subir la imagen.",
			);
		} finally {
			setSubiendo(false);
		}
	}

	function agregarPorUrl() {
		const limpia = url.trim();
		if (!limpia || lleno()) return;
		if (!/^https?:\/\/.+/.test(limpia)) {
			setErrorAccion("La URL debe empezar con https://");
			return;
		}
		setUrl("");
		void guardar([...lista, limpia]);
	}

	function quitar(indice: number) {
		void guardar(lista.filter((_, i) => i !== indice));
	}

	function mover(indice: number, delta: number) {
		const destino = indice + delta;
		if (destino < 0 || destino >= lista.length) return;
		const nuevas = [...lista];
		[nuevas[indice], nuevas[destino]] = [nuevas[destino], nuevas[indice]];
		void guardar(nuevas);
	}

	function abrir() {
		setErrorAccion(null);
		setAviso(null);
		setVentana(true);
	}

	function cerrar() {
		setVentana(false);
	}

	const avisos = <AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />;

	return (
		<SeccionAdmin
			titulo="Imágenes del inicio"
			descripcion="El deslizamiento que rota detrás del titular del home."
		>
			{!ventana && avisos}

			{cargando ? (
				<div className="mt-3 space-y-2">
					{Array.from({ length: 2 }, (_, i) => (
						<div key={i} className="rounded-lg border border-black/10 bg-white p-4">
							<div className="h-2.5 w-24 animate-pulse rounded bg-black/[.06]" />
							<div className="mt-2 h-16 w-full animate-pulse rounded bg-black/[.06]" />
						</div>
					))}
				</div>
			) : (
				<>
					{/* Lo que el público ve ahora mismo en la portada. */}
					<ul className="mt-3 flex flex-wrap gap-2">
						{lista.map((src, i) => (
							<li key={`${src}-${i}`} className="relative">
								<Foto
									src={src}
									alt={`Imagen ${i + 1} del deslizamiento del inicio`}
									className="h-16 w-28 rounded-md object-cover"
								/>
								<span className="absolute bottom-1 left-1 rounded bg-black/55 px-1 text-[10px] leading-4 text-white">
									{i + 1}
								</span>
							</li>
						))}
					</ul>

					<p className="mt-2 text-[11px] text-black/40">
						{lista.length}/{MAXIMO} imágenes · rotan cada 6 segundos.
					</p>

					<div className="mt-3">
						<button type="button" onClick={abrir} className={BTN_PRIMARIO}>
							Editar imágenes
						</button>
					</div>

					<VentanaAdmin
						abierto={ventana}
						onCerrar={cerrar}
						titulo="Imágenes del deslizamiento"
						ancho="ancho"
					>
						{avisos}
						<p className="text-xs text-black/55">
							El orden de aquí es el orden en que se deslizan. Deja la lista
							vacía y guarda para volver a las imágenes de siempre.
						</p>

						{lista.length > 0 ? (
							<ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
								{lista.map((src, i) => (
									<li key={`${src}-${i}`} className="space-y-1">
										<Foto
											src={src}
											alt={`Imagen ${i + 1} del deslizamiento`}
											className="aspect-[16/9] w-full rounded-md object-cover"
										/>
										<div className="flex items-center justify-between gap-1">
											<span className="text-[10px] text-black/40">{i + 1}</span>
											<div className="flex gap-0.5">
												<button
													type="button"
													onClick={() => mover(i, -1)}
													disabled={i === 0}
													aria-label={`Poner la imagen ${i + 1} antes`}
													className={BTN_ICONO}
												>
													‹
												</button>
												<button
													type="button"
													onClick={() => mover(i, 1)}
													disabled={i === lista.length - 1}
													aria-label={`Poner la imagen ${i + 1} después`}
													className={BTN_ICONO}
												>
													›
												</button>
												<button
													type="button"
													onClick={() => quitar(i)}
													aria-label={`Quitar la imagen ${i + 1}`}
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
							<p className="mt-3 text-[12px] text-black/45">
								Sin imágenes: la portada vuelve a las cinco de siempre.
							</p>
						)}

						<div className="mt-3 flex flex-wrap items-center gap-2">
							{!supabaseConfigurado && (
								<p className="w-full text-[12px] text-black/50">
									Falta configurar Supabase para subir archivos; usa
									&quot;Agregar por URL&quot;.
								</p>
							)}
							<label className={BTN_SUBIR}>
								{subiendo ? "Subiendo…" : "Subir archivo"}
								<input
									type="file"
									accept="image/*"
									className="sr-only"
									disabled={!supabaseConfigurado || subiendo || lista.length >= MAXIMO}
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
								aria-label="URL de la imagen"
								className={`${INPUT} min-w-0 flex-1 basis-40`}
							/>
							<button
								type="button"
								onClick={agregarPorUrl}
								disabled={!url.trim() || lista.length >= MAXIMO}
								className={BTN_SECUNDARIO}
							>
								Agregar por URL
							</button>
						</div>

						<p className="mt-1 text-[11px] text-black/40">
							{lista.length}/{MAXIMO} imágenes.
						</p>

						<div className="mt-3 flex flex-wrap gap-3">
							<button type="button" onClick={cerrar} className={BTN_SECUNDARIO}>
								Cerrar
							</button>
						</div>
					</VentanaAdmin>
				</>
			)}
		</SeccionAdmin>
	);
}
