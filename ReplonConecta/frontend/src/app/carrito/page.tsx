"use client";

import Link from "next/link";

import { CLASE_BOTON_AZUL, Cargando, Vacio } from "@/components/ui";
import { useCarrito } from "@/context/CarritoContext";
import { useSesion } from "@/context/SesionContext";
import { pesos } from "@/lib/format";

export default function CarritoPagina() {
	const { carrito, listo, cantidadTotal, total, cambiarCantidad, quitar, vaciar } =
		useCarrito();
	const { sesion } = useSesion();

	if (!listo) return <Cargando />;

	if (!carrito || carrito.items.length === 0) {
		return (
			<Vacio
				titulo="Tu carrito está vacío"
				texto="Abre el mapa y elige un negocio de Repelón para empezar."
			>
				<Link href="/" className={CLASE_BOTON_AZUL}>
					Ver el mapa
				</Link>
			</Vacio>
		);
	}

	return (
		<div className="px-4 pt-4">
			<div className="flex items-center justify-between gap-2">
				<h1 className="text-xl font-bold">Tu carrito</h1>
				<button
					type="button"
					onClick={vaciar}
					className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium text-black/70"
				>
					Vaciar
				</button>
			</div>
			<p className="mt-1 text-sm text-black/60">
				Pedido a <span className="font-medium text-black">{carrito.negocioNombre}</span>
			</p>

			{/*
				 * En PC dos columnas: los productos a la izquierda (dos tercios)
				 * y el total con el botón de continuar a la derecha, que es lo
				 * que se mira para decidir.
		 */}
			<div className="md:grid md:grid-cols-3 md:items-start md:gap-6">
				<ul className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/10 md:col-span-2">
					{carrito.items.map((item) => (
						<li key={item.productoId} className="flex items-center gap-3 p-3">
							<div className="min-w-0 flex-1">
								<p className="font-medium leading-tight">{item.nombre}</p>
								<p className="text-sm text-black/60">{pesos(item.precio)} c/u</p>
							</div>

							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
									className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/15 text-xl font-bold"
									aria-label={`Quitar uno de ${item.nombre}`}
								>
									−
								</button>
								<span className="w-6 text-center font-semibold">{item.cantidad}</span>
								<button
									type="button"
									onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
									disabled={item.cantidad >= 99}
									className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/15 text-xl font-bold disabled:opacity-40"
									aria-label={`Agregar uno de ${item.nombre}`}
								>
									+
								</button>
							</div>

							<div className="w-20 text-right font-semibold">
								{pesos(item.precio * item.cantidad)}
							</div>

							<button
								type="button"
								onClick={() => quitar(item.productoId)}
								className="shrink-0 rounded-full px-1 text-black/45"
								aria-label={`Eliminar ${item.nombre}`}
							>
								✕
							</button>
						</li>
					))}
				</ul>

				{/* El total es lo último que se mira y lo primero que se decide:
				    por eso va en grande, no como una fila más de la lista. */}
				<div className="mt-4 flex items-end justify-between rounded-2xl bg-black/[.04] px-4 py-4">
					<span className="text-sm text-black/60">
						{cantidadTotal} {cantidadTotal === 1 ? "ítem" : "ítems"}
					</span>
					<span className="text-right">
						<span className="block text-xs text-black/50">Total a pagar</span>
						<span className="text-2xl font-bold">{pesos(total)}</span>
					</span>
				</div>

				<Link
					href={sesion ? "/checkout" : "/entrar?next=/checkout"}
					className={`${CLASE_BOTON_AZUL} mt-4`}
				>
					{sesion ? "Continuar con el pedido" : "Inicia sesión para pedir"}
				</Link>

				<p className="mt-2 text-center text-xs text-black/50">
					El pago es contra entrega o por transferencia; se coordina con el negocio.
				</p>
			</div>
		</div>
	);
}
