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
	SeccionAdmin,
	TARJETA,
} from "./ui-admin";

/*
 * Sección "Usuarios" del panel (P2, fila 10).
 *
 * Cambiar el rol y activar/desactivar son los dos únicos poderes que
 * tiene el admin sobre una cuenta. El backend se niega a aplicarlos
 * sobre la cuenta propia (evita que el estudiante se bloquee solo);
 * aquí ni siquiera se muestran los controles de la propia cuenta.
 */

const ETIQUETA_ROL: Record<Rol, string> = {
	COMPRADOR: "Comprador",
	VENDEDOR: "Vendedor",
	ADMIN: "Admin",
};

export function SeccionUsuarios({ perfilId }: { perfilId: string }) {
	const {
		datos,
		cargando,
		error,
		setDatos,
	} = useDatos<Usuario[]>(() => apiConSesion<Usuario[]>("/api/admin/usuarios"), []);

	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [guardando, setGuardando] = useState<string | null>(null);

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

			<BloqueEstado
				cargando={cargando}
				vacio={(datos ?? []).length === 0}
				vacioTitulo="Todavía no hay cuentas"
			>
				<ul className="mt-3 space-y-2">
					{(datos ?? []).map((u) => {
						const esMiCuenta = u.id === perfilId;
						return (
							<li
								key={u.id}
								className={`${TARJETA} sm:flex sm:items-center sm:justify-between sm:gap-3`}
							>
								<div className="min-w-0">
									<p className="truncate font-semibold">
										{u.nombre}
										{esMiCuenta && (
											<span className="ml-2 text-xs font-medium text-black/45">
												(tú)
											</span>
										)}
									</p>
									<p className="truncate text-xs text-black/55">
										{u.email} ·{" "}
										{fecha(u.creadoEn)}
										{u.tieneNegocio ? " · tiene negocio" : ""}
									</p>
								</div>

								<div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
									<span
										className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
											u.activo ? "bg-verde text-white" : "bg-black/60 text-white"
										}`}
									>
										{u.activo ? "Activa" : "Desactivada"}
									</span>

									{!esMiCuenta && (
										<>
											<label className="text-xs text-black/55">
												<span className="sr-only">Rol de {u.nombre}</span>
												<select
													value={u.rol}
													disabled={guardando === u.id}
													onChange={(e) =>
														void cambiar(u, { rol: e.target.value as Rol })
													}
													className="min-h-12 rounded-xl border border-black/15 px-3 py-2 text-sm"
												>
													{(Object.keys(ETIQUETA_ROL) as Rol[]).map((rol) => (
														<option key={rol} value={rol}>
															{ETIQUETA_ROL[rol]}
														</option>
													))}
												</select>
											</label>
											<button
												type="button"
												disabled={guardando === u.id}
												onClick={() => confirmarDesactivar(u)}
												className={BTN_SECUNDARIO}
											>
												{u.activo ? "Desactivar" : "Reactivar"}
											</button>
										</>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			</BloqueEstado>
		</SeccionAdmin>
	);
}
