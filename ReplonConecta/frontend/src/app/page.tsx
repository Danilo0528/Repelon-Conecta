"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { IconoCategoria } from "@/components/IconoCategoria";
import { MapaNegocios } from "@/components/Mapa";
import { StoreCard } from "@/components/StoreCard";
import { Aviso, InsigniaAbierto } from "@/components/ui";
import { api } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/env";
import { conCoordenadas, useCoordenadas } from "@/lib/geocodificar";
import { fotoNegocio } from "@/lib/imagenes";
import { enlaceComoLlegar } from "@/lib/maps";
import type { Categoria, Negocio } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

/*
 * Home de Repelón Conecta, con el diseño de la plantilla.
 *
 * Ya no es una pantalla de mapa a lo alto: es una página que se lee de
 * arriba a abajo y en la que el mapa es una sección más, enmarcada en
 * vidrio como el resto de las superficies:
 *
 *   1. Hero: la promesa del pueblo digitalizado, dos botones y las
 *      categorías.
 *   2. "El pueblo en el mapa": OpenStreetMap con los pines de todos los
 *      comercios; al tocar uno aparece su fichita con "Cómo llegar".
 *   3. "Comercios del pueblo": buscador, filtro de abiertos y la rejilla
 *      de tarjetas de vidrio.
 *   4. Tres razones para usar la app y la invitación a registrarse.
 *
 * Los datos son los mismos de siempre (/api/negocios y /api/categorias),
 * pero se piden una sola vez y se filtran en el navegador: el buscador
 * no vuelve a golpear al servidor por cada tecla.
 */

type ControlZoom = { current: ((direccion: 1 | -1) => void) | null };

const RAZONES = [
	{
		titulo: "Publica tu negocio",
		texto: "Muestra tus productos, precios y fotos a los vecinos.",
		tono: "bg-leaf/10 text-leaf",
		icono: (
			<>
				<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
				<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
				<path d="M9.5 20v-5.5h5V20" strokeLinejoin="round" />
			</>
		),
	},
	{
		titulo: "Habla directamente",
		texto: "Los vecinos pueden consultarte por WhatsApp desde cada tarjeta.",
		tono: "bg-azul/10 text-azul",
		icono: (
			<>
				<rect x="6.5" y="2.5" width="11" height="19" rx="2.5" strokeLinejoin="round" />
				<path d="M10.5 18.5h3" strokeLinecap="round" />
			</>
		),
	},
	{
		titulo: "Encuentra comercios cercanos",
		texto: "Consulta el mapa para saber dónde queda cada negocio.",
		tono: "bg-cielo/25 text-azul",
		icono: (
			<>
				<circle cx="6" cy="17" r="3.2" strokeLinejoin="round" />
				<circle cx="18" cy="17" r="3.2" strokeLinejoin="round" />
				<path d="M9 17h6l-2.5-7H8" strokeLinejoin="round" />
				<path d="M12.5 10 14.5 6h3" strokeLinecap="round" strokeLinejoin="round" />
			</>
		),
	},
];

