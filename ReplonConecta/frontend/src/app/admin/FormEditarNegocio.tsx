"use client";

import { EditorGaleria } from "./EditorGaleria";
import { EditorLogoNegocio } from "./EditorLogoNegocio";
import { EditorProductos } from "./EditorProductos";
import { EditorUbicacion } from "./EditorUbicacion";
import { FormDatosNegocio } from "./FormDatosNegocio";
import { aNumero } from "./negocios-form";
import { BTN_PRIMARIO, BTN_SECUNDARIO } from "./ui-admin";
import type { NegociosAdminState } from "./useNegociosAdmin";

/**
 * Formulario de edición del negocio: datos, mapa, logo, galería y
 * catálogo. El id ya existe, así que las fotos y los productos se
 * guardan al instante contra el backend.
 */
export function FormEditarNegocio({
	admin,
	negocioId,
}: {
	admin: NegociosAdminState;
	negocioId: string;
}) {
	const {
		form,
		campo,
		guardando,
		detalle,
		setDetalle,
		productos,
		categorias,
		nuevoProd,
		setNuevoProd,
		mostrarFormProd,
		setMostrarFormProd,
		creandoProd,
		subiendo,
		setAviso,
		setErrorAccion,
		cerrarModal,
		guardar,
		subirLogo,
		aplicarLogo,
		subirFotoProducto,
		actualizarFotoProducto,
		crearProducto,
		eliminarProducto,
	} = admin;

	return (
		<form onSubmit={(e) => void guardar(e)}>
			{/* Datos básicos */}
			<FormDatosNegocio legend="Datos" form={form} campo={campo} />

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

			{/* Logo */}
			<EditorLogoNegocio
				negocioId={negocioId}
				detalle={detalle}
				subiendo={subiendo}
				onSubir={subirLogo}
				onAplicar={aplicarLogo}
			/>

			{/*
			 * Galería: las fotos que se deslizan en la ficha pública del
			 * negocio. Vive en el modal de edición porque necesita el id
			 * del negocio ya guardado.
			 */}
			<fieldset className="mt-4 space-y-2">
				<legend className="text-[12px] font-medium text-black/50">
					Galería de la ficha
				</legend>
				<p className="text-[12px] text-black/50">
					Fotos que el visitante ve deslizar en{" "}
					{admin.negocioEditando
						? `/negocios/${admin.negocioEditando.slug}`
						: "la ficha"}.
					Puedes subir el archivo o pegar una URL.
				</p>
				<EditorGaleria
					negocioId={negocioId}
					imagenes={detalle?.imagenes ?? []}
					creditos={detalle?.creditos ?? []}
					onCambio={(nuevas, nuevosCreditos) =>
						setDetalle((d) =>
							d ? { ...d, imagenes: nuevas, creditos: nuevosCreditos } : d,
						)
					}
					onAviso={setAviso}
					onError={setErrorAccion}
				/>
			</fieldset>

			{/* Productos */}
			<EditorProductos
				productos={productos}
				categorias={categorias}
				nuevoProd={nuevoProd}
				setNuevoProd={setNuevoProd}
				mostrarFormProd={mostrarFormProd}
				setMostrarFormProd={setMostrarFormProd}
				creandoProd={creandoProd}
				subiendo={subiendo}
				onCrear={() => void crearProducto()}
				onEliminar={(p) => void eliminarProducto(p)}
				onSubirFoto={(p, e) => void subirFotoProducto(p, e)}
				onActualizarFoto={actualizarFotoProducto}
			/>

			<div className="mt-4 flex flex-wrap gap-2 border-t border-black/8 pt-3">
				<button type="submit" disabled={guardando} className={BTN_PRIMARIO}>
					{guardando ? "Guardando…" : "Guardar cambios"}
				</button>
				<button type="button" onClick={cerrarModal} className={BTN_SECUNDARIO}>
					Cancelar
				</button>
			</div>
		</form>
	);
}
