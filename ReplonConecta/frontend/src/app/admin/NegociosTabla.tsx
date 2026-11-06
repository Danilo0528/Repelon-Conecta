"use client";

import { Chip } from "@/components/ui";
import { fecha } from "@/lib/format";
import {
	AvisosSeccion,
	BloqueEstado,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	CeldaTabla,
	FilaTabla,
	INPUT,
	PuntoEstado,
	TablaDensa,
	ThDensa,
} from "./ui-admin";
import type { NegociosAdminState } from "./useNegociosAdmin";

/** Lista densa de negocios con buscador y filtro por estado. */
export function NegociosTabla({ admin }: { admin: NegociosAdminState }) {
	const {
		negocios,
		cargando,
		error,
		filtro,
		setFiltro,
		texto,
		setTexto,
		filtrados,
		errorAccion,
		aviso,
		modo,
		abrirCrear,
		abrirEditar,
		cambiarEstado,
		eliminar,
	} = admin;

	return (
		<>
			{/* Avisos de la lista (fuera del modal). Dentro del modal hay otros. */}
			{modo === null && <AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />}

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
		</>
	);
}
