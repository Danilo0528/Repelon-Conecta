"use client";

import { SeccionCategorias } from "../SeccionCategorias";
import { SeccionCultura } from "../SeccionCultura";
import { SeccionHeroInicio } from "../SeccionHeroInicio";
import { SeccionTextosInicio } from "../SeccionTextosInicio";

/*
 * Módulo Contenido: lo que la portada dice y muestra — qué categorías
 * se ven, qué textos dice el home, qué imágenes rotan en el titular y
 * qué publicaciones tiene el feed de Cultura (/cultura).
 * Las zonas turísticas tienen su propia dirección (/admin/zonas): es el
 * módulo con mapa y geolocalización, y el menú del panel las nombra
 * aparte.
 */
export default function PaginaContenido() {
	return (
		<div>
			<h1 className="text-[18px] font-medium leading-tight">Contenido del sitio</h1>
			<p className="mt-0.5 text-[12px] text-black/45">
				Categorías, textos, imágenes del home y el feed de Cultura: todo lo que el público ve en la portada y en /cultura.
			</p>
			<SeccionCategorias />
			<SeccionHeroInicio />
			<SeccionTextosInicio />
			<SeccionCultura />
		</div>
	);
}
