"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { IconoNav, type NombreIconoNav } from "@/components/IconoNav";
import { useCarrito } from "@/context/CarritoContext";
import { COMPRAS_ACTIVAS } from "@/lib/compras";

import BuscadorNav from "./BuscadorNav";

const DESTINOS: { href: string; etiqueta: string; icono: NombreIconoNav }[] = [
	{ href: "/negocios", etiqueta: "Comercios", icono: "comercios" },
	{ href: "/#turismo", etiqueta: "Turismo", icono: "turismo" },
	{ href: "/cultura", etiqueta: "Cultura", icono: "cultura" },
	{ href: "/fondo-emprender", etiqueta: "Fondo Emprender", icono: "fondo" },
	...(COMPRAS_ACTIVAS
		? [{ href: "/pedidos", etiqueta: "Pedidos", icono: "pedidos" as const }]
		: []),
	{ href: "/vendedor", etiqueta: "Mi negocio", icono: "negocio" },
];

function CenefaBandera() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 853 225"
			preserveAspectRatio="none"
			className="pointer-events-none absolute inset-0 size-full"
		>
			<path fill="#fff" d="M0 0h853v225H0z" />
			<path
				fill="#0f47af"
				d="M648 0h205v176c-82-42-157-52-233-28-87 27-161 65-260 77 133-78 218-157 288-225Z"
			/>
			<path
				fill="#078930"
				d="M561 0h89c35 71-74 143-338 225 159-87 306-152 249-225Z"
			/>
			<path
				fill="#fff"
				d="M0 210c143 24 276 25 410-8 179-44 311-116 443-121v16c-127 9-258 84-438 126-139 32-279 31-415 2Z"
			/>
			<path
				fill="#0f47af"
				d="M0 221c159 28 292 19 425-15 177-45 312-117 428-119v15c-127 9-258 84-438 126-139 32-279 31-415 2Z"
			/>
		</svg>
	);
}

export default function HeaderConecta() {
	const { cantidadTotal } = useCarrito();
	const pathname = usePathname();
	const [menuAbierto, setMenuAbierto] = useState(false);

	return (
		<header className="sticky top-0 z-cromo w-full">
			<nav
				aria-label="Navegación principal"
				className="relative isolate flex h-[82px] items-end gap-2 overflow-visible px-3 pb-2 sm:px-6 md:h-24 lg:px-8"
			>
				<CenefaBandera />
				<Link
					href="/"
					className="relative z-10 flex shrink-0 items-center"
					aria-label="Repelón Conecta, inicio"
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/img/logo-repelon-conecta-transparente.png"
						alt="Repelón Conecta"
						className="h-9 w-[104px] object-contain md:size-14"
					/>
				</Link>

				<div className="relative z-10 ml-2 hidden items-center gap-1 md:flex">
					{DESTINOS.map(({ href, etiqueta, icono }) => {
						const activo =
							!href.includes("#") &&
							(pathname === href || pathname.startsWith(`${href}/`));
						return (
							<Link
								key={href}
								href={href}
								aria-current={activo ? "page" : undefined}
								className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm leading-none transition-colors ${
									activo
										? "bg-[#078930] font-semibold text-white"
										: "font-medium text-[#12366a] hover:bg-white/60"
								}`}
							>
								<IconoNav nombre={icono} className="hidden size-[17px] shrink-0 xl:block" />
								{etiqueta}
							</Link>
						);
					})}
				</div>

				<BuscadorNav />

				<div className="relative z-10 flex items-center gap-2">
					<span aria-hidden className="hidden h-6 w-px bg-[#12366a]/15 md:block" />
					<button
						type="button"
						onClick={() => setMenuAbierto((abierto) => !abierto)}
						aria-expanded={menuAbierto}
						aria-controls="menu-destinos-movil"
						aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
						className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/95 text-[#12366a] shadow-[0_6px_16px_-10px_rgba(16,45,70,.65)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] md:hidden"
					>
						<svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
							{menuAbierto ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
						</svg>
					</button>
					<Link
						href="/perfil"
						className="hidden size-10 place-items-center rounded-xl bg-white/90 text-[#12366a] transition hover:bg-white sm:grid"
						aria-label="Perfil"
					>
						<IconoNav nombre="perfil" />
					</Link>
					{COMPRAS_ACTIVAS && (
						<Link
							href="/carrito"
							className="relative grid size-10 place-items-center rounded-xl bg-white/90 text-[#12366a] transition hover:bg-white"
							aria-label={cantidadTotal > 0 ? `Carrito, ${cantidadTotal} ítems` : "Carrito vacío"}
						>
							<IconoNav nombre="carrito" />
							{cantidadTotal > 0 && (
								<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#078930] px-1 text-[11px] font-bold leading-none text-white">
									{cantidadTotal}
								</span>
							)}
						</Link>
					)}
				</div>
			</nav>

			{menuAbierto && (
				<nav
					id="menu-destinos-movil"
					aria-label="Más destinos"
					className="absolute inset-x-3 top-full z-cromo mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden"
				>
					<p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-[#0a7133]">Explora Repelón</p>
					<div className="grid grid-cols-2 gap-1">
						{DESTINOS.map(({ href, etiqueta, icono }) => (
							<Link
								key={href}
								href={href}
								onClick={() => setMenuAbierto(false)}
								className="flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-[#12366a] transition hover:bg-[#f4f6fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af]"
							>
								<IconoNav nombre={icono} className="size-[18px] shrink-0" />
								<span className="truncate">{etiqueta}</span>
							</Link>
						))}
					</div>
					<button
						type="button"
						onClick={() => {
							setMenuAbierto(false);
							window.dispatchEvent(new Event("repelon:open-chat"));
						}}
						className="mt-1 flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm font-semibold text-[#0a7133] transition hover:bg-[#eaf5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930]"
					>
						<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
							<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z" strokeLinejoin="round" />
						</svg>
						Asistente IA
					</button>
				</nav>
			)}
		</header>
	);
}
