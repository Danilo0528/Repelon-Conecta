import type { Metadata } from "next";
import Link from "next/link";

/*
 * Fondo Emprender: una página propia, no un incrustado.
 *
 * Antes la idea era enlazar o meter en un iframe el sitio del SENA, y
 * eso se cae en cualquier demo (el sitio cambia, mete frame-ancestors
 * y no responde dentro del navegador de la presentación). Acá vive el
 * contenido necesario para entender el programa y postular, con salida
 * a los sitios oficiales para lo que es trámite: así la sección nunca
 * depende de que el sitio ajeno esté de pie.
 *
 * Los datos son referenciales (requisitos, modalidades, acompañamiento);
 * fechas y montos oficiales siempre mandan los del SENA.
 *
 * ESTRUCTURA VISUAL (por qué no es una pila de cajas iguales):
 *   1. Hero a sangre con foto de campo y overlay: la promesa del
 *      fondo, con jerarquía de display y dos salidas claras.
 *   2. Banda de tres promesas (capital, condonación, acompañamiento):
 *      lo que la gente recuerda, en cifra y no en párrafo.
 *   3. Ruta en línea de tiempo vertical: un proceso se entiende como
 *      camino, no como rejilla de cuatro cajas.
 *   4. Requisitos + sectores en dos columnas asimétricas.
 *   5. Cierre: el aviso de seguridad y el puente a la plataforma.
 */

export const metadata: Metadata = {
	title: "Fondo Emprender | Repelón Conecta",
	description:
		"El fondo de capital semilla del SENA: acompañamiento para formular tu plan de negocio y recursos para crear o fortalecer tu emprendimiento en Repelón.",
};

const SITIO_FONDO = "https://www.fondoemprender.com/";
const SITIO_SENA =
	"https://www.sena.edu.co/es-co/trabajo/Paginas/fondo-emprender.aspx";

const PASOS = [
	{
		titulo: "Ruta Emprendedora",
		texto:
			"Te inscribes en la unidad de emprendimiento de tu centro de formación SENA y trabajas la idea del negocio, la validación y el modelo. Terminas con un proyecto listo para postular.",
	},
	{
		titulo: "Revisa la convocatoria",
		texto:
			"El SENA abre convocatorias varias veces al año, por región y por enfoque poblacional. Ahí están las fechas, los montos y los requisitos exactos.",
	},
	{
		titulo: "Postula el proyecto",
		texto:
			"Subes la iniciativa productiva o el plan de negocio en la plataforma del Fondo Emprender, de forma individual o asociada.",
	},
	{
		titulo: "Evaluación y desembolso",
		texto:
			"Viabilidad técnica, acreditación, contrato de cooperación y entrega de los recursos, con acompañamiento del SENA durante la ejecución.",
	},
];

const REQUISITOS = [
	"Ser colombiano, mayor de edad y estar domiciliado en el país.",
	"No tener una empresa constituida con personería jurídica (S.A.S., Ltda., S.A.).",
	"Haber completado la Ruta Emprendedora y contar con el certificado de formación que exija la convocatoria.",
	"Autorizar la consulta en centrales de información y entregar los certificados judiciales, fiscales y disciplinarios.",
	"Presentar la declaración juramentada de dedicación al proyecto.",
	"Postular en grupo solo si la mayoría del equipo son aprendices o egresados del SENA.",
];

const SECTORES = [
	"Agropecuario y agroindustrial",
	"Pesca y acuicultura",
	"Turismo y hospitalidad",
	"Artesanías",
	"Comercio y servicios",
	"Medio ambiente",
];

/** Las tres promesas que van debajo del hero, en una sola banda. */
const PROMESAS = [
	{
		dato: "Capital semilla",
		texto: "Recursos para montar o fortalecer el negocio.",
		punto: "bg-amarillo",
	},
	{
		dato: "Se condona",
		texto: "Si cumples las metas, no devuelves nada.",
		punto: "bg-leaf",
	},
	{
		dato: "Sin costo",
		texto: "El acompañamiento del SENA no se paga.",
		punto: "bg-cielo",
	},
];

