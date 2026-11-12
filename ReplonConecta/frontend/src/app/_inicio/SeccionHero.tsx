"use client";

import Link from "next/link";

import type { InicioState } from "./useInicio";

/** Portada visual del pueblo, con diapositivas administrables desde el panel. */
export function SeccionHero({ inicio }: { inicio: InicioState }) {
	const { imagenesHero, indiceHero, creditoHero, T } = inicio;

	return (
		<section className="relative left-1/2 min-h-[31rem] w-[100vw] max-w-none -translate-x-1/2 overflow-hidden bg-[#102d46] md:min-h-[26rem] lg:min-h-[34rem]">
			{imagenesHero.map((src, i) => (
				<div
					key={`${src}-${i}`}
					aria-hidden
					className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
					style={{
						backgroundImage: `linear-gradient(90deg, rgba(7,24,42,.82) 0%, rgba(7,30,50,.56) 48%, rgba(7,30,50,.12) 100%), url(${src})`,
						opacity: i === indiceHero ? 1 : 0,
					}}
				/>
			))}
			<div
				aria-hidden
				className="absolute inset-0 bg-gradient-to-t from-[#071b2f]/55 via-transparent to-[#071b2f]/10"
			/>

			<div className="relative mx-auto flex min-h-[inherit] w-full max-w-[1440px] items-center px-5 py-10 sm:px-8 sm:py-14 md:px-12 lg:px-20">
				<div className="max-w-3xl">
					<p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/85 sm:text-sm">
						<span className="h-px w-8 bg-[#79c594]" aria-hidden />
						Repelón, Atlántico
					</p>

					<h1 className="mt-5 max-w-[18ch] font-sans text-[clamp(2.5rem,6.2vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
						{T("inicio.hero.titulo1")} <span className="text-[#a6ddb5]">{T("inicio.hero.titulo2")}</span>
					</h1>

					<p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
						{T("inicio.hero.texto")}
					</p>

					<div className="mt-7 flex flex-col gap-3 sm:flex-row">
						<Link
							href="/negocios"
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#078930] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#06782a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[.98]"
						>
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<circle cx="11" cy="11" r="7" />
								<path d="m16.5 16.5 4 4" strokeLinecap="round" />
							</svg>
							Explorar comercios
						</Link>
						<Link
							href="/vendedor"
							className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/95 px-6 py-3 text-sm font-bold text-[#12366a] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[.98]"
						>
							Registrar mi negocio
						</Link>
					</div>

				</div>
			</div>

			{creditoHero && (
				<p className="absolute bottom-4 right-5 z-10 max-w-[70%] text-right text-[11px] leading-snug text-white/75 md:right-8">
					Fuente: {creditoHero}
				</p>
			)}

			<div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#078930] via-white to-[#0f47af]" />
		</section>
	);
}
