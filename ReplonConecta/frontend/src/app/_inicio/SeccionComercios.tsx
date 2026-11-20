"use client";

import Link from "next/link";

import { StoreCard } from "@/components/StoreCard";
import { Aviso } from "@/components/ui";
import type { InicioState } from "./useInicio";

/** Negocios destacados para la home móvil. */
export function SeccionComercios({ inicio }: { inicio: InicioState }) {
	const { negocios, lista } = inicio;

	const destacados = [...lista]
		.sort((a, b) => Number(b.destacado) - Number(a.destacado) || Number(b.abierto) - Number(a.abierto))
		.slice(0, 4);

	return (
		<section className="mx-auto max-w-6xl px-4 pt-8 pb-2 sm:pt-10 sm:pb-4 md:pt-12">
			<div className="mb-4 flex items-end justify-between gap-3">
				<div>
					<h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
						Negocios destacados
					</h2>
					<p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
						Comercios del pueblo para descubrir y contactar fácilmente.
					</p>
				</div>
				<Link
					href="/negocios"
					className="hidden min-h-11 shrink-0 items-center text-sm font-semibold text-leaf sm:inline-flex"
				>
					Ver todos
				</Link>
			</div>

			{negocios.error && (
				<Aviso tono="error">No se pudo cargar el catálogo: {negocios.error}</Aviso>
			)}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{negocios.cargando &&
					lista.length === 0 &&
					Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-64 animate-pulse rounded-3xl border border-black/10 bg-black/[.03]" />
					))}
				{destacados.map((n) => (
					<StoreCard key={n.id} n={n} />
				))}
			</div>

			{!negocios.cargando && !negocios.error && destacados.length === 0 && (
				<div className="rounded-3xl border border-black/10 bg-white px-5 py-10 text-center">
					<p className="font-display text-lg font-semibold text-ink">
						Aún no hay negocios para mostrar
					</p>
					<p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
						Cuando los comercios del pueblo se publiquen, aparecerán aquí para que puedas explorarlos.
					</p>
					<Link
						href="/vendedor"
						className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-white"
					>
						Registrar mi negocio
					</Link>
				</div>
			)}

			<div className="mt-4 sm:mt-6">
				<Link
					href="/negocios"
					className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink sm:w-auto"
				>
					Ver todos los comercios
				</Link>
			</div>
		</section>
	);
}
