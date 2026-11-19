"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { StoreCard } from "@/components/StoreCard";
import { Aviso } from "@/components/ui";
import type { InicioState } from "./useInicio";

/**
 * Rejilla de comercios con buscador local.
 *
 * La caja principal filtra la rejilla mientras se escribe; con Enter (o
 * el botón) abre la pantalla de búsqueda /buscar, que sí llama al
 * endpoint de productos y pinta lista y mapa al mismo tiempo.
 */
export function SeccionComercios({ inicio }: { inicio: InicioState }) {
	const router = useRouter();
	const { texto, setTexto, soloAbiertos, setSoloAbiertos, negocios, lista, filtrados } =
		inicio;

	return (
		<section className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8 md:pt-12">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const consulta = texto.trim();
					router.push(consulta ? `/buscar?q=${encodeURIComponent(consulta)}` : "/buscar");
				}}
				className="glass-soft mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-ink sm:mb-5 sm:gap-3 sm:px-4 sm:py-3 md:mb-6"
			>
				<button
					type="submit"
					aria-label="Buscar productos en el pueblo"
					className="flex h-9 w-9 shrink-0 items-center justify-center text-leaf sm:h-auto sm:w-auto"
				>
					<svg
						viewBox="0 0 24 24"
						className="size-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<circle cx="11" cy="11" r="7" />
						<path d="m16.5 16.5 4 4" strokeLinecap="round" />
					</svg>
				</button>
				<span className="sr-only">Buscar comercios y productos</span>
				<input
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Busca un comercio o producto"
					enterKeyHint="search"
					className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground sm:text-base"
				/>
				<button
					type="submit"
					className="inline-flex min-h-9 shrink-0 items-center rounded-lg bg-leaf px-3 py-1.5 text-xs font-semibold text-white"
				>
					Buscar
				</button>
			</form>

			<div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4 sm:gap-3 md:mb-5">
				<h2 className="font-display text-xl font-semibold text-ink sm:text-2xl md:text-3xl">
					Comercios del pueblo
				</h2>
				<div className="flex gap-1.5 text-xs font-semibold sm:gap-2">
					<button
						type="button"
						onClick={() => setSoloAbiertos(false)}
						className={`inline-flex min-h-9 items-center rounded-full px-3 py-1.5 ${
							!soloAbiertos ? "bg-leaf text-white" : "glass-soft text-muted-foreground"
						}`}
					>
						Todos
					</button>
					<button
						type="button"
						onClick={() => setSoloAbiertos(true)}
						className={`inline-flex min-h-9 items-center rounded-full px-3 py-1.5 ${
							soloAbiertos ? "bg-leaf text-white" : "glass-soft text-muted-foreground"
						}`}
					>
						Abiertos ahora
					</button>
				</div>
			</div>

			{negocios.error && (
				<Aviso tono="error">
					No se pudo cargar el catálogo: {negocios.error}
				</Aviso>
			)}

			<div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
				{negocios.cargando &&
					lista.length === 0 &&
					Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="glass h-60 animate-pulse rounded-3xl sm:h-72" />
					))}
				{filtrados.map((n) => (
					<StoreCard key={n.id} n={n} />
				))}
			</div>

			{!negocios.cargando && !negocios.error && filtrados.length === 0 && (
				<p className="py-6 text-center text-sm text-muted-foreground sm:py-8">
					No encontramos resultados.
				</p>
			)}

			<div className="mt-4 text-center sm:mt-6">
				<Link
					href="/negocios"
					className="glass-soft inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-ink sm:min-h-12 sm:px-5 sm:py-3 sm:text-base"
				>
					Ver todos los comercios
				</Link>
			</div>
		</section>
	);
}
