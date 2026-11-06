"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/lib/api";
import { creditoImagen } from "@/lib/creditos";
import { conCoordenadas, useCoordenadas } from "@/lib/geocodificar";
import { imagenesInicio, textoInicio, creditosInicio } from "@/lib/inicio";
import type { Categoria, Negocio, ZonaTuristica } from "@/lib/tipos";
import { LUGARES_TURISMO, zonaALugar, type LugarTuristico } from "@/lib/turismo";
import { useDatos } from "@/lib/useDatos";

type ControlZoom = { current: ((direccion: 1 | -1) => void) | null };

/**
 * Estado del home: catálogo, textos editables, slider del hero, zonas
 * turísticas y la búsqueda local.
 *
 * Los datos se piden una sola vez y se filtran en el navegador: el
 * buscador no vuelve a golpear al servidor por cada tecla. Las
 * secciones reciben este objeto y solo se encargan de pintar.
 */
export function useInicio() {
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
	 * Slider de fondo del hero: las imágenes las ordena el panel desde
	 * /admin/contenido, y mientras nadie las toca salen las de siempre.
	 * El paso se guarda por módulo y no por la longitud directa, y el
	 * índice visible se recorta: si el admin acorta la lista con la
	 * portada abierta, el slider no se sale en vez de clavarse en un
	 * fondo transparente.
	 */
	const imagenesHero = imagenesInicio(textos.datos);
	const [heroIdx, setHeroIdx] = useState(0);
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const t = setInterval(
			() => setHeroIdx((i) => (i + 1) % imagenesHero.length),
			6000,
		);
		return () => clearInterval(t);
	}, [imagenesHero.length]);
	const indiceHero = heroIdx % imagenesHero.length;

	/* Crédito de la imagen visible: primero el editable del panel, luego
	 * el registro de respaldo de lib/creditos.ts. */
	const creditosHero = creditosInicio(textos.datos);
	const creditoHero =
		creditosHero[indiceHero]?.trim() ||
		creditoImagen(imagenesHero[indiceHero] ?? "");

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

	return {
		texto,
		setTexto,
		soloAbiertos,
		setSoloAbiertos,
		seleccionId,
		setSeleccionId,
		lugarVentana,
		setLugarVentana,
		controlRef,
		categorias,
		negocios,
		textos,
		T,
		imagenesHero,
		indiceHero,
		creditoHero,
		zonas,
		lugares,
		lista,
		catalogo,
		filtrados,
		seleccion,
	};
}

export type InicioState = ReturnType<typeof useInicio>;
