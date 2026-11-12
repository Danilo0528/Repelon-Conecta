"use client";

import Link from "next/link";
import { useState } from "react";

import { FuenteImagen, InsigniaAbierto } from "@/components/ui";
import { creditoNegocio, fotoNegocio, fotoRespaldo } from "@/lib/imagenes";
import type { Negocio } from "@/lib/tipos";

/** Tarjeta breve para que la foto y el acceso al negocio destaquen en móvil. */
export function StoreCard({ n }: { n: Negocio }) {
	const logo = fotoNegocio(n);
	const [fallaEn, setFallaEn] = useState<string | null>(null);
	const foto = fallaEn === logo ? fotoRespaldo(n.nombre) : logo;
	const credito = fallaEn === logo ? null : creditoNegocio(n);

	return (
		<article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_20px_-14px_rgba(16,45,70,.5)] transition hover:-translate-y-0.5 hover:shadow-lg">
			<Link href={`/negocios/${n.slug}`} className="block">
				<div className="relative aspect-[16/9] overflow-hidden bg-[#eaf5ef]">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={foto}
						alt={`Foto de ${n.nombre}`}
						loading="lazy"
						onError={() => setFallaEn(logo)}
						className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					{n.destacado && (
						<span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0a7133] shadow-sm">
							Destacado
						</span>
					)}
				</div>
				<FuenteImagen credito={credito} className="px-3 pt-1" />

				<div className="px-3 pb-2 pt-2">
					<h3 className="truncate font-display text-base font-semibold leading-tight text-[#102d46] sm:text-lg">
						{n.nombre}
					</h3>
					<p className="mt-1 line-clamp-2 min-h-9 text-xs leading-[1.35] text-[#17324d] sm:text-sm">
						{n.descripcion ?? n.direccion}
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
						<InsigniaAbierto abierto={n.abierto} />
						<span className="truncate">{n.barrio ?? n.direccion}</span>
					</div>
				</div>
			</Link>

			<div className="flex items-center gap-2 px-3 pb-3">
				<Link
					href={`/negocios/${n.slug}`}
					className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#078930]/50 bg-[#eaf5ef] px-3 text-xs font-bold text-[#0a7133] transition hover:bg-[#d9efdf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930]"
				>
					Ver negocio
					<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
						<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Link>
				{n.whatsapp && (
					<a
						href={`https://wa.me/${n.whatsapp.replace(/\D/g, "")}`}
						target="_blank"
						rel="noreferrer"
						aria-label={`Contactar por WhatsApp a ${n.nombre}`}
						className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 text-[#0a7133] transition hover:bg-[#eaf5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930]"
					>
						<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
							<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z" strokeLinejoin="round" />
						</svg>
					</a>
				)}
			</div>
		</article>
	);
}
