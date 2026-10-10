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
import { EditorUbicacion, type UbicacionEditada } from "./EditorUbicacion";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	INPUT,
	PuntoEstado,
	SeccionAdmin,
	TARJETA,
} from "./ui-admin";

/*
 * Sección "Negocios" del panel: aprobación, destacados, borrado y
 * fotos (logo y productos) — antes vivía entera dentro de page.tsx
 * (580 líneas mezclando layout con esta lógica).
 *
 * Las fotos las suben los estudiantes (decisión 5 del cuestionario):
 * el archivo va al bucket de Supabase y la URL al backend con la
 * sesión de la app; con "Poner URL" se salta Supabase y se pega
 * cualquier enlace. Con el buscador y los chips, la cola de trabajo
 * (pendientes) es un clic: el link del resumen llega con
 * `?filtro=pendientes` ya puesto.
 */

export type FiltroNegocios = "todos" | "pendientes" | "aprobados";

/*
 * ProductoRequest exige nombre y precio (@Valid), así que el PUT va con
 * el producto completo y solo cambia la foto. Este cuerpo estaba
 * escrito dos veces (subir archivo y poner URL); ahora es uno solo.
 */
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

const BTN_SUBIR =
	"inline-flex h-9 cursor-pointer items-center rounded-md border border-black/15 bg-white px-3 text-[13px] font-medium text-black/70 transition-colors hover:bg-black/[.03] disabled:pointer-events-none disabled:opacity-50";

