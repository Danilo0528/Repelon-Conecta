"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Aviso, Cargando, Vacio } from "@/components/ui";
import { useCarrito } from "@/context/CarritoContext";
import { api } from "@/lib/api";
import { pesos } from "@/lib/format";
import type { NegocioDetalle, Producto } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function FichaNegocio() {
	const { slug } = useParams<{ slug: string }>();
	const { agregar, carrito, vaciar, cantidadTotal, total } = useCarrito();
	const [aviso, setAviso] = useState<string | null>(null);

	const { datos: negocio, cargando, error } = useDatos<NegocioDetalle>(
		() => api(`/api/negocios/slug/${encodeURIComponent(slug)}`),
		[slug],
	);

	function agregarProducto(producto: Producto) {
		setAviso(null);

		const otroNegocio =
			carrito != null && carrito.negocioId !== producto.negocioId;

		if (otroNegocio) {
			const confirmar = window.confirm(
				`Tu carrito es de "${carrito?.negocioNombre}". Un pedido solo puede ser de un negocio. ¿Vaciar el carrito y empezar con "${negocio?.nombre}"?`,
			);
			if (!confirmar) return;
			vaciar();
		}

		agregar(producto);
		setAviso(`Agregado: ${producto.nombre}`);
	}

	if (cargando) return <Cargando />;

	if (error || !negocio) {
		return (
			<div className="px-4 pt-4">
				<Aviso tono="error">{error ?? "No se encontró el negocio."}</Aviso>
				<Link href="/" className="mt-3 inline-block text-sm font-medium text-azul">
					Volver al inicio
				</Link>
			</div>
		);
	}

	const disponibles = negocio.productos.filter((p) => p.disponible);

	return (
		<div className="pb-4">
			<div className="bg-verde px-4 py-4 text-white">
				<h1 className="text-xl font-bold">{negocio.nombre}</h1>
				<p className="mt-1 text-sm text-white/85">
					{negocio.barrio ?? "Repelón"} · {negocio.direccion}
				</p>
				<div className="mt-2 flex items-center gap-2 text-xs">
					<span
						className={`rounded-full px-2 py-0.5 font-semibold ${
							negocio.abierto ? "bg-white text-verde" : "bg-black/40 text-white"
						}`}
					>
						{negocio.abierto ? "Abierto" : "Cerrado"}
					</span>
					{negocio.whatsapp && (
						<a
							href={`https://wa.me/${negocio.whatsapp.replace(/\D/g, "")}`}
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							Escribir por WhatsApp
						</a>
					)}
				</div>
			</div>

			{negocio.descripcion && (
				<p className="px-4 pt-4 text-sm text-black/70">{negocio.descripcion}</p>
			)}

			{!negocio.abierto && (
				<div className="px-4 pt-4">
					<Aviso tono="info">
						El negocio está cerrado ahora. Puedes ver el catálogo, pero
						confirma antes de pedir.
					</Aviso>
				</div>
			)}

			{aviso && (
				<div className="px-4 pt-4">
					<Aviso tono="ok">{aviso}</Aviso>
				</div>
			)}

			<section className="mt-4 px-4">
				<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50">
					Productos
				</h2>

				{disponibles.length === 0 ? (
					<Vacio titulo="Este negocio aún no tiene productos" />
				) : (
					<ul className="divide-y divide-black/10 rounded-2xl border border-black/10">
						{disponibles.map((p) => (
							<li key={p.id} className="flex items-center gap-3 p-3">
								<div className="min-w-0 flex-1">
									<p className="font-medium leading-tight">{p.nombre}</p>
									{p.descripcion && (
										<p className="line-clamp-1 text-xs text-black/55">
											{p.descripcion}
										</p>
									)}
									<p className="mt-1 font-semibold text-azul">{pesos(p.precio)}</p>
									{p.stock != null && p.stock <= 5 && (
										<p className="text-xs text-black/50">
											{p.stock === 0 ? "Agotado" : `Quedan ${p.stock}`}
										</p>
									)}
								</div>
								<button
									type="button"
									onClick={() => agregarProducto(p)}
									disabled={p.stock === 0}
									className="shrink-0 rounded-xl bg-azul px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
								>
									Agregar
								</button>
							</li>
						))}
					</ul>
				)}
			</section>

			{cantidadTotal > 0 && (
				<div className="fixed inset-x-0 bottom-16 z-10 px-4 pb-2">
					<Link
						href="/carrito"
						className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-2xl bg-azul px-4 py-3 font-semibold text-white shadow-lg"
					>
						<span>Ver carrito · {cantidadTotal} ítem(s)</span>
						<span>{pesos(total)}</span>
					</Link>
				</div>
			)}
		</div>
	);
}
