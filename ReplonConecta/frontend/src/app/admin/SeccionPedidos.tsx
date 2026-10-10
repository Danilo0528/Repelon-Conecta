"use client";

import { useState } from "react";

import { apiConSesion } from "@/lib/api";
import { ETIQUETA_ESTADO, fecha, pesos } from "@/lib/format";
import type { EstadoPedido, Pedido, PedidoDetalle } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_SECUNDARIO,
	CeldaTabla,
	FilaTabla,
	INPUT,
	PuntoEstado,
	SeccionAdmin,
	TablaDensa,
	ThDensa,
} from "./ui-admin";

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

export function SeccionPedidos() {
	const {
		datos,
		cargando,
		error,
		setDatos,
	} = useDatos<Pedido[]>(() => apiConSesion<Pedido[]>("/api/admin/pedidos"), []);

	const [estado, setEstado] = useState<EstadoPedido | "TODOS">("TODOS");
	const [texto, setTexto] = useState("");
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [anulando, setAnulando] = useState<string | null>(null);

	const termino = texto.trim().toLocaleLowerCase("es");
	const filtrados = (datos ?? []).filter(
		(p) =>
			(estado === "TODOS" || p.estado === estado) &&
			(!termino ||
				p.numero.toLocaleLowerCase("es").includes(termino) ||
				p.negocioNombre.toLocaleLowerCase("es").includes(termino)),
	);

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
				<input
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Filtrar por número o negocio"
					aria-label="Filtrar pedidos"
					className={`${INPUT} w-full sm:w-64`}
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
				{filtrados.length < (datos ?? []).length && (
					<span className="text-[12px] text-black/40">
						<span className="tabular">{filtrados.length}</span> de{" "}
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
				{filtrados.length === 0 ? (
					<p className="mt-3 text-[13px] text-black/50">
						Ningún pedido coincide con el filtro.
					</p>
				) : (
					<TablaDensa>
						<table className="w-full min-w-[640px] border-collapse">
							<thead className="sticky top-0 z-10 bg-white">
								<tr className="border-b border-black/10">
									<ThDensa>Número</ThDensa>
									<ThDensa>Estado</ThDensa>
									<ThDensa>Negocio</ThDensa>
									<ThDensa num>Items</ThDensa>
									<ThDensa num>Total</ThDensa>
									<ThDensa>Fecha</ThDensa>
									<ThDensa className="text-right">Acción</ThDensa>
								</tr>
							</thead>
							<tbody>
								{filtrados.map((p) => (
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
				)}
			</BloqueEstado>
		</SeccionAdmin>
	);
}
