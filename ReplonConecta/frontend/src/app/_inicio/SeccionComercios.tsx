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

	return (
		<section className="relative z-20 mx-auto -mt-8 w-full max-w-6xl px-4 sm:px-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const consulta = texto.trim();
					router.push(consulta ? `/buscar?q=${encodeURIComponent(consulta)}` : "/buscar");
				}}
				role="search"
				className="mx-auto flex max-w-3xl flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_18px_45px_-24px_rgba(16,45,70,.45)] sm:flex-row sm:items-center sm:rounded-full sm:pl-5"
			>
				<svg
					viewBox="0 0 24 24"
					className="ml-2 hidden size-5 shrink-0 text-[#0f47af] sm:block"
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
					className="min-h-12 w-full rounded-xl bg-transparent px-3 text-base text-[#102d46] outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#0f47af]/40 sm:rounded-full"
				/>
				<button
					type="submit"
					className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#078930] px-7 text-sm font-bold text-white transition hover:bg-[#06782a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930] active:scale-[.98] sm:rounded-full"
				>
					Buscar
				</button>
			</form>

			{(categorias.datos ?? []).filter((categoria) => enAlcance(categoria.slug)).length > 0 && (
				<nav aria-label="Categorías de comercios" className="mx-auto mt-4 max-w-5xl">
					<ul className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/90 p-2 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center sm:gap-3">
						{(categorias.datos ?? [])
							.filter((categoria) => enAlcance(categoria.slug))
							.map((categoria) => (
								<li key={categoria.id} className="shrink-0">
									<Link
										href="/negocios"
										className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#17324d] transition hover:bg-[#eaf5ef] hover:text-[#0a7133] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af]"
									>
										<span className="grid size-8 place-items-center rounded-full bg-[#eaf5ef] text-[#0a7133]">
											<IconoCategoria categoria={categoria} className="size-[18px]" />
										</span>
										{categoria.nombre}
									</Link>
								</li>
							))}
					</ul>
				</nav>
			)}

			<div className="mt-12 md:mt-16">
				<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0a7133]">Lo nuestro, más cerca</p>
						<h2 className="mt-1 font-display text-2xl font-semibold text-[#102d46] md:text-3xl">
							{hayFiltro ? "Comercios encontrados" : "Comercios destacados"}
						</h2>
					</div>
					<div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
						<button
							type="button"
							onClick={() => setSoloAbiertos(false)}
							aria-pressed={!soloAbiertos}
							className={`min-h-10 rounded-full px-4 transition ${!soloAbiertos ? "bg-[#eaf5ef] text-[#0a7133]" : "bg-white text-slate-600 hover:bg-slate-100"}`}
						>
							Todos
						</button>
						<button
							type="button"
							onClick={() => setSoloAbiertos(true)}
							aria-pressed={soloAbiertos}
							className={`min-h-10 rounded-full px-4 transition ${soloAbiertos ? "bg-[#eaf5ef] text-[#0a7133]" : "bg-white text-slate-600 hover:bg-slate-100"}`}
						>
							Abiertos ahora
						</button>
					</div>
				</div>

				{negocios.error && (
					<Aviso tono="error">No se pudo cargar el catálogo: {negocios.error}</Aviso>
				)}

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{negocios.cargando && lista.length === 0 &&
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white" />
						))}
					{paraMostrar.map((negocio) => (
						<StoreCard key={negocio.id} n={negocio} />
					))}
				</div>

				{!negocios.cargando && !negocios.error && paraMostrar.length === 0 && (
					<p className="rounded-2xl bg-white px-4 py-8 text-center text-slate-600">
						No encontramos resultados.
					</p>
				)}

				<div className="mt-6 text-center">
					<Link
						href="/negocios"
						className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0a7133]/30 bg-white px-6 py-3 font-semibold text-[#0a7133] transition hover:bg-[#eaf5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af]"
					>
						Ver todos los comercios
						<svg viewBox="0 0 24 24" className="ml-2 size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
							<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
				</div>
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
