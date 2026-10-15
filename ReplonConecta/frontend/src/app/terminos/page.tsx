import Link from "next/link";

/*
 * Términos y condiciones de Repelón Conecta (borrador).
 *
 * Reglas simples del pueblo: quién publica, quién responde y que los
 * tratos cierran por WhatsApp, entre vecinos.
 */
export default function Terminos() {
	return (
		<article className="mx-auto max-w-2xl px-4 py-10">
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
				Repelón Conecta
			</p>
			<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
				Términos y condiciones
			</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Última actualización: octubre de 2026.
			</p>

			<div className="mt-6 space-y-6 text-sm leading-relaxed text-ink/90">
				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Qué es esta app
					</h2>
					<p className="mt-1.5">
						Repelón Conecta es el directorio digital del pueblo: muestra los
						negocios locales, sus productos y los lugares para visitar. No
						vendemos nosotros nada; conectamos al vecino con el negocio.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Los pedidos se cierran por WhatsApp
					</h2>
					<p className="mt-1.5">
						Cualquier compra, precio, entrega o acuerdo se conversa y se
						confirma directamente con el negocio. La app solo abre la
						conversación: el trato es entre vecinos.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Si publicas un negocio
					</h2>
					<p className="mt-1.5">
						Te comprometes a que la información sea tuya o de tu negocio, y
						que las fotos también. Puedes editarla o borrarla cuando
						quieras desde tu panel.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Contenido de terceros
					</h2>
					<p className="mt-1.5">
						Los mapas los provee Google Maps y las rutas se abren allí. El
						precio del Fondo Emprender y sus reglas los maneja el SENA en su
						sitio oficial: en la app solo contamos qué es.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Cambios
					</h2>
					<p className="mt-1.5">
						Si estas reglas cambian, se actualizan en esta misma página con
						la fecha nueva arriba.
					</p>
				</section>
			</div>

			<p className="mt-8 text-sm text-muted-foreground">
				<Link href="/privacidad" className="font-medium text-azul hover:underline">
					Política de privacidad
				</Link>{" "}
				·{" "}
				<Link href="/" className="font-medium text-azul hover:underline">
					Volver al inicio
				</Link>
			</p>
		</article>
	);
}
