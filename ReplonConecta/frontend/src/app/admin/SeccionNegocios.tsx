"use client";

import { useState, type ChangeEvent } from "react";

import { Chip, Foto } from "@/components/ui";
import { supabaseConfigurado } from "@/lib/env";
import { api, apiConSesion } from "@/lib/api";
import { fecha, pesos } from "@/lib/format";
import { subirImagen } from "@/lib/subirImagen";
import type { NegocioAdmin, NegocioDetalle, Producto } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { CampoUrlImagen } from "./CampoUrlImagen";
import { EditorUbicacion } from "./EditorUbicacion";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	CeldaTabla,
	FilaTabla,
	INPUT,
	PuntoEstado,
	SeccionAdmin,
	TablaDensa,
	ThDensa,
	VentanaAdmin,
} from "./ui-admin";

/*
 * Sección "Negocios" — lista densa + ventana flotante grande para
 * crear y editar (datos, ubicación con mapa, logo y fotos de
 * productos). El formulario sale de la API: RegistroNegocioRequest
 * para alta, NegocioUpdateRequest para edición.
 */

export type FiltroNegocios = "todos" | "pendientes" | "aprobados";

const BTN_SUBIR =
	"inline-flex h-9 cursor-pointer items-center rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

function cuerpoFotoProducto(p: Producto, imagenUrl: string) {
	return JSON.stringify({
		nombre: p.nombre,
		descripcion: p.descripcion,
		precio: p.precio,
		unidad: p.unidad,
		imagenUrl,
		categoriaId: p.categoriaId,
		disponible: p.disponible,
		stock: p.stock,
	});
}

/** Datos del formulario del modal (compartido entre crear y editar). */
type FormNegocio = {
	nombre: string;
	descripcion: string;
	direccion: string;
	barrio: string;
	latitud: string;
	longitud: string;
	telefono: string;
	whatsapp: string;
	horario: string;
	logoUrl: string;
};

const FORM_VACIO: FormNegocio = {
	nombre: "",
	descripcion: "",
	direccion: "",
	barrio: "",
	latitud: "",
	longitud: "",
	telefono: "",
	whatsapp: "",
	horario: "",
	logoUrl: "",
};

function aNumero(texto: string): number | null {
	const t = texto.trim();
	if (!t) return null;
	const n = Number(t);
	return Number.isFinite(n) ? n : null;
}

