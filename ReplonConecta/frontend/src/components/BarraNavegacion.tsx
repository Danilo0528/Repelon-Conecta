"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderConecta from "@/components/HeaderConecta";
import { IconoNav, type NombreIconoNav } from "@/components/IconoNav";

/*
 * En móvil quedan cinco accesos principales en la barra inferior.
 * Cultura y Fondo Emprender siguen disponibles en el menú de cabecera,
 * y la navegación se oculta en escritorio porque allí vive arriba.
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
	{ href: "/#turismo", etiqueta: "Turismo", icono: "palmera" },
	{ href: "/vendedor", etiqueta: "Tienda", icono: "carrito" },
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
				className="fixed inset-x-0 bottom-0 z-cromo md:hidden"
			>
				<div className="grid grid-cols-5 gap-0 border-t border-[#ebe7dc] bg-white px-1 pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+0.375rem)]">
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
								className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1.5 transition-colors duration-200 ${
									activo
										? "font-semibold text-[#078930]"
										: "font-medium text-[#12366a] hover:bg-slate-50"
								}`}
							>
								<IconoNav nombre={icono} />
								<span className="w-full truncate text-center text-[10px] leading-none">
									{etiqueta}
								</span>
								<span aria-hidden className={`absolute inset-x-2 bottom-0.5 h-0.5 rounded-full ${activo ? "bg-[#078930]" : "bg-transparent"}`} />
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
