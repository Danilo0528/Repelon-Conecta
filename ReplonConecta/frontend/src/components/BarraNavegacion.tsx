"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderConecta from "@/components/HeaderConecta";
import { IconoNav, type NombreIconoNav } from "@/components/IconoNav";

/*
 * Navegación de la app.
 *
 * Arriba, la pastilla de vidrio con la marca y los accesos
 * directos (HeaderConecta). Abajo, siete destinos en una barra que
 * FLOTA sobre el fondo (12 px separada del borde) con acabado de
 * vidrio: ya no es una caja blanca pegada abajo, es una pastilla que
 * descansa sobre el contenido.
 *
 * El destino encendido no se marca solo con color de texto: se dibuja
 * una píldora verde con el icono y la etiqueta en blanco, que es la
 * señal que se espera de una barra de pestañas (y la que menos se
 * discute a la hora de saber "dónde estoy"). En pantallas anchas la
 * barra se oculta porque los mismos destinos ya están en la
 * cabecera.
 *
 * El acceso del vendedor y del administrador NO vive aquí: ya hay
 * siete destinos y otro más descuadraría la barra para todos. "Mi negocio" sí entra,
 * porque es de todos. "Turismo" es una ancla (#turismo) a la sección
 * de la home, así que nunca se marca como activo.
 */

/*
 * Iconos de destino de la navegación: viven en IconoNav porque la
 * cabecera (HeaderConecta) pinta los mismos destinos.
 */

const ENLACES: {
	href: string;
	etiqueta: string;
	icono: NombreIconoNav;
}[] = [
	{ href: "/", etiqueta: "Inicio", icono: "inicio" },
	{ href: "/negocios", etiqueta: "Negocios", icono: "comercios" },
	{ href: "/#turismo", etiqueta: "Turismo", icono: "turismo" },
	{ href: "/cultura", etiqueta: "Cultura", icono: "cultura" },
	{ href: "/perfil", etiqueta: "Perfil", icono: "perfil" },
];

export default function BarraNavegacion() {
	const pathname = usePathname();

	// El panel /admin tiene su propio cromo (sidebar, barra superior y
	// menú): la navegación pública no se pinta ahí.
	if (pathname.startsWith("/admin")) return null;

	return (
		<>
			<HeaderConecta />

			<nav
				aria-label="Navegación principal"
				className="fixed inset-x-3 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-cromo sm:inset-x-4 md:hidden"
			>
				<div className="glass grid grid-cols-5 gap-1 rounded-[20px] px-1.5 py-1.5 shadow-float">
					{ENLACES.map(({ href, etiqueta, icono }) => {
						// "/" es la home pero también el prefijo de todo lo
						// demás, así que se compara exacto; el resto por
						// prefijo, para que /negocios/[slug] deje "Negocios"
						// encendido dentro de la ficha. Las anclas (#...) no
						// son rutas, nunca se marcan.
						const activo =
							href === "/"
								? pathname === "/"
								: !href.includes("#") &&
										(pathname === href || pathname.startsWith(`${href}/`));
						return (
							<Link
								key={href}
								href={href}
								aria-current={activo ? "page" : undefined}
								className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 transition-colors ${
									activo
										? "bg-leaf font-semibold text-white shadow-leaf"
										: "font-medium text-muted-foreground hover:bg-black/5 hover:text-ink"
								}`}
							>
								<IconoNav nombre={icono} className="size-5" />
								<span className="w-full truncate text-center text-[11px] leading-none">
									{etiqueta}
								</span>
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
