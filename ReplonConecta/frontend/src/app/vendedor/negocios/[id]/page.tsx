"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Aviso, Cargando, EtiquetaEstado, Vacio } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import { ETIQUETA_PAGO, fecha, pesos } from "@/lib/format";
import type {
	Categoria,
	EstadoPedido,
	Negocio,
	Pedido,
	Producto,
} from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

const SIGUIENTE: Partial<Record<EstadoPedido, EstadoPedido>> = {
	PEDIDO_RECIBIDO: "EN_PREPARACION",
	EN_PREPARACION: "EN_CAMINO",
	EN_CAMINO: "ENTREGADO",
};

const ETIQUETA_SIGUIENTE: Partial<Record<EstadoPedido, string>> = {
	PEDIDO_RECIBIDO: "Pasar a preparación",
	EN_PREPARACION: "Marcar en camino",
	EN_CAMINO: "Marcar entregado",
};

export default function GestionNegocio() {
	const { id } = useParams<{ id: string }>();
	const [pestana, setPestana] = useState<"productos" | "pedidos">("productos");

	const { datos: negocios } = useDatos<Negocio[]>(
		() => apiConSesion<Negocio[]>("/api/negocios/mios"),
		[],
	);
	const negocio = (negocios ?? []).find((n) => n.id === id);

	return (
		<div className="px-4 pt-4">
			<Link href="/vendedor" className="text-sm font-medium text-azul">
				← Mi negocio
			</Link>
			<h1 className="mt-2 text-xl font-bold">
				{negocio?.nombre ?? "Gestión del negocio"}
			</h1>

			<div className="mt-4 flex gap-2">
				<button
					type="button"
					onClick={() => setPestana("productos")}
					className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
						pestana === "productos" ? "bg-verde text-white" : "border border-black/15"
					}`}
				>
					Productos
				</button>
				<button
					type="button"
					onClick={() => setPestana("pedidos")}
					className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
						pestana === "pedidos" ? "bg-verde text-white" : "border border-black/15"
					}`}
				>
					Pedidos
				</button>
			</div>

			{pestana === "productos" ? (
				<SeccionProductos negocioId={id} />
			) : (
				<SeccionPedidos negocioId={id} />
			)}
		</div>
	);
}

// =====================================================================
// PRODUCTOS
// =====================================================================

