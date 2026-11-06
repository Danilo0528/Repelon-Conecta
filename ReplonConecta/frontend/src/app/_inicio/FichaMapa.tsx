"use client";

import Link from "next/link";
import { useState } from "react";

import { InsigniaAbierto } from "@/components/ui";
import { fotoNegocio, fotoRespaldo } from "@/lib/imagenes";
import { enlaceComoLlegar } from "@/lib/maps";
import type { Negocio } from "@/lib/tipos";

/** Ficha del comercio elegido sobre el mapa. */
export function FichaMapa({ n, onCerrar }: { n: Negocio; onCerrar: () => void }) {
	/*
	 * El logo del mapa puede apuntar a una URL que ya no responde; en
	 * ese caso se dibuja la foto del oficio en su lugar, para que la
	 * fichita nunca quede con la imagen rota.
	 */
	const logo = fotoNegocio(n);
	const [fallaEn, setFallaEn] = useState<string | null>(null);
	const foto = fallaEn === logo ? fotoRespaldo(n.nombre) : logo;

	return (
		<div className="glass rounded-2xl p-3">
			<div className="flex gap-3">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={foto}
					alt={`Foto de ${n.nombre}`}
					onError={() => setFallaEn(logo)}
					className="size-20 shrink-0 rounded-xl object-cover"
				/>
				<div className="min-w-0 flex-1">
					<InsigniaAbierto abierto={n.abierto} />
					<p className="mt-1 truncate font-display font-semibold text-ink">
						{n.nombre}
					</p>
					<p className="truncate text-xs text-muted-foreground">
						{n.direccion}
						{n.barrio ? ` · ${n.barrio}` : ""}
					</p>
				</div>
				<button
					type="button"
					onClick={onCerrar}
					aria-label="Quitar la ficha del mapa"
					className="-mr-1 -mt-1 size-8 shrink-0 rounded-full text-black/40 transition-colors hover:bg-black/5"
				>
					×
				</button>
			</div>

			<div className="mt-3 flex gap-2">
				<Link
					href={`/negocios/${n.slug}`}
					className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-leaf px-3 py-2.5 text-center text-sm font-semibold text-white"
				>
					Ver comercio
				</Link>
				<a
					href={enlaceComoLlegar(n)}
					target="_blank"
					rel="noreferrer"
					className="glass-soft flex min-h-11 flex-1 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-ink"
				>
					Cómo llegar
				</a>
			</div>
		</div>
	);
}
