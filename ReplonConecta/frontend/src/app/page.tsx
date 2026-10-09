"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { IconoCategoria } from "@/components/IconoCategoria";
import { MapaNegocios } from "@/components/Mapa";
import { StoreCard } from "@/components/StoreCard";
import { Aviso, InsigniaAbierto } from "@/components/ui";
import { api } from "@/lib/api";
import { enAlcance } from "@/lib/alcance";
import { supabaseConfigurado } from "@/lib/env";
import { conCoordenadas, useCoordenadas } from "@/lib/geocodificar";
import { textoInicio } from "@/lib/inicio";
import { fotoNegocio, fotoRespaldo } from "@/lib/imagenes";
import { enlaceComoLlegar } from "@/lib/maps";
import type { Categoria, Negocio, ZonaTuristica } from "@/lib/tipos";
import {
	LUGARES_TURISMO,
	enlaceLugar,
	zonaALugar,
	type LugarTuristico,
	type MotivoTurismo,
} from "@/lib/turismo";
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
 *   2. "El pueblo en el mapa": Google Maps con los pines de todos los
 *      comercios; al tocar uno aparece su fichita con "Cómo llegar".
 *   3. "Turismo": las fichas sin precios del alcance (direcciones y
 *      zonas). Vive en la base (zonas que carga el admin) y el "camino"
 *      cierra en Google Maps.
 *   4. "Comercios del pueblo": buscador, filtro de abiertos y la rejilla
 *      de tarjetas de vidrio.
 *   5. Tres razones para usar la app y la invitación a registrarse.
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

/**
 * Las tres promesas de la sección Fondo Emprender: qué ofrece el fondo
 * del SENA en una tarjeta cada una (el detalle largo vive en
 * /fondo-emprender, acá solo se cuenta qué es).
 */
const FONDO_EMPRENDER = [
	{
		titulo: "Capital semilla",
		texto: "Recursos para crear o fortalecer tu negocio. Si cumples las metas, se condonan: no devuelves nada.",
		icono: (
			<>
				<circle cx="12" cy="12" r="8.2" />
				<path d="M12 7.4v9.2M14.4 9.6c-.6-.6-1.4-.9-2.4-.9-1.3 0-2.4.7-2.4 1.8 0 2.5 4.9 1.3 4.9 3.9 0 1.1-1.1 1.8-2.4 1.8-1 0-1.9-.3-2.5-1" strokeLinecap="round" />
			</>
		),
	},
	{
		titulo: "Ruta Emprendedora",
		texto: "Te acompañan paso a paso para idear el negocio y formular tu plan, sin costo y con orientadores del SENA.",
		icono: (
			<>
				<circle cx="6.5" cy="6.5" r="2.4" />
				<circle cx="17.5" cy="17.5" r="2.4" />
				<path d="M8.9 6.5h5.1a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.1" strokeLinecap="round" />
			</>
		),
	},
	{
		titulo: "Postulas desde aquí",
		texto: "Individual o en grupo. Repelón Conecta te sirve para mostrar tu catálogo mientras formules el proyecto.",
		icono: (
			<>
				<path d="M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" strokeLinejoin="round" />
				<path d="M13 3.5V9h5M8.5 13.5h7M8.5 17h4.5" strokeLinecap="round" />
			</>
		),
	},
];

/**
 * Fondo pastel de la ilustración de respaldo de cada ficha turística.
 * Si la ficha tiene `imagen`, el fondo no se pinta (la foto lo tapa).
 */
const FONDO_MOTIVO: Record<MotivoTurismo, string> = {
	agua: "bg-gradient-to-br from-blob-3 via-cielo/40 to-blob-2",
	barco: "bg-gradient-to-br from-cielo/50 via-blob-3 to-blob-2/70",
	aves: "bg-gradient-to-br from-blob-1/80 via-blob-3/60 to-cielo/40",
	naturaleza: "bg-gradient-to-br from-blob-1 via-mist to-blob-3/60",
	parque: "bg-gradient-to-br from-blob-1/90 via-cielo/30 to-blob-3",
	pueblo: "bg-gradient-to-br from-blob-3/80 via-blob-1/60 to-mist",
};

