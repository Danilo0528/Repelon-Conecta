import { describe, expect, it } from "vitest";

import {
	filtrarYOrdenar,
	normalizar,
	paginar,
	type ColumnaOrden,
} from "./tabla";

type Fila = {
	nombre: string;
	total: number;
	fecha: string;
	etiqueta: string | null;
};

const COLUMNAS: ColumnaOrden<Fila>[] = [
	{ id: "nombre", valor: (f) => f.nombre },
	{ id: "total", valor: (f) => f.total },
	{ id: "fecha", valor: (f) => f.fecha },
	{ id: "etiqueta", valor: (f) => f.etiqueta },
];

const FILAS: Fila[] = [
	{ nombre: "Ávila", total: 10, fecha: "2026-11-03", etiqueta: null },
	{ nombre: "Bogotá", total: 2, fecha: "2026-11-01", etiqueta: "activo" },
	{ nombre: "cartagena", total: 30, fecha: "2026-11-02", etiqueta: "activo" },
];

describe("normalizar", () => {
	it("recorta, pasa a minúsculas y quita tildes", () => {
		expect(normalizar("  Ávila  ")).toBe("avila");
	});
});

describe("filtrarYOrdenar", () => {
	it("sin texto ni campo devuelve una copia sin mutar la original", () => {
		const resultado = filtrarYOrdenar(FILAS, "", () => "", COLUMNAS, null, "asc");
		expect(resultado).toEqual(FILAS);
		expect(resultado).not.toBe(FILAS);
	});

	it("filtra sin importar mayúsculas ni tildes", () => {
		const resultado = filtrarYOrdenar(
			FILAS,
			"AVILA",
			(f) => f.nombre,
			COLUMNAS,
			null,
			"asc",
		);
		expect(resultado.map((f) => f.nombre)).toEqual(["Ávila"]);
	});

	it("ordena números como números, no como texto", () => {
		const resultado = filtrarYOrdenar(
			FILAS,
			"",
			(f) => f.nombre,
			COLUMNAS,
			"total",
			"asc",
		);
		expect(resultado.map((f) => f.total)).toEqual([2, 10, 30]);
	});

	it("invierte con dirección desc", () => {
		const resultado = filtrarYOrdenar(
			FILAS,
			"",
			(f) => f.nombre,
			COLUMNAS,
			"total",
			"desc",
		);
		expect(resultado.map((f) => f.total)).toEqual([30, 10, 2]);
	});

	it("ordena texto con collation española", () => {
		const resultado = filtrarYOrdenar(
			FILAS,
			"",
			(f) => f.nombre,
			COLUMNAS,
			"nombre",
			"asc",
		);
		expect(resultado.map((f) => f.nombre)).toEqual([
			"Ávila",
			"Bogotá",
			"cartagena",
		]);
	});

	it("trata null como texto vacío", () => {
		const resultado = filtrarYOrdenar(
			FILAS,
			"",
			(f) => f.nombre,
			COLUMNAS,
			"etiqueta",
			"asc",
		);
		expect(resultado[0]?.etiqueta).toBeNull();
	});

	it("ignora un campo de orden desconocido", () => {
		const resultado = filtrarYOrdenar(
			FILAS,
			"",
			(f) => f.nombre,
			COLUMNAS,
			"no-existe",
			"asc",
		);
		expect(resultado).toEqual(FILAS);
	});
});

describe("paginar", () => {
	it("recorta a la página pedida", () => {
		const pagina = paginar(FILAS, 2, 2);
		expect(pagina.visibles.map((f) => f.nombre)).toEqual(["cartagena"]);
		expect(pagina).toMatchObject({ total: 3, paginas: 2, pagina: 2, desde: 3, hasta: 3 });
	});

	it("corrige una página fuera de rango", () => {
		const pagina = paginar(FILAS, 99, 2);
		expect(pagina.pagina).toBe(2);
		expect(pagina.desde).toBe(3);
	});

	it("con lista vacía devuelve 0–0 pero una página", () => {
		const pagina = paginar([], 1, 10);
		expect(pagina).toMatchObject({ total: 0, paginas: 1, pagina: 1, desde: 0, hasta: 0 });
		expect(pagina.visibles).toEqual([]);
	});

	it("evita división por cero usando una fila por página", () => {
		const pagina = paginar(FILAS, 1, 0);
		expect(pagina.visibles).toHaveLength(1);
		expect(pagina.paginas).toBe(3);
	});
});
