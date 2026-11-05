import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LightboxGaleria } from "./LightboxGaleria";

const FOTOS = [
	{ src: "/img/campo.jpg", alt: "Campo" },
	{ src: "/img/tienda.jpg", alt: "Tienda" },
	{ src: "/img/servicios.jpg", alt: "Servicios" },
];

afterEach(cleanup);

describe("LightboxGaleria", () => {
	it("muestra la foto seleccionada y el contador", () => {
		render(
			<LightboxGaleria
				fotos={FOTOS}
				indice={0}
				onIndice={vi.fn()}
				onCerrar={vi.fn()}
			/>,
		);
		expect(screen.getByRole("img", { name: "Campo" })).toBeTruthy();
		expect(screen.getByText("1/3")).toBeTruthy();
	});

	it("avanza con el botón Siguiente", () => {
		const onIndice = vi.fn();
		render(
			<LightboxGaleria
				fotos={FOTOS}
				indice={0}
				onIndice={onIndice}
				onCerrar={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
		expect(onIndice).toHaveBeenCalledWith(1);
	});

	it("retrocede con el botón Anterior (con vuelta)", () => {
		const onIndice = vi.fn();
		render(
			<LightboxGaleria
				fotos={FOTOS}
				indice={0}
				onIndice={onIndice}
				onCerrar={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
		expect(onIndice).toHaveBeenCalledWith(2);
	});

	it("cierra con el botón Cerrar", () => {
		const onCerrar = vi.fn();
		render(
			<LightboxGaleria
				fotos={FOTOS}
				indice={0}
				onIndice={vi.fn()}
				onCerrar={onCerrar}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
		expect(onCerrar).toHaveBeenCalled();
	});

	it("cierra con Escape", () => {
		const onCerrar = vi.fn();
		render(
			<LightboxGaleria
				fotos={FOTOS}
				indice={0}
				onIndice={vi.fn()}
				onCerrar={onCerrar}
			/>,
		);
		fireEvent.keyDown(window, { key: "Escape" });
		expect(onCerrar).toHaveBeenCalled();
	});

	it("muestra el crédito cuando la foto lo tiene", () => {
		const fotos = [{ src: "/img/campo.jpg", alt: "Campo", credito: "Juan Pérez" }];
		render(
			<LightboxGaleria
				fotos={fotos}
				indice={0}
				onIndice={vi.fn()}
				onCerrar={vi.fn()}
			/>,
		);
		expect(screen.getByText("Foto: Juan Pérez")).toBeTruthy();
	});
});