/** Trazo decorativo del motivo; va tenue a un costado de la banda. */
const MOTIVO_TRAZO: Record<MotivoTurismo, ReactNode> = {
	agua: (
		<>
			<circle cx="17" cy="7" r="3" />
			<path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
			<path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
			<path d="M3 21c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
		</>
	),
	barco: (
		<>
			<path d="M12 4v10" />
			<path d="M12.8 5.5 18 14h-5.2z" />
			<path d="M4.5 15.5h15l-2 4H6.5z" />
		</>
	),
	aves: (
		<>
			<path d="M3 9c2-3 4-3 6 0" />
			<path d="M11 9c2-3 4-3 6 0" />
			<path d="M7 15c1.5-2 3-2 4.5 0" />
			<path d="M14 15c1.5-2 3-2 4.5 0" />
		</>
	),
	naturaleza: (
		<>
			<path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" />
			<path d="M5 19 14 10" />
		</>
	),
	parque: (
		<>
			<circle cx="12" cy="9" r="5.5" />
			<path d="M12 14.5V21" />
			<path d="M7.5 21h9" />
		</>
	),
	pueblo: (
		<>
			<path d="M3.5 20.5v-6l4-3 4 3v6" />
			<path d="M13 20.5v-8l4.5-3 4.5 3v8" />
			<path d="M17.5 9.5V6.5" />
			<path d="M16.4 7.7h2.2" />
			<path d="M2 20.5h20" />
		</>
	),
};

