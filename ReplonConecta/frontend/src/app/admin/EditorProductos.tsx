"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";

import { Foto, normalizarUrlImagen } from "@/components/ui";
import { supabaseConfigurado } from "@/lib/env";
import { pesos } from "@/lib/format";
import type { Categoria, Producto } from "@/lib/tipos";
import { CampoUrlImagen } from "./CampoUrlImagen";
import type { FormProducto } from "./negocios-form";
import {
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	BTN_SUBIR,
	INPUT,
} from "./ui-admin";

/**
 * Catálogo del negocio dentro del modal: alta rápida, foto por archivo
 * o URL, y borrado. Cada producto se guarda contra el negocio que ya
 * existe, así que este bloque solo se pinta en modo edición.
 */
export function EditorProductos({
	productos,
	categorias,
	nuevoProd,
	setNuevoProd,
	mostrarFormProd,
	setMostrarFormProd,
	creandoProd,
	subiendo,
	onCrear,
	onEliminar,
	onSubirFoto,
	onActualizarFoto,
}: {
	productos: Producto[];
	categorias: Categoria[];
	nuevoProd: FormProducto;
	setNuevoProd: Dispatch<SetStateAction<FormProducto>>;
	mostrarFormProd: boolean;
	setMostrarFormProd: Dispatch<SetStateAction<boolean>>;
	creandoProd: boolean;
	subiendo: string | null;
	onCrear: () => void;
	onEliminar: (p: Producto) => void;
	onSubirFoto: (p: Producto, evento: ChangeEvent<HTMLInputElement>) => void;
	onActualizarFoto: (p: Producto, url: string) => Promise<void>;
}) {
	return (
		<fieldset className="mt-4 space-y-2">
			<legend className="text-[12px] font-medium text-black/50">
				Productos ({productos.length})
			</legend>

			<div className="flex items-center justify-between">
				<p className="text-[12px] text-black/50">
					Catálogo del negocio; cada uno puede tener su foto.
				</p>
				<button
					type="button"
					onClick={() => setMostrarFormProd((v) => !v)}
					className={BTN_SECUNDARIO}
				>
					{mostrarFormProd ? "Ocultar formulario" : "+ Nuevo producto"}
				</button>
			</div>

			{mostrarFormProd && (
				<div
					className="space-y-2 rounded-md border border-black/10 bg-black/[.02] p-3"
				>
					<div className="grid gap-2 sm:grid-cols-2">
						<label className="block text-[12px] text-black/55">
							Nombre *
							<input
								value={nuevoProd.nombre}
								onChange={(e) => setNuevoProd((p) => ({ ...p, nombre: e.target.value }))}
								required
								maxLength={140}
								placeholder="Ej. Yuca criolla"
								className={INPUT}
							/>
						</label>
						<label className="block text-[12px] text-black/55">
							Precio (COP) *
							<input
								type="number"
								min="0"
								step="100"
								value={nuevoProd.precio}
								onChange={(e) => setNuevoProd((p) => ({ ...p, precio: e.target.value }))}
								required
								placeholder="Ej. 3500"
								className={INPUT}
							/>
						</label>
					</div>
					<div className="grid gap-2 sm:grid-cols-3">
						<label className="block text-[12px] text-black/55">
							Unidad
							<select
								value={nuevoProd.unidad}
								onChange={(e) => setNuevoProd((p) => ({ ...p, unidad: e.target.value }))}
								className={INPUT}
							>
								<option value="KILO">Kilo</option>
								<option value="LIBRA">Libra</option>
							</select>
						</label>
						<label className="block text-[12px] text-black/55">
							Categoría
							<select
								value={nuevoProd.categoriaId}
								onChange={(e) => setNuevoProd((p) => ({ ...p, categoriaId: e.target.value }))}
								className={INPUT}
							>
								<option value="">Sin categoría</option>
								{categorias.map((c) => (
									<option key={c.id} value={c.id}>
										{c.nombre}
									</option>
								))}
							</select>
						</label>
						<label className="block text-[12px] text-black/55">
							Stock
							<input
								type="number"
								min="0"
								value={nuevoProd.stock}
								onChange={(e) => setNuevoProd((p) => ({ ...p, stock: e.target.value }))}
								placeholder="Ej. 50"
								className={INPUT}
							/>
						</label>
					</div>
					<label className="block text-[12px] text-black/55">
						Descripción
						<textarea
							value={nuevoProd.descripcion}
							onChange={(e) => setNuevoProd((p) => ({ ...p, descripcion: e.target.value }))}
							maxLength={600}
							rows={2}
							placeholder="Detalles del producto…"
							className={INPUT}
						/>
					</label>
					<label className="block text-[12px] text-black/55">
						Foto por URL (opcional)
						<input
							type="url"
							value={nuevoProd.imagenUrl}
							onChange={(e) => setNuevoProd((p) => ({ ...p, imagenUrl: e.target.value }))}
							maxLength={500}
							placeholder="https://…/foto.jpg"
							className={INPUT}
						/>
					</label>
					{nuevoProd.imagenUrl.trim().startsWith("http") && (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={normalizarUrlImagen(nuevoProd.imagenUrl)}
							alt="Vista previa de la foto"
							className="h-16 w-16 rounded-md border border-black/10 object-cover"
						/>
					)}
					<div className="flex gap-2">
						<button
							type="button"
							onClick={onCrear}
							disabled={creandoProd || !nuevoProd.nombre.trim() || !nuevoProd.precio.trim()}
							className={BTN_PRIMARIO}
						>
							{creandoProd ? "Creando…" : "Crear producto"}
						</button>
						<button
							type="button"
							onClick={() => setMostrarFormProd(false)}
							className={BTN_SECUNDARIO}
						>
							Cancelar
						</button>
					</div>
				</div>
			)}

			{productos.map((p) => (
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
						<p className="truncate text-[13px] font-medium">{p.nombre}</p>
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
							onChange={(e) => void onSubirFoto(p, e)}
						/>
					</label>
					<CampoUrlImagen
						valor={p.imagenUrl}
						etiqueta={`foto de ${p.nombre}`}
						onGuardar={(url) => onActualizarFoto(p, url)}
					/>
					<button
						type="button"
						onClick={() => onEliminar(p)}
						className={BTN_SECUNDARIO}
					>
						Eliminar
					</button>
				</div>
			))}
			{productos.length === 0 && !mostrarFormProd && (
				<p className="text-[12px] text-black/40">
					Este negocio todavía no tiene productos. Pulsa &quot;+ Nuevo producto&quot;.
				</p>
			)}
		</fieldset>
	);
}
