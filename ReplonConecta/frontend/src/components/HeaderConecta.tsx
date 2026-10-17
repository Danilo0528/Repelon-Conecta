"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCarrito } from "@/context/CarritoContext";
import { COMPRAS_ACTIVAS } from "@/lib/compras";
import { IconoNav, type NombreIconoNav } from "@/components/IconoNav";

import BuscadorNav from "./BuscadorNav";

/*
 * Cabecera de Repelón Conecta.
 *
 * Una pastilla de vidrio (blanco translúcido con desenfoque) que queda
 * pegada arriba, con el sello de la marca a la izquierda —la R verde y
 * el lema "del pueblo, para el pueblo"— y, a la derecha, los accesos
 * que a pantalla ancha no lleva la barra de abajo.
 *
 * En móvil la navegación vive abajo, en la barra flotante; aquí solo
 * quedan la marca y los destinos directos. El carrito y "Pedidos"
 * están ocultos mientras COMPRAS_ACTIVAS sea false: la app termina en
 * el WhatsApp del vendedor (se oculta, no se borra).
 */

/*
 * Iconos de destino de la cabecera: viven en IconoNav porque la barra
 * inferior (BarraNavegacion) pinta los mismos destinos.
 */

const DESTINOS: { href: string; etiqueta: string; icono: NombreIconoNav }[] = [
	{ href: "/negocios", etiqueta: "Comercios", icono: "comercios" },
	// Ancla a la sección de la home: el acceso no queda escondido
	// abajo del scroll, vive en la barra como los demás destinos.
	{ href: "/#turismo", etiqueta: "Turismo", icono: "turismo" },
	{ href: "/fondo-emprender", etiqueta: "Fondo Emprender", icono: "fondo" },
	// Oculto mientras COMPRAS_ACTIVAS sea false: la app es solo
	// intermediaria. Con el interruptor en true vuelve sin mas cambios.
	...(COMPRAS_ACTIVAS
		? [{ href: "/pedidos", etiqueta: "Pedidos", icono: "pedidos" as const }]
		: []),
	{ href: "/vendedor", etiqueta: "Mi negocio", icono: "negocio" },
];

/*
 * Cenefa de la bandera, pegada al borde inferior de la pastilla.
 *
 * Son las tres franjas de Repelón (verde, blanco, azul) pero con su
 * significado escrito adentro, que es lo que la hace del pueblo y no
 * una raya decorativa:
 *   - verde: la cadena de montañas de la Serranía del Caballo, con un
 *     brote creciendo en cada loma (maíz, sorgo, yuca y plátano)
 *   - blanco: la paz, lisa, como la manda la bandera
 *   - azul: las aguas del embalse del Guájaro, con dos olas de altura
 *     distinta y un bocachico nadando (la especie que más se pesca)
 *
 * Los motivos van en <pattern> con unidades fijas (userSpaceOnUse) y
 * el svg NO lleva viewBox: así las montañas, el brote y el pez
 * conservan su tamaño real y no se estiran con el ancho de la
 * pantalla. Si se estiraran, en un monitor ancho serían monstruos y
 * en el celular ni se verían.
 *
 * Cada módulo lleva el pez entero (cuerpo + cola) y el cerro cerrado
 * contra la base: si un motivo cruzara el borde del módulo, la
 * repetición lo parte y aparece una cola suelta sin cuerpo.
 *
 * La banda mide 20 px (h-5) y va con un filete de 1 px arriba
 * (border-ink/20). Los dos detalles son la misma cosa vista dos veces:
 * sin el filete la franja blanca se funde con la pastilla de vidrio
 * y la bandera deja de leerse como tres franjas; y sin esos 20 px no
 * cabe un brote ni un pez, todo se vuelve una raya con textura.
 * Por eso el <nav> lleva pb-5: el contenido respira justo lo que
 * ocupa la cenefa y el logo no queda debajo.
 *
 * Va en aria-hidden: es decoración. El nombre del sitio ya dice
 * "Repelón", y el color no comunica nada que quien usa lector de
 * pantalla necesite saber.
 */
