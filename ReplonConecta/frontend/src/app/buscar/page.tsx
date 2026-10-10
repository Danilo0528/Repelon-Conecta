"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";

import { MapaNegocios } from "@/components/Mapa";
import { Aviso, Cargando, Foto, InsigniaAbierto } from "@/components/ui";
import { api } from "@/lib/api";
import { CATEGORIAS_BUSQUEDA, PISTA_SIN_PRODUCTOS } from "@/lib/alcance";
import { pesos } from "@/lib/format";
import type { Punto } from "@/lib/geocodificar";
import type { Negocio, ResultadoBusqueda } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { enlaceWhatsApp, mensajeConsulta } from "@/lib/whatsapp";

/*
 * Pantalla de búsqueda: "¿dónde consigo X?".
 *
 * Al escribir "yuca" (o "20 kilos de yuca", los números no cuentan) la
 * lista de resultados y los pines del mapa se pintan AL MISMO TIEMPO a
 * partir de una sola llamada a GET /api/buscar: cada resultado trae el
 * producto con su precio en kilos/libras y los datos del negocio
 * (nombre, barrio, dirección, estado, coordenadas), así que la lista y
 * el mapa hablan de lo mismo sin volver al servidor.
 *
 * Sin login: es la puerta de entrada de la app y tiene que servir
 * igual a un vecino que a un visitante.
 *
 * En PC la pantalla se parte en dos columnas (lista a la izquierda,
 * mapa pegado a la derecha); en celular el mapa va arriba, apretado, y
 * la lista corre debajo.
 */

type ControlZoom = { current: ((direccion: 1 | -1) => void) | null };

export default function BuscarPagina() {
	/*
	 * useSearchParams (y el estado que arranca con ?q=) exige este
	 * Suspense para que next build pueda prerender la ruta.
	 */
	return (
		<Suspense fallback={<Cargando texto="Abriendo el buscador…" />}>
			<Busqueda />
		</Suspense>
	);
}

