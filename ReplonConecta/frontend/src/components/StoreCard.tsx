"use client";

import Link from "next/link";
import { useState } from "react";

import { FuenteImagen, InsigniaAbierto } from "@/components/ui";
import { creditoNegocio, fotoNegocio, fotoRespaldo } from "@/lib/imagenes";
import type { Negocio } from "@/lib/tipos";

/*
 * Tarjeta de comercio de la plantilla: superficie de vidrio, foto que
 * se acerca al pasar el cursor, nombre en Fraunces y, abajo, el estado
 * junto al barrio y la cantidad de productos.
 *
 * Toda la tarjeta es un enlace a la ficha del negocio; el pedido por
 * WhatsApp queda aparte y encima, porque es una acción y no una lectura.
 */
export function StoreCard({ n }: { n: Negocio }) {
	/*
	 * El logo viene de la base y puede apuntar a un archivo que ya no
	 * existe: en ese caso se cambia por la foto del oficio en vez de
	 * dejar la imagen rota.
	 */
	const logo = fotoNegocio(n);
	const [fallaEn, setFallaEn] = useState<string | null>(null);
	const foto = fallaEn === logo ? fotoRespaldo(n.nombre) : logo;
	const credito = fallaEn === logo ? null : creditoNegocio(n);

	return (
		<article className="glass group rounded-3xl p-3 transition-transform hover:-translate-y-1 sm:p-4">
			<Link href={`/negocios/${n.slug}`} className="block">
				<div className="overflow-hidden rounded-2xl">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={foto}
						alt={`Foto de ${n.nombre}`}
						loading="lazy"
						onError={() => setFallaEn(logo)}
						className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				<FuenteImagen credito={credito} className="pt-1.5 sm:pt-2" />

				<div className="flex items-center justify-between gap-2 pt-2.5 sm:pt-4">
					<h3 className="min-w-0 truncate font-display text-base font-semibold text-ink sm:text-lg">
						{n.nombre}
					</h3>
					{n.destacado && (
						<span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-azul">
							<svg viewBox="0 0 24 24" className="size-3 fill-current" aria-hidden>
								<path d="m12 2.5 2.9 6.1 6.7.8-5 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-5-4.6 6.7-.8z" />
							</svg>
							Destacado
						</span>
					)}
				</div>

				<p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground sm:mt-1 sm:text-sm">
					{n.descripcion ?? n.direccion}
				</p>

				<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-3">
					<InsigniaAbierto abierto={n.abierto} />
					<span className="text-[13px] text-muted-foreground sm:text-sm">
						{n.barrio ?? n.direccion} · {n.cantidadProductos} productos
					</span>
				</div>
			</Link>

			{n.whatsapp && (
				<a
					href={`https://wa.me/${n.whatsapp.replace(/\D/g, "")}`}
					target="_blank"
					rel="noreferrer"
					className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-leaf hover:underline sm:mt-3"
				>
					<svg
						viewBox="0 0 24 24"
						className="size-4"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						aria-hidden
					>
						<path
							d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z"
							strokeLinejoin="round"
						/>
					</svg>
					Pedir por WhatsApp
				</a>
			)}
		</article>
	);
}
