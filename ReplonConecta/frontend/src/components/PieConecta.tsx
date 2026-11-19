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
		<footer className="mx-auto w-full max-w-6xl px-4 pb-nav-total pt-8 sm:pt-10 md:pb-10 md:pt-12">
			<div className="glass flex flex-col gap-4 rounded-3xl p-4 sm:gap-5 sm:p-5 md:flex-row md:items-start md:justify-between md:gap-6 md:p-6">
				<div className="max-w-xs">
					<p className="font-display text-lg font-semibold text-ink">
						Repelón Conecta
					</p>
					<p className="mt-1 text-sm leading-snug text-muted-foreground sm:leading-relaxed">
						El comercio local y los lugares del pueblo, en un solo lugar.
						Hecho en Repelón, Atlántico.
					</p>
				</div>

				<nav aria-label="Enlaces del pie" className="flex flex-col gap-1.5 text-sm sm:gap-2">
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

				<nav aria-label="Enlaces legales" className="flex flex-col gap-1.5 text-sm sm:gap-2">
					<Link href="/privacidad" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Privacidad
					</Link>
					<Link href="/terminos" className="font-medium text-muted-foreground transition-colors hover:text-leaf">
						Términos y condiciones
					</Link>
				</nav>
			</div>

			{/*
			 * Derechos de autor: el aviso general va siempre; la
			 * lista de créditos solo aparece cuando hay imágenes
			 * registradas en src/lib/creditos.ts.
			 */}
			<div className="mt-4 text-center text-xs leading-relaxed text-muted-foreground md:text-left">
				<p>
					Imágenes de terceros © sus autores. Créditos de uso en
					este sitio.
				</p>
				{creditos.length > 0 && (
					<ul className="mt-1 space-y-0.5">
						{creditos.map(({ imagen, credito }) => (
							<li key={imagen}>
								<span className="font-medium">{credito}</span>
								{" — "}
								<span className="opacity-75">{imagen}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</footer>
	);
}
