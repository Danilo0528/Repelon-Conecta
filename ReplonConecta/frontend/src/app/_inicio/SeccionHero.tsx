"use client";

import Link from "next/link";

import type { InicioState } from "./useInicio";

/** Portada con imágenes administrables desde el panel. */
export function SeccionHero({ inicio }: { inicio: InicioState }) {
	const { imagenesHero, indiceHero, setHeroIdx, creditoHero, T } = inicio;

	return (
		<section className="relative isolate overflow-hidden bg-[#173d32]">
			{imagenesHero.map((src, i) => (
				<div
					key={`${src}-${i}`}
					aria-hidden
					className="absolute inset-0 bg-cover bg-[center_55%] transition-opacity duration-700"
					style={{ backgroundImage: `url(${src})`, opacity: i === indiceHero ? 1 : 0 }}
				/>
			))}
			<div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#102c24]/90 via-[#102c24]/72 to-[#102c24]/38" />
			<div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#102c24]/30 to-transparent" />

			<div className="relative mx-auto flex min-h-[232px] w-full max-w-[1440px] items-center px-5 py-5 sm:min-h-[26rem] sm:px-8 sm:py-14 md:px-12 lg:min-h-[34rem] lg:px-20">
				<div className="max-w-3xl">
					<p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 sm:mb-4 sm:text-sm">
						<span className="h-px w-5 bg-[#f2b705] sm:w-8" aria-hidden />
						Repelón · Atlántico
					</p>

					<h1 className="max-w-[19ch] font-display text-[clamp(1.7rem,8vw,1.9rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:max-w-[17ch] sm:text-[clamp(2rem,6vw,4.5rem)] sm:leading-[.98] sm:tracking-[-0.045em]">
						<span className="sm:hidden">
							<span className="block">{T("inicio.hero.titulo1")}</span>
							<span className="block text-[#f2c84b]">{T("inicio.hero.titulo2")}</span>
						</span>
						<span className="hidden sm:inline">
							{T("inicio.hero.titulo1")} {" "}
							<span className="text-[#f2c84b]">{T("inicio.hero.titulo2")}</span>
						</span>
					</h1>

					<p className="mt-2 max-w-[32ch] text-[12px] leading-[1.45] text-white/90 sm:mt-5 sm:text-lg sm:leading-[1.4]">
						{T("inicio.hero.texto")}
					</p>

					<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-7 sm:gap-3">
						<Link
							href="/negocios"
							aria-label="Explorar negocios"
							className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#f2b705] px-4 text-xs font-bold text-[#173d32] transition hover:bg-[#ffcf31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[.98] sm:min-h-12 sm:px-6 sm:text-sm"
						>
							Explorar negocios
							<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
						<Link
							href="/#turismo"
							className="hidden min-h-10 items-center rounded-full px-1 text-xs font-semibold text-white transition hover:text-[#f2c84b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex sm:px-3 sm:text-sm"
						>
							Conocer Repelón
						</Link>
					</div>
				</div>
			</div>

			{creditoHero && (
				<p className="absolute bottom-5 right-5 z-10 hidden max-w-[45%] text-right text-[10px] leading-snug text-white/85 sm:block sm:text-xs">
					Fuente: {creditoHero}
				</p>
			)}

			{imagenesHero.length > 1 && (
				<div role="group" aria-label="Diapositivas de portada" className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
					{imagenesHero.map((src, index) => (
						<button
							key={`${src}-indicador-${index}`}
							type="button"
							onClick={() => setHeroIdx(index)}
							aria-label={`Mostrar diapositiva ${index + 1}`}
							aria-pressed={indiceHero === index}
							className={`size-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${indiceHero === index ? "bg-white" : "bg-white/50"}`}
						/>
					))}
				</div>
			)}
		</section>
	);
}
