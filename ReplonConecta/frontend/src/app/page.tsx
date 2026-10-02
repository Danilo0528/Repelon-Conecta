"use client";

import Link from "next/link";
import { useState } from "react";

import { Aviso, Cargando, Vacio } from "@/components/ui";
import { api } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/env";
import type { Categoria, Negocio } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function Inicio() {
	const [texto, setTexto] = useState("");
	const [categoriaId, setCategoriaId] = useState<string | null>(null);
	const [barrio, setBarrio] = useState("");

	const categorias = useDatos<Categoria[]>(() => api("/api/categorias"), []);
	const barrios = useDatos<string[]>(() => api("/api/negocios/barrios"), []);

	const negocios = useDatos<Negocio[]>(() => {
		const parametros = new URLSearchParams();
		if (texto.trim()) parametros.set("texto", texto.trim());
		if (categoriaId) parametros.set("categoriaId", categoriaId);
		if (barrio) parametros.set("barrio", barrio);
		const qs = parametros.toString();
		return api(`/api/negocios${qs ? `?${qs}` : ""}`);
	}, [texto, categoriaId, barrio]);

	return (
		<div>
			{!supabaseConfigurado && (
				<div className="px-4 pt-4">
					<Aviso tono="info">
						Falta configurar Supabase en <code>.env.local</code>. El catálogo se ve,
						pero no podrás iniciar sesión ni pedir.
					</Aviso>
				</div>
			)}

			<section className="px-4 pt-4">
				<h1 className="text-xl font-bold">¿Qué necesitas hoy?</h1>
				<p className="text-sm text-black/60">
					Pide a los negocios de Repelón y recibe en tu casa.
				</p>

				<input
					type="search"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Busca pan, mercado, droguería…"
					className="mt-3 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-azul"
					aria-label="Buscar negocios o productos"
				/>

				<div className="mt-3 flex gap-2 overflow-x-auto pb-1">
					<button
						type="button"
						onClick={() => setCategoriaId(null)}
						className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
							categoriaId === null
								? "bg-verde text-white"
								: "border border-black/15 text-black/70"
						}`}
					>
						Todo
					</button>
					{(categorias.datos ?? []).map((c) => (
						<button
							key={c.id}
							type="button"
							onClick={() => setCategoriaId(c.id)}
							className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
								categoriaId === c.id
									? "bg-verde text-white"
									: "border border-black/15 text-black/70"
							}`}
						>
							{c.nombre}
						</button>
					))}
				</div>

				{(barrios.datos ?? []).length > 0 && (
					<select
						value={barrio}
						onChange={(e) => setBarrio(e.target.value)}
						className="mt-3 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
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
			</section>

			<section className="mt-4 px-4">
				{negocios.cargando && <Cargando />}

				{negocios.error && (
					<Aviso tono="error">
						No se pudo cargar el catálogo: {negocios.error}
					</Aviso>
				)}

				{!negocios.cargando && !negocios.error && (negocios.datos ?? []).length === 0 && (
					<Vacio
						titulo="No hay negocios con ese filtro"
						texto="Prueba con otra búsqueda o quita los filtros."
					/>
				)}

				<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{(negocios.datos ?? []).map((n) => (
						<li key={n.id}>
							<Link
								href={`/negocios/${n.slug}`}
								className="flex h-full flex-col rounded-2xl border border-black/10 p-4 shadow-sm active:bg-black/[.03]"
							>
								<div className="flex items-start justify-between gap-2">
									<span className="font-semibold leading-tight">{n.nombre}</span>
									<span
										className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
											n.abierto
												? "bg-verde text-white"
												: "bg-black/60 text-white"
										}`}
									>
										{n.abierto ? "Abierto" : "Cerrado"}
									</span>
								</div>
								{n.descripcion && (
									<p className="mt-1 line-clamp-2 text-sm text-black/60">
										{n.descripcion}
									</p>
								)}
								<p className="mt-2 text-xs text-black/50">
									{n.barrio ?? "Repelón"} · {n.cantidadProductos} productos
								</p>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
