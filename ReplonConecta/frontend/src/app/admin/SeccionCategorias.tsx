"use client";

import { useState, type FormEvent } from "react";

import { apiConSesion } from "@/lib/api";
import type { Categoria } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
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
	PuntoEstado,
	SeccionAdmin,
	TablaDensa,
	ThDensa,
	ThOrdenable,
	useTabla,
	VentanaAdmin,
} from "./ui-admin";
import type { ColumnaOrden } from "./tabla";

/*
 * Sección "Categorías" del panel (P2, fila 12).
 *
 * El backend ya tenía POST y DELETE; esto es la cara que le faltaba.
 * Borrar en realidad desactiva (el producto que apunta a la categoría
 * no se queda huérfano), y las tres familias del alcance llevan un
 * aviso extra antes de apagarlas: son las que el cliente reconoce.
 */

const ALCANCE = new Set(["agro", "pesca", "turismo"]);

const COLUMNAS_CATEGORIAS: ColumnaOrden<Categoria>[] = [
	{ id: "nombre", valor: (c) => c.nombre },
	{ id: "slug", valor: (c) => c.slug },
	{ id: "orden", valor: (c) => c.orden },
	{ id: "estado", valor: (c) => (c.activa ? "Activa" : "Inactiva") },
];

const buscarCategoria = (c: Categoria) =>
	`${c.nombre} ${c.slug} ${c.icono ?? ""}`;

export function SeccionCategorias() {
	const {
		datos,
		cargando,
		error,
		setDatos,
	} = useDatos<Categoria[]>(() =>
		apiConSesion<Categoria[]>("/api/admin/categorias"),
	);

	const [nombre, setNombre] = useState("");
	const [slug, setSlug] = useState("");
	const [icono, setIcono] = useState("");
	const [guardando, setGuardando] = useState(false);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);
	const [ventana, setVentana] = useState(false);

	const tabla = useTabla(datos ?? [], {
		buscar: buscarCategoria,
		columnas: COLUMNAS_CATEGORIAS,
		porPagina: 25,
	});

	// Cerrar descarta lo escrito (mismo criterio que Zonas): Cancelar,
	// la ✕ y Escape pasan por acá para que la próxima apertura no
	// arrastre campos viejos.
	function cerrar() {
		setNombre("");
		setSlug("");
		setIcono("");
		setVentana(false);
	}

	async function crear(e: FormEvent) {
		e.preventDefault();
		if (!nombre.trim()) return;

		setErrorAccion(null);
		setAviso(null);
		setGuardando(true);
		try {
			const creada = await apiConSesion<Categoria>("/api/categorias", {
				method: "POST",
				body: JSON.stringify({
					nombre: nombre.trim(),
					slug: slug.trim() || null,
					icono: icono.trim() || null,
				}),
			});
			setDatos((actual) => [...(actual ?? []), creada]);
			setAviso(`Categoría "${creada.nombre}" creada.`);
			cerrar();
		} catch (e2) {
			// La ventana queda abierta para corregir; el error se ve
			// dentro de ella (los avisos van montados ahí cuando abre).
			setErrorAccion(e2 instanceof Error ? e2.message : "No se pudo crear.");
		} finally {
			setGuardando(false);
		}
	}

	async function desactivar(c: Categoria) {
		const delAlcance = ALCANCE.has(c.slug);
		if (
			!window.confirm(
				delAlcance
					? `"${c.nombre}" es una de las categorías del alcance del proyecto. ¿Desactivarla igual? Los productos no se borran.`
					: `¿Desactivar "${c.nombre}"? Los productos no se borran.`,
			)
		) {
			return;
		}

		setErrorAccion(null);
		setAviso(null);
		try {
			await apiConSesion(`/api/categorias/${c.id}`, { method: "DELETE" });
			setDatos((actual) =>
				(actual ?? []).map((x) => (x.id === c.id ? { ...x, activa: false } : x)),
			);
			setAviso(`"${c.nombre}" quedó desactivada.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo desactivar.");
		}
	}

	const avisos = (
		<AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />
	);

	return (
		<SeccionAdmin
			titulo="Categorías"
			descripcion="El catálogo que el público ve en la portada; borrar solo desactiva."
		>
			{!ventana && avisos}

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={() => {
						setErrorAccion(null);
						setAviso(null);
						setVentana(true);
					}}
					className={BTN_PRIMARIO}
				>
					Nueva categoría
				</button>
				<BuscadorTabla
					valor={tabla.texto}
					onChange={tabla.setTexto}
					placeholder="Filtrar por nombre, slug o icono"
					ariaLabel="Filtrar categorías"
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
				onCerrar={cerrar}
				titulo="Nueva categoría"
			>
				{avisos}
				<form
					onSubmit={(e) => void crear(e)}
					className="mt-1 flex flex-wrap items-end gap-2"
				>
					<label className="text-xs text-black/55">
						Nombre
						<input
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							required
							maxLength={60}
							placeholder="Ej. Ganadería"
							className={INPUT}
						/>
					</label>
					<label className="text-xs text-black/55">
						Slug (opcional)
						<input
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							maxLength={60}
							placeholder="ganaderia"
							className={INPUT}
						/>
					</label>
					<label className="text-xs text-black/55">
						Icono (opcional)
						<input
							value={icono}
							onChange={(e) => setIcono(e.target.value)}
							maxLength={40}
							placeholder="ganado"
							className={INPUT}
						/>
					</label>
					<div className="mt-3 flex w-full flex-wrap gap-3">
						<button
							type="submit"
							disabled={guardando || !nombre.trim()}
							className={BTN_PRIMARIO}
						>
							{guardando ? "Creando…" : "Crear"}
						</button>
						<button
							type="button"
							onClick={cerrar}
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
				vacioTitulo="No hay categorías"
				skeletonColumnas={4}
			>
				{tabla.filtradas.length === 0 ? (
					<p className="mt-3 text-[13px] text-black/50">
						Ninguna categoría coincide con el filtro.
					</p>
				) : (
					<>
						<TablaDensa>
							<table className="w-full min-w-[520px] border-collapse">
								<thead className="sticky top-0 z-10 bg-white">
									<tr className="border-b border-black/10">
										<ThOrdenable
											campo="nombre"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Nombre
										</ThOrdenable>
										<ThOrdenable
											campo="slug"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Slug
										</ThOrdenable>
										<ThOrdenable
											campo="orden"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
											num
										>
											Orden
										</ThOrdenable>
										<ThOrdenable
											campo="estado"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Estado
										</ThOrdenable>
										<ThDensa className="text-right">Acción</ThDensa>
									</tr>
								</thead>
								<tbody>
									{tabla.visibles.map((c) => (
										<FilaTabla key={c.id}>
											<CeldaTabla>
												<span className="font-medium">{c.nombre}</span>
												{c.icono && (
													<span className="ml-2 font-mono text-[11px] text-black/35">
														{c.icono}
													</span>
												)}
											</CeldaTabla>
											<CeldaTabla mono>{c.slug}</CeldaTabla>
											<CeldaTabla num>{c.orden}</CeldaTabla>
											<CeldaTabla>
												<PuntoEstado
													color={c.activa ? "exito" : "neutro"}
													etiqueta={c.activa ? "Activa" : "Inactiva"}
												/>
											</CeldaTabla>
											<CeldaTabla className="text-right">
												{c.activa ? (
													<button
														type="button"
														onClick={() => void desactivar(c)}
														className={BTN_SECUNDARIO}
													>
														Desactivar
													</button>
												) : (
													<span className="text-[12px] text-black/25">—</span>
												)}
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
