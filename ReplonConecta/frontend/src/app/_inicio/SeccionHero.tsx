"use client";

import Link from "next/link";

import type { InicioState } from "./useInicio";

/** Portada visual del pueblo, con diapositivas administrables desde el panel. */
export function SeccionHero({ inicio }: { inicio: InicioState }) {
	const { imagenesHero, indiceHero, setHeroIdx, creditoHero, T } = inicio;

	return (
		<section className="relative isolate overflow-hidden bg-[#f5f8f3]">
			{imagenesHero.map((src, i) => (
				<div
					key={`${src}-${i}`}
					aria-hidden
					className="absolute inset-0 bg-cover bg-[center_58%] transition-opacity duration-1000 ease-in-out"
					style={{ backgroundImage: `url(${src})`, opacity: i === indiceHero ? 0.2 : 0 }}
				/>
			))}
			<div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#f5f8f3] via-[#f5f8f3]/95 to-[#f5f8f3]/75" />

			<div className="relative mx-auto flex min-h-[184px] w-full max-w-[1440px] items-center px-4 py-3 sm:min-h-[26rem] sm:px-8 sm:py-14 md:px-12 lg:min-h-[34rem] lg:px-20">
				<div className="max-w-3xl">
					<p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0a7133] sm:text-sm">
						<span className="h-px w-5 bg-[#078930] sm:w-8" aria-hidden />
						Repelón, Atlántico
					</p>

					<h1 className="max-w-[18ch] font-display text-[clamp(1.45rem,7.6vw,1.55rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[#12366a] sm:mt-5 sm:max-w-[17ch] sm:text-[clamp(2rem,6vw,4.5rem)] sm:leading-[.98] sm:tracking-[-0.045em]">
						<span className="sm:hidden">
							<span className="block">Descubre Repelón,</span>
							<span className="block text-[#0a7133]">cerca de ti.</span>
						</span>
						<span className="hidden sm:inline">
							{T("inicio.hero.titulo1")} {" "}
							<span className="text-[#0a7133]">{T("inicio.hero.titulo2")}</span>
						</span>
					</h1>

					<p className="mt-2 max-w-[34ch] text-[13px] leading-[1.45] text-[#40566a] sm:mt-5 sm:text-lg sm:leading-[1.4]">
						{T("inicio.hero.texto")}
					</p>

					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-7 sm:gap-3">
						<Link
							href="/negocios"
							aria-label="Explorar negocios"
							className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#0a7133] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#075b29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078930] active:scale-[.98] sm:min-h-12 sm:px-6 sm:text-sm"
						>
							Explorar comercios
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
						<Link
							href="/#turismo"
							className="inline-flex min-h-10 items-center rounded-full px-1 text-xs font-semibold text-[#12366a] transition hover:text-[#0a7133] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f47af] sm:px-3 sm:text-sm"
						>
							Conocer Repelón
						</Link>
					</div>
				</div>
			</div>

			{creditoHero && (
				<p className="absolute bottom-5 right-5 z-10 hidden max-w-[45%] text-right text-[10px] leading-snug text-white/90 sm:block sm:text-xs">
					Fuente: {creditoHero}
				</p>
			)}

			{imagenesHero.length > 1 && (
				<div role="group" aria-label="Diapositivas de portada" className="absolute bottom-2 right-4 z-10 flex items-center gap-1.5 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
					{imagenesHero.map((src, index) => (
						<button
							key={`${src}-indicador-${index}`}
							type="button"
							onClick={() => setHeroIdx(index)}
							aria-label={`Mostrar diapositiva ${index + 1}`}
							aria-pressed={indiceHero === index}
							className={`size-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12366a] ${indiceHero === index ? "bg-[#0a7133]" : "bg-[#12366a]/30"}`}
						/>
					))}
				</div>
			)}
		</section>
	);
}
