"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, Cargando } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";

/*
 * Cromo del panel /admin: guard, navegación y sesión.
 *
 * Estructura estándar de panel de administración:
 *
 *   - El guard de sesión/rol vive ACÁ, en el layout, y no deja montar
 *     ninguna página hija hasta que el perfil sea ADMIN. Así las
 *     llamadas a /api/admin/* nunca salen de un usuario sin rol (antes
 *     se disparaban antes de comprobar el rol).
 *   - Sidebar fijo en PC y cajón (drawer) en móvil con las secciones
 *     del panel: Resumen, Negocios, Usuarios, Pedidos, Contenido y
 *     Zonas turísticas — una por tema del panel, en orden de uso
 *     (operación diaria primero, contenido del home al final).
 *   - Pie con "Conectado como …", el rol y Cerrar sesión: el panel se
 *     autoexplica, sin tener que ir a /perfil para salir.
 *   - La navegación pública (HeaderConecta + barra inferior) se oculta
 *     en /admin* (BarraNavegacion): acá manda el cromo del panel.
 */

const SECCIONES: { href: string; etiqueta: string }[] = [
	{ href: "/admin", etiqueta: "Resumen" },
	{ href: "/admin/negocios", etiqueta: "Negocios" },
	{ href: "/admin/usuarios", etiqueta: "Usuarios" },
	{ href: "/admin/pedidos", etiqueta: "Pedidos" },
	{ href: "/admin/contenido", etiqueta: "Contenido" },
	{ href: "/admin/zonas", etiqueta: "Zonas turísticas" },
];

function MenuPanel({ onNavegar }: { onNavegar?: () => void }) {
	const pathname = usePathname();
	const { perfil, salir } = useSesion();
	const router = useRouter();

	async function cerrarSesion() {
		// Navegar ANTES de matar la sesión: si se mata primero, el guard
		// de este layout (perfil → null) dispara su redirección y corre
		// con el push, y el cierre queda sin destino fijo.
		await router.push("/");
		await salir();
	}

	return (
		<nav className="flex h-full flex-col gap-1" aria-label="Secciones del panel">
			<p className="px-3 pb-2 pt-1 font-display text-xs font-semibold uppercase tracking-wide text-black/45">
				Repelón Conecta · Panel
			</p>

			{SECCIONES.map(({ href, etiqueta }) => {
				// "/" del admin es /admin exacto; el resto por prefijo.
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
						className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
							activo
								? "bg-azul text-white"
								: "text-black/70 hover:bg-black/[.05]"
						}`}
					>
						{etiqueta}
					</Link>
				);
			})}

			<div className="mt-auto space-y-2 pt-6">
				<Link
					href="/"
					onClick={onNavegar}
					className="block rounded-xl px-3 py-2.5 text-sm font-medium text-black/60 hover:bg-black/[.05]"
				>
					Ver el sitio
				</Link>
				<div className="rounded-xl bg-black/[.05] px-3 py-2.5">
					<p className="truncate text-xs font-semibold">{perfil?.email}</p>
					<p className="text-[11px] text-black/50">Conectado como ADMIN</p>
				</div>
				<button
					type="button"
					onClick={() => void cerrarSesion()}
					className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm font-semibold text-black/70 disabled:opacity-50"
				>
					Cerrar sesión
				</button>
			</div>
		</nav>
	);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { perfil, cargando } = useSesion();
	const router = useRouter();
	const [menuAbierto, setMenuAbierto] = useState(false);

	useEffect(() => {
		if (!cargando && !perfil) {
			router.replace("/entrar?next=/admin");
		}
	}, [cargando, perfil, router]);

	// El fondo no rueda con el cajón abierto (mismo patrón que la
	// ventana flotante del home).
	useEffect(() => {
		document.body.style.overflow = menuAbierto ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuAbierto]);

	// Escape cierra el cajón; el listener se registra solo abierto.
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
					<Link href="/" className="font-semibold text-azul underline">
						Volver al inicio
					</Link>
				</p>
			</div>
		);
	}

	return (
		<div className="px-4 pb-16 pt-4 md:pb-10">
			{/* Barra superior solo en móvil (en PC manda el sidebar). */}
			<div className="sticky top-0 z-40 -mx-4 mb-4 flex items-center gap-3 border-b border-black/10 bg-white/85 px-4 py-3 backdrop-blur md:hidden">
				<button
					type="button"
					onClick={() => setMenuAbierto(true)}
					aria-label="Abrir el menú del panel"
					className="flex min-h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/15 text-black/70"
				>
					<svg
						viewBox="0 0 24 24"
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						aria-hidden
					>
						<path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
					</svg>
				</button>
				<span className="font-display text-sm font-semibold">
					Panel de administración
				</span>
			</div>

			<div className="flex gap-6">
				<aside className="sticky top-4 hidden h-fit w-60 shrink-0 md:block">
					<div className="glass rounded-3xl p-3">
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
					<div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-float">
						<button
							type="button"
							onClick={() => setMenuAbierto(false)}
							aria-label="Cerrar el menú"
							className="mb-2 flex min-h-12 w-full items-center justify-end rounded-xl px-2 text-sm text-black/60"
						>
							Cerrar
						</button>
						<div className="h-[calc(100%-3.5rem)]">
							<MenuPanel onNavegar={() => setMenuAbierto(false)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