function SeccionProductos({ negocioId }: { negocioId: string }) {
	const {
		datos: productos,
		cargando,
		error,
		setDatos,
	} = useDatos<Producto[]>(
		() => apiConSesion<Producto[]>(`/api/productos/negocio/${negocioId}`),
		[negocioId],
	);
	const { datos: categorias } = useDatos<Categoria[]>(
		() => apiConSesion<Categoria[]>("/api/categorias"),
		[],
	);

	async function alternarDisponible(p: Producto) {
		try {
			await apiConSesion<Producto>(
				`/api/productos/${p.id}/disponibilidad?disponible=${!p.disponible}`,
				{ method: "PATCH" },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) =>
					x.id === p.id ? { ...x, disponible: !p.disponible } : x,
				),
			);
		} catch {
			// Se deja el estado anterior si falla.
		}
	}

	async function eliminar(p: Producto) {
		if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
		try {
			await apiConSesion(`/api/productos/${p.id}`, { method: "DELETE" });
			setDatos((actual) => (actual ?? []).filter((x) => x.id !== p.id));
		} catch {
			// Nada.
		}
	}

	return (
		<div className="mt-4">
			<FormularioProducto
				negocioId={negocioId}
				categorias={categorias ?? []}
				onCambio={(nuevo) =>
					setDatos((actual) => {
						const lista = actual ?? [];
						const existe = lista.some((x) => x.id === nuevo.id);
						return existe
							? lista.map((x) => (x.id === nuevo.id ? nuevo : x))
							: [...lista, nuevo];
					})
				}
			/>

			{cargando && <Cargando />}
			{error && <Aviso tono="error">{error}</Aviso>}

			{!cargando && (productos ?? []).length === 0 && (
				<Vacio titulo="Todavía no tienes productos" texto="Agrega el primero arriba." />
			)}

			<ul className="mt-4 space-y-2">
				{(productos ?? []).map((p) => (
					<li key={p.id} className="rounded-2xl border border-black/10 p-3">
						<div className="flex items-start justify-between gap-2">
							<div>
								<p className="font-medium">{p.nombre}</p>
								<p className="text-sm text-black/60">
									{pesos(p.precio)} · {p.categoriaNombre ?? "Sin categoría"}
									{p.stock != null ? ` · stock ${p.stock}` : ""}
								</p>
							</div>
							<span
								className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
									p.disponible ? "bg-verde text-white" : "bg-black/60 text-white"
								}`}
							>
								{p.disponible ? "Disponible" : "Agotado"}
							</span>
						</div>
						<div className="mt-2 flex gap-2">
							<button
								type="button"
								onClick={() => alternarDisponible(p)}
								className="rounded-lg border border-black/15 px-3 py-1 text-sm"
							>
								{p.disponible ? "Marcar agotado" : "Marcar disponible"}
							</button>
							<button
								type="button"
								onClick={() => eliminar(p)}
								className="rounded-lg border border-black/15 px-3 py-1 text-sm text-black/60"
							>
								Eliminar
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function FormularioProducto({
	negocioId,
	categorias,
	onCambio,
}: {
	negocioId: string;
	categorias: Categoria[];
	onCambio: (p: Producto) => void;
}) {
	const [nombre, setNombre] = useState("");
	const [precio, setPrecio] = useState("");
	const [stock, setStock] = useState("");
	const [categoriaId, setCategoriaId] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [enviando, setEnviando] = useState(false);

	async function crear(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const precioNum = Number(precio);
		if (!nombre.trim() || !Number.isFinite(precioNum) || precioNum <= 0) {
			setError("Pon un nombre y un precio mayor que cero.");
			return;
		}

		setEnviando(true);
		try {
			const creado = await apiConSesion<Producto>(
				`/api/productos/negocio/${negocioId}`,
				{
					method: "POST",
					body: JSON.stringify({
						nombre: nombre.trim(),
						descripcion: descripcion.trim(),
						precio: Math.round(precioNum),
						imagenUrl: null,
						categoriaId: categoriaId || null,
						disponible: true,
						stock: stock.trim() === "" ? null : Number(stock),
					}),
				},
			);
			onCambio(creado);
			setNombre("");
			setPrecio("");
			setStock("");
			setDescripcion("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo guardar.");
		} finally {
			setEnviando(false);
		}
	}

	return (
		<form onSubmit={crear} className="space-y-2 rounded-2xl border border-black/10 p-4">
			<h2 className="font-semibold">Agregar producto</h2>
			{error && <Aviso tono="error">{error}</Aviso>}
			<input
				value={nombre}
				onChange={(e) => setNombre(e.target.value)}
				placeholder="Nombre"
				className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
			/>
			<div className="flex gap-2">
				<input
					inputMode="numeric"
					value={precio}
					onChange={(e) => setPrecio(e.target.value)}
					placeholder="Precio (ej. 4000)"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
				<input
					inputMode="numeric"
					value={stock}
					onChange={(e) => setStock(e.target.value)}
					placeholder="Stock"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
			</div>
			<select
				value={categoriaId}
				onChange={(e) => setCategoriaId(e.target.value)}
				className="w-full rounded-xl border border-black/15 bg-white px-3 py-2"
			>
				<option value="">Sin categoría</option>
				{categorias.map((c) => (
					<option key={c.id} value={c.id}>
						{c.nombre}
					</option>
				))}
			</select>
			<textarea
				value={descripcion}
				onChange={(e) => setDescripcion(e.target.value)}
				rows={2}
				placeholder="Descripción"
				className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
			/>
			<button
				type="submit"
				disabled={enviando}
				className="w-full rounded-xl bg-azul py-2 font-semibold text-white disabled:opacity-60"
			>
				{enviando ? "Guardando…" : "Guardar producto"}
			</button>
		</form>
	);
}

// =====================================================================
// PEDIDOS
// =====================================================================

function SeccionPedidos({ negocioId }: { negocioId: string }) {
	const {
		datos: pedidos,
		cargando,
		error,
		setDatos,
	} = useDatos<Pedido[]>(
		() => apiConSesion<Pedido[]>(`/api/pedidos/negocio/${negocioId}`),
		[negocioId],
	);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);

	async function cambiar(p: Pedido, estado: EstadoPedido, pagoConfirmado?: boolean) {
		setErrorAccion(null);
		try {
			const actualizado = await apiConSesion<Pedido>(
				`/api/pedidos/${p.id}/estado`,
				{
					method: "PATCH",
					body: JSON.stringify({ estado, pagoConfirmado: pagoConfirmado ?? null }),
				},
			);
			setDatos((actual) =>
				(actual ?? []).map((x) =>
					x.id === p.id
						? {
								...x,
								estado: actualizado.estado,
								estadoEtiqueta: actualizado.estadoEtiqueta,
								pagoConfirmado: actualizado.pagoConfirmado,
							}
						: x,
				),
			);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo cambiar.");
		}
	}

	return (
		<div className="mt-4">
			{errorAccion && <Aviso tono="error">{errorAccion}</Aviso>}
			{cargando && <Cargando />}
			{error && <Aviso tono="error">{error}</Aviso>}

			{!cargando && (pedidos ?? []).length === 0 && (
				<Vacio titulo="Sin pedidos por ahora" texto="Cuando te pidan, aparecerán aquí." />
			)}

			<ul className="space-y-3">
				{(pedidos ?? []).map((p) => {
					const siguiente = SIGUIENTE[p.estado];
					const terminal =
						p.estado === "ENTREGADO" ||
						p.estado === "CANCELADO" ||
						p.estado === "RECHAZADO";
					const puedeRechazar =
						p.estado === "PEDIDO_RECIBIDO" || p.estado === "EN_PREPARACION";

					return (
						<li key={p.id} className="rounded-2xl border border-black/10 p-4">
							<div className="flex items-center justify-between gap-2">
								<span className="font-semibold">{p.numero}</span>
								<EtiquetaEstado estado={p.estado} />
							</div>
							<p className="mt-1 text-sm text-black/60">
								{fecha(p.creadoEn)} · {p.cantidadItems} ítem(s) ·{" "}
								<span className="font-semibold text-black">{pesos(p.total)}</span>
							</p>
							<p className="text-sm text-black/60">{ETIQUETA_PAGO[p.metodoPago]}</p>

							<div className="mt-3 flex flex-wrap gap-2">
								{!p.pagoConfirmado && !terminal && (
									<button
										type="button"
										onClick={() => cambiar(p, p.estado, true)}
										className="rounded-lg bg-verde px-3 py-1.5 text-sm font-semibold text-white"
									>
										Confirmar pago
									</button>
								)}
								{siguiente && (
									<button
										type="button"
										onClick={() => cambiar(p, siguiente)}
										className="rounded-lg bg-azul px-3 py-1.5 text-sm font-semibold text-white"
									>
										{ETIQUETA_SIGUIENTE[p.estado]}
									</button>
								)}
								{puedeRechazar && (
									<button
										type="button"
										onClick={() => cambiar(p, "RECHAZADO")}
										className="rounded-lg border border-black/20 px-3 py-1.5 text-sm text-black/65"
									>
										Rechazar
									</button>
								)}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
