import Link from "next/link";

/*
 * Política de privacidad de Repelón Conecta (borrador).
 *
 * Página estática y corta: la app es un directorio del pueblo, no una
 * red social. Si el backend cambia lo que guarda (nuevos campos, otro
 * tercero), hay que actualizar este texto: no es un "template", es la
 * promesa real que se le hace al vecino.
 */
export default function Privacidad() {
	return (
		<article className="mx-auto max-w-2xl px-4 py-10">
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
				Repelón Conecta
			</p>
			<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
				Política de privacidad
			</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Última actualización: octubre de 2026.
			</p>

			<div className="mt-6 space-y-6 text-sm leading-relaxed text-ink/90">
				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Qué datos guardamos
					</h2>
					<p className="mt-1.5">
						Cuando te registras pedimos correo electrónico y contraseña.
						Si publicas un negocio, también el nombre del negocio, la
						dirección, el barrio, el teléfono de WhatsApp y las fotos que
						subas. Nada más.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Para qué los usamos
					</h2>
					<p className="mt-1.5">
						Para que los vecinos te encuentren y te escriban por WhatsApp.
						No vendemos ni cedemos tus datos a nadie, y no enviamos
						correos que no tengan que ver con tu cuenta.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Ubicación
					</h2>
					<p className="mt-1.5">
						Si aceptas compartir tu ubicación, se usa solo para calcularte
						la ruta hacia un negocio o un lugar turístico en Google Maps.
						La decisión es tuya y puedes negarla sin que se pierda ninguna
						función de la app.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Dónde vive la información
					</h2>
					<p className="mt-1.5">
						En Supabase, con acceso restringido: los catálogos son públicos,
						pero tu cuenta y tus pedidos solo los ves tú y el equipo que
						opera la plataforma.
					</p>
				</section>

				<section>
					<h2 className="font-display text-lg font-semibold text-ink">
						Contacto
					</h2>
					<p className="mt-1.5">
						Si quieres ver, corregir o borrar tus datos, escríbenos por el
						WhatsApp del pueblo o pregúntale al negocio donde te registraste.
					</p>
				</section>
			</div>

			<p className="mt-8 text-sm text-muted-foreground">
				<Link href="/terminos" className="font-medium text-azul hover:underline">
					Términos y condiciones
				</Link>{" "}
				·{" "}
				<Link href="/" className="font-medium text-azul hover:underline">
					Volver al inicio
				</Link>
			</p>
		</article>
	);
}
