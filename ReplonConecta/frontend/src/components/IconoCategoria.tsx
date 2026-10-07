import type { Categoria } from "@/lib/tipos";

/*
 * Icono de una categoría, en trazo y a la medida de quien lo pida.
 *
 * La clave sale del campo `icono` que el backend guarda por categoría
 * ("pan", "drogueria", "ferreteria"…). Si una categoría nueva llega sin
 * clave conocida, se intenta por nombre antes de caer a la etiqueta:
 * nunca se ve un hueco.
 */

const TRAZO = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.8,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
};

function dibujo(categoria: Categoria): React.ReactNode {
	const clave = (categoria.icono ?? "").trim().toLowerCase();

	const ETIQUETA = (
		<>
			<path d="M3 12.5V5a2 2 0 0 1 2-2h7.5L21 11.5 12.5 20 3 12.5z" />
			<circle cx="8" cy="8" r="1.4" />
		</>
	);

	const dibujos: Record<string, React.ReactNode> = {
		pan: (
			<>
				<path d="M4 11.5c0-3 2.5-5 5.5-5h5c3 0 5.5 2 5.5 5v.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 12z" />
				<path d="M9 7v7M12 7v7M15 7v7" />
			</>
		),
		tienda: (
			<>
				<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" />
				<path d="M3 9.5 4.8 4.5h14.4L21 9.5" />
				<path d="M9.5 20v-5.5h5V20" />
			</>
		),
		drogueria: (
			<>
				<rect x="3" y="7.5" width="18" height="9" rx="4.5" />
				<path d="M12 10v4M10 12h4" />
			</>
		),
		ferreteria: (
			<path d="M20 5.2a4.6 4.6 0 0 1-6.1 6.1l-7 7a2.2 2.2 0 0 1-3.1-3.1l7-7A4.6 4.6 0 0 1 17 2.1L14.4 4.7l1 3.6 3.6 1z" />
		),
		campo: (
			<>
				<path d="M12 20.5v-7.5" />
				<path d="M12 13c0-3.3-2.4-5.7-5.7-5.7C6.3 10.6 8.7 13 12 13z" />
				<path d="M12 13c0-3.3 2.4-5.7 5.7-5.7C17.7 10.6 15.3 13 12 13z" />
			</>
		),
		pesca: (
			<>
				<path d="M3.5 12c2.6-3.4 6.1-5.1 10.5-5.1 3 0 5.4 1.5 6.5 4.4-1.1 2.9-3.5 4.4-6.5 4.4-4.4 0-7.9-1.7-10.5-3.7z" />
				<path d="M20.5 11.3 22.5 8v8l-2-3.3" strokeLinejoin="round" />
				<circle cx="8.3" cy="11.2" r="0.9" fill="currentColor" stroke="none" />
			</>
		),
		turismo: (
			<>
				<path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" />
				<circle cx="12" cy="10.4" r="2.4" />
			</>
		),
		aseo: (
			<>
				<path d="M12 3.5 13.7 8l4.5 1.7-4.5 1.7L12 16l-1.7-4.6L5.8 9.7 10.3 8z" />
				<path d="M18.5 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
			</>
		),
		bebida: (
			<>
				<path d="M6.5 8.5h10v5.5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4z" />
				<path d="M16.5 9.5H18a2.3 2.3 0 0 1 0 4.6h-1.5" />
				<path d="M9 4.5v2M12 3.5v3M15 4.5v2" />
			</>
		),
		ropa: (
			<path d="M9 4.5 12 6.5l3-2 5 2.8-2 3.2-1.6-.8V19.5H7.6v-9.8L6 10.5 4 7.3z" />
		),
		servicio: (
			<>
				<circle cx="12" cy="12" r="3.2" />
				<path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M6 6l1.9 1.9M16.1 16.1 18 18M18 6l-1.9 1.9M7.9 16.1 6 18" />
			</>
		),
	};

	if (clave in dibujos) return dibujos[clave];

	const nombre = categoria.nombre.toLowerCase();
	if (nombre.includes("pan") || nombre.includes("comida")) return dibujos.pan;
	if (nombre.includes("tienda") || nombre.includes("merc")) return dibujos.tienda;
	if (nombre.includes("drogu")) return dibujos.drogueria;
	if (nombre.includes("ferr")) return dibujos.ferreteria;

	return ETIQUETA;
}

export function IconoCategoria({
	categoria,
	className = "h-4 w-4",
}: {
	categoria: Categoria;
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			aria-hidden
			focusable="false"
			{...TRAZO}
		>
			{dibujo(categoria)}
		</svg>
	);
}
