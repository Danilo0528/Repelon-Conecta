import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BotonNumero } from "./BotonNumero";

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
	Object.defineProperty(navigator, "clipboard", {
		value: { writeText },
		configurable: true,
	});
});

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("BotonNumero", () => {
	it("no pinta nada si el negocio no tiene teléfono", () => {
		const { container } = render(<BotonNumero telefono={null} />);
		expect(container.innerHTML).toBe("");
	});

	it("oculta el número hasta que piden mostrarlo", () => {
		render(<BotonNumero telefono="3001234567" />);

		expect(screen.queryByRole("link")).toBeNull();
		expect(screen.getByRole("button", { name: /mostrar número/i })).toBeTruthy();

		fireEvent.click(screen.getByRole("button", { name: /mostrar número/i }));

		const enlace = screen.getByRole("link", { name: /3001234567/ });
		expect(enlace.getAttribute("href")).toBe("tel:3001234567");
		expect(screen.queryByRole("button", { name: /mostrar número/i })).toBeNull();
	});

	it("limpia el formato del teléfono para el enlace tel:", () => {
		render(<BotonNumero telefono="+57 300 123 4567" />);
		fireEvent.click(screen.getByRole("button", { name: /mostrar número/i }));

		const enlace = screen.getByRole("link");
		expect(enlace.getAttribute("href")).toBe("tel:+573001234567");
	});

	it("copia el número al portapapeles y lo confirma", async () => {
		render(<BotonNumero telefono="3001234567" />);
		fireEvent.click(screen.getByRole("button", { name: /mostrar número/i }));

		fireEvent.click(screen.getByRole("button", { name: /copiar/i }));

		expect(await screen.findByText("¡Copiado!")).toBeTruthy();
		expect(writeText).toHaveBeenCalledWith("3001234567");
	});
});
