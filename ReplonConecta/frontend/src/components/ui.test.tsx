import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Foto } from "@/components/ui";

/*
 * Las fotos de producto y logo salen de Supabase o de una URL pegada
 * en el panel: si esa URL deja de servir, el navegador dibujaría el
 * icono de imagen rota en medio de la pantalla. El contrato es que
 * Foto caiga en el mismo "sin foto" que cuando no hay URL, y que si
 * llega otra foto vuelva a intentar.
 */

afterEach(cleanup);

describe("Foto", () => {
	it("sin URL muestra el placeholder de sin foto", () => {
		render(<Foto src={null} alt="Yuca" />);

		expect(screen.getByRole("img", { name: "Yuca (sin foto)" })).toBeTruthy();
	});

	it("si la URL se cae, cambia al placeholder en vez de dejar la imagen rota", () => {
		render(<Foto src="https://fotos.example.com/yuca.jpg" alt="Yuca" />);

		const img = screen.getByRole("img", { name: "Yuca" }) as HTMLImageElement;
		expect(img.getAttribute("src")).toBe("https://fotos.example.com/yuca.jpg");

		fireEvent.error(img);

		expect(screen.queryByRole("img", { name: "Yuca" })).toBeNull();
		expect(screen.getByRole("img", { name: "Yuca (sin foto)" })).toBeTruthy();
	});

	it("si cambia la foto vuelve a intentar con la nueva", () => {
		const { rerender } = render(
			<Foto src="https://fotos.example.com/una.jpg" alt="Yuca" />,
		);

		fireEvent.error(screen.getByRole("img", { name: "Yuca" }));
		expect(screen.getByRole("img", { name: "Yuca (sin foto)" })).toBeTruthy();

		rerender(<Foto src="https://fotos.example.com/otra.jpg" alt="Yuca" />);

		const img = screen.getByRole("img", { name: "Yuca" }) as HTMLImageElement;
		expect(img.getAttribute("src")).toBe("https://fotos.example.com/otra.jpg");
	});
});
