/*
 * Manchas de color del fondo.
 *
 * Tres círculos gigantes y desenfocados que respiran muy despacio detrás
 * de todo el contenido: le dan color a la app sin poner un bloque de
 * color en ninguna parte. Van fijos, sin eventos y por debajo del
 * contenido, así estorban cero.
 */
export function Blobs() {
	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			<div className="animate-drift absolute -left-32 -top-36 size-[520px] rounded-full bg-blob-1 opacity-60 blur-[60px]" />
			<div className="animate-drift absolute -right-36 top-32 size-[460px] rounded-full bg-blob-2 opacity-60 blur-[60px] [animation-direction:reverse]" />
			<div className="animate-drift absolute -bottom-44 left-1/4 size-[560px] rounded-full bg-blob-3 opacity-60 blur-[60px]" />
		</div>
	);
}