function Busqueda() {
	const router = useRouter();
	const params = useSearchParams();

	const [texto, setTexto] = useState(params.get("q") ?? "");
	const [categoria, setCategoria] = useState<string | null>(null);
	const [barrio, setBarrio] = useState("");
	const [negocioActivo, setNegocioActivo] = useState<string | null>(null);
	const controlRef = useRef<ControlZoom["current"]>(null);

	/*
	 * "Usar mi ubicación": la posición del vecino en el mapa, con su
	 * propio pin, para que compare dónde está él con quién vende lo que
	 * busca. Nada de rutas ni distancias: es orientación, no GPS de la
	 * app. Permiso denegado queda como aviso, la búsqueda sigue igual.
	 */
	const [ubicacion, setUbicacion] = useState<{
		punto: Punto | null;
		pidiendo: boolean;
		error: string | null;
	}>({ punto: null, pidiendo: false, error: null });

	function pedirUbicacion() {
		if (!("geolocation" in navigator)) {
			setUbicacion({
				punto: null,
				pidiendo: false,
				error: "Este navegador no comparte tu ubicación.",
			});
			return;
		}
		setUbicacion((a) => ({ ...a, pidiendo: true, error: null }));
		navigator.geolocation.getCurrentPosition(
			(pos) =>
				setUbicacion({
					punto: { lat: pos.coords.latitude, lng: pos.coords.longitude },
					pidiendo: false,
					error: null,
				}),
			() =>
				setUbicacion({
					punto: null,
					pidiendo: false,
					error:
						"No pudimos usar tu ubicación. Revisa el permiso de ubicación del navegador e inténtalo de nuevo.",
				}),
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
		);
	}

	// La consulta efectiva: sin espacios sobrantes. useDatos solo vuelve
	// a golpear al servidor cuando estos tres cambian, no por tecla suelta.
	const q = texto.trim();

	const resultados = useDatos<ResultadoBusqueda[]>(
		() => {
			const p = new URLSearchParams();
			if (q) p.set("q", q);
			if (categoria) p.set("categoria", categoria);
			if (barrio) p.set("barrio", barrio);
			const consulta = p.toString();
			return api(consulta ? `/api/buscar?${consulta}` : "/api/buscar");
		},
		[q, categoria, barrio],
	);

	// Los barrios del pueblo para el filtro: salen del listado público
	// de negocios, que ya existe y se pide una sola vez.
	const negocios = useDatos<Negocio[]>(() => api("/api/negocios"), []);

	const lista = useMemo(() => resultados.datos ?? [], [resultados.datos]);

	/*
	 * El mapa no pinta productos: pinta negocios. Un mismo negocio con
	 * tres productos en la lista es UN pin; los que no traen
	 * coordenadas se quedan solo en la lista.
	 */
	const enMapa = useMemo(() => {
		const vistos = new Set<string>();
		const mapa: {
			id: string;
			nombre: string;
			slug: string;
			abierto: boolean;
			barrio: string | null;
			direccion: string;
			latitud: number | null;
			longitud: number | null;
		}[] = [];
		for (const r of lista) {
			if (r.latitud == null || r.longitud == null || vistos.has(r.negocioId)) continue;
			vistos.add(r.negocioId);
			mapa.push({
				id: r.negocioId,
				nombre: r.negocioNombre,
				slug: r.negocioSlug,
				abierto: r.abierto,
				barrio: r.barrio,
				direccion: r.direccion,
				latitud: r.latitud,
				longitud: r.longitud,
			});
		}
		return mapa;
	}, [lista]);

	const barrios = useMemo(() => {
		const set = new Set<string>();
		for (const n of negocios.datos ?? []) {
			if (n.barrio) set.add(n.barrio);
		}
		return [...set].sort((a, b) => a.localeCompare(b, "es"));
	}, [negocios.datos]);

	const negociosEnLista = new Set(lista.map((r) => r.negocioId)).size;

	return (
		<div className="mx-auto max-w-6xl px-4 pb-8 pt-6">
			<section className="rounded-3xl bg-azul px-5 py-7 text-white shadow-float md:px-8 md:py-9">
				<div className="max-w-2xl">
					<p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amarillo">
						Repelón Conecta
					</p>
					<h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
						Encuentra lo que necesitas en Repelón
					</h1>
					<p className="mt-3 max-w-xl text-sm leading-6 text-white/80 md:text-base">
						Conectamos vecinos y visitantes con negocios agrícolas, pesqueros y turísticos del pueblo.
					</p>
				</div>

				<label className="mt-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-ink shadow-lg">
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
					<span className="sr-only">Buscar productos</span>
					<input
						type="search"
						value={texto}
						onChange={(e) => setTexto(e.target.value)}
						placeholder="Ej: 20 kilos de yuca, pescado fresco o una finca para visitar"
						enterKeyHint="search"
						className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
					/>
				</label>
			</section>

			<div className="mt-6 flex flex-wrap gap-2" aria-label="Búsquedas sugeridas">
				{["Yuca", "Pescado", "Plátano", "Fincas", "Cabañas"].map((sugerencia) => (
					<button
						key={sugerencia}
						type="button"
						onClick={() => setTexto(sugerencia)}
						className="rounded-full border border-azul/15 bg-white px-4 py-2 text-sm font-semibold text-azul shadow-sm transition-colors hover:border-amarillo hover:bg-amarillo/20 focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
					>
						{sugerencia}
					</button>
				))}
			</div>

				{/* -------------------------- Filtros ---------------------------- */}
				<div className="mt-4 flex flex-wrap items-center gap-2">
				<div className="flex flex-wrap gap-2 text-xs font-semibold">
					{CATEGORIAS_BUSQUEDA.map(({ slug, nombre }) => (
						<button
							key={slug ?? "todo"}
							type="button"
							onClick={() => setCategoria(slug)}
							aria-pressed={categoria === slug}
						className={`rounded-full px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2 ${
							categoria === slug
								? "bg-leaf text-white"
								: "glass-soft text-muted-foreground hover:text-leaf"
						}`}
						>
							{nombre}
						</button>
					))}
				</div>

				{/*
				 * En celular el barrio ocupa su propia fila: en la de los
				 * chips no cabe el select y se corta contra el borde.
				 */}
				<label className="glass-soft flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:ml-auto sm:w-auto">
					<span className="sr-only">Filtrar por barrio</span>
					<svg
						viewBox="0 0 24 24"
						className="size-4 text-leaf"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<path d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z" strokeLinejoin="round" />
						<circle cx="12" cy="10" r="2.6" />
					</svg>
					<select
						value={barrio}
						onChange={(e) => setBarrio(e.target.value)}
						className="bg-transparent outline-none"
					>
						<option value="">Todos los barrios</option>
						{barrios.map((b) => (
							<option key={b} value={b}>
								{b}
							</option>
						))}
					</select>
				</label>
			</div>

			{resultados.error && (
				<div className="mt-4">
					<Aviso tono="error">No se pudo buscar: {resultados.error}</Aviso>
				</div>
			)}
			{ubicacion.error && (
				<div className="mt-4">
					<Aviso tono="error">{ubicacion.error}</Aviso>
				</div>
			)}

			{/* ------------- Lista y mapa, al mismo tiempo ------------------- */}
			<div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
				{/* Mapa: arriba en móvil, columna derecha fija en PC. */}
				<div className="order-first lg:order-last lg:sticky lg:top-24">
					<div className="glass shadow-float relative overflow-hidden rounded-[28px] p-2">
						<div className="relative h-60 overflow-hidden rounded-[22px] lg:h-[62vh]">
							<MapaNegocios
								negocios={enMapa}
								onSeleccionar={(n) => router.push(`/negocios/${n.slug}`)}
								seleccionadoId={negocioActivo}
								controlRef={controlRef}
								resaltar
								miUbicacion={ubicacion.punto}
							/>

							{/*
							 * Usar mi ubicación: abajo a la izquierda, lejos
							 * del control de zoom y de la atribución, que es
							 * donde nadie pisa a nadie en 390 px.
							 */}
							<button
								type="button"
								onClick={pedirUbicacion}
								disabled={ubicacion.pidiendo}
								className="absolute bottom-2 left-2 z-[500] inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm transition-colors hover:text-leaf disabled:opacity-50"
							>
								<svg
									viewBox="0 0 24 24"
									className="size-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden
								>
									<circle cx="12" cy="12" r="7" />
									<path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
									<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
								</svg>
								{ubicacion.pidiendo ? "Buscando…" : "Usar mi ubicación"}
							</button>

							{/* Zoom, pintado aquí y no por Google, para que quede arriba */}
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

							<a
								href="https://www.google.com/maps"
								target="_blank"
								rel="noreferrer"
								className="pointer-events-auto absolute bottom-2 right-2 z-[500] rounded-full bg-white/85 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm"
							>
								© Google Maps
							</a>
						</div>
					</div>
				</div>

				{/* Lista de resultados */}
				<div>
					{!resultados.cargando && !resultados.error && (
						<p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
							{lista.length === 0
								? "Sin resultados."
								: `${lista.length} ${lista.length === 1 ? "producto" : "productos"} en ${negociosEnLista} ${negociosEnLista === 1 ? "negocio" : "negocios"}.`}
						</p>
					)}

					{resultados.cargando && (resultados.datos?.length ?? 0) === 0 && (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="glass h-28 animate-pulse rounded-2xl" />
							))}
						</div>
					)}

					<ul className="space-y-3">
						{lista.map((r) => {
							const activo = negocioActivo === r.negocioId;
							return (
								<li key={r.productoId}>
									<article
										className={`glass rounded-2xl p-3 transition-shadow ${
											activo ? "ring-2 ring-leaf" : ""
										}`}
									>
										<Link
											href={`/negocios/${r.negocioSlug}?producto=${encodeURIComponent(r.productoNombre)}`}
											onMouseEnter={() => setNegocioActivo(r.negocioId)}
											onFocus={() => setNegocioActivo(r.negocioId)}
											className="flex items-center gap-3"
										>
											<Foto
												src={r.imagenUrl}
												alt={r.productoNombre}
												className="size-20 shrink-0 rounded-xl object-cover"
											/>

											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<p className="truncate text-sm font-semibold leading-tight text-ink">
														{r.productoNombre}
													</p>
													<InsigniaAbierto abierto={r.abierto} />
												</div>

												<p className="mt-1 text-lg font-bold leading-tight text-ink">
													{pesos(r.precio)}{" "}
													<span className="text-xs font-medium text-muted-foreground">
														/ {r.unidad === "KILO" ? "kilo" : "libra"}
													</span>
												</p>

												<p className="mt-1 truncate text-xs text-muted-foreground">
													{r.negocioNombre}
													{r.barrio ? ` · ${r.barrio}` : ` · ${r.direccion}`}
												</p>

												<div className="mt-1.5 flex flex-wrap items-center gap-1.5">
													{r.categoriaNombre && (
														<span className="rounded-full bg-leaf/10 px-2 py-0.5 text-[11px] font-semibold text-leaf">
															{r.categoriaNombre}
														</span>
													)}
													{!r.disponible && (
														<span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
															Sin stock
														</span>
													)}
												</div>
											</div>

											<svg
												viewBox="0 0 24 24"
												className="size-5 shrink-0 text-muted-foreground/60"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												aria-hidden
											>
												<path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>

										{/*
										 * El WhatsApp queda FUERA del enlace de la tarjeta
										 * (dos enlaces anidados no existen en HTML) y lleva
										 * el producto nombrado en el mensaje: el dueño sabe
										 * de qué le hablan desde el primer saludo.
										 */}
										{r.whatsapp && (
											<a
												href={enlaceWhatsApp(
													r.whatsapp,
													mensajeConsulta(r.negocioNombre, r.productoNombre),
												)}
												target="_blank"
												rel="noreferrer"
												className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:underline"
											>
												<svg
													viewBox="0 0 24 24"
													className="size-4"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.8"
													aria-hidden
												>
													<path
														d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z"
														strokeLinejoin="round"
													/>
												</svg>
												Escribir por WhatsApp
											</a>
										)}
									</article>
								</li>
							);
						})}
					</ul>

					{!resultados.cargando && !resultados.error && lista.length === 0 && (
						<div className="glass rounded-2xl p-6 text-center">
							<p className="font-semibold text-ink">
								{q ? (
									<>
										No encontramos <span className="italic text-leaf">“{q}”</span>.
									</>
								) : (
									"No hay productos con estos filtros."
								)}
							</p>
							<p className="mt-2 text-sm text-muted-foreground">
								{categoria && PISTA_SIN_PRODUCTOS[categoria]
									? PISTA_SIN_PRODUCTOS[categoria]
									: "Prueba con una sola palabra, por ejemplo solo “yuca” o “pescado”, o quita los filtros."}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
