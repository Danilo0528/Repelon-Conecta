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
		<section className="mx-auto max-w-6xl px-4 pt-12">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const consulta = texto.trim();
					router.push(consulta ? `/buscar?q=${encodeURIComponent(consulta)}` : "/buscar");
				}}
				className="glass-soft mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-ink"
			>
				<button
					type="submit"
					aria-label="Buscar productos en el pueblo"
					className="shrink-0 text-leaf"
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
					className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
				/>
				<button
					type="submit"
					className="shrink-0 rounded-lg bg-leaf px-3 py-1.5 text-xs font-semibold text-white"
				>
					Buscar
				</button>
			</form>

			<div className="mb-5 flex flex-wrap items-end justify-between gap-3">
				<h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
					Comercios del pueblo
				</h2>
				<div className="flex gap-2 text-xs font-semibold">
					<button
						type="button"
						onClick={() => setSoloAbiertos(false)}
						className={`rounded-full px-3 py-1.5 ${
							!soloAbiertos ? "bg-leaf text-white" : "glass-soft text-muted-foreground"
						}`}
					>
						Todos
					</button>
					<button
						type="button"
						onClick={() => setSoloAbiertos(true)}
						className={`rounded-full px-3 py-1.5 ${
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

			<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{negocios.cargando &&
					lista.length === 0 &&
					Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="glass h-72 animate-pulse rounded-3xl" />
					))}
				{filtrados.map((n) => (
					<StoreCard key={n.id} n={n} />
				))}
			</div>

			{!negocios.cargando && !negocios.error && filtrados.length === 0 && (
				<p className="py-8 text-center text-muted-foreground">
					No encontramos resultados.
				</p>
			)}

			<div className="mt-6 text-center">
				<Link
					href="/negocios"
					className="glass-soft inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold text-ink"
				>
					Ver todos los comercios
				</Link>
			</div>
		</section>
	);
}
