"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCarrito } from "@/context/CarritoContext";
import { COMPRAS_ACTIVAS } from "@/lib/compras";
import { IconoNav, type NombreIconoNav } from "@/components/IconoNav";

import BuscadorNav from "./BuscadorNav";

/*
 * Cabecera de Repelón Conecta.
 *
 * Una pastilla de vidrio (blanco translúcido con desenfoque) que queda
 * pegada arriba, con el sello de la marca a la izquierda —la R verde y
 * el lema "del pueblo, para el pueblo"— y, a la derecha, los accesos
 * que a pantalla ancha no lleva la barra de abajo.
 *
 * En móvil la navegación vive abajo, en la barra flotante; aquí solo
 * quedan la marca y los destinos directos. El carrito y "Pedidos"
 * están ocultos mientras COMPRAS_ACTIVAS sea false: la app termina en
 * el WhatsApp del vendedor (se oculta, no se borra).
 */

/*
 * Iconos de destino de la cabecera: viven en IconoNav porque la barra
 * inferior (BarraNavegacion) pinta los mismos destinos.
 */

const DESTINOS: { href: string; etiqueta: string; icono: NombreIconoNav }[] = [
	{ href: "/negocios", etiqueta: "Comercios", icono: "comercios" },
	// Ancla a la sección de la home: el acceso no queda escondido
	// abajo del scroll, vive en la barra como los demás destinos.
	{ href: "/#turismo", etiqueta: "Turismo", icono: "turismo" },
	{ href: "/fondo-emprender", etiqueta: "Fondo Emprender", icono: "fondo" },
	// Oculto mientras COMPRAS_ACTIVAS sea false: la app es solo
	// intermediaria. Con el interruptor en true vuelve sin mas cambios.
	...(COMPRAS_ACTIVAS
		? [{ href: "/pedidos", etiqueta: "Pedidos", icono: "pedidos" as const }]
		: []),
	{ href: "/vendedor", etiqueta: "Mi negocio", icono: "negocio" },
];

export default function HeaderConecta() {
	const { cantidadTotal } = useCarrito();
	const pathname = usePathname();

	/*
	 * padding-top con el notch/camara del Android: layout.tsx pone
	 * viewportFit=cover, asi que sin este safe-area la pastilla se
	 * mete debajo del hueco en pantallas con muesca.
	 */
	return (
		<header className="sticky top-0 z-cromo w-full px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 lg:px-8">
			<nav className="glass relative flex items-center gap-3 rounded-2xl border-azul/10 px-3 py-2 shadow-float">
				<Link
					href="/"
					className="flex shrink-0 items-center gap-2"
					aria-label="Repelón Conecta, inicio"
				>
					<img
						src="/img/logo-repelon-conecta.png"
						alt="Repelón Conecta"
						className="h-9 w-28 object-contain object-center sm:h-12 sm:w-40 md:h-14 md:w-48"
					/>
				</Link>

				<div className="ml-2 hidden items-center gap-1 md:flex">
					{DESTINOS.map(({ href, etiqueta }) => {
						// Las anclas (#...) no son rutas: nunca se marcan.
						const activo =
							!href.includes("#") &&
							(pathname === href || pathname.startsWith(`${href}/`));
						return (
							<Link
								key={href}
								href={href}
								aria-current={activo ? "page" : undefined}
								className={`rounded-full px-3 py-1.5 text-sm leading-none transition-all duration-200 ${
									activo
										? "bg-leaf font-semibold text-white shadow-leaf"
										: "font-medium text-muted-foreground hover:bg-black/5 hover:text-ink"
								}`}
							>
								{etiqueta}
							</Link>
						);
					})}
				</div>

				<BuscadorNav />

				<div className="ml-auto flex items-center gap-2">
					<span aria-hidden className="hidden h-6 w-px bg-black/10 md:block" />
					<Link
						href="/perfil"
						className="glass-soft hidden size-10 place-items-center rounded-xl text-ink transition-colors hover:text-leaf sm:grid"
						aria-label="Perfil"
					>
						<IconoNav nombre="perfil" />
					</Link>

					{COMPRAS_ACTIVAS && (
						<Link
							href="/carrito"
							className="glass-soft relative grid size-10 place-items-center rounded-xl text-ink transition-colors hover:text-leaf"
							aria-label={
								cantidadTotal > 0
									? `Carrito, ${cantidadTotal} ítems`
									: "Carrito vacío"
							}
						>
							<IconoNav nombre="carrito" />
							{cantidadTotal > 0 && (
								<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf px-1 text-[11px] font-bold leading-none text-white">
									{cantidadTotal}
								</span>
							)}
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
