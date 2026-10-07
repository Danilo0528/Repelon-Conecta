import type { NextConfig } from "next";

import { COMPRAS_ACTIVAS } from "./src/lib/compras";

const nextConfig: NextConfig = {
  /*
   * Mientras COMPRAS_ACTIVAS sea false, las rutas de compra no existen
   * para el usuario: quien entre directo (enlace viejo, marcador,
   * boton atras) cae en el home en vez de una pantalla 404 o de un
   * carrito que ya no se muestra. Permanent false (307): si el
   * interruptor se prende, las rutas vuelven sin tocar este archivo.
   */
  async redirects() {
    if (COMPRAS_ACTIVAS) {
      return [];
    }

    const alHome = (fuente: string) => [
      { source: fuente, destination: "/", permanent: false },
      { source: `${fuente}/:path*`, destination: "/", permanent: false },
    ];

    return [...alHome("/carrito"), ...alHome("/checkout"), ...alHome("/pedidos")];
  },
};

export default nextConfig;
