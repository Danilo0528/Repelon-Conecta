"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCarrito } from "@/context/CarritoContext";
import { useSesion } from "@/context/SesionContext";

/*
 * Navegación de la app.
 *
 * Arriba, una barra verde con la marca y el carrito. Abajo, una barra
 * fija tipo app de celular, que es como se va a usar esto: en el
 * teléfono, con una mano. En pantallas grandes la barra inferior se
 * centra con el resto del contenido.
 */

function Icono({ nombre }: { nombre: "inicio" | "pedidos" | "tienda" | "perfil" }) {
	const clase = "h-6 w-6";
	switch (nombre) {
		case "inicio":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			);
		case "pedidos":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<path d="M6 2h12l1 4H5l1-4z" strokeLinejoin="round" />
					<path d="M5 6h14v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6z" strokeLinejoin="round" />
					<path d="M9 11h6" strokeLinecap="round" />
				</svg>
			);
		case "tienda":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<path d="M4 4h16v4H4z" strokeLinejoin="round" />
					<path d="M5 8v12h14V8" strokeLinejoin="round" />
					<path d="M9 12h6" strokeLinecap="round" />
				</svg>
			);
		case "perfil":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<circle cx="12" cy="8" r="4" />
					<path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
				</svg>
			);
	}
}

export default function BarraNavegacion() {
	const pathname = usePathname();
	const { cantidadTotal } = useCarrito();
	const { perfil } = useSesion();

	const esAdmin = perfil?.rol === "ADMIN";
	const puedeVender = perfil?.rol === "VENDEDOR" || esAdmin;

	const enlaces: { href: string; etiqueta: string; icono: Parameters<typeof Icono>[0]["nombre"] }[] = [
		{ href: "/", etiqueta: "Inicio", icono: "inicio" },
		{ href: "/pedidos", etiqueta: "Pedidos", icono: "pedidos" },
	];

	if (puedeVender) {
		enlaces.push({
			href: esAdmin ? "/admin" : "/vendedor",
			etiqueta: esAdmin ? "Admin" : "Mi negocio",
			icono: "tienda",
		});
	}

	enlaces.push({ href: "/perfil", etiqueta: "Perfil", icono: "perfil" });

	return (
		<>
			<header className="sticky top-0 z-20 bg-verde text-white shadow-sm">
				<div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
					<Link href="/" className="text-lg font-bold tracking-tight">
						Repelón Market
					</Link>
					<Link
						href="/carrito"
						className="relative flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium"
						aria-label="Carrito"
					>
						<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
							<circle cx="9" cy="20" r="1.6" />
							<circle cx="18" cy="20" r="1.6" />
							<path d="M2 3h3l2.4 12.4a1 1 0 001 .8h9.7a1 1 0 001-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{cantidadTotal > 0 && (
							<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-verde">
								{cantidadTotal}
							</span>
						)}
					</Link>
				</div>
			</header>

			<nav className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white">
				<div className="mx-auto flex w-full max-w-2xl items-stretch justify-around">
					{enlaces.map((e) => {
						const activo =
							e.href === "/"
								? pathname === "/"
								: pathname.startsWith(e.href);
						return (
							<Link
								key={e.href}
								href={e.href}
								className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
									activo ? "text-verde" : "text-black/55"
								}`}
							>
								<Icono nombre={e.icono} />
								{e.etiqueta}
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
