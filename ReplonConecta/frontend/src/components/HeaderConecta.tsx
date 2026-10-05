"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCarrito } from "@/context/CarritoContext";

/*
 * Cabecera de Repelón Conecta.
 *
 * Una pastilla de vidrio (blanco translúcido con desenfoque) que queda
 * pegada arriba, con el sello de la marca a la izquierda —la R verde y
 * el lema "del pueblo, para el pueblo"— y, a la derecha, el carrito y
 * los destinos que a pantalla ancha no lleva la barra de abajo.
 *
 * En móvil la navegación vive abajo, en la barra flotante; aquí solo
 * quedan la marca y el carrito, que es lo que siempre tiene que estar a
 * mano.
 */

function Icono({
	nombre,
}: {
	nombre: "carrito" | "perfil" | "comercios" | "pedidos" | "negocio";
}) {
	const clase = "h-5 w-5";
	switch (nombre) {
		case "carrito":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<circle cx="9" cy="20" r="1.6" />
					<circle cx="18" cy="20" r="1.6" />
					<path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			);
		case "perfil":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<circle cx="12" cy="8" r="4" />
					<path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
				</svg>
			);
		case "comercios":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
					<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
					<path d="M9.5 20v-5.5h5V20" strokeLinejoin="round" />
				</svg>
			);
		case "pedidos":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M6 2h12l1 4H5l1-4z" strokeLinejoin="round" />
					<path d="M5 6h14v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6z" strokeLinejoin="round" />
					<path d="M9 11h6" strokeLinecap="round" />
				</svg>
			);
		case "negocio":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<rect x="3.5" y="3.5" width="7" height="7" rx="2" />
					<rect x="13.5" y="3.5" width="7" height="7" rx="2" />
					<rect x="3.5" y="13.5" width="7" height="7" rx="2" />
					<rect x="13.5" y="13.5" width="7" height="7" rx="2" />
				</svg>
			);
	}
}

const DESTINOS: { href: string; etiqueta: string; icono: Parameters<typeof Icono>[0]["nombre"] }[] = [
	{ href: "/negocios", etiqueta: "Comercios", icono: "comercios" },
	{ href: "/pedidos", etiqueta: "Pedidos", icono: "pedidos" },
	{ href: "/vendedor", etiqueta: "Mi negocio", icono: "negocio" },
];

export default function HeaderConecta() {
	const { cantidadTotal } = useCarrito();
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 mx-auto w-full max-w-6xl px-4 pt-3">
			<nav className="glass flex items-center gap-3 rounded-2xl px-3 py-2.5">
				<Link
					href="/"
					className="flex shrink-0 items-center gap-2"
					aria-label="Repelón Conecta, inicio"
				>
					<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-leaf font-display text-lg font-semibold text-white">
						R
					</span>
					<span className="leading-tight">
						<span className="block font-display text-base font-semibold tracking-tight text-ink">
							Repelón Conecta
						</span>
						<span className="block text-[9px] font-semibold uppercase tracking-wide text-leaf">
							del pueblo, para el pueblo
						</span>
					</span>
				</Link>

				<div className="ml-2 hidden items-center gap-5 text-sm font-medium md:flex">
					{DESTINOS.map(({ href, etiqueta }) => {
						const activo = pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={activo ? "page" : undefined}
								className={`transition-colors hover:text-leaf ${
									activo ? "text-ink" : "text-muted-foreground"
								}`}
							>
								{etiqueta}
							</Link>
						);
					})}
				</div>

				<div className="ml-auto flex items-center gap-2">
					<Link
						href="/perfil"
						className="glass-soft hidden size-10 place-items-center rounded-xl text-ink transition-colors hover:text-leaf sm:grid"
						aria-label="Perfil"
					>
						<Icono nombre="perfil" />
					</Link>

					<Link
						href="/carrito"
						className="glass-soft relative grid size-10 place-items-center rounded-xl text-ink transition-colors hover:text-leaf"
						aria-label={
							cantidadTotal > 0
								? `Carrito, ${cantidadTotal} ítems`
								: "Carrito vacío"
						}
					>
						<Icono nombre="carrito" />
						{cantidadTotal > 0 && (
							<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf px-1 text-[11px] font-bold leading-none text-white">
								{cantidadTotal}
							</span>
						)}
					</Link>
				</div>
			</nav>
		</header>
	);
}
