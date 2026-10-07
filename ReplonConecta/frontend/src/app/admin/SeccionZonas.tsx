"use client";

import { useState, type FormEvent } from "react";

import { apiConSesion } from "@/lib/api";
import type { ZonaTuristica } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { EditorUbicacion } from "./EditorUbicacion";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	INPUT,
	SeccionAdmin,
	TARJETA,
	VentanaAdmin,
} from "./ui-admin";

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
	const [imagenUrl, setImagenUrl] = useState("");
	const [motivo, setMotivo] = useState("pueblo");
	const [guardando, setGuardando] = useState(false);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	function limpiar() {
		setEditando(null);
		setNombre("");
		setDescripcion("");
		setDireccion("");
		setLatitud("");
		setLongitud("");
		setImagenUrl("");
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
		setImagenUrl(z.imagenUrl ?? "");
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
		const cuerpo = JSON.stringify({
			nombre: nombre.trim(),
			descripcion: descripcion.trim() || null,
			direccion: direccion.trim(),
			latitud: coords.lat,
			longitud: coords.lng,
			imagenUrl: imagenUrl.trim() || null,
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

			<div className="mt-3">
				<button type="button" onClick={nuevaZona} className={BTN_PRIMARIO}>
					Nueva zona
				</button>
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
							<label className="text-xs text-black/55">
								Foto por URL (opcional)
								<input
									value={imagenUrl}
									onChange={(e) => setImagenUrl(e.target.value)}
									maxLength={500}
									type="url"
									placeholder="https://…/foto.jpg"
									className={INPUT}
								/>
							</label>
							{imagenUrl.trim().startsWith("http") && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={imagenUrl.trim()}
									alt="Vista previa de la foto"
									className="h-16 w-28 rounded-lg border border-black/10 object-cover"
								/>
							)}
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
			>
				<ul className="mt-3 space-y-2">
					{(datos ?? []).map((z) => (
						<li
							key={z.id}
							className={`${TARJETA} flex items-center justify-between gap-3`}
						>
							<div className="min-w-0">
								<p className="truncate font-semibold">{z.nombre}</p>
								<p className="truncate text-xs text-black/55">{z.direccion}</p>
								<p className="text-[11px] text-black/45">
									{MOTIVOS.find((m) => m.valor === z.motivo)?.etiqueta ?? "Pueblo"}
									{z.latitud != null && z.longitud != null
										? ` · ${z.latitud}, ${z.longitud}`
										: " · sin coordenadas"}
									{z.imagenUrl ? " · con foto" : " · ilustración"}
								</p>
							</div>
							<div className="flex shrink-0 gap-2">
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
							</div>
						</li>
					))}
				</ul>
			</BloqueEstado>
		</SeccionAdmin>
	);
}
