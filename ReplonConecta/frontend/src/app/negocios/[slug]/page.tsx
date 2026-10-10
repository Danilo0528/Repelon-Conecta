"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { MapaMini } from "@/components/Mapa";
import {
	CLASE_BOTON_AZUL,
	CLASE_BOTON_VERDE,
	Cargando,
	Foto,
	InsigniaAbierto,
	Vacio,
} from "@/components/ui";
import { useCarrito } from "@/context/CarritoContext";
import { api } from "@/lib/api";
import { COMPRAS_ACTIVAS } from "@/lib/compras";
import { pesos } from "@/lib/format";
import { useCoordenadas } from "@/lib/geocodificar";
import { fotoNegocio } from "@/lib/imagenes";
import { enlaceComoLlegar, enlaceVerEnGoogleMaps } from "@/lib/maps";
import type { NegocioDetalle, Producto } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { enlaceWhatsApp, mensajeConsulta } from "@/lib/whatsapp";

/*
 * Ficha del negocio ("/negocios/[slug]").
 *
 * La pantalla responde tres preguntas en orden: ¿qué es?, ¿dónde está?,
 * ¿qué vende? El banner con el nombre superpuesto responde la primera de
 * un vistazo; el bloque de acciones (WhatsApp + Cómo llegar + mapa)
 * responde la segunda; la rejilla de productos la tercera.
 *
 * Todo enlace de ubicación va a Google Maps: "Cómo llegar" propone la
 * ruta desde el centro del pueblo, "Ver en Google Maps" muestra el punto
 * sin ruta. El mapa embebido es Google Maps JS API.
 *
 * El botón "Agregar", el contador "N en el carrito" y la barra de
 * "Ver carrito" están ocultos mientras COMPRAS_ACTIVAS sea false.
 */
export default function FichaNegocio() {
	return (
		<Suspense fallback={<Cargando texto="Abriendo el comercio…" />}>
			<Ficha />
		</Suspense>
	);
}

