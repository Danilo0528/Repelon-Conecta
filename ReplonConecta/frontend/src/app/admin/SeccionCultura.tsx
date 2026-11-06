"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { normalizarUrlImagen } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import { esYouTube, type PublicacionCulturaApi } from "@/lib/cultura";
import { supabaseConfigurado } from "@/lib/env";
import { subirImagen, subirVideo } from "@/lib/subirImagen";
import { useDatos } from "@/lib/useDatos";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	CeldaTabla,
	FilaTabla,
	INPUT,
	SeccionAdmin,
	TablaDensa,
	ThDensa,
	VentanaAdmin,
} from "./ui-admin";

/*
 * Sección "Cultura" del panel (/admin/contenido).
 *
 * Es el CRUD del feed de /cultura: autor, lugar, fecha, pie y medio
 * (foto o video). La foto y el video se pueden subir como archivo al
 * bucket de Supabase o pegar por URL — misma doble vía que las zonas—;
 * el video admite además el ID pelado de YouTube. El orden del feed lo
 * decide la fecha: lo que tenga fecha más reciente sale primero, así
 * que "subir algo nuevo" es ponerle la fecha de hoy.
 */

const BTN_SUBIR =
	"inline-flex h-9 cursor-pointer items-center rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

/** Fecha de hoy en la zona local del navegador (yyyy-mm-dd). */
function hoy(): string {
	const d = new Date();
	const mes = String(d.getMonth() + 1).padStart(2, "0");
	const dia = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Fecha visible en la tabla: dd/mm/aaaa. */
function fechaCorta(iso: string): string {
	const [anio, mes, dia] = iso.split("-");
	return dia && mes && anio ? `${dia}/${mes}/${anio}` : iso;
}

/** La URL del medio cumple la misma regla que valida el backend. */
function medioValido(tipo: "FOTO" | "VIDEO", valor: string): boolean {
	const t = valor.trim();
	if (tipo === "FOTO") return /^(https?:\/\/|\/).{1,500}$/.test(t);
	return /^https?:\/\/.{1,500}$/.test(t) || /^[\w-]{6,20}$/.test(t);
}

type Tipo = "FOTO" | "VIDEO";

export function SeccionCultura() {
	const { datos, cargando, error, setDatos } = useDatos<PublicacionCulturaApi[]>(() =>
		apiConSesion<PublicacionCulturaApi[]>("/api/cultura/publicaciones"),
	);

	const [editando, setEditando] = useState<string | null>(null);
	const [ventana, setVentana] = useState(false);
	const [autor, setAutor] = useState("");
	const [lugar, setLugar] = useState("");
	const [fecha, setFecha] = useState(hoy());
	const [texto, setTexto] = useState("");
	const [tipo, setTipo] = useState<Tipo>("FOTO");
	const [mediaUrl, setMediaUrl] = useState("");
	const [credito, setCredito] = useState("");
	const [guardando, setGuardando] = useState(false);
	const [subiendo, setSubiendo] = useState(false);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	function limpiar() {
		setEditando(null);
		setAutor("");
		setLugar("");
		setFecha(hoy());
		setTexto("");
		setTipo("FOTO");
		setMediaUrl("");
		setCredito("");
	}

	function cerrarVentana() {
		limpiar();
		setVentana(false);
	}

	function nueva() {
		limpiar();
		setErrorAccion(null);
		setAviso(null);
		setVentana(true);
	}

	function editar(p: PublicacionCulturaApi) {
		setEditando(p.id);
		setAutor(p.autor);
		setLugar(p.lugar ?? "");
		setFecha(p.fecha);
		setTexto(p.texto);
		setTipo(p.tipo === "VIDEO" ? "VIDEO" : "FOTO");
		setMediaUrl(p.mediaUrl);
		setCredito(p.credito ?? "");
		setErrorAccion(null);
		setAviso(null);
		setVentana(true);
	}

	async function guardar(e: FormEvent) {
		e.preventDefault();
		if (!autor.trim() || !texto.trim() || !fecha) {
			setErrorAccion("Autor, fecha y texto son obligatorios.");
			return;
		}
		if (!medioValido(tipo, mediaUrl)) {
			setErrorAccion(
				tipo === "FOTO"
					? "La foto debe ser una URL https:// (o una ruta que empiece con /)."
					: "El video debe ser una URL https:// o el ID de YouTube.",
			);
			return;
		}

		setGuardando(true);
		setErrorAccion(null);
		setAviso(null);
		const cuerpo = JSON.stringify({
			autor: autor.trim(),
			lugar: lugar.trim() || null,
			fecha,
			texto: texto.trim(),
			tipo,
			mediaUrl: mediaUrl.trim(),
			credito: credito.trim() || null,
		});
		try {
			if (editando) {
				const p = await apiConSesion<PublicacionCulturaApi>(
					`/api/cultura/publicaciones/${editando}`,
					{ method: "PUT", body: cuerpo },
				);
				setDatos((actual) =>
					(actual ?? []).map((x) => (x.id === p.id ? p : x)).sort(porFecha),
				);
				setAviso("Publicación actualizada.");
			} else {
				const p = await apiConSesion<PublicacionCulturaApi>(
					"/api/cultura/publicaciones",
					{ method: "POST", body: cuerpo },
				);
				setDatos((actual) => [...(actual ?? []), p].sort(porFecha));
				setAviso("Publicación creada. Ya aparece en /cultura.");
			}
			cerrarVentana();
		} catch (e2) {
			setErrorAccion(e2 instanceof Error ? e2.message : "No se pudo guardar.");
		} finally {
			setGuardando(false);
		}
	}

	async function eliminar(p: PublicacionCulturaApi) {
		if (!window.confirm(`¿Borrar esta publicación de Cultura?`)) return;
		setErrorAccion(null);
		setAviso(null);
		try {
			await apiConSesion(`/api/cultura/publicaciones/${p.id}`, { method: "DELETE" });
			setDatos((actual) => (actual ?? []).filter((x) => x.id !== p.id));
			if (editando === p.id) cerrarVentana();
			setAviso("Publicación borrada.");
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo borrar.");
		}
	}

	/*
	 * Subir archivo: la imagen o el video vive en Supabase Storage y la
	 * URL que devuelve llena el campo del medio. Se guarda con "Guardar
	 * publicación", igual que lo escrito a mano. Al crear aún no hay id,
	 * así que el archivo cae en una carpeta fija hasta que el backend
	 * asigne el real.
	 */
	async function subirArchivo(evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;
		setSubiendo(true);
		setErrorAccion(null);
		try {
			const subida =
				tipo === "FOTO"
					? await subirImagen("cultura", editando ?? "nueva", archivo)
					: await subirVideo("cultura", editando ?? "nueva", archivo);
			setMediaUrl(subida);
		} catch (e) {
			setErrorAccion(
				e instanceof Error ? e.message : "No se pudo subir el archivo.",
			);
		} finally {
			setSubiendo(false);
		}
	}

	/* Avisos: dentro de la ventana cuando está abierta, fuera cuando no. */
	const avisos = <AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />;

	return (
		<SeccionAdmin
			titulo="Cultura"
			descripcion={
				<>
					El feed de publicaciones de la sección &quot;Cultura&quot;
					(/cultura): lo que suba aquí es lo que ve el público, ordenado por
					fecha (lo más reciente arriba).
				</>
			}
		>
			{!ventana && avisos}

			<div className="mt-3">
				<button type="button" onClick={nueva} className={BTN_PRIMARIO}>
					Nueva publicación
				</button>
			</div>

			<VentanaAdmin
				abierto={ventana}
				onCerrar={cerrarVentana}
				titulo={editando ? "Editar publicación" : "Nueva publicación"}
				ancho="ancho"
			>
				{avisos}
				<form onSubmit={(e) => void guardar(e)} className="mt-1">
					<div className="grid gap-3 sm:grid-cols-2">
						<label className="text-xs text-black/55">
							Autor (obligatorio)
							<input
								value={autor}
								onChange={(e) => setAutor(e.target.value)}
								required
								maxLength={60}
								placeholder="Ej. Repelón Conecta"
								className={INPUT}
							/>
						</label>
						<label className="text-xs text-black/55">
							Lugar (opcional)
							<input
								value={lugar}
								onChange={(e) => setLugar(e.target.value)}
								maxLength={100}
								placeholder="Ej. Plaza del municipio"
								className={INPUT}
							/>
						</label>
						<label className="text-xs text-black/55">
							Fecha (obligatoria) — ordena el feed
							<input
								type="date"
								value={fecha}
								onChange={(e) => setFecha(e.target.value)}
								required
								className={INPUT}
							/>
						</label>
						<label className="text-xs text-black/55">
							Tipo de medio
							<select
								value={tipo}
								onChange={(e) => {
									setTipo(e.target.value as Tipo);
									setMediaUrl("");
								}}
								className={INPUT}
							>
								<option value="FOTO">Foto</option>
								<option value="VIDEO">Video</option>
							</select>
						</label>
						<label className="text-xs text-black/55 sm:col-span-2">
							Texto de la publicación (obligatorio)
							<textarea
								value={texto}
								onChange={(e) => setTexto(e.target.value)}
								required
								rows={3}
								maxLength={600}
								placeholder="Qué se ve, qué se celebra, qué oficio es…"
								className={INPUT}
							/>
							<span className="mt-0.5 block text-[11px] text-black/40">
								{texto.length}/600
							</span>
						</label>

						<label className="text-xs text-black/55 sm:col-span-2">
							{tipo === "FOTO" ? "Foto" : "Video"} (obligatorio)
							<div className="mt-1 flex flex-wrap items-center gap-2">
								<input
									value={mediaUrl}
									onChange={(e) => setMediaUrl(e.target.value)}
									maxLength={500}
									placeholder={
										tipo === "FOTO"
											? "https://…/foto.jpg"
											: "https://youtube.com/… o https://…/video.mp4"
									}
									className={`${INPUT} min-w-0 flex-1 basis-64`}
								/>
								<label className={BTN_SUBIR}>
									{subiendo ? "Subiendo…" : tipo === "FOTO" ? "Subir foto" : "Subir video"}
									<input
										type="file"
										accept={tipo === "FOTO" ? "image/*" : "video/*"}
										className="sr-only"
										disabled={!supabaseConfigurado || subiendo}
										onChange={(e) => void subirArchivo(e)}
									/>
								</label>
							</div>
							{!supabaseConfigurado && (
								<span className="mt-1 block text-[11px] text-black/50">
									Falta configurar Supabase para subir archivos: pega la URL.
								</span>
							)}
							{tipo === "VIDEO" && mediaUrl.trim() && esYouTube(mediaUrl) && (
								<span className="mt-1 block text-[11px] text-black/50">
									Se va a embeber como video de YouTube.
								</span>
							)}
							{tipo === "VIDEO" && mediaUrl.trim() && !esYouTube(mediaUrl) && (
								<span className="mt-1 block text-[11px] text-black/50">
									Se va a reproducir como archivo de video (MP4/WebM).
								</span>
							)}
							{tipo === "FOTO" && mediaUrl.trim().startsWith("http") && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={normalizarUrlImagen(mediaUrl)}
									alt="Vista previa de la foto"
									className="mt-2 h-20 w-32 rounded-md border border-black/10 object-cover"
								/>
							)}
						</label>

						{tipo === "FOTO" && (
							<label className="text-xs text-black/55 sm:col-span-2">
								Crédito de la foto (opcional)
								<input
									value={credito}
									onChange={(e) => setCredito(e.target.value)}
									maxLength={120}
									placeholder="Ej. Foto: Juan Pérez"
									className={INPUT}
								/>
							</label>
						)}
					</div>

					<div className="mt-4 flex flex-wrap items-end gap-3">
						<button
							type="submit"
							disabled={
								guardando ||
								!autor.trim() ||
								!texto.trim() ||
								!fecha ||
								!medioValido(tipo, mediaUrl)
							}
							className={BTN_PRIMARIO}
						>
							{guardando
								? "Guardando…"
								: editando
									? "Guardar cambios"
									: "Crear publicación"}
						</button>
						<button
							type="button"
							onClick={cerrarVentana}
							className={BTN_SECUNDARIO}
						>
							Cancelar
						</button>
					</div>
				</form>
			</VentanaAdmin>

			<BloqueEstado
				cargando={cargando}
				vacio={(datos ?? []).length === 0}
				vacioTitulo="No hay publicaciones de Cultura"
				skeletonColumnas={5}
			>
				<TablaDensa>
					<table className="w-full min-w-[640px] border-collapse">
						<thead className="sticky top-0 z-10 bg-white">
							<tr className="border-b border-black/10">
								<ThDensa>Fecha</ThDensa>
								<ThDensa>Autor</ThDensa>
								<ThDensa>Texto</ThDensa>
								<ThDensa>Medio</ThDensa>
								<ThDensa className="text-right">Acción</ThDensa>
							</tr>
						</thead>
						<tbody>
							{(datos ?? []).map((p) => (
								<FilaTabla key={p.id}>
									<CeldaTabla mono>{fechaCorta(p.fecha)}</CeldaTabla>
									<CeldaTabla className="max-w-[140px]">
										<p className="truncate font-medium">{p.autor}</p>
										{p.lugar && (
											<p className="truncate text-[11px] text-black/45">{p.lugar}</p>
										)}
									</CeldaTabla>
									<CeldaTabla className="max-w-[260px]">
										<span className="line-clamp-2">{p.texto}</span>
									</CeldaTabla>
									<CeldaTabla>
										{p.tipo === "VIDEO" ? (
											esYouTube(p.mediaUrl) ? "Video (YouTube)" : "Video (archivo)"
										) : (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={normalizarUrlImagen(p.mediaUrl)}
												alt=""
												className="h-9 w-14 rounded border border-black/10 object-cover"
											/>
										)}
									</CeldaTabla>
									<CeldaTabla className="text-right">
										<span className="inline-flex gap-1.5">
											<button
												type="button"
												onClick={() => editar(p)}
												className={BTN_SECUNDARIO}
											>
												Editar
											</button>
											<button
												type="button"
												onClick={() => void eliminar(p)}
												className={BTN_SECUNDARIO}
											>
												Borrar
											</button>
										</span>
									</CeldaTabla>
								</FilaTabla>
							))}
						</tbody>
					</table>
				</TablaDensa>
			</BloqueEstado>
		</SeccionAdmin>
	);
}

/** Misma regla que el backend: fecha más reciente primero. */
function porFecha(a: PublicacionCulturaApi, b: PublicacionCulturaApi): number {
	if (a.fecha === b.fecha) return 0;
	return a.fecha < b.fecha ? 1 : -1;
}
