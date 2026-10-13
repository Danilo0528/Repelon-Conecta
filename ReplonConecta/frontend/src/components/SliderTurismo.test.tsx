import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SliderTurismo } from "./SliderTurismo";

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe("SliderTurismo", () => {
	it("pasa a la siguiente foto mientras el cursor está encima", () => {
		vi.useFakeTimers();
		vi.stubGlobal(
			"matchMedia",
			vi.fn().mockReturnValue({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}),
		);

		render(
			<SliderTurismo
				imagenes={["https://fotos.example.com/una.jpg", "https://fotos.example.com/dos.jpg"]}
				nombre="Embalse"
			/>,
		);
		expect(screen.getByText("1/2")).toBeTruthy();

		fireEvent.mouseEnter(screen.getByRole("img", { name: "Embalse, 2 fotos" }));
		act(() => {
			vi.advanceTimersByTime(2200);
		});
		expect(screen.getByText("2/2")).toBeTruthy();
	});
});
