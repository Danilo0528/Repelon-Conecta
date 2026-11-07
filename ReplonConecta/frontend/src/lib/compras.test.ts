import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

/*
 * Regla de negocio del cliente (oct. 2026): la app es solo intermediaria,
 * la compra termina en WhatsApp. Mientras COMPRAS_ACTIVAS=false, las rutas
 * de carrito/checkout/pedidos deben redirigir al home en vez de mostrar
 * pantallas huerfanas. Este test es la especificacion ejecutable de esa
 * decision; si se prende la compra, hay que actualizarlo a proposito.
 */
describe("compra desactivada", () => {
	it("con COMPRAS_ACTIVAS=false, /carrito, /checkout y /pedidos redirigen al inicio", async () => {
		const redirects = (await nextConfig.redirects?.()) ?? [];

		expect(redirects).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ source: "/carrito", destination: "/" }),
				expect.objectContaining({ source: "/checkout", destination: "/" }),
				expect.objectContaining({ source: "/pedidos", destination: "/" }),
			]),
		);
	});
});
