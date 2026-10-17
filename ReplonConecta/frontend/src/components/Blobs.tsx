/*
 * Fondo de la app: tapiz agricola + manchas de color.
 *
 * Dos capas, ambas fijas, sin eventos y por debajo del contenido:
 *   1. El TAPIZ: mosaico con lo que el pueblo siembra (sorgo, maiz,
 *      platano, yuca sobre surcos de campo), en un verde muy tenue.
 *      Da textura de pueblo a toda la app sin poner un bloque de
 *      color en ninguna parte. Se repite en toda la pagina y como va
 *      con `fixed` no gasta memoria al hacer scroll.
 *   2. Los BLOBS: tres manchas gigantes desenfocadas que respiran muy
 *      despacio, encima del tapiz y debajo del contenido: aportan
 *      color y profundidad.
 *
 * IMPORTANTE sobre el color del tapiz: va escrito dentro del SVG y no
 * en currentColor. Cuando un SVG entra como background-image es un
 * recurso externo, no hereda el color del documento y se pintaria con
 * el valor inicial (negro). Asi que el verde se controla con la
 * opacidad de esta capa, no cambiando el color desde aca.
 *
 * La opacidad de los blobs va en 0.22 y no en 0.6: ahora los tokens
 * blob-1/2/3 son los colores plenos de la bandera (#4fbc7b, #4a90d9,
 * #f6c945) y no las versiones casi blancas de antes. Con blur de 60 px
 * basta poco para teñir la pagina; a 0.6 las manchas gritaban y el
 * texto perdia contraste encima.
 */
export function Blobs() {
	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			{/* Capa 1: tapiz agricola. */}
			<div
				className="absolute inset-0 opacity-[.22]"
				style={{
					backgroundImage: "url(/img/tapiz-agricola.svg)",
					backgroundSize: "240px 240px",
					backgroundRepeat: "repeat",
				}}
			/>
			{/* Capa 2: manchas que respiran, encima del tapiz. */}
			<div className="animate-drift absolute -left-32 -top-36 size-[520px] rounded-full bg-blob-1 opacity-[.22] blur-[60px]" />
			<div className="animate-drift absolute -right-36 top-32 size-[460px] rounded-full bg-blob-2 opacity-[.22] blur-[60px] [animation-direction:reverse]" />
			<div className="animate-drift absolute -bottom-44 left-1/4 size-[560px] rounded-full bg-blob-3 opacity-[.18] blur-[60px]" />
		</div>
	);
}
