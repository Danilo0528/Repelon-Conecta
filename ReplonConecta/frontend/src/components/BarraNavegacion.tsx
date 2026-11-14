"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderConecta from "@/components/HeaderConecta";

/*
 * Barra de navegación inferior móvil — diseño Material.
 * 5 destinos: Inicio, Comercios, Turismo, SENA, Mi Negocio.
 * Fondo #fbfbf9/90 con backdrop-blur, sombra arriba.
 */

const ENLACES = [
	{
		href: "/",
		label: "Inicio",
		icon: (
			<svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />
			</svg>
		),
	},
	{
		href: "/negocios",
		label: "Comercios",
		icon: (
			<svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16" />
			</svg>
		),
	},
	{
		href: "/#turismo",
		label: "Turismo",
		icon: (
			<svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M12 21s7-6 7-11a7 7 0 00-14 0c0 5 7 11 7 11z" />
				<circle cx="12" cy="10" r="2.5" />
			</svg>
		),
	},
	{
		href: "/cultura",
		label: "Cultura",
		icon: (
			<svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M9 18V5l12-2v13" />
				<circle cx="6" cy="18" r="3" />
				<circle cx="18" cy="16" r="3" />
			</svg>
		),
	},
	{
		href: "/vendedor",
		label: "Mi Negocio",
		icon: (
			<svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
				<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
			</svg>
		),
	},
];

export default function BarraNavegacion() {
	const pathname = usePathname();
	if (pathname.startsWith("/admin")) return null;

	return (
		<>
			<HeaderConecta />

			<nav
				aria-label="Navegación principal"
				className="fixed inset-x-0 bottom-0 z-cromo md:hidden"
				style={{
					background: "rgba(251,251,249,0.92)",
					backdropFilter: "blur(20px)",
					boxShadow: "0 -2px 12px rgba(7,27,47,0.06)",
					paddingBottom: "env(safe-area-inset-bottom, 0px)",
				}}
			>
				<div className="flex h-16 items-center justify-around px-1">
					{ENLACES.map(({ href, label, icon }) => {
						const activo = href === "/"
							? pathname === "/"
							: !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
						return (
							<Link key={href} href={href}
								aria-current={activo ? "page" : undefined}
								className="flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 py-1 transition-colors"
								style={{ color: activo ? "#006d23" : "#3e4a3d" }}>
								{icon}
								<span className="text-[11px] font-bold leading-none" style={{ letterSpacing: "0.04em" }}>
									{label}
								</span>
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
