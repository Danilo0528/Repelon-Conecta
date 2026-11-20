"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { listaCreditos } from "@/lib/creditos";

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

	const creditos = listaCreditos();

	return (
		<footer className="mx-auto w-full max-w-6xl px-4 pb-nav-total pt-10 md:pb-10 md:pt-12">
			<div className="border-t border-black/10 pt-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
					<div className="max-w-xs">
						<p className="font-display text-lg font-semibold text-ink">
							Repelón Conecta
						</p>
						<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
							Comercio local y turismo de Repelón, en un solo lugar.
						</p>
					</div>

					<nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
						<Link href="/negocios" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
							Comercios
						</Link>
						<Link href="/#turismo" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
							Turismo
						</Link>
						<Link href="/cultura" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
							Cultura
						</Link>
						<Link href="/fondo-emprender" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
							Fondo Emprender
						</Link>
						<Link href="/vendedor" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
							Publica tu negocio
						</Link>
					</nav>
				</div>

				<div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>Hecho en Repelón, Atlántico.</p>
					<div className="flex flex-wrap gap-x-4 gap-y-1">
						<Link href="/privacidad" className="transition-colors hover:text-leaf">Privacidad</Link>
						<Link href="/terminos" className="transition-colors hover:text-leaf">Términos</Link>
					</div>
				</div>

				{creditos.length > 0 && (
					<div className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
						<p>Imágenes de terceros © sus autores.</p>
					</div>
				)}
			</div>
		</footer>
	);
}
