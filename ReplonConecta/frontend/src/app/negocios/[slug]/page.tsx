"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { MapaMini } from "@/components/Mapa";
import {
	CLASE_BOTON_AZUL,
	CLASE_BOTON_NEUTRO,
	Cargando,
	Foto,
	InsigniaAbierto,
	Vacio,
} from "@/components/ui";
import { useCarrito } from "@/context/CarritoContext";
import { api } from "@/lib/api";
import { pesos } from "@/lib/format";
import { useCoordenadas } from "@/lib/geocodificar";
import { fotoNegocio } from "@/lib/imagenes";
import { enlaceComoLlegar, enlaceVerEnMapa } from "@/lib/maps";
import type { NegocioDetalle, Producto } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

/*
 * Ficha del negocio ("/negocios/[slug]").
 *
 * El orden de la pantalla es el orden en que se decide: foto grande, qué
 * es, si está abierto, cómo llegar, qué vende y cuánto. Ese último par
 * (qué vende / cuánto) es lo único que hay que ver para tocar el botón,
 * así que la rejilla de productos pone la foto, el nombre y el precio
 * juntos, y el botón ocupa todo el ancho de la tarjeta: con un pulgar, un
 * botón pequeño a un lado de la fila se falla.
 *
 * La barra de "Ver carrito" solo aparece si lo que hay en el carrito es
 * de ESTE negocio. Un pedido es de un solo negocio, así que ofrecer el
 * carrito de otro aquí sería llevar al comprador a una pantalla donde
 * tendrá que vaciar lo que acaba de armar.
 */