export default function Inicio() {
	const router = useRouter();
	const [texto, setTexto] = useState("");
	const [soloAbiertos, setSoloAbiertos] = useState(false);
	const [seleccionId, setSeleccionId] = useState<string | null>(null);
	/** Lugar turístico abierto en la ventana flotante (null = cerrada). */
	const [lugarVentana, setLugarVentana] = useState<LugarTuristico | null>(
		null,
	);
	const controlRef = useRef<ControlZoom["current"]>(null);

	const categorias = useDatos<Categoria[]>(() => api("/api/categorias"), []);
	const negocios = useDatos<Negocio[]>(() => api("/api/negocios"), []);

	/*
	 * Textos editables (P2): el panel /admin guarda los cambios en el
	 * backend y acá se leen; lo que nadie cambió sigue en los valores
	 * por defecto de lib/inicio.ts.
	 */
	const textos = useDatos<Record<string, string>>(
		() => api("/api/inicio/textos"),
		[],
	);
	const T = (clave: Parameters<typeof textoInicio>[1]) =>
		textoInicio(textos.datos, clave);

	/*
	 * Zonas turísticas: las carga el estudiante desde /admin (con su
	 * ubicación actual para la dirección exacta) y acá se leen. Si el
	 * backend no responde, `datos` queda en null y se muestra el
	 * respaldo estático de lib/turismo.ts; si la base está vacía a
	 * propósito (datos = []), la sección no se pinta.
	 */
	const zonas = useDatos<ZonaTuristica[]>(() => api("/api/zonas"), []);
	const lugares: LugarTuristico[] = zonas.datos
		? zonas.datos.map(zonaALugar)
		: LUGARES_TURISMO;

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
			<div className="m-0 p-0">
				{/* ============================ Hero ============================ */}
				<section
					className="relative m-0 min-h-[100svh] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/img/hero-campo.png)',
				}}
			>
				{/* Overlay oscuro para mejorar legibilidad del texto */}
				<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
				
				{/* Contenido superpuesto */}
					<div className="relative z-10 flex min-h-[100svh] w-full items-center px-6 sm:px-10 lg:px-16 xl:px-24">
					<div className="max-w-xl">
						<span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-leaf">
							<span className="size-2 rounded-full bg-leaf" aria-hidden />
							Comercio local, digitalizado
						</span>

						<h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
							{T("inicio.hero.titulo1")}{" "}
							<span className="italic text-yellow-300">
								{T("inicio.hero.titulo2")}
							</span>
						</h1>

						<p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/90">
							{T("inicio.hero.texto")}
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
							{(categorias.datos ?? [])
								.filter((c) => enAlcance(c.slug))
								.map((c) => (
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
				</div>
			</section>

			{/* ======================= El pueblo en el mapa ======================= */}
			<section className="mx-auto max-w-6xl px-4 pt-12">
				<div className="mb-5">
					<h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
						El pueblo en el mapa
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						{T("inicio.mapa.texto")}
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

						{/* Etiqueta del pueblo + crédito de Google Maps */}
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
								href="https://www.google.com/maps"
								target="_blank"
								rel="noreferrer"
								className="pointer-events-auto rounded-full bg-white/85 px-2 py-0.5 text-[10px] text-black/50 backdrop-blur-sm"
							>
								© Google Maps
							</a>
						</div>

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

		{/* ========================== Turismo ========================== */}
		{/*
		 * Fichas sin precios: una de las tres familias del alcance no
		 * vende productos, solo muestra dónde queda cada lugar. El
		 * contenido vive en la base (`zonas_turisticas`, cargadas desde
		 * /admin; lib/turismo.ts solo respalda) y el "camino" cierra en
		 * Google Maps: al presionar la ficha se abre una ventana
		 * flotante con la info previa del lugar y desde ahí el botón
		 * sale hacia el mapa, nunca a un chat de pedido. Con la base
		 * vacía no hay ancla "Turismo" que mostrar. El id es el ancla
		 * del nav y el scroll-mt deja que el título no quede bajo la
		 * pastilla de vidrio.
		 */}
		{lugares.length > 0 && (
			<section
				id="turismo"
				className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-12"
			>
				<div className="mb-5">
					<h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
						Turismo en Repelón
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						{T("inicio.turismo.texto")}
					</p>
				</div>

				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{lugares.map((lugar) => (
					<button
						key={`${lugar.nombre}|${lugar.direccion}`}
						type="button"
						onClick={() => setLugarVentana(lugar)}
						aria-haspopup="dialog"
						aria-label={`Ver información de ${lugar.nombre}`}
						className="glass flex w-full flex-col rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
					>
						{/*
						 * Banda superior: foto real si existe; si no,
						 * ilustración de respaldo (gradiente pastel +
						 * trazo del motivo). El desbordamiento (-m*) la
						 * lleva al borde de la tarjeta.
						 */}
						<div
							role="img"
							aria-label={
								lugar.imagen
									? `${lugar.nombre} (foto)`
									: `${lugar.nombre} (ilustración)`
							}
							className={`relative -mx-5 -mt-5 mb-4 h-36 overflow-hidden rounded-t-3xl ${FONDO_MOTIVO[lugar.motivo]}`}
						>
							{lugar.imagen ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={lugar.imagen}
									alt={lugar.nombre}
									onError={(e) => {
										// URL caída: se apaga la foto y queda el fondo de la ficha
										e.currentTarget.style.display = "none";
									}}
									className="absolute inset-0 h-full w-full object-cover"
								/>
							) : (
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden
									className="absolute -bottom-6 -right-4 h-36 w-36 text-ink/15"
								>
									{MOTIVO_TRAZO[lugar.motivo]}
								</svg>
							)}
						</div>
						<div className="flex items-center gap-2">
								<span className="grid size-9 place-items-center rounded-xl bg-cielo/25 text-azul">
									<svg
										viewBox="0 0 24 24"
										className="size-5"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
										aria-hidden
									>
										<path
											d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z"
											strokeLinejoin="round"
										/>
										<circle cx="12" cy="10.4" r="2.4" />
									</svg>
								</span>
								<h3 className="font-display font-semibold text-ink">
									{lugar.nombre}
								</h3>
							</div>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								{lugar.descripcion}
							</p>
							<p className="mt-2 text-xs text-muted-foreground/80">
								{lugar.direccion}
							</p>
						<span className="glass-soft mt-4 inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-ink">
							Cómo llegar
						</span>
					</button>
				))}
				</div>
			</section>
		)}

			{/* Ventana flotante del lugar turístico elegido */}
			{lugarVentana && (
				<VentanaLugar
					lugar={lugarVentana}
					onCerrar={() => setLugarVentana(null)}
				/>
			)}

			{/* ===================== Comercios del pueblo ===================== */}
			<section className="mx-auto max-w-6xl px-4 pt-12">
			{/*
			 * La caja principal: mientras se escribe filtra la rejilla de
			 * comercios de abajo, y con Enter (o el botón) abre la pantalla
			 * de búsqueda /buscar, que sí llama al endpoint de productos y
			 * pinta lista y mapa al mismo tiempo.
			 */}
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

			{/* ====================== Fondo Emprender ====================== */}
			{/*
			 * La ayuda del SENA, contada en la casa: no es un trámite de
			 * la plataforma (eso vive en /fondo-emprender) pero el que
			 * está por montar su negocio tiene que enterarse acá.
			 */}
			<section id="fondo-emprender" className="mx-auto max-w-6xl px-4 pt-12">
				<div className="glass rounded-3xl bg-gradient-to-br from-azul/10 via-glass/40 to-leaf/10 p-6 md:p-8">
					<div className="flex flex-wrap items-center gap-2">
						<span className="rounded-full bg-azul/15 px-2.5 py-1 text-xs font-semibold text-azul">
							Programa del SENA
						</span>
						<span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold text-leaf">
							Sin intereses
						</span>
					</div>

					<h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
						{T("inicio.fondo.titulo")}
					</h2>
					<p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
						{T("inicio.fondo.texto")}
					</p>

					<div className="mt-5 grid gap-4 sm:grid-cols-3">
						{FONDO_EMPRENDER.map(({ titulo, texto, icono }) => (
							<div key={titulo} className="rounded-2xl bg-glass/70 p-4">
								<div className="grid size-10 place-items-center rounded-xl bg-azul/10 text-azul">
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
								<h3 className="mt-3 font-display text-base font-semibold text-ink">
									{titulo}
								</h3>
								<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
									{texto}
								</p>
							</div>
						))}
					</div>

					<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
						<Link
							href="/fondo-emprender"
							className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-azul px-5 py-3 text-center font-semibold text-white"
						>
							Conocer el Fondo Emprender
						</Link>
						<a
							href="https://www.fondoemprender.com/"
							target="_blank"
							rel="noreferrer"
							className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-azul/30 px-5 py-3 text-center font-semibold text-azul"
						>
							Sitio oficial del SENA
						</a>
						<p className="text-xs leading-relaxed text-muted-foreground">
							La postulación es directamente con el SENA: aquí no se
							cobra nada por postular.
						</p>
					</div>
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
							{T("inicio.cta.titulo")}
						</h3>
						<p className="text-sm text-muted-foreground">
							{T("inicio.cta.texto")}
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
	/*
	 * El logo del mapa puede apuntar a una URL que ya no responde; en
	 * ese caso se dibuja la foto del oficio en su lugar, para que la
	 * fichita nunca quede con la imagen rota.
	 */
	const logo = fotoNegocio(n);
	const [fallaEn, setFallaEn] = useState<string | null>(null);
	const foto = fallaEn === logo ? fotoRespaldo(n.nombre) : logo;

	return (
		<div className="glass rounded-2xl p-3">
			<div className="flex gap-3">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={foto}
					alt=""
					onError={() => setFallaEn(logo)}
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
					className="glass-soft flex min-h-11 flex-1 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-ink"
				>
					Cómo llegar
				</a>
			</div>
		</div>
	);
}

/* ====================================================================
 * Ventana flotante de un lugar turístico
 * ==================================================================== */

/*
 * La idea del botón flotante (estilo FAB de Gmail): al presionar la
 * ficha de un lugar se abre esta ventana con la info previa —foto o
 * ilustración, descripción y dirección— y de ahí el botón sale hacia
 * Google Maps. Se cierra con la X, con "Cerrar", tocando fuera o con
 * Escape; mientras está abierta la página de atrás no se mueve.
 */
function VentanaLugar({
	lugar,
	onCerrar,
}: {
	lugar: LugarTuristico;
	onCerrar: () => void;
}) {
	useEffect(() => {
		const alPulsar = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onCerrar();
			}
		};
		document.addEventListener("keydown", alPulsar);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", alPulsar);
			document.body.style.overflow = "";
		};
	}, [onCerrar]);

	return (
		<div
			className="fixed inset-0 z-[900] flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center"
			onClick={onCerrar}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={`Información de ${lugar.nombre}`}
				onClick={(e) => e.stopPropagation()}
				className="ventana-flotante glass max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl"
			>
				<div
					role="img"
					aria-label={
						lugar.imagen
							? `${lugar.nombre} (foto)`
							: `${lugar.nombre} (ilustración)`
					}
					className={`relative h-44 overflow-hidden rounded-t-3xl ${FONDO_MOTIVO[lugar.motivo]}`}
				>
					{lugar.imagen ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={lugar.imagen}
							alt={lugar.nombre}
							onError={(e) => {
								// URL caída: se apaga la foto y queda el fondo de la ficha
								e.currentTarget.style.display = "none";
							}}
							className="absolute inset-0 h-full w-full object-cover"
						/>
					) : (
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
							className="absolute -bottom-8 -right-6 h-44 w-44 text-ink/15"
						>
							{MOTIVO_TRAZO[lugar.motivo]}
						</svg>
					)}
					<button
						type="button"
						onClick={onCerrar}
						aria-label="Cerrar"
						className="absolute right-3 top-3 size-9 rounded-full bg-white/85 text-ink shadow-float hover:bg-white"
					>
						✕
					</button>
				</div>

				<div className="p-5">
					<h3 className="font-display text-xl font-semibold text-ink">
						{lugar.nombre}
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						{lugar.descripcion}
					</p>
					<p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground/80">
						<svg
							viewBox="0 0 24 24"
							className="mt-0.5 size-4 shrink-0"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							aria-hidden
						>
							<path
								d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z"
								strokeLinejoin="round"
							/>
							<circle cx="12" cy="10.4" r="2.4" />
						</svg>
						<span>{lugar.direccion}</span>
					</p>

					<a
						href={enlaceLugar(lugar)}
						target="_blank"
						rel="noreferrer"
						className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-azul px-4 py-3 text-sm font-semibold text-white"
					>
						<svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
							<path d="M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
						</svg>
						Abrir en Google Maps
					</a>
					<button
						type="button"
						onClick={onCerrar}
						className="glass-soft mt-2 min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-ink"
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
}
