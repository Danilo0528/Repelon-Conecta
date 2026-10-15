import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";

import BarraNavegacion from "@/components/BarraNavegacion";
import { Blobs } from "@/components/Blobs";
import { CarritoProvider } from "@/context/CarritoContext";
import { SesionProvider } from "@/context/SesionContext";
import { AsistenteIaChat } from "@/components/AsistenteIaChat";
import PieConecta from "@/components/PieConecta";

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
	/*
	 * Base para resolver las URLs relativas del og:image. Sin esto
	 * Next avisa y arma la URL con localhost, lo que rompe la vista
	 * previa al compartir en producción. El hosting real se declara en
	 * NEXT_PUBLIC_URL (p. ej. https://repelonconecta.example.com).
	 */
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
	),
	title: "Repelón Conecta | Encuentra lo que necesitas",
	description:
		"Encuentra productos agrícolas, pescado fresco y lugares para visitar en Repelón, Atlántico. Conecta directamente con negocios locales por WhatsApp.",
	icons: {
		icon: "/img/logo-repelon-conecta.png",
	},
	/*
	 * Vista previa al compartir: WhatsApp y Facebook son el canal
	 * principal de la app, y sin esto el enlace sale con foto genérica.
	 * hero.jpg es la imagen de fondo del hero (horizontal, ~1200x630
	 * es lo que piden las dos plataformas).
	 */
	openGraph: {
		type: "website",
		locale: "es_CO",
		siteName: "Repelón Conecta",
		title: "Repelón Conecta | Encuentra lo que necesitas",
		description:
			"Encuentra productos agrícolas, pescado fresco y lugares para visitar en Repelón, Atlántico. Conecta directamente con negocios locales por WhatsApp.",
		images: [
			{
				url: "/img/hero.jpg",
				width: 1200,
				height: 630,
				alt: "Repelón Conecta",
			},
		],
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
			{/* Sin bg-background acá a propósito: el fondo vive en html (ver
				    globals.css) para que no tape los blobs ni el tapiz. */}
			<body className="flex min-h-full flex-col text-ink">
				{/*
				 * Atajo de teclado: el primer Tab salta la cabecera y la
				 * barra de destinos y aterriza en el contenido. Oculto a
				 * simple vista, visible solo con foco de teclado.
				 */}
				<a
					href="#contenido"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-atajo focus:rounded-xl focus:bg-leaf focus:px-4 focus:py-3 focus:font-semibold focus:text-white focus:shadow-leaf"
				>
					Saltar al contenido
				</a>
				<Blobs />
				<SesionProvider>
					<CarritoProvider>
						<BarraNavegacion />
						{/*
						 * El contenedor de la app: 6xl (1152 px) para que en
						 * PC el contenido use la pantalla (cada pantalla pone su
						 * propio padding y su ancho adentro: rejillas, dos
						 * columnas, formularios centrados). El id es el destino
						 * del atajo "Saltar al contenido"; el padding inferior
						 * para la barra de destinos lo lleva el pie, que cierra
						 * las pantallas públicas (en /admin no se pinta).
						 */}
						<main
							id="contenido"
							tabIndex={-1}
							className="mx-auto w-full max-w-6xl flex-1 focus:outline-none"
						>
							{children}
						</main>
						<PieConecta />
						<AsistenteIaChat />
					</CarritoProvider>
				</SesionProvider>
			</body>
		</html>
	);
}
