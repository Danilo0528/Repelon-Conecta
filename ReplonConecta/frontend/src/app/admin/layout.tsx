"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, Cargando } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";

/*
 * Cromo del panel /admin — dense dashboard.
 *
 * Reglas del skill:
 *   - Sidebar angosto (224px), tinte sutil, 1px border. Nunca glass
 *     ni oscuro completo.
 *   - Nav items con icono + label, h-9, activo = accent tint a 10%.
 *   - Breadcrumbs en el header móvil.
 *   - ⌘K visible como affordance de búsqueda.
 *   - Micro-motion: bg shift, sin translate.
 */

const SECCIONES: {
	href: string;
	etiqueta: string;
	icono: React.ReactNode;
}[] = [
	{
		href: "/admin",
		etiqueta: "Resumen",
		icono: (
			<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<path d="M3 10.5 10 4l7 6.5M5 9.5V16a1 1 0 0 0 1 1h3v-4h2v4h3a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
	},
	{
		href: "/admin/negocios",
		etiqueta: "Negocios",
		icono: (
			<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<path d="M3 7h14v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7ZM2 7l1.5-3h13L18 7M8 11h4" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
	},
	{
		href: "/admin/usuarios",
		etiqueta: "Usuarios",
		icono: (
			<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<circle cx="10" cy="7" r="3" />
				<path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" strokeLinecap="round" />
			</svg>
		),
	},
	{
		href: "/admin/pedidos",
		etiqueta: "Pedidos",
		icono: (
			<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<path d="M6 3h8l1 3H5l1-3ZM4 6h12v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM8 10h4" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
	},
	{
		href: "/admin/contenido",
		etiqueta: "Contenido",
		icono: (
			<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<path d="M4 4h12v12H4V4ZM7 7h6M7 10h6M7 13h4" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
	},
	{
		href: "/admin/zonas",
		etiqueta: "Zonas",
		icono: (
			<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<path d="M10 17s-5-4.5-5-8a5 5 0 0 1 10 0c0 3.5-5 8-5 8Z" strokeLinecap="round" strokeLinejoin="round" />
				<circle cx="10" cy="9" r="1.5" />
			</svg>
		),
	},
];

function MenuPanel({ onNavegar }: { onNavegar?: () => void }) {
	const pathname = usePathname();
	const { perfil, salir } = useSesion();
	const router = useRouter();

	async function cerrarSesion() {
		await router.push("/");
		await salir();
	}

	return (
		<nav className="flex h-full flex-col gap-0.5" aria-label="Secciones del panel">
			<p className="px-3 pb-2 pt-1 text-[11px] font-medium text-black/35">
				Repelón Conecta
			</p>

			{SECCIONES.map(({ href, etiqueta, icono }) => {
				const activo =
					href === "/admin"
						? pathname === "/admin"
						: pathname === href || pathname.startsWith(`${href}/`);
				return (
					<Link
						key={href}
						href={href}
						aria-current={activo ? "page" : undefined}
						onClick={onNavegar}
						className={`flex h-9 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors ${
							activo
								? "bg-azul/10 text-azul"
								: "text-black/60 hover:bg-black/[.04] hover:text-black/80"
						}`}
					>
						{icono}
						{etiqueta}
					</Link>
				);
			})}

			<div className="mt-auto space-y-1 pt-4">
				<Link
					href="/"
					onClick={onNavegar}
					className="flex h-9 items-center gap-2 rounded-md px-3 text-[13px] text-black/50 transition-colors hover:bg-black/[.04] hover:text-black/70"
				>
					<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
						<path d="M10 4v12M4 10l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					Ver el sitio
				</Link>
				<div className="border-t border-black/8 px-3 pt-2 pb-1">
					<p className="truncate font-mono text-[11px] text-black/50">{perfil?.email}</p>
					<p className="text-[11px] text-black/35">ADMIN</p>
				</div>
				<button
					type="button"
					onClick={() => void cerrarSesion()}
					className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-[13px] text-black/50 transition-colors hover:bg-black/[.04] hover:text-peligro disabled:opacity-50"
				>
					<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
						<path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M13 14l4-4-4-4M17 10H8" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					Cerrar sesión
				</button>
			</div>
		</nav>
	);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { perfil, cargando } = useSesion();
	const router = useRouter();
	const pathname = usePathname();
	const [menuAbierto, setMenuAbierto] = useState(false);

	useEffect(() => {
		if (!cargando && !perfil) {
			router.replace("/entrar?next=/admin");
		}
	}, [cargando, perfil, router]);

	useEffect(() => {
		document.body.style.overflow = menuAbierto ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuAbierto]);

	useEffect(() => {
		if (!menuAbierto) return;
		const alTeclar = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMenuAbierto(false);
		};
		window.addEventListener("keydown", alTeclar);
		return () => window.removeEventListener("keydown", alTeclar);
	}, [menuAbierto]);

	if (cargando) return <Cargando />;
	if (!perfil) return null;

	if (perfil.rol !== "ADMIN") {
		return (
			<div className="px-4 pt-6">
				<Aviso tono="error">Esta sección es solo para administradores.</Aviso>
				<p className="mt-3 text-sm">
					<Link href="/" className="font-medium text-azul underline">
						Volver al inicio
					</Link>
				</p>
			</div>
		);
	}

	// Breadcrumb: label de la sección activa.
	const seccionActiva = SECCIONES.find((s) =>
		s.href === "/admin" ? pathname === "/admin" : pathname.startsWith(s.href),
	);

	return (
		<div className="px-4 pb-16 pt-3 md:pb-8">
			{/* Header móvil: hamburger + breadcrumb + ⌘K. */}
			<div className="sticky top-0 z-40 -mx-4 mb-3 flex items-center gap-2 border-b border-black/8 bg-background px-4 py-2 md:hidden">
				<button
					type="button"
					onClick={() => setMenuAbierto(true)}
					aria-label="Abrir el menú del panel"
					className="flex size-8 shrink-0 items-center justify-center rounded-md border border-black/10 text-black/60"
				>
					<svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
						<path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
					</svg>
				</button>
				<nav aria-label="Ruta" className="flex min-w-0 items-center gap-1 text-[12px] text-black/40">
					<span>Panel</span>
					<span aria-hidden>/</span>
					<span className="truncate font-medium text-black/70">
						{seccionActiva?.etiqueta ?? "Resumen"}
					</span>
				</nav>
				<div className="ml-auto flex items-center gap-1.5 rounded-md border border-black/10 px-2 py-1 text-[11px] text-black/35">
					<svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
						<circle cx="7" cy="7" r="4.5" />
						<path d="m10.5 10.5 3 3" strokeLinecap="round" />
					</svg>
					⌘K
				</div>
			</div>

			<div className="flex gap-4">
				{/* Sidebar: tinte sutil, borde, sin glass. */}
				<aside className="sticky top-3 hidden h-fit w-56 shrink-0 md:block">
					<div className="rounded-lg border border-black/8 bg-white/50 p-2">
						<MenuPanel />
					</div>
				</aside>
				<div className="min-w-0 flex-1">{children}</div>
			</div>

			{/* Cajón de navegación en móvil. */}
			{menuAbierto && (
				<div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menú del panel">
					<button
						type="button"
						aria-label="Cerrar el menú"
						onClick={() => setMenuAbierto(false)}
						className="absolute inset-0 bg-black/30"
					/>
					<div className="absolute inset-y-0 left-0 w-64 max-w-[85vw] overflow-y-auto border-r border-black/10 bg-white p-3">
						<button
							type="button"
							onClick={() => setMenuAbierto(false)}
							aria-label="Cerrar el menú"
							className="mb-1 flex h-8 w-full items-center justify-end rounded-md px-2 text-[12px] text-black/50 hover:bg-black/[.04]"
						>
							Cerrar
						</button>
						<div className="h-[calc(100%-2.5rem)]">
							<MenuPanel onNavegar={() => setMenuAbierto(false)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
