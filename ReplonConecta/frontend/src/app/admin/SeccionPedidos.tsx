"use client";

import { useMemo, useState } from "react";

import { apiConSesion } from "@/lib/api";
import { ETIQUETA_ESTADO, fecha, pesos } from "@/lib/format";
import type { EstadoPedido, Pedido, PedidoDetalle } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import {
	AvisosSeccion,
	BloqueEstado,
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
} from "./ui-admin";
import type { ColumnaOrden } from "./tabla";

/*
 * Sección "Pedidos" — dense table.
 *
 * Tabla densa con sticky thead, status dots (no pills), números con
 * tabular-nums, fechas en mono, skeleton rows al cargar.
 */

const ESTADOS: EstadoPedido[] = [
	"PEDIDO_RECIBIDO",
	"EN_PREPARACION",
	"EN_CAMINO",
	"ENTREGADO",
	"CANCELADO",
	"RECHAZADO",
];

/** Mismas reglas que el backend: solo se anula antes de salir. */
const ANULABLES: EstadoPedido[] = ["PEDIDO_RECIBIDO", "EN_PREPARACION"];

/** Color semántico del dot según estado. */
const COLOR_ESTADO: Record<EstadoPedido, "info" | "exito" | "peligro" | "neutro"> = {
	PEDIDO_RECIBIDO: "info",
	EN_PREPARACION: "info",
	EN_CAMINO: "exito",
	ENTREGADO: "exito",
	CANCELADO: "neutro",
	RECHAZADO: "peligro",
};

/** Columnas ordenables (módulo, no componente: lista estable). */
const COLUMNAS_PEDIDOS: ColumnaOrden<Pedido>[] = [
	{ id: "numero", valor: (p) => p.numero },
	{ id: "estado", valor: (p) => p.estadoEtiqueta ?? ETIQUETA_ESTADO[p.estado] },
	{ id: "negocio", valor: (p) => p.negocioNombre },
	{ id: "items", valor: (p) => p.cantidadItems },
	{ id: "total", valor: (p) => p.total },
	{ id: "fecha", valor: (p) => p.creadoEn },
];

const buscarPedido = (p: Pedido) => `${p.numero} ${p.negocioNombre}`;

export function SeccionPedidos() {
	const {
		datos,
		cargando,
		error,
		setDatos,
	} = useDatos<Pedido[]>(() => apiConSesion<Pedido[]>("/api/admin/pedidos"), []);

	const [estado, setEstado] = useState<EstadoPedido | "TODOS">("TODOS");
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [anulando, setAnulando] = useState<string | null>(null);

	const porEstado = useMemo(
		() =>
			(datos ?? []).filter((p) => estado === "TODOS" || p.estado === estado),
		[datos, estado],
	);
	const tabla = useTabla(porEstado, {
		buscar: buscarPedido,
		columnas: COLUMNAS_PEDIDOS,
		ordenInicial: "fecha",
		direccionInicial: "desc",
	});

	async function anular(p: Pedido) {
		if (!window.confirm(`¿Anular el pedido ${p.numero}? El stock vuelve al negocio.`)) {
			return;
		}
		setErrorAccion(null);
		setAnulando(p.id);
		try {
			const detalle = await apiConSesion<PedidoDetalle>(
				`/api/admin/pedidos/${p.id}/cancelar`,
				{ method: "PATCH" },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) =>
					x.id === p.id
						? { ...x, estado: detalle.estado, estadoEtiqueta: detalle.estadoEtiqueta }
						: x,
				),
			);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo anular.");
		} finally {
			setAnulando(null);
		}
	}

	return (
		<SeccionAdmin
			titulo="Pedidos"
			descripcion="Todos los pedidos de la plataforma; anular devuelve el stock al negocio."
		>
			<AvisosSeccion accion={errorAccion} carga={error} />

			{/* Toolbar: ghost controls, h-9, gap-2. */}
			<div className="mt-3 flex flex-wrap items-center gap-2">
				<BuscadorTabla
					valor={tabla.texto}
					onChange={tabla.setTexto}
					placeholder="Filtrar por número o negocio"
					ariaLabel="Filtrar pedidos"
				/>
				<label className="text-[12px] text-black/50">
					<span className="sr-only">Filtrar por estado</span>
					<select
						value={estado}
						onChange={(e) => setEstado(e.target.value as EstadoPedido | "TODOS")}
						className={`${INPUT} w-auto`}
					>
						<option value="TODOS">Todos los estados</option>
						{ESTADOS.map((e) => (
							<option key={e} value={e}>
								{ETIQUETA_ESTADO[e]}
							</option>
						))}
					</select>
				</label>
				{tabla.filtradas.length < (datos ?? []).length && (
					<span className="text-[12px] text-black/40">
						<span className="tabular">{tabla.filtradas.length}</span> de{" "}
						<span className="tabular">{(datos ?? []).length}</span>
					</span>
				)}
			</div>

			<BloqueEstado
				cargando={cargando}
				vacio={(datos ?? []).length === 0}
				vacioTitulo="Todavía no hay pedidos"
				skeletonColumnas={5}
			>
				{tabla.filtradas.length === 0 ? (
					<p className="mt-3 text-[13px] text-black/50">
						Ningún pedido coincide con el filtro.
					</p>
				) : (
					<>
						<TablaDensa>
							<table className="w-full min-w-[640px] border-collapse">
								<thead className="sticky top-0 z-10 bg-white">
									<tr className="border-b border-black/10">
										<ThOrdenable
											campo="numero"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Número
										</ThOrdenable>
										<ThOrdenable
											campo="estado"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Estado
										</ThOrdenable>
										<ThOrdenable
											campo="negocio"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Negocio
										</ThOrdenable>
										<ThOrdenable
											campo="items"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
											num
										>
											Items
										</ThOrdenable>
										<ThOrdenable
											campo="total"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
											num
										>
											Total
										</ThOrdenable>
										<ThOrdenable
											campo="fecha"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Fecha
										</ThOrdenable>
										<ThDensa className="text-right">Acción</ThDensa>
									</tr>
								</thead>
								<tbody>
									{tabla.visibles.map((p) => (
										<FilaTabla key={p.id}>
											<CeldaTabla mono>{p.numero}</CeldaTabla>
											<CeldaTabla>
												<PuntoEstado
													color={COLOR_ESTADO[p.estado]}
													etiqueta={p.estadoEtiqueta ?? ETIQUETA_ESTADO[p.estado]}
												/>
											</CeldaTabla>
											<CeldaTabla className="max-w-[180px] truncate">
												{p.negocioNombre}
											</CeldaTabla>
											<CeldaTabla num>{p.cantidadItems}</CeldaTabla>
											<CeldaTabla num className="font-medium">
												{pesos(p.total)}
											</CeldaTabla>
											<CeldaTabla mono>{fecha(p.creadoEn)}</CeldaTabla>
											<CeldaTabla className="text-right">
												{ANULABLES.includes(p.estado) ? (
													<button
														type="button"
														disabled={anulando === p.id}
														onClick={() => void anular(p)}
														className={BTN_SECUNDARIO}
													>
														{anulando === p.id ? "Anulando…" : "Anular"}
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
