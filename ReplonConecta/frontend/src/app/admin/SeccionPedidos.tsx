"use client";

import { useState } from "react";

import { apiConSesion } from "@/lib/api";
import { CLASE_ESTADO, ETIQUETA_ESTADO, fecha, pesos } from "@/lib/format";
import type { EstadoPedido, Pedido, PedidoDetalle } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_SECUNDARIO,
	INPUT,
	SeccionAdmin,
	TARJETA,
} from "./ui-admin";

/*
 * Sección "Pedidos" del panel (P2, fila 11).
 *
 * El listado es global (toda la plataforma) y los filtros corren en el
 * navegador: son dos o tres clics, no una consulta por tecla. Anular
 * va por el mismo cancelar del backend, así que devuelve el stock y
 * respeta los estados finales (lo entregado o en camino no se anula).
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

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<input
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Filtrar por número o negocio"
					className={`${INPUT} w-full sm:w-auto sm:flex-1`}
				/>
				<label className="text-xs text-black/55">
					<span className="sr-only">Filtrar por estado</span>
					<select
						value={estado}
						onChange={(e) => setEstado(e.target.value as EstadoPedido | "TODOS")}
						className="min-h-12 rounded-xl border border-black/15 px-3 py-2 text-sm"
					>
						<option value="TODOS">Todos los estados</option>
						{ESTADOS.map((e) => (
							<option key={e} value={e}>
								{ETIQUETA_ESTADO[e]}
							</option>
						))}
					</select>
				</label>
			</div>

			<BloqueEstado
				cargando={cargando}
				vacio={(datos ?? []).length === 0}
				vacioTitulo="Todavía no hay pedidos"
			>
				{filtrados.length === 0 ? (
					<p className="mt-3 text-sm text-black/55">
						Ningún pedido coincide con el filtro.
					</p>
				) : (
					<ul className="mt-3 space-y-2">
						{filtrados.map((p) => (
							<li
								key={p.id}
								className={`${TARJETA} sm:flex sm:items-center sm:justify-between sm:gap-3`}
							>
								<div className="min-w-0">
									<p className="flex flex-wrap items-center gap-2 font-semibold">
										<span className="font-mono text-sm">{p.numero}</span>
										<span
											className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CLASE_ESTADO[p.estado]}`}
										>
											{p.estadoEtiqueta ?? ETIQUETA_ESTADO[p.estado]}
										</span>
									</p>
									<p className="truncate text-xs text-black/55">
										{p.negocioNombre} · {p.cantidadItems}{" "}
										{p.cantidadItems === 1 ? "producto" : "productos"} ·{" "}
										{fecha(p.creadoEn)}
									</p>
								</div>

								<div className="mt-2 flex items-center gap-3 sm:mt-0">
									<span className="font-bold">{pesos(p.total)}</span>
									{ANULABLES.includes(p.estado) && (
										<button
											type="button"
											disabled={anulando === p.id}
											onClick={() => void anular(p)}
											className={BTN_SECUNDARIO}
										>
											{anulando === p.id ? "Anulando…" : "Anular"}
										</button>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</BloqueEstado>
		</SeccionAdmin>
	);
}
