"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderConecta from "@/components/HeaderConecta";
import { IconoNav, type NombreIconoNav } from "@/components/IconoNav";

/*
 * Navegación de la app.
 *
 * Arriba, la pastilla de vidrio con la marca y los accesos
 * directos (HeaderConecta). Abajo, seis destinos en una barra que
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
 * El acceso del vendedor y del administrador NO vive aquí: meter un
 * séptimo destino descuadra la barra para todos. "Mi negocio" sí entra,
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
	// Etiquetas cortas a proposito: en un Android angosto (320 px) cada
	// destino tiene ~44 px de ancho y un texto largo queda truncado.
	{ href: "/negocios", etiqueta: "Negocios", icono: "comercios" },
	{ href: "/#turismo", etiqueta: "Turismo", icono: "turismo" },
	{ href: "/fondo-emprender", etiqueta: "Fondo", icono: "fondo" },
	{ href: "/vendedor", etiqueta: "Tienda", icono: "negocio" },
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
				className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-cromo md:hidden"
			>
				<div className="glass grid grid-cols-6 gap-0.5 rounded-[22px] px-1.5 py-1.5">
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
								className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1.5 transition-all duration-200 ${
									activo
										? "bg-leaf font-semibold text-white shadow-leaf"
										: "font-medium text-muted-foreground hover:bg-black/5 hover:text-ink"
								}`}
							>
								<IconoNav nombre={icono} />
								<span className="w-full truncate text-center text-[10px] leading-none tracking-tighter">
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