export default function Inicio() {
	const [texto, setTexto] = useState("");
	const [soloAbiertos, setSoloAbiertos] = useState(false);
	const [seleccionId, setSeleccionId] = useState<string | null>(null);
	const controlRef = useRef<ControlZoom["current"]>(null);

	const categorias = useDatos<Categoria[]>(() => api("/api/categorias"), []);
	const negocios = useDatos<Negocio[]>(() => api("/api/negocios"), []);

	const lista = useMemo(() => negocios.datos ?? [], [negocios.datos]);
	/*
	 * Los negocios de la base no traen coordenadas, así que el mapa no
	 * tendría dónde ponerlos. useCoordenadas resuelve la dirección de
	 * cada uno (una sola vez, guardada en el navegador) y `catalogo` es
	 * la lista que sí tiene punto.
	 */
	const coordenadas = useCoordenadas(lista);
	const catalogo = useMemo(
		() => conCoordenadas(lista, coordenadas),
		[lista, coordenadas],
	);

	const term = texto.trim().toLocaleLowerCase("es");
	const filtrados = useMemo(
		() =>
			catalogo.filter(
				(n) =>
					(!soloAbiertos || n.abierto) &&
					(!term ||
						[n.nombre, n.descripcion, n.barrio, n.direccion].some((v) =>
							v?.toLocaleLowerCase("es").includes(term),
						)),
			),
		[catalogo, term, soloAbiertos],
	);

	const seleccion = seleccionId
		? (catalogo.find((n) => n.id === seleccionId) ?? null)
		: null;

	return (
		<div className="pb-6">
			{/* ============================ Hero ============================ */}
			<section className="mx-auto max-w-6xl px-4 pt-6 md:pt-10">
				<div className="grid items-center gap-8 md:grid-cols-2">
					<div>
						<span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-leaf">
							<span className="size-2 rounded-full bg-leaf" aria-hidden />
							Comercio local, digitalizado
						</span>

						<h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-5xl">
							Todo el pueblo,{" "}
							<span className="italic text-leaf">a un toque</span> de tu celular.
						</h1>

						<p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
							Descubre las panaderías, ferreterías, droguerías y productores de
							Repelón. Consulta sus productos y habla directamente con tus
							vecinos.
						</p>

						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								href="/negocios"
								className="inline-flex min-h-12 items-center justify-center rounded-xl bg-leaf px-5 py-3 font-semibold text-white shadow-leaf transition-transform active:scale-[.98]"
							>
								Explorar comercios
							</Link>
							<Link
								href="/vendedor"
								className="glass-soft inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold text-ink"
							>
								Registrar mi negocio
							</Link>
						</div>

						{!supabaseConfigurado && (
							<div className="mt-4">
								<Aviso tono="info">
									Falta configurar Supabase en <code>.env.local</code>. Se ve el
									catálogo, pero no se puede iniciar sesión ni pedir.
								</Aviso>
							</div>
						)}

						<div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
							{(categorias.datos ?? []).slice(0, 6).map((c) => (
								<Link
									key={c.id}
									href="/negocios"
									className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-leaf"
								>
									<IconoCategoria categoria={c} className="h-4 w-4" />
									{c.nombre}
								</Link>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="glass shadow-float overflow-hidden rounded-[28px] p-2">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/img/hero.jpg"
								alt="Mostrador de una tienda del pueblo con pan y frutas"
								className="aspect-[6/5] w-full rounded-[22px] object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* ======================= El pueblo en el mapa ======================= */}
			<section className="mx-auto max-w-6xl px-4 pt-12">
				<div className="mb-5">
					<h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
						El pueblo en el mapa
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Toca un pin para ver el comercio y cómo llegar.
					</p>
				</div>

				<div className="glass shadow-float relative overflow-hidden rounded-[28px] p-2">
					<div className="relative h-[420px] overflow-hidden rounded-[22px] md:h-[480px] lg:h-[540px]">
						<MapaNegocios
							negocios={catalogo}
							onSeleccionar={(n) => setSeleccionId(n.id)}
							seleccionadoId={seleccion?.id ?? null}
							controlRef={controlRef}
						/>

						{/* Etiqueta del pueblo + crédito de OpenStreetMap */}
						<div className="pointer-events-none absolute left-3 top-3 z-[500] flex flex-col items-start gap-1">
							<span className="glass-soft flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink">
								<svg
									viewBox="0 0 24 24"
									className="size-3.5 text-leaf"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden
								>
									<path
										d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z"
										strokeLinejoin="round"
									/>
									<circle cx="12" cy="10" r="2.6" />
								</svg>
								Repelón, Atlántico
							</span>
							<a
								href="https://www.openstreetmap.org/copyright"
								target="_blank"
								rel="noreferrer"
								className="pointer-events-auto rounded-full bg-white/85 px-2 py-0.5 text-[10px] text-black/50 backdrop-blur-sm"
							>
								© OpenStreetMap
							</a>
						</div>

						{/* Zoom, pintado aquí y no por Leaflet, para que quede arriba */}
						<div className="absolute right-3 top-3 z-[500] flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white/85 shadow-sm backdrop-blur-sm">
							<button
								type="button"
								onClick={() => controlRef.current?.(1)}
								aria-label="Acercar el mapa"
								className="flex h-9 w-9 items-center justify-center text-lg font-medium text-ink/70 active:bg-black/5"
							>
								+
							</button>
							<span className="mx-2 h-px bg-black/10" aria-hidden />
							<button
								type="button"
								onClick={() => controlRef.current?.(-1)}
								aria-label="Alejar el mapa"
								className="flex h-9 w-9 items-center justify-center text-lg font-medium text-ink/70 active:bg-black/5"
							>
								−
							</button>
						</div>

						{/* Ficha del comercio elegido, o la tira para elegir uno */}
						{catalogo.length > 0 && (
							<div className="absolute inset-x-3 bottom-3 z-[500]">
								{seleccion ? (
									<FichaMapa
										n={seleccion}
										onCerrar={() => setSeleccionId(null)}
									/>
								) : (
									<div className="glass flex gap-2 overflow-x-auto rounded-2xl p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
										{catalogo.slice(0, 6).map((n) => (
											<button
												key={n.id}
												type="button"
												onClick={() => setSeleccionId(n.id)}
												className="flex shrink-0 items-center gap-2 rounded-xl p-1.5 pr-3 text-left hover:bg-white/70"
											>
												<span
													className={`size-2.5 shrink-0 rounded-full ${
														n.abierto ? "bg-leaf" : "bg-muted-foreground"
													}`}
													aria-hidden
												/>
												<span className="text-xs font-semibold text-ink">
													{n.nombre}
												</span>
											</button>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ===================== Comercios del pueblo ===================== */}
			<section className="mx-auto max-w-6xl px-4 pt-12">
				<label className="glass-soft mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-ink">
					<svg
						viewBox="0 0 24 24"
						className="size-5 shrink-0 text-leaf"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<circle cx="11" cy="11" r="7" />
						<path d="m16.5 16.5 4 4" strokeLinecap="round" />
					</svg>
					<span className="sr-only">Buscar comercios y productos</span>
					<input
						type="search"
						value={texto}
						onChange={(e) => setTexto(e.target.value)}
						placeholder="Busca un comercio o producto"
						enterKeyHint="search"
						className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
					/>
				</label>

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

			{/* ====================== Para quién sirve ====================== */}
			<section className="mx-auto max-w-6xl px-4 pt-12">
				<div className="grid gap-6 md:grid-cols-3">
					{RAZONES.map(({ titulo, texto: descripcion, tono, icono }) => (
						<div key={titulo} className="glass rounded-3xl p-6">
							<div
								className={`grid size-11 place-items-center rounded-2xl ${tono}`}
							>
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden
								>
									{icono}
								</svg>
							</div>
							<h3 className="mt-4 font-display text-lg font-semibold text-ink">
								{titulo}
							</h3>
							<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
								{descripcion}
							</p>
						</div>
					))}
				</div>

				<div className="glass mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-leaf/10 via-glass/40 to-azul/10 p-6 md:flex-row">
					<div>
						<h3 className="font-display text-xl font-semibold text-ink">
							¿Tienes un negocio en Repelón?
						</h3>
						<p className="text-sm text-muted-foreground">
							Muestra tus productos a todo el pueblo.
						</p>
					</div>
					<Link
						href="/vendedor"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-leaf px-5 py-3 font-semibold text-white shadow-leaf"
					>
						Crear mi tienda gratis
					</Link>
				</div>
			</section>
		</div>
	);
}

/* ====================================================================
 * Ficha del comercio elegido sobre el mapa
 * ==================================================================== */

function FichaMapa({ n, onCerrar }: { n: Negocio; onCerrar: () => void }) {
	return (
		<div className="glass rounded-2xl p-3">
			<div className="flex gap-3">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={fotoNegocio(n)}
					alt=""
					className="size-20 shrink-0 rounded-xl object-cover"
				/>
				<div className="min-w-0 flex-1">
					<InsigniaAbierto abierto={n.abierto} />
					<p className="mt-1 truncate font-display font-semibold text-ink">
						{n.nombre}
					</p>
					<p className="truncate text-xs text-muted-foreground">
						{n.direccion}
						{n.barrio ? ` · ${n.barrio}` : ""}
					</p>
				</div>
				<button
					type="button"
					onClick={onCerrar}
					aria-label="Quitar la ficha del mapa"
					className="-mr-1 -mt-1 size-8 shrink-0 rounded-full text-black/40 transition-colors hover:bg-black/5"
				>
					×
				</button>
			</div>

			<div className="mt-3 flex gap-2">
				<Link
					href={`/negocios/${n.slug}`}
					className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-leaf px-3 py-2.5 text-center text-sm font-semibold text-white"
				>
					Ver comercio
				</Link>
				<a
					href={enlaceComoLlegar(n)}
					target="_blank"
					rel="noreferrer"
					className="glass-soft flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-ink"
				>
					Cómo llegar
				</a>
			</div>
		</div>
	);
}
