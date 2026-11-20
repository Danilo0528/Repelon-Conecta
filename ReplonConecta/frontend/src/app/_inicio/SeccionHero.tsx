"use client";

import Link from "next/link";

import { IconoCategoria } from "@/components/IconoCategoria";
import { Aviso } from "@/components/ui";
import { enAlcance } from "@/lib/alcance";
import { supabaseConfigurado } from "@/lib/env";
import type { InicioState } from "./useInicio";

/** Portada: slider de fotos, promesa del pueblo digitalizado y atajos por rubro. */
export function SeccionHero({ inicio }: { inicio: InicioState }) {
	const { imagenesHero, indiceHero, creditoHero, categorias, T } = inicio;

	return (
		<section className="relative left-1/2 m-0 min-h-[70svh] w-[100vw] max-w-none -translate-x-1/2 overflow-hidden bg-cover bg-center bg-no-repeat sm:min-h-[80svh] md:min-h-[calc(100svh-4rem)]">
			{/* Slider de fondo: imágenes apiladas con crossfade */}
			{imagenesHero.map((src, i) => (
				<div
					key={`${src}-${i}`}
					aria-hidden
					className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1200ms] ease-in-out"
					style={{
						backgroundImage: `linear-gradient(90deg, rgba(7,27,47,.46), rgba(7,27,47,.08)), url(${src})`,
						opacity: i === indiceHero ? 1 : 0,
					}}
				/>
			))}
			{/* Overlay oscuro para mejorar legibilidad del texto */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#071b2f]/85 via-[#0b3550]/55 to-[#0b3550]/20" />
			<div className="absolute inset-0 bg-gradient-to-t from-[#071b2f]/60 via-transparent to-transparent" />

			{/* Contenido superpuesto: en móvil más compacto para que se vea
			    contenido útil antes del primer scroll. */}
			<div className="relative z-10 mx-auto grid min-h-[70svh] w-full max-w-[1480px] items-center gap-3 px-4 py-5 sm:min-h-[80svh] sm:gap-5 sm:px-8 sm:py-8 md:min-h-[calc(100svh-4rem)] md:grid-cols-[minmax(0,1fr)_320px] md:gap-8 md:px-10 md:py-14 lg:gap-10 lg:px-16 xl:px-24">
				<div className="max-w-2xl">
					<div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:mb-3 sm:text-[11px] sm:tracking-[0.16em]">
						<span className="h-px w-5 bg-amarillo sm:w-7" />
						Repelón, Atlántico
					</div>
					<span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-leaf sm:gap-2 sm:py-1 sm:text-xs">
						<span className="size-1.5 rounded-full bg-leaf sm:size-2" aria-hidden />
						Comercio local, digitalizado
					</span>

					<h1 className="mt-2.5 font-display text-[1.85rem] font-semibold leading-[1.04] tracking-tight text-white sm:mt-3 sm:text-[2.25rem] md:text-5xl lg:text-6xl">
						{T("inicio.hero.titulo1")}{" "}
						<span className="italic text-amarillo">
							{T("inicio.hero.titulo2")}
						</span>
					</h1>

					<p className="mt-2.5 max-w-md text-[13.5px] leading-snug text-white/90 sm:mt-3 sm:text-[15px] sm:leading-relaxed">
						{T("inicio.hero.texto")}
					</p>

					<div className="mt-3.5 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
						<Link
							href="/negocios"
							className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-white shadow-leaf transition-transform active:scale-[.98] sm:min-h-12 sm:flex-none sm:px-5 sm:py-3 sm:text-base"
						>
							Explorar comercios
						</Link>
						<Link
							href="/vendedor"
							className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-leaf shadow-leaf transition-transform active:scale-[.98] sm:min-h-12 sm:flex-none sm:px-5 sm:py-3 sm:text-base"
						>
							Registrar mi negocio
						</Link>
					</div>

					{!supabaseConfigurado && (
						<div className="mt-2.5 sm:mt-3">
							<Aviso tono="info">
								Falta configurar Supabase en <code>.env.local</code>. Se ve el
								catálogo, pero no se puede iniciar sesión ni pedir.
							</Aviso>
						</div>
					)}

					<div className="mt-3 flex flex-wrap gap-1.5 text-xs font-medium sm:mt-5 sm:gap-2">
						{(categorias.datos ?? [])
							.filter((c) => enAlcance(c.slug))
							.map((c) => (
								<Link
									key={c.id}
									href="/negocios"
									className="glass-soft inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 py-1 text-muted-foreground transition-colors hover:text-leaf sm:min-h-0 sm:px-3 sm:py-1.5"
								>
									<IconoCategoria categoria={c} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									{c.nombre}
								</Link>
							))}
					</div>
				</div>

				<div className="hidden md:block">
					<div className="overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-2xl backdrop-blur-md">
						<div className="relative h-48 overflow-hidden bg-[#d8eadc]">
							<div className="absolute inset-0 bg-[url('/img/hero-campo.png')] bg-cover bg-center" />
							<div className="absolute inset-0 bg-gradient-to-t from-[#071b2f]/65 to-transparent" />
							<div className="absolute bottom-4 left-4 right-4 text-white">
								<p className="text-xs font-semibold uppercase tracking-[0.16em] text-amarillo">Historias que conectan</p>
								<p className="mt-1 font-display text-xl font-semibold">Tu negocio merece ser encontrado</p>
							</div>
						</div>
						<div className="p-5">
							<div className="flex items-start gap-3">
								<div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-leaf text-lg text-white">R</div>
								<div>
									<p className="font-semibold text-ink">Crece con Repelón Conecta</p>
									<p className="mt-1 text-sm leading-relaxed text-muted-foreground">Haz visible lo que haces y conecta con nuevos clientes del pueblo.</p>
								</div>
							</div>
							<Link href="/vendedor" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-azul px-4 py-3 text-sm font-semibold text-white transition hover:bg-azul/90">Registrar mi negocio</Link>
						</div>
					</div>
				</div>
			</div>

			{/*
			 * Crédito de autor de la imagen del slider visible, si
			 * tiene uno registrado en lib/creditos. En móvil sube
			 * sobre la barra flotante de destinos (bottom-nav-total).
			 */}
			{creditoHero && (
				<p className="absolute bottom-nav-total right-5 z-10 max-w-[70%] text-right text-[11px] leading-snug text-white/65 md:bottom-4 md:right-8">
					Fuente: {creditoHero}
				</p>
			)}
		</section>
	);
}
