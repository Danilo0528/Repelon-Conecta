import Link from "next/link";

import { InsigniaAbierto } from "@/components/ui";
import { fotoNegocio } from "@/lib/imagenes";
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
	return (
		<article className="glass group rounded-3xl p-4 transition-transform hover:-translate-y-1">
			<Link href={`/negocios/${n.slug}`} className="block">
				<div className="overflow-hidden rounded-2xl">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={fotoNegocio(n)}
						alt={`Foto de ${n.nombre}`}
						loading="lazy"
						className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				<div className="flex items-center justify-between gap-2 pt-4">
					<h3 className="min-w-0 truncate font-display text-lg font-semibold text-ink">
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

				<p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
					{n.descripcion ?? n.direccion}
				</p>

				<div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
					<InsigniaAbierto abierto={n.abierto} />
					<span className="text-sm text-muted-foreground">
						{n.barrio ?? n.direccion} · {n.cantidadProductos} productos
					</span>
				</div>
			</Link>

			{n.whatsapp && (
				<a
					href={`https://wa.me/${n.whatsapp.replace(/\D/g, "")}`}
					target="_blank"
					rel="noreferrer"
					className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:underline"
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
