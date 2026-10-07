import { describe, expect, it } from "vitest";

import { fotoNegocio, fotoRespaldo } from "@/lib/imagenes";

/*
 * El logo llega de la base y puede ser una URL que ya no existe. La
 * foto del oficio es el respaldo: la tarjeta nunca queda con la
 * imagen rota, y las locales de /public/img siempre responden.
 */

describe("fotoRespaldo", () => {
	it("reconoce el oficio por el nombre", () => {
		expect(fotoRespaldo("Agro Repelón")).toBe("/img/campo.jpg");
		expect(fotoRespaldo("La Panadería del Pueblo")).toBe("/img/panaderia.jpg");
		expect(fotoRespaldo("Ferretería El Clavo")).toBe("/img/ferreteria.jpg");
	});

	it("si no reconoce el oficio usa la tienda genérica", () => {
		expect(fotoRespaldo("Pescadería La Barra")).toBe("/img/tienda.jpg");
	});
});

describe("fotoNegocio", () => {
	it("sin logo cae en la foto del oficio", () => {
		expect(fotoNegocio({ nombre: "Agro Repelón", logoUrl: "" })).toBe(
			"/img/campo.jpg",
		);
		expect(fotoNegocio({ nombre: "Agro Repelón", logoUrl: null })).toBe(
			"/img/campo.jpg",
		);
		expect(fotoNegocio({ nombre: "Agro Repelón" })).toBe("/img/campo.jpg");
	});

	it("con logo usa el logo (absoluto o ruta local)", () => {
		expect(
			fotoNegocio({ nombre: "Agro", logoUrl: "https://x.com/logo.png" }),
		).toBe("https://x.com/logo.png");
		expect(fotoNegocio({ nombre: "Agro", logoUrl: "/img/logo.png" })).toBe(
			"/img/logo.png",
		);
	});

	it("un logo que no es URL (texto suelto) no se pinta como imagen", () => {
		expect(fotoNegocio({ nombre: "Agro Repelón", logoUrl: "pendiente" })).toBe(
			"/img/campo.jpg",
		);
	});
});
