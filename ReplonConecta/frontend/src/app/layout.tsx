import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import BarraNavegacion from "@/components/BarraNavegacion";
import { CarritoProvider } from "@/context/CarritoContext";
import { SesionProvider } from "@/context/SesionContext";

import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Repelón Market",
	description:
		"El mercado de Repelón, en tu celular. Pide a los negocios del pueblo y recibe en tu casa.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#16A34A",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className={`${geist.variable} h-full`}>
			<body className="flex min-h-full flex-col bg-white text-black">
				<SesionProvider>
					<CarritoProvider>
						<BarraNavegacion />
						{/* El padding inferior deja espacio para la barra fija. */}
						<main className="mx-auto w-full max-w-2xl flex-1 pb-24">
							{children}
						</main>
					</CarritoProvider>
				</SesionProvider>
			</body>
		</html>
	);
}
