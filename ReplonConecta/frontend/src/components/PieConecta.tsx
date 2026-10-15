"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * Pie de la app pública.
 *
 * Minimal a propósito: no es un link farm de cuatro columnas. Son los
 * caminos de vuelta que hacen falta cuando alguien llega al fondo de
 * una página larga (el home mide varias pantallas), más los enlaces
 * legales que la app necesita tener accesibles desde cualquier lugar.
 *
 * Como la barra de destinos, se oculta en /admin: ese panel tiene su
 * propio cromo.
 */
export default function PieConecta() {
	const pathname = usePathname();

	if (pathname.startsWith("/admin")) return null;

	return (
		<footer className="mx-auto w-full max-w-6xl px-4 pb-nav-total pt-12 md:pb-10">
			<div className="glass flex flex-col gap-6 rounded-3xl p-6 md:flex-row md:items-start md:justify-between">
				<div className="max-w-xs">
					<p className="font-display text-lg font-semibold text-ink">
						Repelón Conecta
					</p>
					<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
						El comercio local y los lugares del pueblo, en un solo lugar.
						Hecho en Repelón, Atlántico.
					</p>
				</div>

				<nav aria-label="Enlaces del pie" className="flex flex-col gap-2 text-sm">
					<Link href="/negocios" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Comercios
					</Link>
					<Link href="/#turismo" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Turismo
					</Link>
					<Link href="/fondo-emprender" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Fondo Emprender
					</Link>
					<Link href="/vendedor" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Publica tu negocio
					</Link>
				</nav>

				<nav aria-label="Enlaces legales" className="flex flex-col gap-2 text-sm">
					<Link href="/privacidad" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Privacidad
					</Link>
					<Link href="/terminos" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Términos y condiciones
					</Link>
				</nav>
			</div>
		</footer>
	);
}
