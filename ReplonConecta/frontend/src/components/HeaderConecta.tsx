"use client";

import Link from "next/link";

import { useCarrito } from "@/context/CarritoContext";
import { COMPRAS_ACTIVAS } from "@/lib/compras";
import { IconoNav } from "@/components/IconoNav";

import BuscadorNav from "./BuscadorNav";

/**
 * Cabecera limpia: logo + búsqueda y accesos esenciales.
 * La navegación principal vive en la barra inferior en móvil.
 */
export default function HeaderConecta() {
	const { cantidadTotal } = useCarrito();
	return (
		<header className="sticky top-0 z-cromo w-full px-3 pt-[calc(env(safe-area-inset-top,0px)+0.35rem)] sm:px-4 sm:pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:px-8">
			<nav className="glass flex items-center gap-2 rounded-2xl border-black/10 px-2.5 py-2 shadow-sm sm:gap-3 sm:px-3">
				<Link
					href="/"
					className="flex shrink-0 items-center"
					aria-label="Repelón Conecta, inicio"
				>
					<img
						src="/img/logo-repelon-conecta-transparente.png"
						alt="Repelón Conecta"
						className="h-8 w-[6.25rem] object-contain object-left sm:h-9 sm:w-28 md:h-10 md:w-32"
					/>
				</Link>

				<div className="min-w-0 flex-1">
					<BuscadorNav />
				</div>

				<div className="ml-auto flex items-center gap-1.5 sm:gap-2">
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
