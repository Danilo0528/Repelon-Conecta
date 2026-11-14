"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCarrito } from "@/context/CarritoContext";
import { COMPRAS_ACTIVAS } from "@/lib/compras";
import BuscadorNav from "./BuscadorNav";

/*
 * Cabecera — diseño Material.
 *
 * Fondo #f8f9ff/90 con backdrop-blur, sombra sutil.
 * Logo real + badge de localización + nav texto + botón "Registrar mi negocio".
 */
export default function HeaderConecta() {
	const { cantidadTotal } = useCarrito();
	const pathname = usePathname();
	if (pathname.startsWith("/admin")) return null;

	return (
		<header className="fixed top-0 w-full z-cromo"
			style={{ background: "rgba(248,249,255,0.90)", backdropFilter: "blur(20px)", boxShadow: "0 1px 8px rgba(7,27,47,0.06)" }}>
			<div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8 lg:px-12">

				{/* Marca */}
				<div className="flex shrink-0 items-center gap-2">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/img/logo-repelon-conecta-transparente.png" alt="Repelón Conecta" className="h-8 w-auto" />
					<div className="flex flex-col leading-none">
						<span className="text-[18px] font-bold tracking-tight" style={{ color: "#006d23" }}>Repelón Conecta</span>
						<span className="text-[11px] font-medium" style={{ color: "#3e4a3d" }}>Impulso Comunitario &amp; Comercio</span>
					</div>
					{/* Badge bandera — solo escritorio */}
					<div className="hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 ml-1 shadow-sm"
						style={{ background: "#e5eeff" }}>
						<BanderaChica />
						<span className="text-[12px] font-bold" style={{ color: "#091c31" }}>Repelón, Atl.</span>
					</div>
				</div>

				{/* Nav escritorio */}
				<nav className="hidden xl:flex items-center gap-5" aria-label="Navegación principal">
					{[
						{ href: "/",               label: "Inicio" },
						{ href: "/negocios",        label: "Comercios" },
						{ href: "/#turismo",        label: "Turismo Guájaro" },
						{ href: "/cultura",         label: "Cultura" },
						{ href: "/fondo-emprender", label: "Fondo SENA" },
					].map(({ href, label }) => {
						const activo = href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);
						return (
							<Link key={href} href={href}
								aria-current={activo ? "page" : undefined}
								className="text-[14px] font-semibold transition-colors px-3 py-1.5 rounded-lg"
								style={activo
									? { background: "#078930", color: "#fff" }
									: { color: "#3e4a3d" }}>
								{label}
							</Link>
						);
					})}
				</nav>

				{/* Acciones */}
				<div className="flex shrink-0 items-center gap-2">
					<div className="hidden md:block">
						<BuscadorNav />
					</div>

					<Link href="/vendedor"
						className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white transition-all shadow-sm"
						style={{ background: "#078930" }}>
						<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
							<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
							<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
						</svg>
						Registrar mi negocio
					</Link>

					<Link href="/perfil" aria-label="Mi perfil"
						className="flex h-9 w-9 items-center justify-center rounded-full text-white"
						style={{ background: "#006d23" }}>
						<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
							<circle cx="12" cy="8" r="4" />
							<path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
						</svg>
					</Link>

					{COMPRAS_ACTIVAS && (
						<Link href="/carrito"
							className="relative flex h-9 w-9 items-center justify-center rounded-full border text-[#3e4a3d] transition hover:bg-[#f0f4f2]"
							style={{ borderColor: "#becab9" }}
							aria-label={cantidadTotal > 0 ? `Carrito, ${cantidadTotal} ítems` : "Carrito"}>
							<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
								<circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
								<path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" />
							</svg>
							{cantidadTotal > 0 && (
								<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#006d23] px-1 text-[11px] font-bold text-white">
									{cantidadTotal}
								</span>
							)}
						</Link>
					)}

					{/* Búsqueda móvil */}
					<div className="md:hidden">
						<BuscadorNav />
					</div>
				</div>
			</div>
		</header>
	);
}

function BanderaChica() {
	return (
		<div className="flex h-3.5 w-5 flex-col overflow-hidden rounded-sm border border-[#becab9]" title="Bandera de Repelón" aria-hidden>
			<span className="h-1/3 w-full" style={{ background: "#006d23" }} />
			<span className="h-1/3 w-full" style={{ background: "#fff" }} />
			<span className="h-1/3 w-full" style={{ background: "#1660a3" }} />
		</div>
	);
}