export default function PaginaFondoEmprender() {
	return (
		<div className="m-0 p-0">
			{/* ============================ Hero ============================ */}
			{/*
			 * A sangre, igual que el de la home: la página del fondo es
			 * una invitación y no un apéndice del directorio. La foto de
			 * campo da contexto (esto es para negocios del pueblo) y el
			 * overlay mantiene el texto legible sobre cualquier imagen.
			 */}
			<section className="relative left-1/2 m-0 w-[100vw] max-w-none -translate-x-1/2 overflow-hidden">
				<div
					aria-hidden
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: "url(/img/campo.jpg)" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[#071b2f]/90 via-[#0b3550]/70 to-[#0b3550]/25" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#071b2f]/70 via-transparent to-transparent" />

				<div className="relative z-10 mx-auto grid min-h-[58svh] w-full max-w-6xl items-center px-4 py-12 sm:px-6 md:py-16">
					<div className="max-w-2xl">
						<div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
							<span className="h-px w-8 bg-amarillo" aria-hidden />
							Programa del SENA
						</div>

						<h1 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-white md:text-5xl lg:text-6xl">
							Fondo{" "}
							<span className="italic text-amarillo">Emprender</span>
						</h1>

						<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
							Es el fondo de capital semilla del Gobierno de Colombia,
							administrado por el SENA, para los proyectos que se ponen en
							marcha o se fortalecen. Te acompañan a formular el plan y, si
							cumples las metas,{" "}
							<strong className="font-semibold text-white">
								los recursos se condonan
							</strong>
							: no se devuelven.
						</p>

						<div className="mt-7 flex flex-wrap gap-3">
							<a
								href={SITIO_FONDO}
								target="_blank"
								rel="noreferrer"
								className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amarillo px-5 py-3 text-center font-semibold text-ink transition hover:bg-amarillo/90 active:scale-[.98]"
							>
								Ir al sitio oficial del Fondo
							</a>
							<a
								href={SITIO_SENA}
								target="_blank"
								rel="noreferrer"
								className="glass-soft inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold text-white transition hover:bg-white/85 active:scale-[.98]"
							>
								Ver información en sena.edu.co
							</a>
						</div>

						<p className="mt-5 text-xs leading-relaxed text-white/70">
							La postulación es directamente con el SENA: aquí no se cobra
							nada por postular.{" "}
							<Link
								href="/"
								className="font-medium text-white underline decoration-white/40 underline-offset-4 transition hover:text-amarillo hover:decoration-amarillo"
							>
								Volver al mapa
							</Link>
						</p>
					</div>
				</div>
			</section>

			{/* ====================== Banda de promesas ====================== */}
			{/*
			 * Lo que la gente se lleva de la página, en tres piezas
			 * cortas y con color propio. Va con su propio aire debajo del
			 * hero (sin margen negativo: sobre el overlay oscuro la
			 * superposición se leía como pegote, no como profundidad).
			 */}
			<section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-12">
				<div className="glass grid gap-3 rounded-3xl p-4 shadow-float sm:grid-cols-3">
					{PROMESAS.map(({ dato, texto, punto }) => (
						<div key={dato} className="flex items-start gap-3 rounded-2xl p-3">
							<span
								className={`mt-1.5 size-2.5 shrink-0 rounded-full ${punto}`}
								aria-hidden
							/>
							<div>
								<p className="font-display text-base font-semibold text-ink">
									{dato}
								</p>
								<p className="mt-0.5 text-sm leading-snug text-muted-foreground">
									{texto}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ======================== La ruta, en camino ======================== */}
			{/*
			 * Un proceso se lee como recorrido, no como rejilla: línea
			 * vertical con los números encima. En móvil la línea queda a
			 * la izquierda y el texto respira; el número es el ancla
			 * visual de cada etapa.
			 */}
			<section className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
					Cómo funciona
				</p>
				<h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
					De la idea al desembolso, paso a paso
				</h2>
				<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
					El recorrido tiene cuatro etapas. Ninguna se paga y las tres
					primeras puedes hacerlas desde Repelón.
				</p>

				<ol className="mt-8 space-y-0">
					{PASOS.map((paso, i) => (
						<li key={paso.titulo} className="relative flex gap-4 pb-8 last:pb-0">
							{/* Riel vertical: une los cuatro puntos del camino. */}
							{i < PASOS.length - 1 && (
								<span
									aria-hidden
									className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-leaf/25"
								/>
							)}
							<span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-leaf text-sm font-bold tabular text-white shadow-leaf">
								{i + 1}
							</span>
							<div className="min-w-0 flex-1 pt-1">
								<h3 className="font-display text-lg font-semibold text-ink">
									{paso.titulo}
								</h3>
								<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
									{paso.texto}
								</p>
							</div>
						</li>
					))}
				</ol>
			</section>

			{/* ================ Requisitos y sectores (dos columnas) ================ */}
			{/*
			 * Columnas desiguales a propósito: los requisitos son una
			 * lista larga que necesita ancho; el "qué se financia" es más
			 * visual (sectores en pastillas) y aguanta la columna corta.
			 */}
			<section className="mx-auto grid max-w-6xl gap-5 px-4 pt-14 sm:px-6 md:grid-cols-[1.15fr_1fr]">
				<div className="glass rounded-3xl p-6 md:p-8">
					<h2 className="font-display text-xl font-semibold text-ink">
						¿Quiénes pueden postular?
					</h2>
					<ul className="mt-4 space-y-3">
						{REQUISITOS.map((r) => (
							<li
								key={r}
								className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
							>
								<svg
									viewBox="0 0 24 24"
									className="mt-0.5 size-4 shrink-0 text-leaf"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.2"
									aria-hidden
								>
									<path
										d="m5 12.5 4.5 4.5L19 7.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span>{r}</span>
							</li>
						))}
					</ul>
					<p className="mt-4 border-t border-black/5 pt-3 text-xs leading-relaxed text-muted-foreground/80">
						La lista es referencial: el requisito que manda es el de la
						convocatoria vigente.
					</p>
				</div>

				<div className="flex flex-col gap-5">
					<div className="glass rounded-3xl p-6 md:p-8">
						<h2 className="font-display text-xl font-semibold text-ink">
							¿Qué se financia?
						</h2>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							La creación y el fortalecimiento de iniciativas productivas:
							montar el negocio, comprar los primeros insumos o dar el salto
							que ya llevas tiempo planeando. Puedes postular solo o en
							grupo.
						</p>

						<h3 className="mt-5 font-display text-sm font-semibold text-ink">
							Sectores que entran
						</h3>
						<div className="mt-2.5 flex flex-wrap gap-2">
							{SECTORES.map((s) => (
								<span
									key={s}
									className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-semibold text-leaf"
								>
									{s}
								</span>
							))}
						</div>
					</div>

					{/*
					 * El dato que más cuesta creer, con su propio peso:
					 * fondo verde sólido y texto en display, no un párrafo
					 * perdido dentro de otra tarjeta.
					 */}
					<div className="rounded-3xl bg-leaf p-6 text-white shadow-leaf md:p-8">
						<p className="font-display text-xl font-semibold leading-snug">
							Si cumples las metas, los recursos se condonan.
						</p>
						<p className="mt-2 text-sm leading-relaxed text-white/85">
							Se devuelven solo si el proyecto no cumple lo que se
							comprometió. Ese es el corazón del fondo.
						</p>
					</div>
				</div>
			</section>

			{/* ============ Acompañamiento + aviso (dos columnas desiguales) ============ */}
			<section className="mx-auto grid max-w-6xl gap-5 px-4 pt-14 sm:px-6 md:grid-cols-[1fr_1.15fr]">
				<div className="glass rounded-3xl p-6 md:p-8">
					<h2 className="font-display text-xl font-semibold text-ink">
						¿Dónde me acompañan?
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						Los Centros de Desarrollo Empresarial del SENA atienden
						presencial y virtual, y en cada centro de formación está la
						unidad de emprendimiento que te orienta en la Ruta Emprendedora.
						El acompañamiento no tiene costo.
					</p>
				</div>

				<div className="rounded-3xl border border-azul/25 bg-azul/[.06] p-6 md:p-8">
					<div className="flex items-center gap-2.5">
						<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-azul/15 text-azul">
							<svg
								viewBox="0 0 24 24"
								className="size-5"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								aria-hidden
							>
								<path
									d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3z"
									strokeLinejoin="round"
								/>
								<path d="M9.5 12.2 11.3 14l3.4-3.6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</span>
						<h2 className="font-display text-lg font-semibold text-ink">
							Antes de postular
						</h2>
					</div>
					<ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
						<li className="flex gap-2.5">
							<span className="mt-2 size-1.5 shrink-0 rounded-full bg-azul" aria-hidden />
							<span>
								Nadie del SENA cobra por postular ni por acompañarte: si te
								piden dinero, no es el Fondo.
							</span>
						</li>
						<li className="flex gap-2.5">
							<span className="mt-2 size-1.5 shrink-0 rounded-full bg-azul" aria-hidden />
							<span>
								Las fechas, montos y requisitos exactos viven en la
								convocatoria vigente del SENA; esta página es una guía para
								empezar.
							</span>
						</li>
						<li className="flex gap-2.5">
							<span className="mt-2 size-1.5 shrink-0 rounded-full bg-azul" aria-hidden />
							<span>
								En Repelón Conecta no guardamos ni revisamos tu proyecto:
								todo el trámite ocurre con el SENA.
							</span>
						</li>
					</ul>
				</div>
			</section>

			{/* ==================== Puente a la plataforma ==================== */}
			{/*
			 * El cierre es la única sección que habla de la plataforma,
			 * y va con foto del oficio para que "tu negocio" se vea como
			 * algo real, no como una promesa abstracta.
			 */}
			<section className="mx-auto max-w-6xl px-4 pb-4 pt-14 sm:px-6">
				<div className="glass overflow-hidden rounded-3xl md:grid md:grid-cols-[1fr_320px]">
					<div className="p-6 md:p-8">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
							Y aquí, en Repelón Conecta
						</p>
						<h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
							Visibilidad hoy, plan mañana
						</h2>
						<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
							Esta plataforma no tramita ni cobra el Fondo: la postulación
							se hace directamente con el SENA. Lo que sí puedes hacer acá
							es tener tu negocio visible mientras formules el proyecto:
							catálogo con precios, fotos y el botón de WhatsApp para que
							los vecinos te pidan.
						</p>
						<div className="mt-5 flex flex-col gap-3 sm:flex-row">
							<Link
								href="/vendedor"
								className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-leaf px-5 py-3 text-center font-semibold text-white shadow-leaf transition hover:bg-leaf/90 active:scale-[.98]"
							>
								Publicar mi negocio gratis
							</Link>
							<Link
								href="/negocios"
								className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-leaf/40 px-5 py-3 text-center font-semibold text-leaf transition hover:bg-leaf/5 active:scale-[.98]"
							>
								Ver los comercios del pueblo
							</Link>
						</div>
					</div>
					<div
						role="img"
						aria-label="Negocio del pueblo: mostrando sus productos a la comunidad"
						className="hidden bg-cover bg-center md:block"
						style={{ backgroundImage: "url(/img/tienda.jpg)" }}
					/>
				</div>
			</section>
		</div>
	);
}
