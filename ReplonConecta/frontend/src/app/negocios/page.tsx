"use client";

import Link from "next/link";
import { useState } from "react";

import { Aviso, Cargando, Chip, Foto, InsigniaAbierto, Vacio } from "@/components/ui";
import { api } from "@/lib/api";
import { PISTA_SIN_PRODUCTOS, enAlcance } from "@/lib/alcance";
import { fotoNegocio } from "@/lib/imagenes";
import type { Categoria, Negocio } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

/*
 * Lista de negocios ("/negocios"): la alternativa al mapa.
 *
 * El mapa es la pantalla principal porque en un pueblo lo que importa es
 * "dónde está", pero buscar por nombre o recorrer por barrio se hace
 * mucho mejor en una rejilla. Las dos pantallas leen el mismo endpoint
 * con los mismos filtros, de modo que el resultado es el conjunto
 * completo y no un subconjunto distinto.
 *
 * La rejilla es de rejilla y no un feed: cada tarjeta es una foto,
 * un nombre y un dato, en ese orden de peso. Nada de sombra gruesa ni de
 * texto secundario; si un dato no cabe, no cabe. Son dos columnas en
 * móvil y crece hasta cuatro en PC, que es donde el ancho sobra.
 */
export default function ListaNegocios() {
	const [texto, setTexto] = useState("");
	const [categoriaId, setCategoriaId] = useState<string | null>(null);
	const [barrio, setBarrio] = useState("");
	const [soloAbiertos, setSoloAbiertos] = useState(false);

	const categorias = useDatos<Categoria[]>(() => api("/api/categorias"), []);
	const barrios = useDatos<string[]>(() => api("/api/negocios/barrios"), []);

	const negocios = useDatos<Negocio[]>(() => {
		const parametros = new URLSearchParams();
		if (texto.trim()) parametros.set("texto", texto.trim());
		if (categoriaId) parametros.set("categoriaId", categoriaId);
		if (barrio) parametros.set("barrio", barrio);
		if (soloAbiertos) parametros.set("abierto", "true");
		const qs = parametros.toString();
		return api(`/api/negocios${qs ? `?${qs}` : ""}`);
	}, [texto, categoriaId, barrio, soloAbiertos]);

	const hayFiltros =
		texto.trim() !== "" || categoriaId != null || barrio !== "" || soloAbiertos;

	/*
	 * La pista de la categoría vacía: si el filtro elegido es turismo
	 * (que no tiene productos con precio) se explica el porqué en vez
	 * de dejar un vacío mudo. Cualquier otro filtro vacío sigue con el
	 * mensaje genérico de siempre.
	 */
	const categoriaActual = (categorias.datos ?? []).find((c) => c.id === categoriaId);
	const pista = categoriaActual ? PISTA_SIN_PRODUCTOS[categoriaActual.slug] : undefined;

	let textoVacio = "Todavía no hay negocios registrados.";
	if (hayFiltros) {
		textoVacio = "Prueba con otra búsqueda o quita los filtros.";
	}
	if (pista) {
		textoVacio = pista;
	}

	return (
		<div className="px-4 pt-4">
			<div className="flex items-baseline justify-between gap-2">
				<h1 className="text-xl font-bold">Negocios en Repelón</h1>
				<Link href="/" className="shrink-0 text-sm font-medium text-azul">
					Ver mapa
				</Link>
			</div>

			<input
				type="search"
				value={texto}
				onChange={(e) => setTexto(e.target.value)}
				placeholder="Busca yuca, pescado, mojarra…"
				className="mt-3 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-azul md:max-w-xl"
				aria-label="Buscar negocios o productos"
			/>

			<div className="mt-3 flex gap-2 overflow-x-auto pb-1">
				<Chip activo={soloAbiertos} onClick={() => setSoloAbiertos((v) => !v)}>
					Abiertos ahora
				</Chip>
				<Chip activo={categoriaId === null} onClick={() => setCategoriaId(null)}>
					Todo
				</Chip>
				{(categorias.datos ?? [])
					.filter((c) => enAlcance(c.slug))
					.map((c) => (
						<Chip
							key={c.id}
							activo={categoriaId === c.id}
							onClick={() => setCategoriaId(c.id)}
						>
							{c.nombre}
						</Chip>
					))}
			</div>

			{(barrios.datos ?? []).length > 0 && (
				<select
					value={barrio}
					onChange={(e) => setBarrio(e.target.value)}
					className="mt-3 w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm md:max-w-xs"
					aria-label="Filtrar por barrio"
				>
					<option value="">Todos los barrios</option>
					{(barrios.datos ?? []).map((b) => (
						<option key={b} value={b}>
							{b}
						</option>
					))}
				</select>
			)}

			{negocios.error && (
				<div className="mt-3">
					<Aviso tono="error">
						No se pudo cargar la lista: {negocios.error}
					</Aviso>
				</div>
			)}

			{negocios.cargando && <Cargando />}

			{!negocios.cargando && !negocios.error && (negocios.datos ?? []).length === 0 && (
				<Vacio titulo="No hay negocios con ese filtro" texto={textoVacio}>
					{hayFiltros && (
						<button
							type="button"
							onClick={() => {
								setTexto("");
								setCategoriaId(null);
								setBarrio("");
								setSoloAbiertos(false);
							}}
							className="rounded-xl bg-azul px-4 py-3 text-sm font-semibold text-white"
						>
							Quitar filtros
						</button>
					)}
				</Vacio>
			)}

			<ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{(negocios.datos ?? []).map((n) => (
					<li key={n.id}>
						<Link
							href={`/negocios/${n.slug}`}
							className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 active:bg-black/[.03]"
						>
							<Foto
								src={fotoNegocio(n)}
								alt={`Foto de ${n.nombre}`}
								className="h-28 w-full"
							/>
							<div className="flex flex-1 flex-col p-3">
								<p className="line-clamp-2 font-semibold leading-tight">{n.nombre}</p>
								<div className="mt-auto pt-2">
									<InsigniaAbierto abierto={n.abierto} />
									<p className="mt-1.5 text-xs text-black/55">
										{n.barrio ?? "Repelón"} · {n.cantidadProductos} prod.
									</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
