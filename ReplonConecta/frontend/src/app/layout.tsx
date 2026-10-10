import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";

import BarraNavegacion from "@/components/BarraNavegacion";
import { Blobs } from "@/components/Blobs";
import { CarritoProvider } from "@/context/CarritoContext";
import { SesionProvider } from "@/context/SesionContext";

import "./globals.css";

/*
 * Tipografías de la casa:
 *   - Fraunces (display): títulos y marca.
 *   - Manrope (sans):     cuerpo y UI general.
 *   - IBM Plex Mono:      IDs, timestamps, códigos, números tabulares
 *                         del panel denso (skill dense-dashboard).
 */
const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	display: "swap",
});

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
	display: "swap",
});

const plexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Repelón Conecta | Encuentra lo que necesitas",
	description:
		"Encuentra productos agrícolas, pescado fresco y lugares para visitar en Repelón, Atlántico. Conecta directamente con negocios locales por WhatsApp.",
	icons: {
		icon: "/img/logo-repelon-conecta.png",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#124B82",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="es"
			className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable} h-full`}
		>
			<body className="flex min-h-full flex-col bg-background text-ink">
				<Blobs />
				<SesionProvider>
					<CarritoProvider>
						<BarraNavegacion />
						{/*
						 * El contenedor de la app: 6xl (1152 px) para que en
						 * PC el contenido use la pantalla (cada pantalla pone su
						 * propio padding y su ancho adentro: rejillas, dos
						 * columnas, formularios centrados) y el padding
						 * inferior para la barra de destinos, que en móvil
						 * va flotando sobre el fondo.
						 */}
						<main className="mx-auto w-full max-w-6xl flex-1 pb-nav-total md:pb-10">
							{children}
						</main>
					</CarritoProvider>
				</SesionProvider>
			</body>
		</html>
	);
}
