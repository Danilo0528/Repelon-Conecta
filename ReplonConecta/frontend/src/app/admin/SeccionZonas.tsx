"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { normalizarUrlImagen } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/env";
import { subirImagen } from "@/lib/subirImagen";
import type { ZonaTuristica } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { EditorUbicacion } from "./EditorUbicacion";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	BuscadorTabla,
	CeldaTabla,
	FilaTabla,
	INPUT,
	Paginador,
	SeccionAdmin,
	TablaDensa,
	ThDensa,
	ThOrdenable,
	useTabla,
	VentanaAdmin,
} from "./ui-admin";
import type { ColumnaOrden } from "./tabla";

/*
 * Sección "Zonas turísticas" del panel (P2, fila 14).
 *
 * El home mostraba las 6 fichas de turismo pegadas en lib/turismo.ts;
 * ahora viven en la tabla `zonas_turisticas` y acá las carga el
 * estudiante. El truco de la geolocalización: "Usar mi ubicación"
 * pone las coordenadas exactas del celular y, si el campo dirección
 * está vacío, el route /api/geocode (Nominatim inverso) lo traduce a
 * texto legible — así la dirección queda bien sin escribirla. Nada de
 * eso es obligatorio: se puede crear la zona solo con nombre y
 * dirección escrita a mano (pasa el geocoder para que el "Cómo llegar"
 * del home funcione).
 */

const MOTIVOS: { valor: string; etiqueta: string }[] = [
	{ valor: "agua", etiqueta: "Agua y embalse" },
	{ valor: "barco", etiqueta: "Barco y pescadores" },
	{ valor: "aves", etiqueta: "Aves" },
	{ valor: "naturaleza", etiqueta: "Naturaleza" },
	{ valor: "parque", etiqueta: "Parque o plaza" },
	{ valor: "pueblo", etiqueta: "Pueblo" },
];

/** Cuántas fotos admite la ficha (el home las desliza al pasar el cursor). */
const MAXIMO = 4;

const COLUMNAS_ZONAS: ColumnaOrden<ZonaTuristica>[] = [
	{ id: "zona", valor: (z) => z.nombre },
	{
		id: "motivo",
		valor: (z) => MOTIVOS.find((m) => m.valor === z.motivo)?.etiqueta ?? "Pueblo",
	},
	{ id: "orden", valor: (z) => z.orden },
	{ id: "fotos", valor: (z) => z.imagenes?.length || (z.imagenUrl ? 1 : 0) },
];

const buscarZona = (z: ZonaTuristica) =>
	`${z.nombre} ${z.direccion} ${
		MOTIVOS.find((m) => m.valor === z.motivo)?.etiqueta ?? ""
	}`;

const BTN_SUBIR =
	"inline-flex h-9 cursor-pointer items-center rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

/** Texto de coordenada → número; vacío o basura → null. */
function aNumero(texto: string): number | null {
	const limpio = texto.trim();
	if (!limpio) return null;
	const n = Number(limpio);
	return Number.isFinite(n) ? n : null;
}

