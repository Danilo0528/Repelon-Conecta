import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import BarraNavegacion from "@/components/BarraNavegacion";
import { Blobs } from "@/components/Blobs";
import { CarritoProvider } from "@/context/CarritoContext";
import { SesionProvider } from "@/context/SesionContext";

import "./globals.css";

/*
 * Las dos tipografías de la casa: Fraunces para los títulos y el nombre
 * de la marca, Manrope para todo lo demás. Las variables que dejan aquí
 * son las que globals.css traduce a --font-display y --font-sans.
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

export const metadata: Metadata = {
	title: "Repelón Conecta",
	description:
		"El mercado de Repelón, en tu celular. Pide a los negocios del pueblo y recibe en tu casa.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#16A34A",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className={`${fraunces.variable} ${manrope.variable} h-full`}>
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
