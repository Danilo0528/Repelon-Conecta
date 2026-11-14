"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { listaCreditos } from "@/lib/creditos";

export default function PieConecta() {
	const pathname = usePathname();
	if (pathname.startsWith("/admin")) return null;

	const creditos = listaCreditos();

	return (
		<footer
			className="w-full"
			style={{
				background: "#eff4ff",
				marginTop: "2rem",
				paddingBottom: "calc(var(--spacing-nav-total, 5.25rem) + 0px)",
			}}
		>
			<div className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-14 lg:px-12">
				<div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

					{/* Marca */}
					<div className="flex flex-col gap-3 lg:col-span-2">
						<div className="flex items-center gap-3">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/img/logo-repelon-conecta-transparente.png"
								alt="Repelón Conecta"
								className="h-8 w-auto object-contain"
							/>
							<span className="text-[20px] font-bold" style={{ color: "#006d23" }}>
								Repelón Conecta
							</span>
						</div>
						<p className="max-w-xs text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>
							Plataforma comunitaria de integración comercial y turística para los emprendedores,
							agricultores y prestadores de servicios de Repelón, Atlántico.
						</p>
						<div className="flex items-center gap-2">
							<svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="#0b5c9e" strokeWidth="2" aria-hidden>
								<path d="m12 2.5 2.9 6.1 6.7.8-5 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-5-4.6 6.7-.8z" />
							</svg>
							<span className="text-[12px]" style={{ color: "#3e4a3d" }}>
								Alianza con Fondo Emprender SENA
							</span>
						</div>
					</div>

					{/* Ecosistema */}
					<nav aria-label="Ecosistema Repelón" className="flex flex-col gap-2">
						<h4 className="mb-2 text-[16px] font-bold" style={{ color: "#091c31" }}>
							Ecosistema Repelón
						</h4>
						{[
							{ href: "/negocios",        label: "Directorio de Negocios" },
							{ href: "/#turismo",        label: "Ecoturismo Guájaro" },
							{ href: "/fondo-emprender", label: "Convocatorias SENA" },
							{ href: "/vendedor",        label: "Registrar mi negocio" },
						].map(({ href, label }) => (
							<Link key={href} href={href}
								className="text-[14px] transition-colors hover:text-[#006d23]"
								style={{ color: "#3e4a3d" }}>
								{label}
							</Link>
						))}
					</nav>

					{/* Para Emprendedores */}
					<div className="flex flex-col gap-3">
						<h4 className="mb-1 text-[16px] font-bold" style={{ color: "#091c31" }}>
							Para Emprendedores
						</h4>
						<p className="text-[14px] leading-relaxed" style={{ color: "#3e4a3d" }}>
							Visibiliza tu producto o servicio ante miles de turistas y habitantes del departamento.
						</p>
						<Link href="/vendedor"
							className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white transition hover:brightness-95"
							style={{ background: "#1660a3" }}>
							<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
								<path d="M4.5 9.5h15V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" strokeLinejoin="round" />
								<path d="M3 9.5 4.8 4.5h14.4L21 9.5" strokeLinejoin="round" />
							</svg>
							Sumar mi Comercio
						</Link>
					</div>
				</div>

				{/* Pie */}
				<div className="flex flex-col items-center justify-between gap-4 border-t pt-6 text-[12px] sm:flex-row"
					style={{ borderColor: "#dbe9ff", color: "#3e4a3d" }}>
					<div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
						<div className="flex items-center gap-2">
							{/* Bandera mini */}
							<div className="flex h-3.5 w-5 flex-col overflow-hidden rounded-sm border" style={{ borderColor: "#becab9" }} aria-hidden>
								<span className="h-1/3 w-full" style={{ background: "#006d23" }} />
								<span className="h-1/3 w-full" style={{ background: "#fff" }} />
								<span className="h-1/3 w-full" style={{ background: "#1660a3" }} />
							</div>
							<span className="font-bold" style={{ color: "#006d23" }}>
								Hecho con orgullo en Repelón, Atlántico
							</span>
							<span style={{ color: "#3e4a3d" }}>— Tierra del Guájaro y gente pujante.</span>
						</div>
						<span className="hidden sm:inline" style={{ color: "#becab9" }}>•</span>
						<span>© {new Date().getFullYear()} Repelón Conecta</span>
					</div>
					<div className="flex items-center gap-6">
						<Link href="/privacidad" className="transition-colors hover:text-[#091c31]">
							Términos y Políticas
						</Link>
						<Link href="/privacidad" className="transition-colors hover:text-[#091c31]">
							Centro de Ayuda
						</Link>
					</div>
				</div>

				{creditos.length > 0 && (
					<ul className="mt-3 space-y-0.5 text-[11px]" style={{ color: "#6e7a6b" }}>
						{creditos.map(({ imagen, credito }) => (
							<li key={imagen}>
								<span className="font-medium">{credito}</span> — <span>{imagen}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</footer>
	);
}
