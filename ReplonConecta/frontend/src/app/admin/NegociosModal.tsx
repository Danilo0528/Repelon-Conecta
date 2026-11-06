"use client";

import { normalizarUrlImagen } from "@/components/ui";

import { EditorUbicacion } from "./EditorUbicacion";
import { FormDatosNegocio } from "./FormDatosNegocio";
import { FormEditarNegocio } from "./FormEditarNegocio";
import { aNumero } from "./negocios-form";
import {
	AvisosSeccion,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	INPUT,
	VentanaAdmin,
} from "./ui-admin";
import type { NegociosAdminState } from "./useNegociosAdmin";

/**
 * Ventana flotante de Negocios: el alta y la edición comparten el mismo
 * marco, pero el formulario cambia porque la edición suma logo, galería
 * y catálogo. Crear no trae fotos todavía: el logo se carga después de
 * guardar, desde el propio modal de edición.
 */
export function NegociosModal({ admin }: { admin: NegociosAdminState }) {
	const { modo, negocioId, negocioEditando, cargandoDetalle, errorAccion, aviso, cerrarModal } =
		admin;

	return (
		<VentanaAdmin
			abierto={modo !== null}
			onCerrar={cerrarModal}
			titulo={modo === "crear" ? "Nuevo negocio" : `Editar: ${negocioEditando?.nombre ?? ""}`}
			ancho="ancho"
		>
			{/* Avisos DENTRO del modal: aquí ocurren las acciones. */}
			<AvisosSeccion accion={errorAccion} exito={aviso} />

			{negocioId !== null && cargandoDetalle && (
				<p className="text-[13px] text-black/50">Cargando negocio…</p>
			)}

			{negocioId !== null && !cargandoDetalle && (
				<FormEditarNegocio admin={admin} negocioId={negocioId} />
			)}

			{modo === "crear" && <FormCrearNegocio admin={admin} />}
		</VentanaAdmin>
	);
}

/** Alta: solo datos, logo por URL y ubicación. */
function FormCrearNegocio({ admin }: { admin: NegociosAdminState }) {
	const { form, campo, guardando, guardar, cerrarModal, setAviso, setErrorAccion } = admin;

	return (
		<form onSubmit={(e) => void guardar(e)}>
			<FormDatosNegocio
				legend="Datos del negocio"
				form={form}
				campo={campo}
				conPlaceholders
			>
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
						src={normalizarUrlImagen(form.logoUrl)}
						alt="Vista previa del logo"
						className="h-16 w-16 rounded-md border border-black/10 object-cover"
					/>
				)}
			</FormDatosNegocio>

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
	);
}
