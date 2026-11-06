"use client";

import { useState } from "react";

import { apiConSesion } from "@/lib/api";
import { fecha } from "@/lib/format";
import type { Rol, Usuario } from "@/lib/tipos";
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
 * Sección "Usuarios" — dense table.
 *
 * Cambiar el rol y activar/desactivar son los dos únicos poderes que
 * tiene el admin sobre una cuenta. El backend se niega a aplicarlos
 * sobre la cuenta propia; aquí ni siquiera se muestran los controles
 * de la propia cuenta. Status = dot semántico (no pill).
 */

const ETIQUETA_ROL: Record<Rol, string> = {
	COMPRADOR: "Comprador",
	VENDEDOR: "Vendedor",
	ADMIN: "Admin",
};

const COLUMNAS_USUARIOS: ColumnaOrden<Usuario>[] = [
	{ id: "usuario", valor: (u) => u.nombre },
	{ id: "rol", valor: (u) => ETIQUETA_ROL[u.rol] },
	{ id: "estado", valor: (u) => (u.activo ? "Activa" : "Desactivada") },
	{ id: "creado", valor: (u) => u.creadoEn },
];

const buscarUsuario = (u: Usuario) =>
	`${u.nombre} ${u.email} ${ETIQUETA_ROL[u.rol]}`;

export function SeccionUsuarios({ perfilId }: { perfilId: string }) {
	const {
		datos,
		cargando,
		error,
		setDatos,
	} = useDatos<Usuario[]>(() => apiConSesion<Usuario[]>("/api/admin/usuarios"), []);

	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [guardando, setGuardando] = useState<string | null>(null);

	const tabla = useTabla(datos ?? [], {
		buscar: buscarUsuario,
		columnas: COLUMNAS_USUARIOS,
		ordenInicial: "creado",
		direccionInicial: "desc",
	});

	async function cambiar(u: Usuario, cambios: { rol?: Rol; activo?: boolean }) {
		setErrorAccion(null);
		setGuardando(u.id);
		try {
			const actualizado = await apiConSesion<Usuario>(
				`/api/admin/usuarios/${u.id}`,
				{ method: "PATCH", body: JSON.stringify(cambios) },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) => (x.id === u.id ? actualizado : x)),
			);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo actualizar.");
		} finally {
			setGuardando(null);
		}
	}

	function confirmarDesactivar(u: Usuario) {
		if (
			!window.confirm(
				u.activo
					? `¿Desactivar la cuenta de "${u.nombre}"? No podrá usar la app hasta que la actives.`
					: `¿Reactivar la cuenta de "${u.nombre}"?`,
			)
		) {
			return;
		}
		void cambiar(u, { activo: !u.activo });
	}

	return (
		<SeccionAdmin
			titulo="Usuarios"
			descripcion="Cambia roles y activa o desactiva cuentas; la cuenta propia no se toca."
		>
			<AvisosSeccion accion={errorAccion} carga={error} />

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<BuscadorTabla
					valor={tabla.texto}
					onChange={tabla.setTexto}
					placeholder="Filtrar por nombre, correo o rol"
					ariaLabel="Filtrar usuarios"
				/>
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
				vacioTitulo="Todavía no hay cuentas"
				skeletonColumnas={5}
			>
				{tabla.filtradas.length === 0 ? (
					<p className="mt-3 text-[13px] text-black/50">
						Ninguna cuenta coincide con el filtro.
					</p>
				) : (
					<>
						<TablaDensa>
							<table className="w-full min-w-[680px] border-collapse">
								<thead className="sticky top-0 z-10 bg-white">
									<tr className="border-b border-black/10">
										<ThOrdenable
											campo="usuario"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Usuario
										</ThOrdenable>
										<ThOrdenable
											campo="rol"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Rol
										</ThOrdenable>
										<ThOrdenable
											campo="estado"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Estado
										</ThOrdenable>
										<ThOrdenable
											campo="creado"
											orden={tabla}
											onOrdenar={tabla.alternarOrden}
										>
											Creado
										</ThOrdenable>
										<ThDensa className="text-right">Acción</ThDensa>
									</tr>
								</thead>
								<tbody>
									{tabla.visibles.map((u) => {
										const esMiCuenta = u.id === perfilId;
										return (
											<FilaTabla key={u.id}>
												<CeldaTabla className="max-w-[240px]">
													<p className="truncate font-medium">
														{u.nombre}
														{esMiCuenta && (
															<span className="ml-1.5 text-[11px] text-black/40">
																(tú)
															</span>
														)}
													</p>
													<p className="truncate font-mono text-[11px] text-black/45">
														{u.email}
													</p>
												</CeldaTabla>
												<CeldaTabla>
													{esMiCuenta ? (
														<span className="text-[13px] text-black/70">
															{ETIQUETA_ROL[u.rol]}
														</span>
													) : (
														<select
															value={u.rol}
															disabled={guardando === u.id}
															aria-label={`Rol de ${u.nombre}`}
															onChange={(e) =>
																void cambiar(u, { rol: e.target.value as Rol })
															}
															className={INPUT}
														>
															{(Object.keys(ETIQUETA_ROL) as Rol[]).map((rol) => (
																<option key={rol} value={rol}>
																	{ETIQUETA_ROL[rol]}
																</option>
															))}
														</select>
													)}
												</CeldaTabla>
												<CeldaTabla>
													<PuntoEstado
														color={u.activo ? "exito" : "peligro"}
														etiqueta={u.activo ? "Activa" : "Desactivada"}
													/>
													{u.tieneNegocio && (
														<span className="ml-2 text-[11px] text-black/35">
															negocio
														</span>
													)}
												</CeldaTabla>
												<CeldaTabla mono>{fecha(u.creadoEn)}</CeldaTabla>
												<CeldaTabla className="text-right">
													{esMiCuenta ? (
														<span className="text-[12px] text-black/25">—</span>
													) : (
														<button
															type="button"
															disabled={guardando === u.id}
															onClick={() => confirmarDesactivar(u)}
															className={BTN_SECUNDARIO}
														>
															{u.activo ? "Desactivar" : "Reactivar"}
														</button>
													)}
												</CeldaTabla>
											</FilaTabla>
										);
									})}
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