export function SeccionNegocios({ filtroInicial }: { filtroInicial?: FiltroNegocios }) {
	const { datos: negocios, cargando, error, setDatos } = useDatos<NegocioAdmin[]>(
		() => apiConSesion<NegocioAdmin[]>("/api/admin/negocios"),
		[],
	);

	const [filtro, setFiltro] = useState<FiltroNegocios>(filtroInicial ?? "todos");
	const [texto, setTexto] = useState("");
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	// Ubicación: qué negocio tiene el editor abierto y el borrador de
	// cada uno (dirección + pin), que se guarda aparte del resto de la
	// ficha con su propio botón.
	const [ubicacionAbierta, setUbicacionAbierta] = useState<string | null>(null);
	const [borradores, setBorradores] = useState<Record<string, UbicacionEditada>>({});
	const [guardandoUbicacion, setGuardandoUbicacion] = useState<string | null>(null);

	// Fotos: qué archivo se está subiendo (llave = "logo-{id}" o
	// "foto-{productoId}"), qué negocio tiene sus productos abiertos y
	// los productos ya cargados para no pedirlos dos veces.
	const [subiendo, setSubiendo] = useState<string | null>(null);
	const [abiertoFotos, setAbiertoFotos] = useState<string | null>(null);
	const [productosPorNegocio, setProductosPorNegocio] = useState<
		Record<string, Producto[]>
	>({});
	const [cargandoFotos, setCargandoFotos] = useState<string | null>(null);

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

	async function cambiar(
		n: NegocioAdmin,
		cambios: { aprobado?: boolean; destacado?: boolean },
	) {
		setErrorAccion(null);
		try {
			const actualizado = await apiConSesion<NegocioAdmin>(
				`/api/admin/negocios/${n.id}`,
				{ method: "PATCH", body: JSON.stringify(cambios) },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) => (x.id === n.id ? actualizado : x)),
			);
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
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo eliminar.");
		}
	}

	/*
	 * Ubicación: dirección escrita + pin del mapa, con borrador por
	 * negocio para que se pueda corregir sin afectar a los demás. El
	 * guardado va por PUT /api/negocios/{id}, que el backend acepta para
	 * el rol ADMIN (NegocioService.actualizar → actualVendedorOAdmin) y
	 * que solo pisa los campos informados.
	 */
	function alternarUbicacion(n: NegocioAdmin) {
		if (ubicacionAbierta === n.id) {
			setUbicacionAbierta(null);
			return;
		}
		setErrorAccion(null);
		setAviso(null);
		setBorradores((b) => ({
			...b,
			[n.id]: b[n.id] ?? { direccion: n.direccion, lat: n.latitud, lng: n.longitud },
		}));
		setUbicacionAbierta(n.id);
	}

	function editarUbicacion(id: string, cambios: Partial<UbicacionEditada>) {
		setBorradores((b) => {
			const actual = b[id] ?? { direccion: "", lat: null, lng: null };
			return { ...b, [id]: { ...actual, ...cambios } };
		});
	}

	async function guardarUbicacion(n: NegocioAdmin) {
		const b = borradores[n.id];
		if (!b) return;
		if (!b.direccion.trim()) {
			setErrorAccion("La dirección es obligatoria.");
			return;
		}
		if ((b.lat == null) !== (b.lng == null)) {
			setErrorAccion("Falta un valor del par de coordenadas.");
			return;
		}

		setGuardandoUbicacion(n.id);
		setErrorAccion(null);
		setAviso(null);
		try {
			const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${n.id}`, {
				method: "PUT",
				body: JSON.stringify({
					direccion: b.direccion.trim(),
					latitud: b.lat,
					longitud: b.lng,
				}),
			});
			setDatos((actual) =>
				(actual ?? []).map((x) =>
					x.id === n.id
						? {
								...x,
								direccion: actualizado.direccion,
								latitud: actualizado.latitud,
								longitud: actualizado.longitud,
							}
						: x,
				),
			);
			setBorradores((bd) => ({
				...bd,
				[n.id]: {
					direccion: actualizado.direccion,
					lat: actualizado.latitud,
					lng: actualizado.longitud,
				},
			}));
			setAviso(`Ubicación de "${n.nombre}" guardada.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo guardar la ubicación.");
		} finally {
			setGuardandoUbicacion(null);
		}
	}

	/*
	 * Fotos. Sube el archivo al bucket con la sesión de Supabase y
	 * después le pega la URL al negocio/producto con la sesión de la
	 * app: son dos pasos porque el storage no escribe en la base.
	 */
	async function subirLogo(n: NegocioAdmin, evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;

		setErrorAccion(null);
		setSubiendo(`logo-${n.id}`);
		try {
			const url = await subirImagen("negocios", n.id, archivo);
			const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${n.id}`, {
				method: "PUT",
				body: JSON.stringify({ logoUrl: url }),
			});
			setDatos((actual) =>
				(actual ?? []).map((x) =>
					x.id === n.id ? { ...x, logoUrl: actualizado.logoUrl } : x,
				),
			);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir el logo.");
		} finally {
			setSubiendo(null);
		}
	}

	async function abrirFotos(n: NegocioAdmin) {
		if (abiertoFotos === n.id) {
			setAbiertoFotos(null);
			return;
		}
		setAbiertoFotos(n.id);
		if (productosPorNegocio[n.id]) return;

		setCargandoFotos(n.id);
		setErrorAccion(null);
		try {
			const productos = await api<Producto[]>(`/api/productos/negocio/${n.id}`);
			setProductosPorNegocio((m) => ({ ...m, [n.id]: productos }));
		} catch (e) {
			setErrorAccion(
				e instanceof Error ? e.message : "No se pudieron cargar los productos.",
			);
			setAbiertoFotos(null);
		} finally {
			setCargandoFotos(null);
		}
	}

	/** Único PUT de producto con foto nueva: lo comparten subir archivo y URL. */
	async function actualizarFotoProducto(
		n: NegocioAdmin,
		p: Producto,
		imagenUrl: string,
	) {
		const actualizado = await apiConSesion<Producto>(`/api/productos/${p.id}`, {
			method: "PUT",
			body: cuerpoFotoProducto(p, imagenUrl),
		});
		setProductosPorNegocio((m) => ({
			...m,
			[n.id]: (m[n.id] ?? []).map((x) => (x.id === p.id ? actualizado : x)),
		}));
	}

	async function subirFotoProducto(
		n: NegocioAdmin,
		p: Producto,
		evento: ChangeEvent<HTMLInputElement>,
	) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;

		setErrorAccion(null);
		setSubiendo(`foto-${p.id}`);
		try {
			const url = await subirImagen("productos", p.id, archivo);
			await actualizarFotoProducto(n, p, url);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir la foto.");
		} finally {
			setSubiendo(null);
		}
	}

	/*
	 * Imágenes por URL: mismo destino que subir archivo (el backend
	 * guarda el texto en `logoUrl`/`imagenUrl`), pero sin pasar por
	 * Supabase. url vacía = quitar la imagen que había.
	 */
	async function ponerLogoUrl(n: NegocioAdmin, url: string) {
		const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${n.id}`, {
			method: "PUT",
			body: JSON.stringify({ logoUrl: url }),
		});
		setDatos((actual) =>
			(actual ?? []).map((x) =>
				x.id === n.id ? { ...x, logoUrl: actualizado.logoUrl } : x,
			),
		);
	}

	function ponerFotoUrl(n: NegocioAdmin, p: Producto, url: string) {
		return actualizarFotoProducto(n, p, url);
	}

	return (
		<SeccionAdmin
			titulo="Negocios"
			descripcion="Aprueba, destaca o elimina negocios, carga sus fotos y corrige su dirección en el mapa."
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
				<Chip
					activo={filtro === "pendientes"}
					onClick={() => setFiltro("pendientes")}
				>
					Pendientes
				</Chip>
				<Chip
					activo={filtro === "aprobados"}
					onClick={() => setFiltro("aprobados")}
				>
					Aprobados
				</Chip>
				{filtrados.length < (negocios ?? []).length && (
					<span className="text-[12px] text-black/40">
						<span className="tabular">{filtrados.length}</span> de{" "}
						<span className="tabular">{(negocios ?? []).length}</span>
					</span>
				)}
			</div>

			<BloqueEstado
				cargando={cargando}
				vacio={(negocios ?? []).length === 0}
				vacioTitulo="No hay negocios registrados"
			>
				{filtrados.length === 0 && (
					<p className="mt-4 text-sm text-black/55">
						Ningún negocio coincide con el filtro.
					</p>
				)}

				{/* En PC los negocios salen en varias columnas; en móvil, uno
				    debajo del otro como siempre. */}
				<ul className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					{filtrados.map((n) => (
						<li key={n.id} className={TARJETA}>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{n.nombre}</p>
									<p className="truncate text-[12px] text-black/50">
										{n.barrio ?? "Repelón"} ·{" "}
										<span className="tabular">{n.cantidadProductos}</span> productos ·{" "}
										<span className="tabular">{n.pedidosRecibidos}</span> pedidos
									</p>
									<p className="truncate text-[11px] text-black/40">
										Dueño: {n.duenoNombre}{" "}
										<span className="font-mono">({n.duenoEmail})</span> ·{" "}
										<span className="font-mono">{fecha(n.creadoEn)}</span>
									</p>
								</div>
								<div className="flex shrink-0 flex-col items-end gap-1">
									<PuntoEstado
										color={n.aprobado ? "exito" : "advertencia"}
										etiqueta={n.aprobado ? "Aprobado" : "Pendiente"}
									/>
									{n.destacado && (
										<span className="inline-flex items-center gap-1.5 text-[12px] text-azul">
											<span className="size-1.5 shrink-0 rounded-full bg-azul" aria-hidden />
											Destacado
										</span>
									)}
								</div>
							</div>

							<div className="mt-3 flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => cambiar(n, { aprobado: !n.aprobado })}
									className={BTN_SECUNDARIO}
								>
									{n.aprobado ? "Suspender" : "Aprobar"}
								</button>
								<button
									type="button"
									onClick={() => cambiar(n, { destacado: !n.destacado })}
									className={BTN_SECUNDARIO}
								>
									{n.destacado ? "Quitar destacado" : "Destacar"}
								</button>
								<button
									type="button"
									onClick={() => alternarUbicacion(n)}
									aria-expanded={ubicacionAbierta === n.id}
									className={BTN_SECUNDARIO}
								>
									{ubicacionAbierta === n.id ? "Ocultar ubicación" : "Ubicación"}
								</button>
								<button
									type="button"
									onClick={() => eliminar(n)}
									className={BTN_SECUNDARIO}
								>
									Eliminar
								</button>
							</div>

							{/*
							 * Ubicación: la dirección exacta y el pin. Se busca por
							 * sugerencias, se afina arrastrando el pin y se guarda con
							 * su propio botón, sin tocar el resto de la ficha.
							 */}
							{ubicacionAbierta === n.id && (
								<div className="mt-3 border-t border-black/10 pt-3">
									<p className="text-xs text-black/55">
										Escribe la dirección para ver sugerencias —o usa Usar mi
										ubicación— y afina el punto arrastrando el pin. El pin es
										lo que usan &quot;Cómo llegar&quot; y el mapa del home.
									</p>

									<EditorUbicacion
										direccion={borradores[n.id]?.direccion ?? ""}
										lat={borradores[n.id]?.lat ?? null}
										lng={borradores[n.id]?.lng ?? null}
										onDireccion={(t) => editarUbicacion(n.id, { direccion: t })}
										onPunto={(la, ln) => editarUbicacion(n.id, { lat: la, lng: ln })}
										onAviso={setAviso}
										onError={setErrorAccion}
									/>

									<button
										type="button"
										onClick={() => void guardarUbicacion(n)}
										disabled={guardandoUbicacion === n.id}
										className={`${BTN_PRIMARIO} mt-3`}
									>
										{guardandoUbicacion === n.id
											? "Guardando…"
											: "Guardar ubicación"}
									</button>
								</div>
							)}

							{/*
							 * Fotos: el estudiante sube el logo del negocio y las
							 * fotos de sus productos desde acá. La vista previa
							 * sale del mismo campo que usa la ficha.
							 */}
							<div className="mt-3 border-t border-black/10 pt-3">
								{!supabaseConfigurado && (
									<p className="text-xs text-black/55">
										Falta configurar Supabase en <code>.env.local</code> para
										subir archivos; con el botón Poner URL se puede igual.
									</p>
								)}

								<div className="flex items-center gap-3">
									<Foto
										src={n.logoUrl}
										alt={`Logo de ${n.nombre}`}
										className="size-10 shrink-0 rounded-md"
									/>
									<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
										<label className={BTN_SUBIR}>
											{subiendo === `logo-${n.id}`
												? "Subiendo…"
												: n.logoUrl
													? "Cambiar logo"
													: "Subir logo"}
											<input
												type="file"
												accept="image/*"
												className="sr-only"
												disabled={!supabaseConfigurado || subiendo !== null}
												onChange={(e) => void subirLogo(n, e)}
											/>
										</label>
										<button
											type="button"
											onClick={() => void abrirFotos(n)}
											aria-expanded={abiertoFotos === n.id}
											className={BTN_SECUNDARIO}
										>
											{abiertoFotos === n.id
												? "Ocultar fotos"
												: `Fotos de productos (${n.cantidadProductos})`}
										</button>
										<CampoUrlImagen
											valor={n.logoUrl}
											etiqueta={`logo de ${n.nombre}`}
											onGuardar={(url) => ponerLogoUrl(n, url)}
										/>
									</div>
								</div>

								{abiertoFotos === n.id && (
									<div className="mt-3 space-y-2">
										{cargandoFotos === n.id && (
											<p className="text-sm text-black/55">Cargando productos…</p>
										)}

										{(productosPorNegocio[n.id] ?? []).map((p) => (
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
													<p className="truncate text-[13px] font-medium">
														{p.nombre}
													</p>
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
														onChange={(e) => void subirFotoProducto(n, p, e)}
													/>
												</label>
												<CampoUrlImagen
													valor={p.imagenUrl}
													etiqueta={`foto de ${p.nombre}`}
													onGuardar={(url) => ponerFotoUrl(n, p, url)}
												/>
											</div>
										))}

										{cargandoFotos !== n.id &&
											(productosPorNegocio[n.id] ?? []).length === 0 && (
												<p className="text-xs text-black/55">
													Este negocio todavía no tiene productos.
												</p>
											)}
									</div>
								)}
							</div>
						</li>
					))}
				</ul>
			</BloqueEstado>
		</SeccionAdmin>
	);
}
