"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Aviso, Cargando, EtiquetaEstado } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import {
	ETIQUETA_ENTREGA,
	ETIQUETA_PAGO,
	fecha,
	pesos,
} from "@/lib/format";
import type { PedidoDetalle } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function DetallePedido() {
	const { id } = useParams<{ id: string }>();
	const [accion, setAccion] = useState<"ninguna" | "cancelando">("ninguna");
	const [error, setError] = useState<string | null>(null);

	const { datos: pedido, cargando, error: errorCarga, setDatos } =
		useDatos<PedidoDetalle>(
			() => apiConSesion<PedidoDetalle>(`/api/pedidos/${id}`),
			[id],
		);

	async function cancelar() {
		if (!pedido) return;
		if (!window.confirm("¿Cancelar este pedido?")) return;

		setError(null);
		setAccion("cancelando");
		try {
			const actualizado = await apiConSesion<PedidoDetalle>(
				`/api/pedidos/${pedido.id}/cancelar`,
				{ method: "PATCH" },
			);
			setDatos(actualizado);
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo cancelar.");
		} finally {
			setAccion("ninguna");
		}
	}

	if (cargando) return <Cargando />;

	if (errorCarga || !pedido) {
		return (
			<div className="px-4 pt-4">
				<Aviso tono="error">{errorCarga ?? "No se encontró el pedido."}</Aviso>
				<Link href="/pedidos" className="mt-3 inline-block text-sm font-medium text-azul">
					Volver a mis pedidos
				</Link>
			</div>
		);
	}

	// El backend bloquea cancelar un pedido que ya salió (EN_CAMINO), así
	// que el botón no debe ofrecerse: sería un error garantizado.
	const sePuedeCancelar =
		pedido.estado === "PEDIDO_RECIBIDO" || pedido.estado === "EN_PREPARACION";

	return (
		<div className="px-4 pt-4">
			<Link href="/pedidos" className="text-sm font-medium text-azul">
				← Mis pedidos
			</Link>

			<div className="mt-3 flex items-center justify-between gap-2">
				<h1 className="text-lg font-bold">Pedido {pedido.numero}</h1>
				<EtiquetaEstado estado={pedido.estado} />
			</div>
			<p className="mt-1 text-sm text-black/55">{fecha(pedido.creadoEn)}</p>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			{/*
			 * En PC, dos columnas: los productos a la izquierda y los
			 * datos del pedido a la derecha, para que todo se vea sin
			 * bajar la página.
			 */}
			<div className="mt-5 md:grid md:grid-cols-2 md:items-start md:gap-6">
				<section>
					<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
						Productos
					</h2>
					<ul className="mt-2 divide-y divide-black/10 rounded-2xl border border-black/10">
						{pedido.items.map((i) => (
							<li key={i.productoId} className="flex items-center justify-between p-3">
								<div>
									<p className="font-medium">
										{i.cantidad} × {i.nombre}
									</p>
									<p className="text-sm text-black/55">{pesos(i.precioUnitario)} c/u</p>
								</div>
								<span className="font-semibold">{pesos(i.subtotal)}</span>
							</li>
						))}
					</ul>
					<div className="mt-2 flex items-center justify-between rounded-2xl bg-black/[.04] px-4 py-3">
						<span className="text-sm text-black/60">Total</span>
						<span className="text-lg font-bold">{pesos(pedido.total)}</span>
					</div>
				</section>

				<section className="mt-5 space-y-1 rounded-2xl border border-black/10 p-4 text-sm md:mt-0">
					<p>
						<span className="text-black/55">Negocio: </span>
						{pedido.negocioNombre}
					</p>
					<p>
						<span className="text-black/55">Entrega: </span>
						{ETIQUETA_ENTREGA[pedido.metodoEntrega]}
					</p>
					<p>
						<span className="text-black/55">Pago: </span>
						{ETIQUETA_PAGO[pedido.metodoPago]}
						{pedido.pagoConfirmado ? " · Confirmado" : " · Por confirmar"}
					</p>
					{pedido.metodoEntrega === "DOMICILIO" && pedido.entregaDireccion && (
						<p>
							<span className="text-black/55">Dirección: </span>
							{pedido.entregaDireccion}
							{pedido.entregaBarrio ? `, ${pedido.entregaBarrio}` : ""}
						</p>
					)}
					{pedido.entregaReferencia && (
						<p>
							<span className="text-black/55">Referencia: </span>
							{pedido.entregaReferencia}
						</p>
					)}
					{pedido.notas && (
						<p>
							<span className="text-black/55">Notas: </span>
							{pedido.notas}
						</p>
					)}
				</section>
			</div>

			<div className="md:max-w-md">
				{pedido.whatsappResumenUrl && (
					<a
						href={pedido.whatsappResumenUrl}
						target="_blank"
						rel="noreferrer"
						className="mt-4 block w-full rounded-xl bg-verde py-3 text-center font-semibold text-white"
					>
						Escribir al negocio por WhatsApp
					</a>
				)}

				{sePuedeCancelar && (
					<button
						type="button"
						onClick={cancelar}
						disabled={accion === "cancelando"}
						className="mt-3 w-full rounded-xl border border-black/20 py-3 font-semibold text-black/70 disabled:opacity-50"
					>
						{accion === "cancelando" ? "Cancelando…" : "Cancelar pedido"}
					</button>
				)}
			</div>
		</div>
	);
}
