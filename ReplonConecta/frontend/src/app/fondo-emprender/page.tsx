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

export default function PaginaFondoEmprender() {
	return (
		<div className="px-4 pt-4">
			{/* ============================ Encabezado ============================ */}
			<div className="glass rounded-3xl bg-gradient-to-br from-azul/10 via-glass/40 to-leaf/10 p-6 md:p-8">
				<div className="flex flex-wrap items-center gap-2">
					<span className="rounded-full bg-azul/15 px-2.5 py-1 text-xs font-semibold text-azul">
						Programa del SENA
					</span>
					<span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold text-leaf">
						Capital semilla
					</span>
				</div>

				<h1 className="mt-3 font-display text-3xl font-semibold text-ink">
					Fondo Emprender
				</h1>
				<p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
					Es el fondo de capital semilla creado por el Gobierno de
					Colombia y administrado por el SENA para financiar proyectos
					que se ponen en marcha o se fortalecen. Te acompañan para
					formular el plan y, si cumples las metas, los recursos se
					condonan: no se devuelven.
				</p>

				<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a
						href={SITIO_FONDO}
						target="_blank"
						rel="noreferrer"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-azul px-5 py-3 text-center font-semibold text-white"
					>
						Ir al sitio oficial del Fondo
					</a>
					<a
						href={SITIO_SENA}
						target="_blank"
						rel="noreferrer"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-azul/30 px-5 py-3 text-center font-semibold text-azul"
					>
						Ver información en sena.edu.co
					</a>
					<Link
						href="/"
						className="inline-flex min-h-12 shrink-0 items-center justify-center px-2 py-3 text-sm font-medium text-azul"
					>
						Volver al mapa
					</Link>
				</div>
			</div>

			{/* ============================ Cómo funciona ============================ */}
			<section className="glass mt-4 rounded-3xl p-6">
				<h2 className="font-display text-xl font-semibold text-ink">
					Cómo funciona, paso a paso
				</h2>
				<ol className="mt-4 grid gap-4 sm:grid-cols-2">
					{PASOS.map((paso, i) => (
						<li key={paso.titulo} className="rounded-2xl bg-glass/70 p-4">
							<span className="grid size-8 place-items-center rounded-full bg-azul/10 text-sm font-bold text-azul">
								{i + 1}
							</span>
							<h3 className="mt-2 font-display text-base font-semibold text-ink">
								{paso.titulo}
							</h3>
							<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
								{paso.texto}
							</p>
						</li>
					))}
				</ol>
			</section>

			{/* ============================ Quién y qué ============================ */}
			<section className="mt-4 grid gap-4 md:grid-cols-2">
				<div className="glass rounded-3xl p-6">
					<h2 className="font-display text-xl font-semibold text-ink">
						¿Quiénes pueden postular?
					</h2>
					<ul className="mt-3 space-y-2">
						{REQUISITOS.map((r) => (
							<li
								key={r}
								className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
							>
								<svg
									viewBox="0 0 24 24"
									className="mt-0.5 size-4 shrink-0 text-leaf"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.2"
									aria-hidden
								>
									<path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								{r}
							</li>
						))}
					</ul>
					<p className="mt-3 text-xs text-muted-foreground">
						La lista es referencial: el requisito que manda es el de
						la convocatoria vigente.
					</p>
				</div>

				<div className="glass rounded-3xl p-6">
					<h2 className="font-display text-xl font-semibold text-ink">
						¿Qué se financia?
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						La creación y el fortalecimiento de iniciativas
						productivas: montar el negocio, comprar los primeros
						insumos o dar el salto que ya llevas tiempo planeando.
						Puedes postular solo o en grupo.
					</p>

					<h3 className="mt-4 font-display text-sm font-semibold text-ink">
						Sectores que entran
					</h3>
					<div className="mt-2 flex flex-wrap gap-2">
						{SECTORES.map((s) => (
							<span
								key={s}
								className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-semibold text-leaf"
							>
								{s}
							</span>
						))}
					</div>

					<div className="mt-4 rounded-2xl bg-azul/10 p-4">
						<p className="text-sm leading-relaxed text-ink">
							<strong className="font-semibold">
								Recursos condonables.
							</strong>{" "}
							Se devuelven solo si el proyecto no cumple las metas
							comprometidas.
						</p>
					</div>
				</div>
			</section>

			{/* ============================ Acompañamiento ============================ */}
			<section className="glass mt-4 rounded-3xl p-6">
				<h2 className="font-display text-xl font-semibold text-ink">
					¿Dónde me acompañan?
				</h2>
				<p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
					Los Centros de Desarrollo Empresarial del SENA atienden
					presencial y virtual, y en cada centro de formación está la
					unidad de emprendimiento que te orienta en la Ruta
					Emprendedora. El acompañamiento no tiene costo.
				</p>
			</section>

			{/* ============================ Aquí, en la plataforma ============================ */}
			<section className="glass mt-4 rounded-3xl p-6">
				<h2 className="font-display text-xl font-semibold text-ink">
					Y aquí, en Repelón Conecta
				</h2>
				<p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
					Esta plataforma no tramita ni cobra el Fondo: la postulación
					se hace directamente con el SENA. Lo que sí puedes hacer
					acá es tener tu negocio visible mientras formules el
					proyecto: catálogo con precios, fotos y el botón de WhatsApp
					para que los vecinos te pidan.
				</p>
				<div className="mt-4 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/vendedor"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-leaf px-5 py-3 text-center font-semibold text-white shadow-leaf"
					>
						Publicar mi negocio gratis
					</Link>
					<Link
						href="/negocios"
						className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-leaf/40 px-5 py-3 text-center font-semibold text-leaf"
					>
						Ver los comercios del pueblo
					</Link>
				</div>
			</section>

			{/* ============================ Aviso ============================ */}
			<section className="mt-4 rounded-3xl border border-azul/20 bg-azul/5 p-5">
				<h2 className="font-display text-base font-semibold text-ink">
					Antes de postular
				</h2>
				<ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
					<li>
						Nadie del SENA cobra por postular ni por acompañarte: si
						te piden dinero, no es el Fondo.
					</li>
					<li>
						Las fechas, montos y requisitos exactos viven en la
						convocatoria vigente del SENA; esta página es una
						guía para empezar.
					</li>
					<li>
						En Repelón Conecta no guardamos ni revisamos tu
						proyecto: todo el trámite ocurre con el SENA.
					</li>
				</ul>
			</section>
		</div>
	);
}
