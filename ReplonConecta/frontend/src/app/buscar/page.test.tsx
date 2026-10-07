import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ResultadoBusqueda } from "@/lib/tipos";

/*
 * Flujo de búsqueda (P2, fila 14): escribe → llama /api/buscar →
 * pinta lista y conteo; los chips de categoría agregan el parámetro;
 * sin resultados muestra el mensaje amigable.
 *
 * Se mockea la capa de red (no hay backend en el test), el mapa
 * (Google Maps necesita navegador de verdad) y next/navigation (fuera del
 * runtime de Next).
 */

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }));

vi.mock("@/lib/api", () => ({
	api: apiMock,
	apiConSesion: apiMock,
	ErrorApi: class ErrorApi extends Error {},
}));

vi.mock("@/components/Mapa", () => ({
	MapaNegocios: () => <div data-testid="mapa" />,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
	useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...resto
	}: ComponentProps<"a"> & { href: string; children?: ReactNode }) => (
		<a href={href} {...resto}>
			{children}
		</a>
	),
}));

import BuscarPagina from "./page";

const YUCA: ResultadoBusqueda = {
	productoId: "prod-1",
	productoNombre: "Yuca",
	productoDescripcion: "Yuca fresca",
	precio: 2500,
	unidad: "KILO",
	imagenUrl: null,
	disponible: true,
	negocioId: "neg-1",
	negocioNombre: "Agro Repelón",
	negocioSlug: "agro-repelon",
	direccion: "Vereda Rotinet, km 3",
	barrio: "Vereda Rotinet",
	latitud: 10.505,
	longitud: -75.135,
	whatsapp: "573001111005",
	abierto: true,
	categoriaNombre: "Agro",
};

function responderCon(resultados: ResultadoBusqueda[]) {
	apiMock.mockImplementation((ruta: string) => {
		if (ruta.startsWith("/api/buscar")) {
			return Promise.resolve(resultados);
		}
		if (ruta === "/api/negocios") {
			return Promise.resolve([]);
		}
		return Promise.resolve(null);
	});
}

function cajaBusqueda(): HTMLInputElement {
	const input = screen.getByPlaceholderText(
		"Escribe lo que buscas: yuca, pescado, mango…",
	) as HTMLInputElement;
	return input;
}

describe("flujo de búsqueda", () => {
	beforeEach(() => {
		apiMock.mockReset();
		responderCon([YUCA]);
	});

	afterEach(cleanup);

	it("al escribir consulta llama a /api/buscar con la q y pinta el resultado", async () => {
		render(<BuscarPagina />);

		// La primera carga llega sin consulta.
		await waitFor(() =>
			expect(apiMock).toHaveBeenCalledWith("/api/buscar"),
		);

		fireEvent.change(cajaBusqueda(), { target: { value: "yuca" } });

		expect(await screen.findByText("Yuca")).toBeTruthy();
		expect(apiMock).toHaveBeenCalledWith("/api/buscar?q=yuca");

		// Lista y mapa hablan del mismo resultado: conteo y negocio.
		expect(screen.getByText(/1 producto en 1 negocio/)).toBeTruthy();
		expect(screen.getAllByText(/Agro Repelón/).length).toBeGreaterThan(0);
	});

	it("el chip de categoría agrega el parámetro categoria a la llamada", async () => {
		render(<BuscarPagina />);

		await waitFor(() =>
			expect(apiMock).toHaveBeenCalledWith("/api/buscar"),
		);

		fireEvent.click(screen.getByRole("button", { name: "Agro" }));

		await waitFor(() =>
			expect(apiMock).toHaveBeenCalledWith("/api/buscar?categoria=agro"),
		);
	});

	it("sin resultados muestra el mensaje amigable", async () => {
		responderCon([]);
		render(<BuscarPagina />);

		// Con consulta: "No encontramos ..." con la palabra buscada.
		fireEvent.change(cajaBusqueda(), { target: { value: "ñandú" } });
		expect(await screen.findByText(/No encontramos/)).toBeTruthy();

		// Sin consulta: el mensaje de filtros sin resultados.
		fireEvent.change(cajaBusqueda(), { target: { value: "" } });
		expect(
			await screen.findByText("No hay productos con estos filtros."),
		).toBeTruthy();
	});
});
