/*
 * Lógica pura de las tablas del panel: filtrar por texto, ordenar por
 * columna y paginar. Vive sin React para poder probarla con vitest.
 *
 * Las secciones definen sus columnas en el módulo (no dentro del
 * componente) para que la lista sea estable entre renders.
 */

export type Direccion = "asc" | "desc";

export type ColumnaOrden<T> = {
	/** Identificador estable de la columna (el mismo que usa ThOrdenable). */
	id: string;
	/** Valor natural de la fila para comparar. */
	valor: (fila: T) => string | number | null | undefined;
	/** Comparador propio cuando `valor` no alcanza. */
	comparar?: (a: T, b: T) => number;
};

/** Minúsculas, sin tildes y sin espacios en los extremos (reglas del español). */
export function normalizar(texto: string): string {
	return texto
		.trim()
		.toLocaleLowerCase("es")
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "");
}

/**
 * Aplica el buscador y el orden activo. No muta la lista original.
 * Los números se comparan como números (2 antes que 10) y el texto con
 * collation española, así "Ávila" queda junto a "avila".
 */
export function filtrarYOrdenar<T>(
	filas: readonly T[],
	texto: string,
	buscar: (fila: T) => string,
	columnas: readonly ColumnaOrden<T>[],
	campo: string | null,
	direccion: Direccion,
): T[] {
	const termino = normalizar(texto);
	const filtradas = termino
		? filas.filter((fila) => normalizar(buscar(fila)).includes(termino))
		: [...filas];

	if (!campo) return filtradas;
	const columna = columnas.find((c) => c.id === campo);
	if (!columna) return filtradas;

	const signo = direccion === "asc" ? 1 : -1;
	return filtradas.sort((a, b) => {
		if (columna.comparar) return signo * columna.comparar(a, b);

		const va = columna.valor(a);
		const vb = columna.valor(b);
		if (typeof va === "number" && typeof vb === "number") {
			return signo * (va - vb);
		}

		const textoA = va == null ? "" : String(va);
		const textoB = vb == null ? "" : String(vb);
		return (
			signo *
			textoA.localeCompare(textoB, "es", {
				numeric: true,
				sensitivity: "base",
			})
		);
	});
}

export type Pagina<T> = {
	visibles: T[];
	total: number;
	paginas: number;
	pagina: number;
	/** Número de la primera fila mostrada (1-based); 0 si no hay filas. */
	desde: number;
	/** Número de la última fila mostrada (1-based); 0 si no hay filas. */
	hasta: number;
};

/** Recorta la lista a la página pedida, corrigiendo números fuera de rango. */
export function paginar<T>(
	filas: readonly T[],
	pagina: number,
	porPagina: number,
): Pagina<T> {
	const total = filas.length;
	const tamano = Math.max(1, porPagina);
	const paginas = Math.max(1, Math.ceil(total / tamano));
	const actual = Math.min(Math.max(1, pagina), paginas);
	const inicio = (actual - 1) * tamano;
	const visibles = filas.slice(inicio, inicio + tamano);
	return {
		visibles: [...visibles],
		total,
		paginas,
		pagina: actual,
		desde: total === 0 ? 0 : inicio + 1,
		hasta: Math.min(inicio + tamano, total),
	};
}
