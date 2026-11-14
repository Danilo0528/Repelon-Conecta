"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconoCategoria } from "@/components/IconoCategoria";
import { Aviso } from "@/components/ui";
import { enAlcance } from "@/lib/alcance";
import { supabaseConfigurado } from "@/lib/env";
import type { InicioState } from "./useInicio";

export function SeccionHero({ inicio }: { inicio: InicioState }) {
	const router = useRouter();
	const { imagenesHero, indiceHero, creditoHero, categorias, T } = inicio;

	function buscar(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const q = (fd.get("q") as string).trim();
		router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar");
	}

	return (
		<section className="relative w-full overflow-hidden" style={{ background: "#fbfbf9" }}>
			{/* Ambientación de fondo */}
			<div className="pointer-events-none absolute inset-0"
				style={{ background: "linear-gradient(to right, #f0f4f2 0%, transparent 50%, #eff4ff 100%)", opacity: 0.7 }} aria-hidden />
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(210,228,255,0.3)" }} aria-hidden />
			<div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(111,221,121,0.15)" }} aria-hidden />

			{/* Fotos de fondo crossfade (detrás del contenido, no sobre él) */}
			{imagenesHero.map((src, i) => (
				<div key={`${src}-${i}`} aria-hidden
					className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms]"
					style={{ backgroundImage: `url(${src})`, opacity: i === indiceHero ? 0.12 : 0 }} />
			))}

			<div className="relative mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16 lg:px-12 lg:py-20">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">

					{/* ── Columna izquierda ── */}
					<div className="flex flex-col items-start lg:col-span-7">

						{/* Badge municipal */}
						<div className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm"
							style={{ background: "#e5eeff" }}>
							<BanderaChica />
							<span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "#078930" }} aria-hidden />
							<span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#091c31" }}>
								Repelón, Atlántico
							</span>
							<span style={{ color: "#3e4a3d" }}>•</span>
							<span className="text-[12px] font-bold" style={{ color: "#006d23" }}>Orgullo Repelonero</span>
						</div>

						{/* Titular */}
						<h1 className="mb-5 font-sans font-extrabold tracking-tight"
							style={{ fontSize: "clamp(2rem,5vw,3rem)", lineHeight: "1.1", color: "#091c31" }}>
							Todo el pueblo, a un{" "}
							<span style={{ color: "#006d23", fontStyle: "italic" }}>toque de tu celular.</span>
						</h1>

						<p className="mb-6 max-w-xl text-[18px] leading-[1.6]" style={{ color: "#3e4a3d" }}>
							{T("inicio.hero.texto")}
						</p>

						{!supabaseConfigurado && (
							<div className="mb-5 w-full max-w-xl">
								<Aviso tono="info">Falta configurar Supabase en <code>.env.local</code>.</Aviso>
							</div>
						)}

						{/* CTAs */}
						<div className="mb-6 flex flex-wrap items-center gap-3">
							<Link href="/negocios"
								className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-[14px] font-semibold text-white shadow-md transition hover:-translate-y-0.5"
								style={{ background: "#078930" }}>
								<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
									<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
									<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
								</svg>
								Explorar comercios
							</Link>
							<Link href="/vendedor"
								className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-[14px] font-semibold shadow-sm transition hover:bg-[#f0f4f2]"
								style={{ background: "#fff", color: "#1660a3", border: "1.5px solid #d2e4ff" }}>
								<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
									<circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
								</svg>
								Registrar mi negocio
							</Link>
						</div>

						{/* Chips de categoría */}
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-[12px] font-bold uppercase tracking-wider mr-1" style={{ color: "#3e4a3d" }}>
								Explorar rápido:
							</span>
							{(categorias.datos ?? []).filter((c) => enAlcance(c.slug)).map((c) => (
								<Link key={c.id} href="/negocios"
									className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold transition hover:brightness-95"
									style={{ background: "#e5eeff", color: "#091c31" }}>
									<IconoCategoria categoria={c} className="size-4" />
									{c.nombre}
								</Link>
							))}
						</div>
					</div>

					{/* ── Columna derecha: tarjeta de presentación ── */}
					<div className="lg:col-span-5">
						<div className="overflow-hidden rounded-xl shadow-xl" style={{ background: "#fff" }}>
							{/* Imagen del Guájaro o primera imagen del hero */}
							<div className="relative h-64 w-full overflow-hidden">
								{imagenesHero.length > 0 ? (
									<div className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
										style={{ backgroundImage: `url(${imagenesHero[indiceHero]})` }} />
								) : (
									<div className="h-full w-full"
										style={{ background: "linear-gradient(135deg, #e5eeff 0%, #d2e4ff 50%, #e5eeff 100%)" }} />
								)}
								<div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,28,49,0.75) 0%, transparent 60%)" }} />
								<div className="absolute bottom-3 left-3 right-3">
									<span className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider"
										style={{ background: "#ffdea7", color: "#271900" }}>
										Historias que conectan
									</span>
									<h3 className="text-[20px] font-bold leading-snug text-white">
										Tu negocio merece ser encontrado
									</h3>
								</div>
							</div>

							{/* Contenido inferior */}
							<div className="p-5">
								<div className="mb-3 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-lg shadow-sm"
										style={{ background: "#078930" }}>R</div>
									<div>
										<p className="text-[16px] font-bold leading-tight" style={{ color: "#091c31" }}>
											Crece con Repelón Conecta
										</p>
										<p className="text-[12px]" style={{ color: "#3e4a3d" }}>
											Impulso municipal para familias campesinas y emprendedoras
										</p>
									</div>
								</div>
								<p className="mb-4 text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>
									Haz visible lo que produces: plátano, yuca, mojarra fresca o servicios técnicos.
									Llega a tus clientes directamente a tu WhatsApp.
								</p>
								<Link href="/vendedor"
									className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-semibold text-white transition hover:brightness-95"
									style={{ background: "#1660a3" }}>
									<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
										<path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 23 17z" strokeLinejoin="round" />
									</svg>
									Registrar mi negocio ahora
								</Link>
							</div>
						</div>
					</div>

				</div>
			</div>

			{creditoHero && (
				<p className="absolute bottom-2 right-4 z-10 text-[11px]" style={{ color: "#3e4a3d" }}>
					{creditoHero}
				</p>
			)}
		</section>
	);
}

function BanderaChica() {
	return (
		<div className="flex h-3.5 w-5 flex-col overflow-hidden rounded-sm border" style={{ borderColor: "#becab9" }} aria-hidden>
			<span className="h-1/3 w-full" style={{ background: "#006d23" }} />
			<span className="h-1/3 w-full" style={{ background: "#fff" }} />
			<span className="h-1/3 w-full" style={{ background: "#1660a3" }} />
		</div>
	);
}