export default function FichaNegocio() {
	const { slug } = useParams<{ slug: string }>();
	const { agregar, carrito, vaciar, cantidadTotal, total } = useCarrito();

	const { datos: negocio, cargando, error } = useDatos<NegocioDetalle>(
		() => api(`/api/negocios/slug/${encodeURIComponent(slug)}`),
		[slug],
	);
	/*
	 * Mismo truco que en el home: el negocio no trae coordenadas, así
	 * que se resuelven al entrar (una sola vez, guardadas) y con ellas
	 * se puede dibujar el mapa de la ficha y abrir OpenStreetMap en el
	 * punto exacto.
	 */
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
				<Link
					href="/"
					className={`${CLASE_BOTON_AZUL} mt-4`}
				>
					Volver al mapa
				</Link>
			</div>
		);
	}

	const disponibles = negocio.productos.filter((p) => p.disponible);
	/*
	 * Coordenadas a usar en la ficha: las de la base si vienen, o las
	 * que resolvió useCoordenadas a partir de la dirección escrita.
	 * Con ellas el mapa tiene dónde poner el pin y OpenStreetMap abre
	 * exactamente en el negocio y no en el centro del pueblo.
	 */
	const lat = negocio.latitud ?? coordenadas[negocio.id]?.lat ?? null;
	const lng = negocio.longitud ?? coordenadas[negocio.id]?.lng ?? null;
	const ubicacion = lat != null && lng != null ? { ...negocio, latitud: lat, longitud: lng } : negocio;
	const enCarrito = carrito?.negocioId === negocio.id;
	const unidadesDe = (productoId: string) =>
		carrito?.items.find((i) => i.productoId === productoId)?.cantidad ?? 0;

	return (
		<div className="pb-4">
			{/* Foto grande. No solo texto: es la primera señal de si es o no
			    el negocio que uno tiene en mente. */}
			<Foto
				src={fotoNegocio(negocio)}
				alt={`Logo de ${negocio.nombre}`}
				className="h-44 w-full sm:h-56 md:h-72"
			/>

			{/*
			 * En PC la ficha se parte en dos columnas: a la izquierda lo
			 * que se lee (nombre, dirección, descripción), a la derecha lo
			 * que se mira y se toca (cómo llegar y el mapa). En móvil
			 * siguen apiladas, en el mismo orden de siempre.
			 */}
			<div className="md:grid md:grid-cols-2 md:items-start md:gap-6 lg:gap-10">
				<div className="px-4 pt-4">
					<div className="flex items-start justify-between gap-2">
						<h1 className="text-2xl font-bold leading-tight">{negocio.nombre}</h1>
						<InsigniaAbierto abierto={negocio.abierto} />
					</div>

					<p className="mt-1 text-sm text-black/60">
						{negocio.barrio ?? "Repelón"} · {negocio.direccion}
					</p>

					{negocio.descripcion && (
						<p className="mt-3 text-sm text-black/70">{negocio.descripcion}</p>
					)}

					{negocio.whatsapp && (
						<a
							href={`https://wa.me/${negocio.whatsapp.replace(/\D/g, "")}`}
							target="_blank"
							rel="noreferrer"
							className={`${CLASE_BOTON_NEUTRO} mt-4 justify-start`}
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
							Escribir por WhatsApp · {negocio.whatsapp}
						</a>
					)}
				</div>

				{/* Dónde está y cómo llegar. El botón va primero y grande: es la
				    acción que hace la gente que ya sabe qué quiere comprar. */}
				<section className="mt-5 px-4 md:mt-0">
					<a
						href={enlaceComoLlegar(ubicacion)}
						target="_blank"
						rel="noreferrer"
						className={CLASE_BOTON_AZUL}
					>
						Cómo llegar
					</a>

					<a
						href={enlaceVerEnMapa(ubicacion)}
						target="_blank"
						rel="noreferrer"
						className={`${CLASE_BOTON_NEUTRO} mt-2`}
					>
						Ver en OpenStreetMap
					</a>

					<div className="mt-3">
						{lat != null && lng != null ? (
							<MapaMini
								lat={lat}
								lng={lng}
								nombre={negocio.nombre}
								abierto={negocio.abierto}
							/>
						) : (
							<p className="rounded-2xl bg-black/[.03] px-4 py-3 text-sm text-black/60">
								{negocio.direccion}
								{negocio.referenciaUbicacion
									? ` · ${negocio.referenciaUbicacion}`
									: ""}
							</p>
						)}
					</div>
				</section>
			</div>

			<section className="mt-6 px-4">
				<div className="flex items-baseline justify-between gap-2">
					<h2 className="text-lg font-bold">Productos</h2>
					{disponibles.length > 0 && (
						<span className="text-sm text-black/50">{disponibles.length}</span>
					)}
				</div>

				{!negocio.abierto && disponibles.length > 0 && (
					<p className="mt-2 rounded-xl border border-black/15 bg-black/[.03] px-3 py-2 text-sm text-black/70">
						El negocio está cerrado ahora. Puedes armar el pedido, pero confirma
						antes de enviarlo.
					</p>
				)}

				{disponibles.length === 0 ? (
					<Vacio titulo="Este negocio aún no tiene productos" />
				) : (
					<ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{disponibles.map((p) => {
							const unidades = unidadesDe(p.id);
							return (
								<li
									key={p.id}
									className="flex flex-col overflow-hidden rounded-2xl border border-black/10"
								>
									<Foto src={p.imagenUrl} alt={p.nombre} className="h-24 w-full" />
									<div className="flex flex-1 flex-col p-2.5">
										<p className="line-clamp-2 text-sm font-medium leading-tight">
											{p.nombre}
										</p>

										<p className="mt-1 text-base font-bold">{pesos(p.precio)}</p>

										{p.stock != null && p.stock <= 5 && (
											<p className="text-xs text-black/50">
												{p.stock === 0 ? "Agotado" : `Quedan ${p.stock}`}
											</p>
										)}

										{unidades > 0 && (
											<p className="text-xs font-medium text-azul">
												{unidades === 1 ? "1 en el carrito" : `${unidades} en el carrito`}
											</p>
										)}

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
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>

			{enCarrito && cantidadTotal > 0 && (
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
