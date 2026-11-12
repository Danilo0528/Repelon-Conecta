"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconoCategoria } from "@/components/IconoCategoria";
import { StoreCard } from "@/components/StoreCard";
import { Aviso } from "@/components/ui";
import { enAlcance } from "@/lib/alcance";
import { supabaseConfigurado } from "@/lib/env";
import type { InicioState } from "./useInicio";

/** Buscador principal, categorías reales y una selección del catálogo local. */
export function SeccionComercios({ inicio }: { inicio: InicioState }) {
	const router = useRouter();
	const {
		texto,
		setTexto,
		soloAbiertos,
		setSoloAbiertos,
		negocios,
		categorias,
		lista,
		filtrados,
	} = inicio;
	const destacados = filtrados.filter((negocio) => negocio.destacado);
	const hayFiltro = texto.trim().length > 0 || soloAbiertos;
	const paraMostrar = (hayFiltro || destacados.length === 0 ? filtrados : destacados).slice(0, 4);
	const categoriasVisibles = (categorias.datos ?? []).filter((categoria) => enAlcance(categoria.slug));

	return (
		<section className="relative z-20 mx-auto -mt-3 w-full max-w-6xl px-4 sm:-mt-8 sm:px-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const consulta = texto.trim();
					router.push(consulta ? `/buscar?q=${encodeURIComponent(consulta)}` : "/buscar");
				}}
				role="search"
				className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-[#d9e3f5] bg-white p-1.5 pl-4 shadow-[0_10px_25px_-18px_rgba(16,45,70,.55)]"
			>
				<svg
					viewBox="0 0 24 24"
					className="size-5 shrink-0 text-[#12366a]"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden
				>
					<circle cx="11" cy="11" r="7" />
					<path d="m16.5 16.5 4 4" strokeLinecap="round" />
				</svg>
				<label htmlFor="busqueda-inicio" className="sr-only">
					Buscar comercios y productos en Repelón
				</label>
				<input
					id="busqueda-inicio"
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="¿Qué estás buscando hoy?"
					enterKeyHint="search"
					className="min-h-11 min-w-0 w-full bg-transparent text-xs text-[#102d46] outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#0f47af]/40 sm:text-base"
				/>
				<button
					type="submit"
					aria-label="Buscar"
					className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-[#078930] px-3 text-sm font-bold text-white transition hover:bg-[#06782a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930] active:scale-[.98] sm:min-w-0 sm:gap-2 sm:px-5"
				>
					<svg viewBox="0 0 24 24" className="size-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
						<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="hidden sm:inline">Buscar</span>
				</button>
			</form>

			{categoriasVisibles.length > 0 && (
				<nav aria-label="Categorías de comercios" className="mx-auto mt-3 max-w-5xl">
					<ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center sm:gap-3">
						{categoriasVisibles.map((categoria) => (
							<li key={categoria.id} className="shrink-0">
								<Link
									href="/negocios"
									className="flex min-h-[76px] min-w-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e7ecf6] bg-[#f4f6fc] px-2 py-2 text-[11px] font-semibold leading-tight text-[#12366a] transition hover:bg-[#eaf5ef] hover:text-[#0a7133] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] sm:min-w-[112px] sm:gap-2 sm:py-3 sm:text-sm"
								>
									<span className="grid size-8 place-items-center text-[#0f47af] sm:size-10">
										<IconoCategoria categoria={categoria} className="size-7 sm:size-9" />
									</span>
									<span className="max-w-[80px] truncate">{categoria.nombre}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			)}

			<div className="mt-7 sm:mt-12 md:mt-16">
				<div className="mb-2 flex items-center justify-between gap-2 sm:mb-4">
					<h2 className="font-display text-base font-semibold leading-tight text-[#102d46] sm:text-2xl md:text-3xl">
						{hayFiltro ? "Comercios encontrados" : "Comercios destacados"}
					</h2>
					<Link
						href="/negocios"
						className="inline-flex min-h-10 shrink-0 items-center gap-1 text-xs font-bold text-[#0a7133] hover:underline sm:text-sm"
					>
						Ver todos
						<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
							<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
				</div>

				<div className="mb-3 flex gap-2">
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

				{negocios.error && <Aviso tono="error">No se pudo cargar el catálogo: {negocios.error}</Aviso>}

				<div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
					{negocios.cargando && lista.length === 0 &&
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white" />
						))}
					{paraMostrar.map((negocio) => <StoreCard key={negocio.id} n={negocio} />)}
				</div>

				{!negocios.cargando && !negocios.error && paraMostrar.length === 0 && (
					<p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-slate-600">No encontramos resultados.</p>
				)}
			</div>

			{!supabaseConfigurado && (
				<div className="mx-auto mt-6 max-w-3xl">
					<Aviso tono="info">
						Falta configurar Supabase en <code>.env.local</code>. Se ve el catálogo, pero no se puede iniciar sesión ni pedir.
					</Aviso>
				</div>
			)}
		</section>
	);
}
