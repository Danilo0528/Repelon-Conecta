import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";

import BarraNavegacion from "@/components/BarraNavegacion";
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

/*
 * URL pública del sitio. Si falta la variable, el respaldo es el dominio
 * de producción y NO localhost: una vista previa de WhatsApp con
 * `http://localhost:3000/img/hero.jpg` no la abre nadie. En local se
 * puede sobreescribir con NEXT_PUBLIC_URL=http://localhost:3000.
 */
const URL_SITIO =
	process.env.NEXT_PUBLIC_URL ?? "https://repelon-conecta.vercel.app";

const TITULO = "Repelón Conecta | Encuentra lo que necesitas";
const DESCRIPCION =
	"Encuentra productos agrícolas, pescado fresco y lugares para visitar en Repelón, Atlántico. Conecta directamente con negocios locales por WhatsApp.";

export const metadata: Metadata = {
	metadataBase: new URL(URL_SITIO),
	title: TITULO,
	description: DESCRIPCION,
	icons: {
		icon: "/img/logo-repelon-conecta.png",
	},
	/*
	 * Vista previa al compartir: WhatsApp y Facebook son el canal
	 * principal de la app, y sin esto el enlace sale con foto genérica.
	 * hero.jpg es la imagen de fondo del hero (horizontal, ~1200x630
	 * es lo que piden las dos plataformas). Las URLs se resuelven con
	 * metadataBase, así que NO salen con localhost.
	 */
	openGraph: {
		type: "website",
		locale: "es_CO",
		siteName: "Repelón Conecta",
		url: "/",
		title: TITULO,
		description: DESCRIPCION,
		images: [
			{
				url: "/img/hero.jpg",
				width: 1200,
				height: 630,
				alt: "Repelón Conecta",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: TITULO,
		description: DESCRIPCION,
		images: ["/img/hero.jpg"],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#0b2f4f",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="es"
			className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable} h-full`}
		>
			{/* El fondo de la app: gris azulado uniforme, sin blobs. */}
			<body className="flex min-h-full flex-col bg-[#f6f8fb] text-[#17202e]">
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
							className="w-full flex-1 focus:outline-none"
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
