"use client";

import Link from "next/link";

import type { InicioState } from "./useInicio";

/** Portada visual del pueblo, con diapositivas administrables desde el panel. */
export function SeccionHero({ inicio }: { inicio: InicioState }) {
	const { imagenesHero, indiceHero, creditoHero, T } = inicio;

	return (
		<section className="relative left-1/2 min-h-[17rem] w-[100vw] max-w-none -translate-x-1/2 overflow-hidden bg-[#102d46] sm:min-h-[26rem] lg:min-h-[34rem]">
			{imagenesHero.map((src, i) => (
				<div
					key={`${src}-${i}`}
					aria-hidden
					className="absolute inset-0 bg-cover bg-[center_58%] transition-opacity duration-1000 ease-in-out"
					style={{
						backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 46%, rgba(255,255,255,.2) 100%), linear-gradient(0deg, rgba(255,255,255,.16), transparent 45%), url(${src})`,
						opacity: i === indiceHero ? 1 : 0,
					}}
				/>
			))}

			<div className="relative mx-auto flex min-h-[inherit] w-full max-w-[1440px] items-center px-4 py-4 sm:px-8 sm:py-14 md:px-12 lg:px-20">
				<div className="max-w-3xl">
					<p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0a7133] sm:text-sm">
						<span className="h-px w-5 bg-[#078930] sm:w-8" aria-hidden />
						Repelón, Atlántico
					</p>

					<h1 className="mt-2 max-w-[17ch] font-sans text-[clamp(2rem,8vw,4.5rem)] font-extrabold leading-[.98] tracking-[-0.045em] text-[#12366a] sm:mt-5">
						{T("inicio.hero.titulo1")}{" "}<span className="text-[#0a7133]">{T("inicio.hero.titulo2")}</span>
					</h1>

					<p className="mt-3 max-w-[39ch] text-[13px] leading-[1.4] text-[#12366a] sm:mt-5 sm:text-lg">
						{T("inicio.hero.texto")}
					</p>

					<div className="mt-4 flex max-w-xl flex-row gap-2 sm:mt-7 sm:gap-3">
						<Link
							href="/negocios"
							aria-label="Explorar negocios"
							className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#078930] px-2 py-2 text-[11px] font-bold text-white shadow-lg shadow-black/15 transition hover:bg-[#06782a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930] active:scale-[.98] sm:min-h-12 sm:flex-none sm:gap-2 sm:px-6 sm:text-sm"
						>
							<svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M3 10h18v10H3zM2 10l2-6h16l2 6M8 20v-6h4v6" strokeLinejoin="round" />
								<path d="M5 10c0 1.2.7 2 1.5 2S8 11.2 8 10m0 0c0 1.2.7 2 1.5 2s1.5-.8 1.5-2m0 0c0 1.2.7 2 1.5 2S14 11.2 14 10m0 0c0 1.2.7 2 1.5 2S17 11.2 17 10m0 0c0 1.2.7 2 1.5 2S20 11.2 20 10" />
							</svg>
							<span className="min-[360px]:hidden">Explorar</span>
							<span className="hidden min-[360px]:inline">Explorar negocios</span>
							<svg viewBox="0 0 24 24" className="hidden size-4 shrink-0 min-[360px]:block" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
						<Link
							href="/#turismo"
							aria-label="Conocer Repelón"
							className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#12366a]/25 bg-white/95 px-2 py-2 text-[11px] font-bold text-[#12366a] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] active:scale-[.98] sm:min-h-12 sm:flex-none sm:gap-2 sm:px-6 sm:text-sm"
						>
							<svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" strokeLinejoin="round" />
								<circle cx="12" cy="10" r="2.3" />
							</svg>
							Conocer Repelón
						</Link>
					</div>
				</div>
			</div>

			{creditoHero && (
				<p className="absolute bottom-5 right-5 z-10 max-w-[45%] text-right text-[10px] leading-snug text-white/90 sm:bottom-7 sm:right-8 sm:text-xs">
					Fuente: {creditoHero}
				</p>
			)}

			<svg aria-hidden viewBox="0 0 100 12" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-5 w-full">
				<path d="M0 2 C28 11 67 12 100 1 V12 H0Z" fill="#078930" />
				<path d="M0 5 C28 13 67 14 100 4 V8 C68 16 28 15 0 9Z" fill="#ffffff" />
				<path d="M0 9 C28 15 68 16 100 7 V12 H0Z" fill="#0f47af" />
			</svg>
		</section>
	);
}
