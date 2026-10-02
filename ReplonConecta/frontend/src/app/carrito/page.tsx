"use client";

import Link from "next/link";

import { Cargando, Vacio } from "@/components/ui";
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
				texto="Explora los negocios de Repelón y agrega lo que necesites."
			>
				<Link
					href="/"
					className="inline-block rounded-xl bg-azul px-4 py-2 text-sm font-semibold text-white"
				>
					Ver negocios
				</Link>
			</Vacio>
		);
	}

	return (
		<div className="px-4 pt-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">Tu carrito</h1>
				<button
					type="button"
					onClick={vaciar}
					className="text-sm font-medium text-black/55 underline"
				>
					Vaciar
				</button>
			</div>
			<p className="mt-1 text-sm text-black/60">
				Pedido a <span className="font-medium text-black">{carrito.negocioNombre}</span>
			</p>

			<ul className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/10">
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
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 text-lg font-bold"
								aria-label={`Quitar uno de ${item.nombre}`}
							>
								−
							</button>
							<span className="w-6 text-center font-semibold">{item.cantidad}</span>
							<button
								type="button"
								onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
								disabled={item.cantidad >= 99}
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 text-lg font-bold disabled:opacity-40"
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
							className="text-black/45"
							aria-label={`Eliminar ${item.nombre}`}
						>
							✕
						</button>
					</li>
				))}
			</ul>

			<div className="mt-4 flex items-center justify-between rounded-2xl bg-black/[.04] px-4 py-3">
				<span className="text-sm text-black/60">{cantidadTotal} ítem(s)</span>
				<span className="text-lg font-bold">{pesos(total)}</span>
			</div>

			<Link
				href={sesion ? "/checkout" : "/entrar?next=/checkout"}
				className="mt-4 block w-full rounded-xl bg-azul py-3 text-center font-semibold text-white"
			>
				{sesion ? "Continuar con el pedido" : "Inicia sesión para pedir"}
			</Link>

			<p className="mt-2 text-center text-xs text-black/50">
				El pago es contra entrega o por transferencia; se coordina con el negocio.
			</p>
		</div>
	);
}
