"use client";

import Link from "next/link";

import { StoreCard } from "@/components/StoreCard";
import { Aviso } from "@/components/ui";
import type { InicioState } from "./useInicio";

export function SeccionComercios({ inicio }: { inicio: InicioState }) {
	const { soloAbiertos, setSoloAbiertos, negocios, lista, filtrados } = inicio;

	return (
		<section className="w-full py-10 md:py-16" id="comercios" style={{ background: "#f0f4f2" }}>
			<div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">

				{/* Barra superior de filtros */}
				<div className="mb-8 overflow-hidden rounded-xl p-5 shadow-sm" style={{ background: "#fff" }}>
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#006d23" }}>
								Directorio Comunitario
							</p>
							<h2 className="font-sans text-[2rem] font-extrabold tracking-tight md:text-[2.25rem]"
								style={{ color: "#091c31" }}>
								Comercios del pueblo
							</h2>
						</div>

						{/* Búsqueda */}
						<div className="flex-1 lg:max-w-md">
							<div className="relative flex items-center rounded-lg shadow-inner"
								style={{ background: "#f8f9ff" }}>
								<svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 size-[22px]"
									fill="none" stroke="#3e4a3d" strokeWidth="2" strokeLinecap="round" aria-hidden>
									<circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
								</svg>
								<input
									type="search"
									placeholder="Busca por plátano, pescado, ferretería..."
									onChange={(e) => {
										/* búsqueda se delega al buscador principal */
									}}
									className="w-full rounded-lg py-3 pl-11 pr-24 text-[14px] outline-none focus:ring-2 focus:ring-[#006d23]/30"
									style={{ background: "transparent", color: "#091c31" }}
								/>
								<Link href="/buscar"
									className="absolute right-2 rounded-md px-3.5 py-1.5 text-[12px] font-bold text-white"
									style={{ background: "#078930" }}>
									Buscar
								</Link>
							</div>
						</div>

						{/* Toggle todos / abiertos */}
						<div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "#f8f9ff" }}>
							{[
								{ label: "Todos", activo: !soloAbiertos, fn: () => setSoloAbiertos(false) },
								{ label: "Abiertos ahora", activo: soloAbiertos, fn: () => setSoloAbiertos(true) },
							].map(({ label, activo, fn }) => (
								<button key={label} type="button" onClick={fn}
									className="rounded-md px-4 py-2 text-[12px] font-bold transition-colors"
									style={activo
										? { background: "#091c31", color: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.12)" }
										: { color: "#3e4a3d" }}>
									{label}
								</button>
							))}
						</div>

						{/* Vista mapa */}
						<Link href="/buscar"
							className="hidden shrink-0 items-center gap-1 rounded-lg border px-4 py-2.5 text-[14px] font-semibold transition hover:bg-[#f8f9ff] md:flex"
							style={{ color: "#1660a3", borderColor: "#d2e4ff" }}>
							<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
								<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
								<line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
							</svg>
							Mapa
						</Link>
					</div>
				</div>

				{negocios.error && <Aviso tono="error">No se pudo cargar el catálogo: {negocios.error}</Aviso>}

				{/* Rejilla */}
				<div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
					{negocios.cargando && lista.length === 0 &&
						Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="h-72 animate-pulse rounded-xl" style={{ background: "#e5eeff" }} />
						))}
					{filtrados.map((n) => <StoreCard key={n.id} n={n} />)}
				</div>

				{!negocios.cargando && !negocios.error && filtrados.length === 0 && (
					<p className="py-10 text-center text-[15px]" style={{ color: "#3e4a3d" }}>
						No encontramos resultados.
					</p>
				)}

				<div className="mt-8 flex justify-center">
					<Link href="/negocios"
						className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-[14px] font-semibold shadow-sm transition hover:bg-[#e5eeff]"
						style={{ background: "#fff", color: "#091c31", border: "1px solid #dbe9ff" }}>
						Ver todos los comercios del municipio
						<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</Link>
				</div>
			</div>
		</section>
	);
}
