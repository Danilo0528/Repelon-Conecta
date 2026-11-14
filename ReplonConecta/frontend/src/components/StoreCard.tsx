"use client";

import Link from "next/link";
import { useState } from "react";

import { FuenteImagen } from "@/components/ui";
import { creditoNegocio, fotoNegocio, fotoRespaldo } from "@/lib/imagenes";
import type { Negocio } from "@/lib/tipos";

/*
 * Tarjeta de comercio — diseño Material.
 *
 * Fondo blanco, borde sutil, foto 192px, badge de estado, nombre,
 * descripción, chip de característica y botón WhatsApp verde.
 */
export function StoreCard({ n }: { n: Negocio }) {
	const logo = fotoNegocio(n);
	const [fallaEn, setFallaEn] = useState<string | null>(null);
	const foto = fallaEn === logo ? fotoRespaldo(n.nombre) : logo;
	const credito = fallaEn === logo ? null : creditoNegocio(n);

	const msgWA = encodeURIComponent(
		`Hola, vi tu negocio ${n.nombre} en Repelón Conecta`,
	);

	return (
		<article
			className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
			style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(7,27,47,0.06)" }}
		>
			{/* Foto */}
			<div className="relative h-48 w-full overflow-hidden">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={foto}
					alt={`Foto de ${n.nombre}`}
					loading="lazy"
					onError={() => setFallaEn(logo)}
					className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
				/>
				{/* Badges */}
				<div className="absolute left-3 top-3 flex gap-1.5">
					<span
						className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-bold text-white shadow-sm"
						style={{ background: n.abierto ? "#0b8544" : "#6e7a6b" }}
					>
						{n.abierto && (
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
						)}
						{n.abierto ? "Abierto" : "Cerrado"}
					</span>
					{n.destacado && (
						<span
							className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold shadow-sm"
							style={{ background: "#0b5c9e", color: "#fff" }}
						>
							<svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
								<path d="m12 2.5 2.9 6.1 6.7.8-5 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-5-4.6 6.7-.8z" />
							</svg>
							Verificado
						</span>
					)}
				</div>
			</div>

			{/* Contenido */}
			<Link href={`/negocios/${n.slug}`} className="flex flex-1 flex-col p-4">
				<FuenteImagen credito={credito} className="mb-2" />

				<p className="mb-1 flex items-center gap-1 text-[12px]" style={{ color: "#3e4a3d" }}>
					<svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
						<path d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z" strokeLinejoin="round" />
						<circle cx="12" cy="10" r="2.5" />
					</svg>
					{n.barrio ?? n.direccion}
					{n.cantidadProductos > 0 && ` · ${n.cantidadProductos} productos`}
				</p>

				<h3 className="mb-1 font-sans text-[18px] font-bold leading-snug" style={{ color: "#091c31" }}>
					{n.nombre}
				</h3>

				<p className="mb-3 flex-1 line-clamp-2 text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>
					{n.descripcion ?? n.direccion}
				</p>

				{/* Chip de característica */}
				{n.barrio && (
					<div
						className="flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-semibold"
						style={{ background: "#e5eeff", color: "#1660a3" }}
					>
						<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
							<path d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z" strokeLinejoin="round" />
							<circle cx="12" cy="10" r="2.5" />
						</svg>
						{n.barrio}
					</div>
				)}
			</Link>

			{/* WhatsApp */}
			{n.whatsapp && (
				<div className="px-4 pb-4">
					<a
						href={`https://wa.me/${n.whatsapp.replace(/\D/g, "")}?text=${msgWA}`}
						target="_blank"
						rel="noreferrer"
						className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-bold text-white shadow-sm transition hover:opacity-90"
						style={{ background: "#25d366" }}
					>
						<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
							<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z" />
						</svg>
						Pedir por WhatsApp
					</a>
				</div>
			)}
		</article>
	);
}