function Ficha() {
	const { slug } = useParams<{ slug: string }>();
	const productoInteres = useSearchParams().get("producto");
	const { agregar, carrito, vaciar, cantidadTotal, total } = useCarrito();

	const { datos: negocio, cargando, error } = useDatos<NegocioDetalle>(
		() => api(`/api/negocios/slug/${encodeURIComponent(slug)}`),
		[slug],
	);
	const coordenadas = useCoordenadas(negocio ? [negocio] : []);

	function agregarProducto(producto: Producto) {
		const otroNegocio =
			carrito != null && carrito.negocioId !== producto.negocioId;

		if (otroNegocio) {
			const confirmar = window.confirm(
				`Tu carrito es de "${carrito?.negocioNombre}". Un pedido solo puede ser de un negocio. ¿Vaciar el carrito y empezar con "${negocio?.nombre}"?`,
			);
			if (!confirmar) return;
			vaciar();
		}

		agregar(producto);
	}

	if (cargando) return <Cargando />;

	if (error || !negocio) {
		return (
			<div className="px-4 pt-4">
				<p className="text-sm">{error ?? "No se encontró el negocio."}</p>
				<Link href="/" className={`${CLASE_BOTON_AZUL} mt-4`}>
					Volver al mapa
				</Link>
			</div>
		);
	}

	const disponibles = negocio.productos.filter((p) => p.disponible);
	const lat = negocio.latitud ?? coordenadas[negocio.id]?.lat ?? null;
	const lng = negocio.longitud ?? coordenadas[negocio.id]?.lng ?? null;
	const ubicacion =
		lat != null && lng != null
			? { ...negocio, latitud: lat, longitud: lng }
			: negocio;
	const enCarrito = carrito?.negocioId === negocio.id;
	const unidadesDe = (productoId: string) =>
		carrito?.items.find((i) => i.productoId === productoId)?.cantidad ?? 0;

	return (
		<div className="pb-4">
			{/*
			 * Banner: foto a todo el ancho con el nombre y el estado
			 * superpuestos abajo a la izquierda, sobre un degradado que
			 * garantiza legibilidad sin importar la foto.
			 */}
			<div className="relative">
				<Foto
					src={fotoNegocio(negocio)}
					alt={negocio.nombre}
					className="h-52 w-full object-cover sm:h-64 md:h-80"
				/>
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-16">
					<div className="flex items-end justify-between gap-3">
						<h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
							{negocio.nombre}
						</h1>
						<InsigniaAbierto abierto={negocio.abierto} />
					</div>
					<p className="mt-1 text-sm text-white/80">
						{negocio.barrio ?? "Repelón"} · {negocio.direccion}
					</p>
				</div>
			</div>

			{/*
			 * En PC: dos columnas. Izquierda = lo que se lee (descripción,
			 * horario). Derecha = lo que se hace (WhatsApp, Cómo llegar,
			 * mapa). En móvil van apiladas en ese mismo orden.
			 */}
			<div className="md:grid md:grid-cols-2 md:items-start md:gap-6 lg:gap-10">
				{/* Info */}
				<div className="px-4 pt-4">
					{negocio.descripcion && (
						<p className="text-sm leading-relaxed text-black/70">
							{negocio.descripcion}
						</p>
					)}

					<Horario json={negocio.horario} />
				</div>

				{/* Acciones + mapa */}
				<section className="mt-4 px-4 md:mt-4">
					{negocio.whatsapp && (
						<a
							href={enlaceWhatsApp(
								negocio.whatsapp,
								mensajeConsulta(negocio.nombre, productoInteres),
							)}
							target="_blank"
							rel="noreferrer"
							className={CLASE_BOTON_VERDE}
						>
							<svg
								className="h-5 w-5 shrink-0"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden
							>
								<path
									d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"
									strokeLinejoin="round"
								/>
							</svg>
							Escribir por WhatsApp
						</a>
					)}

					<a
						href={enlaceComoLlegar(ubicacion)}
						target="_blank"
						rel="noreferrer"
						className={`${CLASE_BOTON_AZUL} mt-2`}
					>
						<svg
							className="h-5 w-5 shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden
						>
							<path
								d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
								strokeLinejoin="round"
							/>
							<circle cx="12" cy="9" r="2.5" />
						</svg>
						Cómo llegar
					</a>

					{/*
					 * Mapa embebido. Si no hay coordenadas (ni resueltas)
					 * se muestra la dirección escrita con un enlace a
					 * Google Maps para buscarla.
					 */}
					<div className="mt-3">
						{lat != null && lng != null ? (
							<>
								<MapaMini
									lat={lat}
									lng={lng}
									nombre={negocio.nombre}
									abierto={negocio.abierto}
								/>
								<a
									href={enlaceVerEnGoogleMaps(ubicacion)}
									target="_blank"
									rel="noreferrer"
									className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-azul"
								>
									Ver en Google Maps
									<svg
										className="h-4 w-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										aria-hidden
									>
										<path
											d="M7 17L17 7M17 7H7M17 7v10"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</a>
							</>
						) : (
							<div className="rounded-2xl bg-black/[.03] px-4 py-3">
								<p className="text-sm text-black/60">
									{negocio.direccion}
									{negocio.referenciaUbicacion
										? ` · ${negocio.referenciaUbicacion}`
										: ""}
								</p>
								<a
									href={enlaceVerEnGoogleMaps(ubicacion)}
									target="_blank"
									rel="noreferrer"
									className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-azul"
								>
									Buscar en Google Maps
									<svg
										className="h-4 w-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										aria-hidden
									>
										<path
											d="M7 17L17 7M17 7H7M17 7v10"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</a>
							</div>
						)}
					</div>
				</section>
			</div>

			{/* Productos */}
			<section className="mt-8 px-4">
				<div className="flex items-baseline justify-between gap-2">
					<h2 className="text-lg font-bold">Productos</h2>
					{disponibles.length > 0 && (
						<span className="text-sm text-black/50">
							{disponibles.length}
						</span>
					)}
				</div>

				{!negocio.abierto && disponibles.length > 0 && (
					<p className="mt-2 rounded-xl border border-black/15 bg-black/[.03] px-3 py-2 text-sm text-black/70">
						El negocio está cerrado ahora.{" "}
						{COMPRAS_ACTIVAS
							? "Puedes armar el pedido, pero confirma antes de enviarlo."
							: "Si quieres ir, confirma antes con el dueño."}
					</p>
				)}

				{disponibles.length === 0 ? (
					<Vacio titulo="Este negocio aún no tiene productos" />
				) : (
					<ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
						{disponibles.map((p) => {
							const unidades = unidadesDe(p.id);
							return (
								<li
									key={p.id}
									className="flex flex-col overflow-hidden rounded-2xl border border-black/10"
								>
									<Foto
										src={p.imagenUrl}
										alt={p.nombre}
										className="aspect-square w-full"
									/>
									<div className="flex flex-1 flex-col p-3">
										<p className="line-clamp-2 text-sm font-medium leading-tight">
											{p.nombre}
										</p>

										<p className="mt-1.5 text-base font-bold">
											{pesos(p.precio)}
											{p.unidad && (
												<span className="text-xs font-medium text-black/50">
													{" "}
													/ {p.unidad === "LIBRA" ? "libra" : "kilo"}
												</span>
											)}
										</p>

										{p.stock != null && p.stock <= 5 && (
											<p className="mt-0.5 text-xs text-black/50">
												{p.stock === 0
													? "Agotado"
													: `Quedan ${p.stock}`}
											</p>
										)}

										{COMPRAS_ACTIVAS && unidades > 0 && (
											<p className="mt-0.5 text-xs font-medium text-azul">
												{unidades === 1
													? "1 en el carrito"
													: `${unidades} en el carrito`}
											</p>
										)}

										{COMPRAS_ACTIVAS && (
											<button
												type="button"
												onClick={() => agregarProducto(p)}
												disabled={p.stock === 0}
												className={`${CLASE_BOTON_AZUL} mt-auto pt-2.5`}
												aria-label={`Agregar ${p.nombre} al carrito`}
											>
												<span aria-hidden className="text-xl leading-none">
													+
												</span>
												Agregar
											</button>
										)}
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>

			{COMPRAS_ACTIVAS && enCarrito && cantidadTotal > 0 && (
				<div className="fixed inset-x-0 bottom-nav-total z-20 px-4 pb-2">
					<Link
						href="/carrito"
						className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl bg-azul px-4 py-3.5 font-semibold text-white shadow-lg"
					>
						<span>Ver carrito ({cantidadTotal})</span>
						<span>{pesos(total)}</span>
					</Link>
				</div>
			)}
		</div>
	);
}

/* ====================================================================
 * Horario de la semana
 * ==================================================================== */

const DIAS_HORARIO: { clave: string; nombre: string }[] = [
	{ clave: "lunes", nombre: "Lun" },
	{ clave: "martes", nombre: "Mar" },
	{ clave: "miercoles", nombre: "Mié" },
	{ clave: "jueves", nombre: "Jue" },
	{ clave: "viernes", nombre: "Vie" },
	{ clave: "sabado", nombre: "Sáb" },
	{ clave: "domingo", nombre: "Dom" },
];

/*
 * El horario llega de la base como el JSON armado en el alta del
 * negocio. Se lee a mano y se pinta compacto, con el día de hoy en
 * negrita y fondo sutil. Si el JSON viene roto o vacío no se pinta
 * nada en vez de romper la pantalla.
 */
function Horario({ json }: { json: string | null }) {
	if (!json) return null;

	let datos: Record<string, { abre: string; cierra: string } | null> | null =
		null;
	try {
		datos = JSON.parse(json);
	} catch {
		datos = null;
	}

	const horario = datos;
	if (!horario || typeof horario !== "object") return null;

	const hoyClave = [
		"domingo",
		"lunes",
		"martes",
		"miercoles",
		"jueves",
		"viernes",
		"sabado",
	][new Date().getDay()];

	return (
		<section className="mt-5">
			<h2 className="text-sm font-semibold text-black/50">Horario</h2>
			<ul className="mt-1.5 space-y-0.5 text-sm">
				{DIAS_HORARIO.map(({ clave, nombre }) => {
					const dia = horario[clave];
					const esHoy = clave === hoyClave;
					return (
						<li
							key={clave}
							className={`flex items-baseline justify-between gap-2 rounded-md px-2 py-1 ${
								esHoy
									? "bg-black/[.04] font-semibold text-ink"
									: "text-black/55"
							}`}
						>
							<span>{nombre}</span>
							<span className="tabular-nums">
								{dia ? `${dia.abre}–${dia.cierra}` : "Cerrado"}
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