export function SeccionNegocios({ filtroInicial }: { filtroInicial?: FiltroNegocios }) {
	const { datos: negocios, cargando, error, setDatos } = useDatos<NegocioAdmin[]>(
		() => apiConSesion<NegocioAdmin[]>("/api/admin/negocios"),
		[],
	);

	const [filtro, setFiltro] = useState<FiltroNegocios>(filtroInicial ?? "todos");
	const [texto, setTexto] = useState("");
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	// Modal: null = cerrado; "crear" = alta; id de negocio = edición.
	const [modo, setModo] = useState<"crear" | string | null>(null);
	const [form, setForm] = useState<FormNegocio>(FORM_VACIO);
	const [guardando, setGuardando] = useState(false);
	const [cargandoDetalle, setCargandoDetalle] = useState(false);

	// Detalle completo del negocio en edición (descripción, tel, etc.).
	const [detalle, setDetalle] = useState<NegocioDetalle | null>(null);

	// Fotos del negocio en edición.
	const [subiendo, setSubiendo] = useState<string | null>(null);
	const [productos, setProductos] = useState<Producto[]>([]);

	const termino = texto.trim().toLocaleLowerCase("es");
	const filtrados = (negocios ?? []).filter(
		(n) =>
			(filtro === "todos" ||
				(filtro === "pendientes" && !n.aprobado) ||
				(filtro === "aprobados" && n.aprobado)) &&
			(!termino ||
				n.nombre.toLocaleLowerCase("es").includes(termino) ||
				n.duenoNombre.toLocaleLowerCase("es").includes(termino)),
	);

	function campo<K extends keyof FormNegocio>(k: K, v: FormNegocio[K]) {
		setForm((f) => ({ ...f, [k]: v }));
	}

	function limpiar() {
		setForm(FORM_VACIO);
		setDetalle(null);
		setProductos([]);
		setSubiendo(null);
		setErrorAccion(null);
		setAviso(null);
	}

	function abrirCrear() {
		limpiar();
		setModo("crear");
	}

	function abrirEditar(n: NegocioAdmin) {
		limpiar();
		setModo(n.id);
		cargarDetalle(n.id);
	}

	function cerrarModal() {
		setModo(null);
		limpiar();
	}

	/** Carga el detalle completo y los productos para el modal de edición. */
	async function cargarDetalle(id: string) {
		setCargandoDetalle(true);
		setErrorAccion(null);
		try {
			const [d, ps] = await Promise.all([
				apiConSesion<NegocioDetalle>(`/api/negocios/${id}`),
				api<Producto[]>(`/api/productos/negocio/${id}`),
			]);
			setDetalle(d);
			setProductos(ps);
			setForm({
				nombre: d.nombre,
				descripcion: d.descripcion ?? "",
				direccion: d.direccion,
				barrio: d.barrio ?? "",
				latitud: d.latitud != null ? String(d.latitud) : "",
				longitud: d.longitud != null ? String(d.longitud) : "",
				telefono: d.telefono ?? "",
				whatsapp: d.whatsapp ?? "",
				horario: d.horario ?? "",
				logoUrl: d.logoUrl ?? "",
			});
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo cargar el negocio.");
		} finally {
			setCargandoDetalle(false);
		}
	}

	function coordenadas(): { lat: number | null; lng: number | null } {
		return { lat: aNumero(form.latitud), lng: aNumero(form.longitud) };
	}

	async function guardar(e: React.FormEvent) {
		e.preventDefault();
		setErrorAccion(null);
		setAviso(null);

		if (!form.nombre.trim()) {
			setErrorAccion("El nombre es obligatorio.");
			return;
		}
		if (!form.direccion.trim()) {
			setErrorAccion("La dirección es obligatoria.");
			return;
		}
		const { lat, lng } = coordenadas();
		if ((lat == null) !== (lng == null)) {
			setErrorAccion("Falta un valor del par de coordenadas.");
			return;
		}

		setGuardando(true);
		try {
			if (modo === "crear") {
				const cuerpo = JSON.stringify({
					nombre: form.nombre.trim(),
					descripcion: form.descripcion.trim() || null,
					direccion: form.direccion.trim(),
					barrio: form.barrio.trim() || null,
					latitud: lat,
					longitud: lng,
					telefono: form.telefono.trim() || null,
					whatsapp: form.whatsapp.trim() || null,
					horario: form.horario.trim() || null,
					logoUrl: form.logoUrl.trim() || null,
				});
				const nuevo = await apiConSesion<NegocioDetalle>("/api/negocios", {
					method: "POST",
					body: cuerpo,
				});
				// Refrescar la lista y pasar a modo edición con el nuevo ID,
				// así el usuario puede subir el logo y los productos al toque.
				const lista = await apiConSesion<NegocioAdmin[]>("/api/admin/negocios");
				setDatos(lista);
				setAviso(`Negocio "${nuevo.nombre}" creado. Ahora puedes subir su logo y productos.`);
				setModo(nuevo.id);
				setDetalle(nuevo);
				// Cargar productos del negocio nuevo (vacío por ahora).
				try {
					const ps = await api<Producto[]>(`/api/productos/negocio/${nuevo.id}`);
					setProductos(ps);
				} catch {
					setProductos([]);
				}
			} else {
				const id = modo;
				const cuerpo = JSON.stringify({
					nombre: form.nombre.trim(),
					descripcion: form.descripcion.trim() || null,
					direccion: form.direccion.trim(),
					barrio: form.barrio.trim() || null,
					latitud: lat,
					longitud: lng,
					telefono: form.telefono.trim() || null,
					whatsapp: form.whatsapp.trim() || null,
					horario: form.horario.trim() || null,
				});
				const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${id}`, {
					method: "PUT",
					body: cuerpo,
				});
				setDatos((actual) =>
					(actual ?? []).map((x) =>
						x.id === id
							? {
									...x,
									nombre: actualizado.nombre,
									direccion: actualizado.direccion,
									barrio: actualizado.barrio,
									latitud: actualizado.latitud,
									longitud: actualizado.longitud,
									logoUrl: actualizado.logoUrl,
								}
							: x,
					),
				);
				setAviso(`Negocio "${actualizado.nombre}" actualizado.`);
			}
		} catch (e2) {
			setErrorAccion(e2 instanceof Error ? e2.message : "No se pudo guardar.");
		} finally {
			setGuardando(false);
		}
	}

	async function cambiarEstado(n: NegocioAdmin, cambios: { aprobado?: boolean; destacado?: boolean }) {
		setErrorAccion(null);
		try {
			const actualizado = await apiConSesion<NegocioAdmin>(
				`/api/admin/negocios/${n.id}`,
				{ method: "PATCH", body: JSON.stringify(cambios) },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) => (x.id === n.id ? actualizado : x)),
			);
			setAviso(`"${n.nombre}" ${actualizado.aprobado ? "aprobado" : "suspendido"}.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo actualizar.");
		}
	}

	async function eliminar(n: NegocioAdmin) {
		if (!window.confirm(`¿Eliminar "${n.nombre}"? Los pedidos impiden borrarlo.`)) {
			return;
		}
		setErrorAccion(null);
		try {
			await apiConSesion(`/api/admin/negocios/${n.id}`, { method: "DELETE" });
			setDatos((actual) => (actual ?? []).filter((x) => x.id !== n.id));
			setAviso(`Negocio "${n.nombre}" eliminado.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo eliminar.");
		}
	}

	// --- Fotos (solo en modo edición) ---

	async function subirLogo(id: string, evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;
		setErrorAccion(null);
		setSubiendo(`logo-${id}`);
		try {
			const url = await subirImagen("negocios", id, archivo);
			await aplicarLogo(id, url);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir el logo.");
		} finally {
			setSubiendo(null);
		}
	}

	async function aplicarLogo(id: string, url: string) {
		const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${id}`, {
			method: "PUT",
			body: JSON.stringify({ logoUrl: url }),
		});
		setDetalle((d) => (d ? { ...d, logoUrl: actualizado.logoUrl } : d));
		setDatos((actual) =>
			(actual ?? []).map((x) => (x.id === id ? { ...x, logoUrl: actualizado.logoUrl } : x)),
		);
	}

	async function subirFotoProducto(p: Producto, evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;
		setErrorAccion(null);
		setSubiendo(`foto-${p.id}`);
		try {
			const url = await subirImagen("productos", p.id, archivo);
			await actualizarFotoProducto(p, url);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir la foto.");
		} finally {
			setSubiendo(null);
		}
	}

	async function actualizarFotoProducto(p: Producto, imagenUrl: string) {
		const actualizado = await apiConSesion<Producto>(`/api/productos/${p.id}`, {
			method: "PUT",
			body: cuerpoFotoProducto(p, imagenUrl),
		});
		setProductos((ps) => ps.map((x) => (x.id === p.id ? actualizado : x)));
	}

	const editando = modo !== null && modo !== "crear";
	const negocioEditando = editando ? (negocios ?? []).find((n) => n.id === modo) : null;

	return (
		<SeccionAdmin
			titulo="Negocios"
			descripcion="Aprueba, destaca o elimina negocios; crea nuevos y edita sus datos en una ventana."
		>
			<AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<input
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Buscar por nombre o dueño"
					aria-label="Buscar negocio"
					className={`${INPUT} w-full sm:w-72`}
				/>
				<Chip activo={filtro === "todos"} onClick={() => setFiltro("todos")}>
					Todos
				</Chip>
				<Chip activo={filtro === "pendientes"} onClick={() => setFiltro("pendientes")}>
					Pendientes
				</Chip>
				<Chip activo={filtro === "aprobados"} onClick={() => setFiltro("aprobados")}>
					Aprobados
				</Chip>
				{filtrados.length < (negocios ?? []).length && (
					<span className="text-[12px] text-black/40">
						<span className="tabular">{filtrados.length}</span> de{" "}
						<span className="tabular">{(negocios ?? []).length}</span>
					</span>
				)}
				<button type="button" onClick={abrirCrear} className={`${BTN_PRIMARIO} ml-auto`}>
					+ Nuevo negocio
				</button>
			</div>

			<BloqueEstado
				cargando={cargando}
				vacio={(negocios ?? []).length === 0}
				vacioTitulo="No hay negocios registrados"
				skeletonColumnas={5}
			>
				{filtrados.length === 0 ? (
					<p className="mt-3 text-[13px] text-black/50">
						Ningún negocio coincide con el filtro.
					</p>
				) : (
					<TablaDensa>
						<table className="w-full min-w-[680px] border-collapse">
							<thead className="sticky top-0 z-10 bg-white">
								<tr className="border-b border-black/10">
									<ThDensa>Negocio</ThDensa>
									<ThDensa>Dueño</ThDensa>
									<ThDensa>Estado</ThDensa>
									<ThDensa num>Productos</ThDensa>
									<ThDensa num>Pedidos</ThDensa>
									<ThDensa>Creado</ThDensa>
									<ThDensa className="text-right">Acción</ThDensa>
								</tr>
							</thead>
							<tbody>
								{filtrados.map((n) => (
									<FilaTabla key={n.id}>
										<CeldaTabla className="max-w-[200px]">
											<p className="truncate font-medium">{n.nombre}</p>
											<p className="truncate text-[11px] text-black/45">
												{n.barrio ?? "Repelón"} · {n.direccion}
											</p>
											{n.destacado && (
												<span className="text-[11px] text-azul">★ Destacado</span>
											)}
										</CeldaTabla>
										<CeldaTabla className="max-w-[160px]">
											<p className="truncate text-[12px]">{n.duenoNombre}</p>
											<p className="truncate font-mono text-[11px] text-black/45">
												{n.duenoEmail}
											</p>
										</CeldaTabla>
										<CeldaTabla>
											<PuntoEstado
												color={n.aprobado ? "exito" : "advertencia"}
												etiqueta={n.aprobado ? "Aprobado" : "Pendiente"}
											/>
										</CeldaTabla>
										<CeldaTabla num>{n.cantidadProductos}</CeldaTabla>
										<CeldaTabla num>{n.pedidosRecibidos}</CeldaTabla>
										<CeldaTabla mono>{fecha(n.creadoEn)}</CeldaTabla>
										<CeldaTabla className="text-right">
											<span className="inline-flex gap-1.5">
												<button
													type="button"
													onClick={() => abrirEditar(n)}
													className={BTN_SECUNDARIO}
												>
													Editar
												</button>
												<button
													type="button"
													onClick={() => void cambiarEstado(n, { aprobado: !n.aprobado })}
													className={BTN_SECUNDARIO}
												>
													{n.aprobado ? "Suspender" : "Aprobar"}
												</button>
												<button
													type="button"
													onClick={() => void cambiarEstado(n, { destacado: !n.destacado })}
													className={BTN_SECUNDARIO}
												>
													{n.destacado ? "★" : "☆"}
												</button>
												<button
													type="button"
													onClick={() => void eliminar(n)}
													className={BTN_SECUNDARIO}
												>
													Eliminar
												</button>
											</span>
										</CeldaTabla>
									</FilaTabla>
								))}
							</tbody>
						</table>
					</TablaDensa>
				)}
			</BloqueEstado>

			{/*
			 * Ventana grande: datos + ubicación + fotos (solo edición).
			 * Crear no trae fotos todavía — el logo se carga después de
			 * guardar, desde el propio modal de edición.
			 */}
			<VentanaAdmin
				abierto={modo !== null}
				onCerrar={cerrarModal}
				titulo={modo === "crear" ? "Nuevo negocio" : `Editar: ${negocioEditando?.nombre ?? ""}`}
				ancho="ancho"
			>
				{editando && cargandoDetalle && (
					<p className="text-[13px] text-black/50">Cargando negocio…</p>
				)}

				{editando && !cargandoDetalle && (
					<form onSubmit={(e) => void guardar(e)}>
						{/* Datos básicos */}
						<fieldset className="space-y-2">
							<legend className="text-[12px] font-medium text-black/50">Datos</legend>
							<label className="block text-[12px] text-black/55">
								Nombre *
								<input
									value={form.nombre}
									onChange={(e) => campo("nombre", e.target.value)}
									required
									maxLength={120}
									className={INPUT}
								/>
							</label>
							<label className="block text-[12px] text-black/55">
								Descripción
								<textarea
									value={form.descripcion}
									onChange={(e) => campo("descripcion", e.target.value)}
									maxLength={1000}
									rows={2}
									className={INPUT}
								/>
							</label>
							<div className="grid gap-2 sm:grid-cols-2">
								<label className="block text-[12px] text-black/55">
									Barrio
									<input
										value={form.barrio}
										onChange={(e) => campo("barrio", e.target.value)}
										maxLength={100}
										className={INPUT}
									/>
								</label>
								<label className="block text-[12px] text-black/55">
									Horario
									<input
										value={form.horario}
										onChange={(e) => campo("horario", e.target.value)}
										maxLength={60}
										placeholder="Ej. 7am – 5pm"
										className={INPUT}
									/>
								</label>
							</div>
							<div className="grid gap-2 sm:grid-cols-2">
								<label className="block text-[12px] text-black/55">
									Teléfono
									<input
										value={form.telefono}
										onChange={(e) => campo("telefono", e.target.value)}
										pattern="[0-9+\s-]{7,20}"
										className={INPUT}
									/>
								</label>
								<label className="block text-[12px] text-black/55">
									WhatsApp
									<input
										value={form.whatsapp}
										onChange={(e) => campo("whatsapp", e.target.value)}
										pattern="[0-9+\s-]{7,20}"
										className={INPUT}
									/>
								</label>
							</div>
						</fieldset>

						{/* Ubicación */}
						<fieldset className="mt-4 space-y-2">
							<legend className="text-[12px] font-medium text-black/50">Ubicación</legend>
							<EditorUbicacion
								direccion={form.direccion}
								lat={aNumero(form.latitud)}
								lng={aNumero(form.longitud)}
								onDireccion={(t) => campo("direccion", t)}
								onPunto={(la, ln) => {
									campo("latitud", la != null ? String(la) : "");
									campo("longitud", ln != null ? String(ln) : "");
								}}
								onAviso={setAviso}
								onError={setErrorAccion}
							/>
						</fieldset>

						{/* Fotos */}
						<fieldset className="mt-4 space-y-2">
							<legend className="text-[12px] font-medium text-black/50">Fotos</legend>
							{!supabaseConfigurado && (
								<p className="text-[12px] text-black/50">
									Falta configurar Supabase para subir archivos; usa &quot;Poner URL&quot;.
								</p>
							)}
							<div className="flex items-center gap-3">
								<Foto
									src={detalle?.logoUrl ?? null}
									alt="Logo del negocio"
									className="size-10 shrink-0 rounded-md"
								/>
								<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
									<label className={BTN_SUBIR}>
										{subiendo === `logo-${modo}`
											? "Subiendo…"
											: detalle?.logoUrl
												? "Cambiar logo"
												: "Subir logo"}
										<input
											type="file"
											accept="image/*"
											className="sr-only"
											disabled={!supabaseConfigurado || subiendo !== null}
											onChange={(e) => {
												if (modo) void subirLogo(modo, e);
											}}
										/>
									</label>
									<CampoUrlImagen
										valor={detalle?.logoUrl ?? null}
										etiqueta="logo del negocio"
										onGuardar={async (url) => {
											if (modo) await aplicarLogo(modo, url);
										}}
									/>
								</div>
							</div>

							{productos.map((p) => (
								<div
									key={p.id}
									className="flex flex-wrap items-center gap-3 rounded-md bg-black/[.03] p-2"
								>
									<Foto
										src={p.imagenUrl}
										alt={p.nombre}
										className="size-10 shrink-0 rounded-md"
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate text-[13px] font-medium">{p.nombre}</p>
										<p className="text-[11px] text-black/50">
											<span className="tabular">{pesos(p.precio)}</span> /{" "}
											{p.unidad === "KILO" ? "kilo" : "libra"}
											{p.disponible ? "" : " · sin stock"}
										</p>
									</div>
									<label className={BTN_SUBIR}>
										{subiendo === `foto-${p.id}`
											? "Subiendo…"
											: p.imagenUrl
												? "Cambiar foto"
												: "Subir foto"}
										<input
											type="file"
											accept="image/*"
											className="sr-only"
											disabled={!supabaseConfigurado || subiendo !== null}
											onChange={(e) => void subirFotoProducto(p, e)}
										/>
									</label>
									<CampoUrlImagen
										valor={p.imagenUrl}
										etiqueta={`foto de ${p.nombre}`}
										onGuardar={(url) => actualizarFotoProducto(p, url)}
									/>
								</div>
							))}
							{productos.length === 0 && (
								<p className="text-[12px] text-black/40">
									Este negocio todavía no tiene productos.
								</p>
							)}
						</fieldset>

						<div className="mt-4 flex flex-wrap gap-2 border-t border-black/8 pt-3">
							<button type="submit" disabled={guardando} className={BTN_PRIMARIO}>
								{guardando ? "Guardando…" : "Guardar cambios"}
							</button>
							<button type="button" onClick={cerrarModal} className={BTN_SECUNDARIO}>
								Cancelar
							</button>
						</div>
					</form>
				)}

				{modo === "crear" && (
					<form onSubmit={(e) => void guardar(e)}>
						<fieldset className="space-y-2">
							<legend className="text-[12px] font-medium text-black/50">Datos del negocio</legend>
							<label className="block text-[12px] text-black/55">
								Nombre *
								<input
									value={form.nombre}
									onChange={(e) => campo("nombre", e.target.value)}
									required
									maxLength={120}
									placeholder="Ej. Finca La Esperanza"
									className={INPUT}
								/>
							</label>
							<label className="block text-[12px] text-black/55">
								Descripción
								<textarea
									value={form.descripcion}
									onChange={(e) => campo("descripcion", e.target.value)}
									maxLength={1000}
									rows={2}
									placeholder="Qué vende o qué ofrece…"
									className={INPUT}
								/>
							</label>
							<div className="grid gap-2 sm:grid-cols-2">
								<label className="block text-[12px] text-black/55">
									Barrio
									<input
										value={form.barrio}
										onChange={(e) => campo("barrio", e.target.value)}
										maxLength={100}
										placeholder="Ej. Centro"
										className={INPUT}
									/>
								</label>
								<label className="block text-[12px] text-black/55">
									Horario
									<input
										value={form.horario}
										onChange={(e) => campo("horario", e.target.value)}
										maxLength={60}
										placeholder="Ej. 7am – 5pm"
										className={INPUT}
									/>
								</label>
							</div>
							<div className="grid gap-2 sm:grid-cols-2">
								<label className="block text-[12px] text-black/55">
									Teléfono
									<input
										value={form.telefono}
										onChange={(e) => campo("telefono", e.target.value)}
										pattern="[0-9+\s-]{7,20}"
										placeholder="300 123 4567"
										className={INPUT}
									/>
								</label>
								<label className="block text-[12px] text-black/55">
									WhatsApp
									<input
										value={form.whatsapp}
										onChange={(e) => campo("whatsapp", e.target.value)}
										pattern="[0-9+\s-]{7,20}"
										placeholder="300 123 4567"
										className={INPUT}
									/>
								</label>
							</div>
							<label className="block text-[12px] text-black/55">
								Logo por URL (opcional)
								<input
									type="url"
									value={form.logoUrl}
									onChange={(e) => campo("logoUrl", e.target.value)}
									maxLength={500}
									placeholder="https://…/logo.jpg"
									className={INPUT}
								/>
							</label>
							{form.logoUrl.trim().startsWith("http") && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={form.logoUrl.trim()}
									alt="Vista previa del logo"
									className="h-16 w-16 rounded-md border border-black/10 object-cover"
								/>
							)}
						</fieldset>

						<fieldset className="mt-4 space-y-2">
							<legend className="text-[12px] font-medium text-black/50">Ubicación</legend>
							<EditorUbicacion
								direccion={form.direccion}
								lat={aNumero(form.latitud)}
								lng={aNumero(form.longitud)}
								onDireccion={(t) => campo("direccion", t)}
								onPunto={(la, ln) => {
									campo("latitud", la != null ? String(la) : "");
									campo("longitud", ln != null ? String(ln) : "");
								}}
								onAviso={setAviso}
								onError={setErrorAccion}
							/>
						</fieldset>

						<div className="mt-4 flex flex-wrap gap-2 border-t border-black/8 pt-3">
							<button
								type="submit"
								disabled={guardando || !form.nombre.trim() || !form.direccion.trim()}
								className={BTN_PRIMARIO}
							>
								{guardando ? "Creando…" : "Crear negocio"}
							</button>
							<button type="button" onClick={cerrarModal} className={BTN_SECUNDARIO}>
								Cancelar
							</button>
						</div>
					</form>
				)}
			</VentanaAdmin>
		</SeccionAdmin>
	);
}