function CenefaBandera() {
	return (
		<span
			aria-hidden
			className="pointer-events-none absolute inset-x-0 bottom-0 block h-5 overflow-hidden rounded-b-[15px] border-t border-ink/20"
		>
			<span className="grid h-full w-full grid-cols-3">
				{/* Serranía + agricultura. El verde va escrito a mano y no
				    en bg-leaf: --color-leaf es un punto más oscuro (texto
				    pequeño) y esta cenefa es bandera, así que acá manda
				    el #078930 del archivo oficial. */}
				<span className="relative block h-full overflow-hidden bg-[#078930]">
					<svg className="absolute inset-0 h-full w-full">
						<defs>
							<pattern
								id="cenefa-serrania"
								width="76"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								{/* Cerros anchos y de altura desigual. Con
								    picos angostos y muy seguidos deja de
								    leerse como cordillera y se vuelve
								    diente de sierra, que es el error típico
								    de este motivo. El del medio es el único
								    que sube a y=11: ahí, en la loma, se
								    planta el brote. */}
								<path
									d="M0 20 12 13.5 24 16.5 38 11 50 15.5 62 12.5 76 20Z"
									fill="#ffffff"
									opacity=".32"
								/>
								{/* Brote creciendo en la loma. Va con hojas y
								    no con una mazorca redonda: a 9 px una
								    bola sobre un palo se lee como chinche o
								    como lollipop, y una hoja a cada lado se
								    lee como planta. Es la agricultura del
								    municipio —maíz, sorgo, yuca, plátano—
								    reducida a lo que cabe en una cenefa. */}
								<path
									d="M38 11V2"
									fill="none"
									stroke="#ffffff"
									strokeOpacity=".58"
									strokeWidth="1.1"
									strokeLinecap="round"
								/>
								<path
									d="M38 5c-2.4-2.8-5.6-3.6-8.2-2.6 1.5 3.2 4.7 5 8.2 3.2z"
									fill="#ffffff"
									fillOpacity=".58"
									stroke="none"
								/>
								<path
									d="M38 7.4c2.4-2.8 5.6-3.6 8.2-2.6-1.5 3.2-4.7 5-8.2 3.2z"
									fill="#ffffff"
									fillOpacity=".58"
									stroke="none"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#cenefa-serrania)" />
					</svg>
				</span>

				{/* La paz. */}
				<span className="block h-full bg-white" />

				{/* El embalse del Guájaro. */}
				<span className="relative block h-full overflow-hidden bg-azul">
					<svg className="absolute inset-0 h-full w-full">
						<defs>
							<pattern
								id="cenefa-embalse"
								width="44"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								{/* Dos ondas de altura distinta: con una
								    sola se lee como raya ondulada; con dos
								    se lee como agua con profundidad. */}
								<path
									d="M0 11.5q11-6.2 22 0t22 0"
									fill="none"
									stroke="#ffffff"
									strokeOpacity=".45"
									strokeWidth="1.4"
									strokeLinecap="round"
								/>
								<path
									d="M0 17q11-4.6 22 0t22 0"
									fill="none"
									stroke="#ffffff"
									strokeOpacity=".28"
									strokeWidth="1.2"
									strokeLinecap="round"
								/>
								{/* Bocachico: la especie que más se pesca en
								    el Guájaro. Va entero dentro del módulo
								    (cuerpo + cola) para que la repetición no
								    lo parta a la mitad, y deja aire entre
								    pez y pez para que no se lea como papel
								    tapiz. */}
								<g
									fill="none"
									stroke="#ffffff"
									strokeOpacity=".62"
									strokeWidth="1.1"
									strokeLinejoin="round"
									strokeLinecap="round"
								>
									<path d="M11.5 4.6c2.1-2.9 8-2.9 10.1 0-2.1 2.9-8 2.9-10.1 0z" />
									<path d="M21.6 4.6 25.2 2.1v5z" />
								</g>
								<circle cx="13.8" cy="4" r=".6" fill="#ffffff" fillOpacity=".75" stroke="none" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#cenefa-embalse)" />
					</svg>
				</span>
			</span>
		</span>
	);
}

