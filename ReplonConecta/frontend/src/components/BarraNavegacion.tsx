"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderConecta from "@/components/HeaderConecta";

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

function Icono({
	nombre,
}: {
	nombre: "inicio" | "negocios" | "negocio" | "perfil" | "turismo" | "fondo";
}) {
	const clase = "h-[21px] w-[21px]";
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
		case "turismo":
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" strokeLinejoin="round" />
					<circle cx="12" cy="10.4" r="2.4" />
				</svg>
			);
		case "fondo":
			// Brote: "capital semilla", que es lo que ofrece el Fondo.
			return (
				<svg className={clase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M12 21v-9" strokeLinecap="round" />
					<path d="M12 12c4.4 0 8-3.6 8-8-4.4 0-8 3.6-8 8z" strokeLinejoin="round" />
					<path d="M12 15c-3.3 0-6-2.7-6-6 3.3 0 6 2.7 6 6z" strokeLinejoin="round" />
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
	{ href: "/#turismo", etiqueta: "Turismo", icono: "turismo" },
	{ href: "/fondo-emprender", etiqueta: "Fondo", icono: "fondo" },
	{ href: "/vendedor", etiqueta: "Mi tienda", icono: "negocio" },
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
				className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 md:hidden"
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
								<Icono nombre={icono} />
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
