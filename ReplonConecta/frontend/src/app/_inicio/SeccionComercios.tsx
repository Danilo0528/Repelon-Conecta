"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { StoreCard } from "@/components/StoreCard";
import type { InicioState } from "./useInicio";

const ACCESOS_CATEGORIA = [
	{ nombre: "Agro", icono: "agro", href: "/negocios" },
	{ nombre: "Pesca", icono: "pesca", href: "/negocios" },
	{ nombre: "Turismo", icono: "turismo", href: "/#turismo" },
] as const;

type IconoAcceso = (typeof ACCESOS_CATEGORIA)[number]["icono"];

function IconoCategoriaAcceso({ tipo }: { tipo: IconoAcceso }) {
	let dibujo: ReactNode;

	switch (tipo) {
		case "agro":
			dibujo = <><path d="M12 21v-8" /><path d="M12 13C5.5 13 3 8.5 3 4c6.5 0 9 4 9 9Z" /><path d="M12 13c0-6 3-9 9-9 0 5.5-3 9-9 9Z" /></>;
			break;
		case "pesca":
			dibujo = <><path d="M2.5 12c2.6-3.5 6.1-5.2 10.5-5.2 3 0 5.5 1.5 6.6 4.5-1.1 3-3.6 4.5-6.6 4.5-4.4 0-7.9-1.7-10.5-3.8Z" /><path d="m19.5 11.3 2.8-2.5v6.4l-2.8-2.5" /><circle cx="8" cy="10.8" r=".8" fill="currentColor" stroke="none" /></>;
			break;
		case "turismo":
			dibujo = <><path d="M12 21V10" /><path d="M12 10C9 4.5 5 3 2.5 4c1.2 4.1 4.3 6.2 9.5 6Z" /><path d="M12 10c3-5.5 7-7 9.5-6-1.2 4.1-4.3 6.2-9.5 6Z" /><path d="M12 9c-1.5-4.2-1.3-6.2 0-7.5 1.4 1.4 1.5 3.5 0 7.5Z" /></>;
	}

	return (
		<svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
			{dibujo}
		</svg>
	);
}

function TarjetaCargando() {
	return (
		<article aria-hidden className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white sm:block">
			<div className="h-36 animate-pulse bg-gradient-to-br from-emerald-100 via-emerald-50 to-sky-100 sm:h-40" />
			<div className="animate-pulse px-3 pb-3 pt-3">
				<div className="h-4 w-3/5 rounded bg-slate-200" />
				<div className="mt-2 h-3 w-full rounded bg-slate-100" />
				<div className="mt-1 h-3 w-4/5 rounded bg-slate-100" />
				<div className="mt-3 h-9 rounded-full bg-emerald-50" />
			</div>
		</article>
	);
}