export default function HeaderConecta() {
	const { cantidadTotal } = useCarrito();
	const pathname = usePathname();

	/*
	 * padding-top con el notch/camara del Android: layout.tsx pone
	 * viewportFit=cover, asi que sin este safe-area la pastilla se
	 * mete debajo del hueco en pantallas con muesca.
	 */
	return (
		<header className="sticky top-0 z-cromo w-full px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 lg:px-8">
			<nav className="glass relative flex items-center gap-3 rounded-2xl border-azul/10 px-3 pt-2 pb-5 shadow-float">
				{/*
				 * La bandera PINTANDO el vidrio, no solo en el borde.
				 *
				 * Un degradado horizontal que va del verde de la bandera
				 * a la izquierda, pasa por blanco limpio en el centro y
				 * termina en el azul a la derecha. Los extremos son los
				 * colores de la bandera y el medio se queda en blanco,
				 * que es como está dibujada.
				 *
				 * Va con -z-10 y no con z-0: .glass usa backdrop-filter,
				 * eso crea contexto de apilamiento, y una capa negativa
				 * se pinta DESPUÉS del fondo del propio vidrio pero
				 * ANTES del texto. Con z-0 quedaría encima de las
				 * letras y las taparía.
				 *
				 * La opacidad va bajando hacia el centro por dos motivos:
				 * el texto de los destinos es gris medio y sobre un verde
				 * saturado perdería contraste, y un bloque duro de color
				 * se lee como un calcomán pegado, no como vidrio teñido.
				 */}
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
					style={{
						background:
							"linear-gradient(90deg, rgba(7,137,48,.32) 0%, rgba(7,137,48,.13) 24%, rgba(255,255,255,0) 44%, rgba(255,255,255,0) 56%, rgba(15,71,175,.13) 76%, rgba(15,71,175,.32) 100%)",
					}}
				/>
				<CenefaBandera />
				<Link
					href="/"
					className="flex shrink-0 items-center gap-2"
					aria-label="Repelón Conecta, inicio"
				>
					{/*
					 * Va la versión SIN fondo. La original trae el blanco
					 * cocido en el archivo (es un PNG de 24 bits, sin
					 * canal alfa) y con la cenefa y el lavado de la
					 * bandera detrás, ese blanco aparecía como un
					 * recuadro pegado sobre el verde. El favicon se queda
					 * con la original: en la pestaña del navegador un
					 * cuadro lleno se lee mejor que una silueta.
					 */}
					<img
						src="/img/logo-repelon-conecta-transparente.png"
						alt="Repelón Conecta"
						className="h-9 w-28 object-contain object-center sm:h-12 sm:w-40 md:h-14 md:w-48"
					/>
				</Link>

				<div className="ml-2 hidden items-center gap-1 md:flex">
					{DESTINOS.map(({ href, etiqueta, icono }) => {
						// Las anclas (#...) no son rutas: nunca se marcan.
						const activo =
							!href.includes("#") &&
							(pathname === href || pathname.startsWith(`${href}/`));
						return (
							<Link
								key={href}
								href={href}
								aria-current={activo ? "page" : undefined}
								className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm leading-none transition-all duration-200 ${
									activo
										? "bg-leaf font-semibold text-white shadow-leaf"
										: "font-medium text-muted-foreground hover:bg-black/5 hover:text-ink"
								}`}
							>
								{/*
								 * El ícono entra desde xl: entre 768 y 1279 px la
								 * pastilla ya va apretada con el buscador y los
								 * destinos, y meter cuatro íconos la desborda.
								 */}
								<IconoNav
									nombre={icono}
									className="hidden h-[17px] w-[17px] shrink-0 xl:block"
								/>
								{etiqueta}
							</Link>
						);
					})}
				</div>

				<BuscadorNav />

				<div className="ml-auto flex items-center gap-2">
					<span aria-hidden className="hidden h-6 w-px bg-black/10 md:block" />
					<Link
						href="/perfil"
						className="glass-soft hidden size-10 place-items-center rounded-xl text-ink transition-colors hover:text-leaf sm:grid"
						aria-label="Perfil"
					>
						<IconoNav nombre="perfil" />
					</Link>

					{COMPRAS_ACTIVAS && (
						<Link
							href="/carrito"
							className="glass-soft relative grid size-10 place-items-center rounded-xl text-ink transition-colors hover:text-leaf"
							aria-label={
								cantidadTotal > 0
									? `Carrito, ${cantidadTotal} ítems`
									: "Carrito vacío"
							}
						>
							<IconoNav nombre="carrito" />
							{cantidadTotal > 0 && (
								<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf px-1 text-[11px] font-bold leading-none text-white">
									{cantidadTotal}
								</span>
							)}
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
