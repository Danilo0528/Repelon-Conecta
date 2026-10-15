/*
 * Fondo de la app: tapiz agrÃ­cola + manchas de color.
 *
 * Dos capas, ambas fijas, sin eventos y por debajo del contenido:
 *   1. El TAPIZ: mosaico con lo que el pueblo siembra (sorgo, maÃ­z,
 *      plÃ¡tano, yuca sobre surcos de campo), en un verde muy tenue.
 *      Da textura de pueblo a toda la app sin poner un bloque de
 *      color en ninguna parte. Se repite en toda la pÃ¡gina y como va
 *      con `fixed` no gasta memoria al hacer scroll.
 *   2. Los BLOBS: tres manchas gigantes desenfocadas que respiran muy
 *      despacio, encima del tapiz y debajo del contenido: aportan
 *      color y profundidad.
 *
 * El tapiz va con `currentColor` (el SVG lo hereda del padre), asÃ­ el
 * color se controla desde acÃ¡ y no dentro del archivo.
 */
export function Blobs() {
	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			{/* Capa 1: tapiz agrÃ­cola. El verde va escrito dentro del SVG
			    (un background-image no hereda currentColor del documento),
			    asÃ­ que la intensidad se regula con la opacidad de acÃ¡. */}
			<div
				className="absolute inset-0 opacity-[.22]"
				style={{
					backgroundImage: "url(/img/tapiz-agricola.svg)",
					backgroundSize: "240px 240px",
					backgroundRepeat: "repeat",
				}}
			/>
			{/* Capa 2: manchas que respiran, encima del tapiz. */}
			<div className="animate-drift absolute -left-32 -top-36 size-[520px] rounded-full bg-blob-1 opacity-60 blur-[60px]" />
			<div className="animate-drift absolute -right-36 top-32 size-[460px] rounded-full bg-blob-2 opacity-60 blur-[60px] [animation-direction:reverse]" />
			<div className="animate-drift absolute -bottom-44 left-1/4 size-[560px] rounded-full bg-blob-3 opacity-60 blur-[60px]" />
		</div>
	);
}