/** Buscador principal, categorías del alcance y comercios del catálogo local. */
export function SeccionComercios({ inicio }: { inicio: InicioState }) {
	const router = useRouter();
	const { texto, setTexto, soloAbiertos, setSoloAbiertos, negocios, lista, filtrados } = inicio;
	const destacados = filtrados.filter((negocio) => negocio.destacado);
	const hayFiltro = texto.trim().length > 0 || soloAbiertos;
	const paraMostrar = (hayFiltro || destacados.length === 0 ? filtrados : destacados).slice(0, 4);

	return (
		<section className="relative z-20 mx-auto mt-1 w-full max-w-6xl px-4 sm:-mt-8 sm:px-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const consulta = texto.trim();
					router.push(consulta ? `/buscar?q=${encodeURIComponent(consulta)}` : "/buscar");
				}}
				role="search"
				className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-[#e9e5d9] bg-white px-3 py-1 shadow-[0_5px_18px_-16px_rgba(23,61,50,.5)] sm:rounded-2xl sm:pl-4"
			>
				<svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[#173d32] sm:size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
					<circle cx="11" cy="11" r="7" />
					<path d="m16.5 16.5 4 4" strokeLinecap="round" />
				</svg>
				<label htmlFor="busqueda-inicio" className="sr-only">Buscar comercios y productos en Repelón</label>
				<input
					id="busqueda-inicio"
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="¿Qué estás buscando hoy?"
					enterKeyHint="search"
					className="min-h-10 min-w-0 w-full bg-transparent text-[13px] text-[#18352b] outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#0f47af]/40 sm:text-base"
				/>
				<button type="submit" aria-label="Buscar" className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#173d32] text-white transition hover:bg-[#245642] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af]">
					<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
						<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</form>

			<nav aria-label="Categorías para explorar" className="mx-auto mt-2 max-w-5xl">
				<ul className="grid grid-cols-3 gap-2 sm:gap-3">
					{ACCESOS_CATEGORIA.map(({ nombre, icono, href }) => (
						<li key={nombre} className="min-w-0">
							<Link
								href={href}
								className="flex min-h-11 flex-row items-center justify-center gap-1.5 rounded-xl border border-[#e9e5d9] bg-white px-1.5 text-center text-[10px] font-semibold leading-tight text-[#234537] transition hover:border-[#b8d0bd] hover:bg-[#f7faf5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] sm:min-h-28 sm:flex-col sm:gap-2 sm:rounded-2xl sm:text-sm"
							>
								<span className={`grid size-4 shrink-0 place-items-center ${icono === "pesca" ? "text-[#0f47af]" : "text-[#0a7133]"} sm:size-10`}>
									<IconoCategoriaAcceso tipo={icono} />
								</span>
								<span className="w-full truncate">{nombre}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<div className="mt-5 sm:mt-12 md:mt-16">
				<div className="mb-2 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
					<h2 className="whitespace-nowrap font-display text-base font-semibold leading-tight tracking-[-0.02em] text-[#173d32] min-[380px]:text-lg sm:text-2xl md:text-3xl">
						{hayFiltro ? "Comercios encontrados" : "Comercios destacados"}
					</h2>
					{negocios.cargando && !negocios.error && lista.length === 0 ? (
						<span role="status" className="shrink-0 text-[10px] font-medium text-[#66746a] min-[380px]:text-xs">Cargando…</span>
					) : (
						<Link
							href="/negocios"
							className="inline-flex min-h-8 shrink-0 items-center gap-1 text-[11px] font-bold text-[#0a7133] hover:underline min-[380px]:text-xs sm:min-h-10 sm:text-sm"
						>
							Ver todos
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
					)}
				</div>

				<div className="mb-3 hidden gap-2 sm:flex">
					<button
						type="button"
						onClick={() => setSoloAbiertos(false)}
						aria-pressed={!soloAbiertos}
						className={`min-h-8 rounded-full px-3 text-[11px] font-semibold transition ${!soloAbiertos ? "bg-[#eaf5ef] text-[#0a7133]" : "bg-white text-slate-600 hover:bg-slate-100"}`}
					>
						Todos
					</button>
					<button
						type="button"
						onClick={() => setSoloAbiertos(true)}
						aria-pressed={soloAbiertos}
						className={`min-h-8 rounded-full px-3 text-[11px] font-semibold transition ${soloAbiertos ? "bg-[#eaf5ef] text-[#0a7133]" : "bg-white text-slate-600 hover:bg-slate-100"}`}
					>
						Abiertos ahora
					</button>
				</div>

				{negocios.error && (
					<div role="status" className="mb-3 flex items-center gap-2.5 rounded-xl border border-[#ebe7dc] bg-[#faf9f5] px-3 py-2.5">
						<span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#eeeade] text-[#536b4c]" aria-hidden>
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 19.5h16M6 19.5V9l6-4.5L18 9v10.5M9 19.5v-6h6v6" />
							</svg>
						</span>
						<p className="text-[11px] leading-snug text-[#56645a]">No pudimos cargar el directorio. Intenta de nuevo más tarde.</p>
					</div>
				)}

				<div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
					{negocios.cargando && !negocios.error && lista.length === 0 &&
						Array.from({ length: 2 }).map((_, i) => <TarjetaCargando key={i} />)}
					{paraMostrar.map((negocio) => <StoreCard key={negocio.id} n={negocio} />)}
				</div>

				{!negocios.cargando && !negocios.error && paraMostrar.length === 0 && (
					<p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-slate-600">No encontramos comercios destacados.</p>
				)}
			</div>
		</section>
	);
}