export function SeccionZonas() {
	const { datos, cargando, error, setDatos } = useDatos<ZonaTuristica[]>(() =>
		apiConSesion<ZonaTuristica[]>("/api/zonas"),
	);

	const [editando, setEditando] = useState<string | null>(null);
	const [ventana, setVentana] = useState(false);
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [direccion, setDireccion] = useState("");
	const [latitud, setLatitud] = useState("");
	const [longitud, setLongitud] = useState("");
	const [imagenes, setImagenes] = useState<string[]>([]);
	const [creditos, setCreditos] = useState<string[]>([]);
	const [motivo, setMotivo] = useState("pueblo");
	const [guardando, setGuardando] = useState(false);
	const [subiendo, setSubiendo] = useState(false);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	const tabla = useTabla(datos ?? [], {
		buscar: buscarZona,
		columnas: COLUMNAS_ZONAS,
		ordenInicial: "orden",
	});

	function limpiar() {
		setEditando(null);
		setNombre("");
		setDescripcion("");
		setDireccion("");
		setLatitud("");
		setLongitud("");
		setImagenes([]);
		setCreditos([]);
		setMotivo("pueblo");
	}

	function cerrarVentana() {
		limpiar();
		setVentana(false);
	}

	function nuevaZona() {
		limpiar();
		setErrorAccion(null);
		setAviso(null);
		setVentana(true);
	}

	function editar(z: ZonaTuristica) {
		setEditando(z.id);
		setNombre(z.nombre);
		setDescripcion(z.descripcion ?? "");
		setDireccion(z.direccion);
		setLatitud(z.latitud != null ? String(z.latitud) : "");
		setLongitud(z.longitud != null ? String(z.longitud) : "");
		setImagenes(z.imagenes?.length ? z.imagenes : z.imagenUrl ? [z.imagenUrl] : []);
		setCreditos(
			z.imagenes?.length
				? z.imagenes.map((_, i) => z.creditos?.[i] ?? "")
				: [],
		);
		setMotivo(MOTIVOS.some((m) => m.valor === z.motivo) ? z.motivo : "pueblo");
		setErrorAccion(null);
		setAviso(null);
		setVentana(true);
	}

	/*
	 * Dirección, sugerencias, GPS y el mapa con el pin arrastrable viven
	 * todos en EditorUbicacion: la sección solo recibe los cambios y
	 * valida el par de coordenadas antes de guardar.
	 */
	function coordenadasValidas(): {
		ok: boolean;
		lat: number | null;
		lng: number | null;
		mensaje?: string;
	} {
		const textoLat = latitud.trim();
		const textoLng = longitud.trim();
		if (!textoLat && !textoLng) return { ok: true, lat: null, lng: null };
		if (!textoLat || !textoLng) {
			return { ok: false, lat: null, lng: null, mensaje: "Pon las dos coordenadas o ninguna." };
		}
		const lat = Number(textoLat);
		const lng = Number(textoLng);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			return { ok: false, lat: null, lng: null, mensaje: "Las coordenadas deben ser números." };
		}
		if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
			return { ok: false, lat: null, lng: null, mensaje: "Coordenadas fuera de rango." };
		}
		return { ok: true, lat, lng };
	}

	async function guardar(e: FormEvent) {
		e.preventDefault();
		const coords = coordenadasValidas();
		if (!coords.ok) {
			setErrorAccion(coords.mensaje ?? "Coordenadas inválidas.");
			return;
		}
		if (!nombre.trim() || !direccion.trim()) {
			setErrorAccion("Nombre y dirección son obligatorios.");
			return;
		}

		setGuardando(true);
		setErrorAccion(null);
		setAviso(null);
		// Se filtran juntos para que cada crédito siga a su foto.
		const fotos = imagenes
			.map((url, i) => ({ url: url.trim(), credito: creditos[i]?.trim() ?? "" }))
			.filter((foto) => foto.url);
		const cuerpo = JSON.stringify({
			nombre: nombre.trim(),
			descripcion: descripcion.trim() || null,
			direccion: direccion.trim(),
			latitud: coords.lat,
			longitud: coords.lng,
			imagenes: fotos.map((foto) => foto.url),
			creditos: fotos.map((foto) => foto.credito),
			motivo,
		});
		try {
			if (editando) {
				const zona = await apiConSesion<ZonaTuristica>(`/api/zonas/${editando}`, {
					method: "PUT",
					body: cuerpo,
				});
				setDatos((actual) =>
					(actual ?? []).map((x) => (x.id === zona.id ? zona : x)),
				);
				setAviso(`Zona "${zona.nombre}" actualizada.`);
			} else {
				const zona = await apiConSesion<ZonaTuristica>("/api/zonas", {
					method: "POST",
					body: cuerpo,
				});
				setDatos((actual) => [...(actual ?? []), zona]);
				setAviso(`Zona "${zona.nombre}" creada. Ya aparece en el home.`);
			}
			cerrarVentana();
		} catch (e2) {
			setErrorAccion(e2 instanceof Error ? e2.message : "No se pudo guardar la zona.");
		} finally {
			setGuardando(false);
		}
	}

	async function eliminar(z: ZonaTuristica) {
		if (!window.confirm(`¿Borrar la zona "${z.nombre}" del home?`)) return;
		setErrorAccion(null);
		setAviso(null);
		try {
			await apiConSesion(`/api/zonas/${z.id}`, { method: "DELETE" });
			setDatos((actual) => (actual ?? []).filter((x) => x.id !== z.id));
			if (editando === z.id) cerrarVentana();
			setAviso(`Zona "${z.nombre}" borrada.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo borrar la zona.");
		}
	}

	/*
	 * Subir archivo: el archivo vive en Supabase Storage y la URL que
	 * devuelve se agrega a la lista de fotos. Se persiste con "Guardar
	 * cambios", igual que las URLs escritas a mano — mismo trato para
	 * las dos vías. Al crear la zona aún no hay id, así que la foto
	 * cae en una carpeta fija hasta que el backend asigne el real.
	 */
	async function subirArchivo(evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;
		if (imagenes.length >= MAXIMO) {
			setErrorAccion(`La zona admite hasta ${MAXIMO} fotos.`);
			return;
		}
		setSubiendo(true);
		setErrorAccion(null);
		try {
			const subida = await subirImagen("zonas", editando ?? "nueva", archivo);
			setImagenes((actuales) => [...actuales, subida]);
			setCreditos((actuales) => [...actuales, ""]);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir la foto.");
		} finally {
			setSubiendo(false);
		}
	}

	/*
	 * Los avisos van UNA sola vez montados: dentro de la ventana cuando
	 * está abierta (si no, quedarían tapados tras la capa oscura — es
	 * donde avisan los errores de geolocalización y de guardado) y en la
	 * sección cuando está cerrada.
	 */
	const avisos = <AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />;

	return (
		<SeccionAdmin
			titulo="Zonas turísticas"
			descripcion={
				<>
					Los atractivos de la sección &quot;Turismo en Repelón&quot; del home.
					Toca <strong>Nueva zona</strong> y, dentro de la ventana, escribe la
					dirección para elegir entre las sugerencias —o usa{" "}
					<strong>Usar mi ubicación</strong>— y afina el punto{" "}
					<strong>arrastrando el pin</strong> del mapa.
				</>
			}
		>
			{!ventana && avisos}

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<button type="button" onClick={nuevaZona} className={BTN_PRIMARIO}>
					Nueva zona
				</button>
				<BuscadorTabla
					valor={tabla.texto}
					onChange={tabla.setTexto}
					placeholder="Filtrar por nombre, dirección o motivo"
					ariaLabel="Filtrar zonas turísticas"
				/>
				{tabla.filtradas.length < (datos ?? []).length && (
					<span className="text-[12px] text-black/40">
						<span className="tabular">{tabla.filtradas.length}</span> de{" "}
						<span className="tabular">{(datos ?? []).length}</span>
					</span>
				)}
			</div>

			<VentanaAdmin
				abierto={ventana}
				onCerrar={cerrarVentana}
				titulo={editando ? "Editar zona" : "Nueva zona"}
				ancho="ancho"
			>
				{avisos}
				<form onSubmit={(e) => void guardar(e)} className="mt-1">
					<label className="text-xs text-black/55">
						Nombre (obligatorio)
						<input
							id="zona-nombre"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							required
							maxLength={80}
							placeholder="Ej. Caleta de pescadores"
							className={INPUT}
						/>
					</label>

					<EditorUbicacion
						direccion={direccion}
						lat={aNumero(latitud)}
						lng={aNumero(longitud)}
						onDireccion={setDireccion}
						onPunto={(la, ln) => {
							setLatitud(la != null ? String(la) : "");
							setLongitud(ln != null ? String(ln) : "");
						}}
						onAviso={setAviso}
						onError={setErrorAccion}
					/>

					<div className="mt-2 grid gap-2 sm:grid-cols-2">
						<label className="text-xs text-black/55">
							Descripción (opcional)
							<textarea
								value={descripcion}
								onChange={(e) => setDescripcion(e.target.value)}
								maxLength={300}
								rows={2}
								placeholder="Qué se hace o qué se ve ahí…"
								className={INPUT}
							/>
						</label>
						<div className="grid gap-2">
							<fieldset className="grid gap-2">
								<legend className="text-xs text-black/55">
									Fotos (hasta 4; sube el archivo o pega una URL — pasan al
									poner el cursor sobre la ficha)
								</legend>
								{imagenes.map((url, indice) => (
									<div key={indice} className="space-y-1">
										<div className="flex items-center gap-2">
											<label className="min-w-0 flex-1">
												<span className="sr-only">URL de la foto {indice + 1}</span>
												<input
													value={url}
													onChange={(e) =>
														setImagenes((actuales) =>
															actuales.map((actual, i) => i === indice ? e.target.value : actual),
														)
													}
													maxLength={500}
													type="url"
													placeholder="https://…/foto.jpg"
													className={INPUT}
												/>
											</label>
											<button
												type="button"
												onClick={() => {
													setImagenes((actuales) => actuales.filter((_, i) => i !== indice));
													setCreditos((actuales) => actuales.filter((_, i) => i !== indice));
												}}
												aria-label={`Quitar foto ${indice + 1}`}
												className={`${BTN_SECUNDARIO} shrink-0`}
											>
												Quitar
											</button>
											{url.trim().startsWith("http") && (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={normalizarUrlImagen(url)}
													alt={`Vista previa de la foto ${indice + 1}`}
													className="h-10 w-16 shrink-0 rounded-md border border-black/10 object-cover"
												/>
											)}
										</div>
										<label className="block">
											<span className="sr-only">Fuente de la foto {indice + 1}</span>
											<input
												value={creditos[indice] ?? ""}
												onChange={(e) => {
													const texto = e.target.value;
													setCreditos((actuales) => {
														const nuevos = imagenes.map((_, i) => actuales[i] ?? "");
														nuevos[indice] = texto;
														return nuevos;
													});
												}}
												maxLength={300}
												placeholder="Fuente de la foto (https://… o autor)"
												className={INPUT}
											/>
										</label>
									</div>
								))}
								<div className="flex flex-wrap items-center gap-2">
									{!supabaseConfigurado && (
										<p className="w-full text-[12px] text-black/50">
											Falta configurar Supabase para subir archivos; usa
											&quot;+ Añadir URL&quot;.
										</p>
									)}
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
									{imagenes.length < MAXIMO && (
										<button
											type="button"
											onClick={() => {
												setImagenes((actuales) => [...actuales, ""]);
												setCreditos((actuales) => [...actuales, ""]);
											}}
											className={BTN_SECUNDARIO}
										>
											+ Añadir URL
										</button>
									)}
								</div>
							</fieldset>
						</div>
					</div>

					<div className="mt-4 flex flex-wrap items-end gap-3">
						<label className="text-xs text-black/55">
							Ilustración de respaldo
							<select
								value={motivo}
								onChange={(e) => setMotivo(e.target.value)}
								className={INPUT}
							>
								{MOTIVOS.map((m) => (
									<option key={m.valor} value={m.valor}>
										{m.etiqueta}
									</option>
								))}
							</select>
						</label>
						<button
							type="submit"
							disabled={guardando || !nombre.trim() || !direccion.trim()}
							className={BTN_PRIMARIO}
						>
							{guardando
								? "Guardando…"
								: editando
									? "Guardar cambios"
									: "Crear zona"}
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
				vacioTitulo="No hay zonas turísticas"
				skeletonColumnas={4}
			>
				{tabla.filtradas.length === 0 ? (
					<p className="mt-3 text-[13px] text-black/50">
						Ninguna zona coincide con el filtro.
					</p>
				) : (
					<>
						<TablaDensa>
							<table className="w-full min-w-[560px] border-collapse">
								<thead className="sticky top-0 z-10 bg-white">
									<tr className="border-b border-black/10">
										<ThOrdenable
											campo="zona"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Zona
										</ThOrdenable>
										<ThOrdenable
											campo="motivo"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Ilustración
										</ThOrdenable>
										<ThOrdenable
											campo="fotos"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
											num
										>
											Fotos
										</ThOrdenable>
										<ThOrdenable
											campo="orden"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
											num
										>
											Orden
										</ThOrdenable>
										<ThDensa className="text-right">Acción</ThDensa>
									</tr>
								</thead>
								<tbody>
									{tabla.visibles.map((z) => (
										<FilaTabla key={z.id}>
											<CeldaTabla className="max-w-[220px]">
												<p className="truncate font-medium">{z.nombre}</p>
												<p className="truncate text-[11px] text-black/45">
													{z.direccion}
												</p>
											</CeldaTabla>
											<CeldaTabla>
												<span className="text-[12px] text-black/60">
													{MOTIVOS.find((m) => m.valor === z.motivo)?.etiqueta ??
														"Pueblo"}
												</span>
											</CeldaTabla>
											<CeldaTabla num>
												{z.imagenes?.length || (z.imagenUrl ? 1 : 0)}
											</CeldaTabla>
											<CeldaTabla num>{z.orden}</CeldaTabla>
											<CeldaTabla className="text-right">
												<span className="inline-flex gap-1.5">
													<button
														type="button"
														onClick={() => editar(z)}
														className={BTN_SECUNDARIO}
													>
														Editar
													</button>
													<button
														type="button"
														onClick={() => void eliminar(z)}
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
						<Paginador
							pagina={tabla.pagina}
							paginas={tabla.paginas}
							desde={tabla.desde}
							hasta={tabla.hasta}
							total={tabla.total}
							porPagina={tabla.porPagina}
							onPagina={tabla.setPagina}
							onPorPagina={tabla.setPorPagina}
						/>
					</>
				)}
			</BloqueEstado>
		</SeccionAdmin>
	);
}
