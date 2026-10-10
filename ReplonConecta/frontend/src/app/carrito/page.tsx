"use client";

import Link from "next/link";

import {
	CLASE_BOTON_AZUL,
	Cargando,
	Vacio,
} from "@/components/ui";
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
		<div className="px-4 pt-6">
			<div className="flex items-center justify-between gap-2">
				<h1 className="font-display text-2xl font-semibold text-ink">
					Tu carrito
				</h1>
				<button
					type="button"
					onClick={vaciar}
					className="min-h-11 rounded-xl border border-black/15 px-3 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/[.03] focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
				>
					Vaciar
				</button>
			</div>
			<p className="mt-1 text-sm text-muted-foreground">
				Pedido a{" "}
				<span className="font-medium text-ink">{carrito.negocioNombre}</span>
			</p>

			{/*
			 * En PC: lista a la izquierda (2 columnas) y a la derecha el
			 * resumen con total + CTA + nota, envueltos en un div para que
			 * el CTA quede debajo del total y no en una fila fantasma.
			 */}
			<div className="md:grid md:grid-cols-3 md:items-start md:gap-6">
				<ul className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/10 md:col-span-2">
					{carrito.items.map((item) => (
						<li key={item.productoId} className="flex items-center gap-3 p-3">
							<div className="min-w-0 flex-1">
								<p className="font-medium leading-tight text-ink">
									{item.nombre}
								</p>
								<p className="text-sm text-muted-foreground">
									{pesos(item.precio)} c/u
								</p>
							</div>

							<div className="flex items-center gap-1.5">
								<button
									type="button"
									onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
									className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/15 text-xl font-bold text-ink transition-colors hover:bg-black/[.03] focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
									aria-label={`Quitar uno de ${item.nombre}`}
								>
									−
								</button>
								<span className="w-6 text-center font-semibold tabular-nums">
									{item.cantidad}
								</span>
								<button
									type="button"
									onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
									disabled={item.cantidad >= 99}
									className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/15 text-xl font-bold text-ink transition-colors hover:bg-black/[.03] focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2 disabled:opacity-50"
									aria-label={`Agregar uno de ${item.nombre}`}
								>
									+
								</button>
							</div>

							<div className="w-20 text-right font-semibold tabular-nums text-ink">
								{pesos(item.precio * item.cantidad)}
							</div>

							<button
								type="button"
								onClick={() => quitar(item.productoId)}
								className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/[.05] hover:text-black/70 focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
								aria-label={`Eliminar ${item.nombre}`}
							>
								✕
							</button>
						</li>
					))}
				</ul>

				{/*
				 * Resumen: total grande + CTA + nota de pago. Todo envuelto
				 * en un div con md:col-start-3 para que en desktop quede
				 * en la columna correcta (bajo el total, no en fila 2).
				 */}
				<div className="mt-4 md:col-start-3 md:mt-4">
					<div className="flex items-end justify-between rounded-2xl bg-black/[.04] px-4 py-4">
						<span className="text-sm text-muted-foreground">
							{cantidadTotal} {cantidadTotal === 1 ? "ítem" : "ítems"}
						</span>
						<span className="text-right">
							<span className="block text-xs text-muted-foreground">
								Total a pagar
							</span>
							<span className="text-2xl font-bold tabular-nums text-ink">
								{pesos(total)}
							</span>
						</span>
					</div>

					<Link
						href={sesion ? "/checkout" : "/entrar?next=/checkout"}
						className={`${CLASE_BOTON_AZUL} mt-3`}
					>
						{sesion ? "Continuar con el pedido" : "Inicia sesión para pedir"}
					</Link>

					<p className="mt-2 text-center text-xs text-muted-foreground">
						El pago es contra entrega o por transferencia; se coordina con el negocio.
					</p>
				</div>
			</div>
		</div>
	);
}
