"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderConecta from "@/components/HeaderConecta";

/*
 * Navegación de la app.
 *
 * Arriba, la pastilla de vidrio con la marca y el carrito
 * (HeaderConecta). Abajo, cuatro destinos y solo cuatro, en una barra
 * que FLOTA sobre el fondo (12 px separada del borde) con acabado de
 * vidrio: ya no es una caja blanca pegada abajo, es una pastilla que
 * descansa sobre el contenido.
 *
 * El destino encendido se marca en verde y en negrita, que es la señal
 * que usa la plantilla. En pantallas anchas la barra se oculta porque
 * los mismos destinos ya están en la cabecera.
 *
 * El acceso del vendedor y del administrador NO vive aquí: meter un
 * quinto destino descuadra la barra para todos. "Mi negocio" sí entra,
 * porque es de todos.
 */

function Icono({ nombre }: { nombre: "inicio" | "negocios" | "negocio" | "perfil" }) {
	const clase = "h-5 w-5";
	switch (nombre) {
		case "inicio":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M3.5 11 12 4l8.5 7" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M6 10.2V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.8" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			);
		case "negocios":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
					<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
					<path d="M9.5 20v-5.5h5V20" strokeLinejoin="round" />
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
		case "perfil":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<circle cx="12" cy="8" r="4" />
					<path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
				</svg>
			);
	}
}

const ENLACES: {
	href: string;
	etiqueta: string;
	icono: Parameters<typeof Icono>[0]["nombre"];
}[] = [
	{ href: "/", etiqueta: "Inicio", icono: "inicio" },
	{ href: "/negocios", etiqueta: "Negocios", icono: "negocios" },
	{ href: "/vendedor", etiqueta: "Mi negocio", icono: "negocio" },
	{ href: "/perfil", etiqueta: "Perfil", icono: "perfil" },
];

export default function BarraNavegacion() {
	const pathname = usePathname();

	return (
		<>
			<HeaderConecta />

			<nav className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 md:hidden">
				<div className="glass grid grid-cols-4 rounded-2xl px-1 py-1.5">
					{ENLACES.map(({ href, etiqueta, icono }) => {
						// "/" es la home pero también el prefijo de todo lo
						// demás, así que se compara exacto; el resto por
						// prefijo, para que /negocios/[slug] deje "Negocios"
						// encendido dentro de la ficha.
						const activo =
							href === "/"
								? pathname === "/"
								: pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={activo ? "page" : undefined}
								className={`flex flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] transition-colors ${
									activo
										? "font-bold text-leaf"
										: "font-medium text-muted-foreground hover:text-leaf"
								}`}
							>
								<Icono nombre={icono} />
								{etiqueta}
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
