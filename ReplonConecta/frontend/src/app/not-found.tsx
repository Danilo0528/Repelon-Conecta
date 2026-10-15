import Link from "next/link";

/*
 * 404 de Repelón Conecta.
 *
 * En vez de la página blanca de Next: la marca, una explicación corta
 * y dos caminos de vuelta (inicio y comercios) para que nadie quede en
 * un callejón. Es un componente de servidor y no necesita contexto:
 * la barra de destinos la pinta el layout de todos modos.
 */
export default function NoEncontrado() {
	return (
		<div className="flex min-h-[60svh] flex-col items-center justify-center px-4 py-16 text-center">
			<p className="font-display text-6xl font-semibold tracking-tight text-leaf">
				404
			</p>
			<h1 className="mt-3 font-display text-2xl font-semibold text-ink">
				Esa página no existe
			</h1>
			<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
				Puede que el enlace esté viejo o que el negocio ya no esté
				publicado. Desde el inicio encuentras el mapa y el catálogo
				del pueblo.
			</p>

			<div className="mt-6 flex flex-wrap justify-center gap-3">
				<Link
					href="/"
					className="inline-flex min-h-12 items-center justify-center rounded-xl bg-leaf px-5 py-3 font-semibold text-white shadow-leaf transition hover:bg-leaf/90 active:scale-[.98]"
				>
					Volver al inicio
				</Link>
				<Link
					href="/negocios"
					className="glass-soft inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold text-ink transition hover:bg-white/80"
				>
					Ver comercios
				</Link>
			</div>
		</div>
	);
}
