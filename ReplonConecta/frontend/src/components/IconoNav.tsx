/*
 * Iconos de destino de la navegación.
 *
 * Viven en un solo sitio porque la pastilla de la cabecera
 * (HeaderConecta) y la barra inferior del pulgar (BarraNavegacion)
 * pintan los mismos destinos: cuando los dos dibujaban su propio SVG
 * había dos copias del mismo trazo que podían divergir con el tiempo.
 *
 * Mismo oficio para todos: viewBox 24, trazo a 1.8, currentColor,
 * `aria-hidden` (la etiqueta siempre la pone el enlace contenedor).
 */
export type NombreIconoNav =
	| "inicio"
	| "comercios"
	| "carrito"
	| "pedidos"
	| "negocio"
	| "perfil"
	| "turismo"
	| "fondo";

export function IconoNav({
	nombre,
	className = "h-[21px] w-[21px]",
}: {
	nombre: NombreIconoNav;
	className?: string;
}) {
	switch (nombre) {
		case "inicio":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M3.5 11 12 4l8.5 7" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M6 10.2V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.8" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			);
		// Misma tienda que "negocio" del vendedor: el destino de la
		// barra se llama "Negocios" y el de la cabecera "Comercios".
		case "comercios":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
					<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
					<path d="M9.5 20v-5.5h5V20" strokeLinejoin="round" />
				</svg>
			);
		case "carrito":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<circle cx="9" cy="20" r="1.6" />
					<circle cx="18" cy="20" r="1.6" />
					<path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			);
		case "pedidos":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M6 2h12l1 4H5l1-4z" strokeLinejoin="round" />
					<path d="M5 6h14v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6z" strokeLinejoin="round" />
					<path d="M9 11h6" strokeLinecap="round" />
				</svg>
			);
		case "negocio":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<rect x="3.5" y="3.5" width="7" height="7" rx="2" />
					<rect x="13.5" y="3.5" width="7" height="7" rx="2" />
					<rect x="3.5" y="13.5" width="7" height="7" rx="2" />
					<rect x="13.5" y="13.5" width="7" height="7" rx="2" />
				</svg>
			);
		case "perfil":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<circle cx="12" cy="8" r="4" />
					<path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
				</svg>
			);
		case "turismo":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" strokeLinejoin="round" />
					<circle cx="12" cy="10.4" r="2.4" />
				</svg>
			);
		case "fondo":
			// Brote: "capital semilla", que es lo que ofrece el Fondo.
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M12 21v-9" strokeLinecap="round" />
					<path d="M12 12c4.4 0 8-3.6 8-8-4.4 0-8 3.6-8 8z" strokeLinejoin="round" />
					<path d="M12 15c-3.3 0-6-2.7-6-6 3.3 0 6 2.7 6 6z" strokeLinejoin="round" />
				</svg>
			);
	}
}
