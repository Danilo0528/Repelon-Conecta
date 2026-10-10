"use client";

import Link from "next/link";

import { Aviso, Cargando } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import { pesos } from "@/lib/format";
import type { MetricasAdmin } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { SeccionAdmin } from "./ui-admin";

/*
 * Resumen del panel — dense dashboard.
 *
 * Jerarquía de señal (skill):
 *   - Tier 1 (hero): Ventas hoy — la cifra que responde "¿está
 *     funcionando hoy?". Accent tint, número grande, tabular.
 *   - Tier 2 (supports): Negocios, Pendientes, Usuarios, Pedidos.
 *     Neutros, más chicos, agrupados junto al hero.
 *   - Nada de 6 cards idénticas: eso es el anti-patrón del skill.
 *
 * Cada cifra es botón que lleva a su lista.
 */

function HeroMetrica({
	valor,
	etiqueta,
	nota,
	href,
}: {
	valor: string;
	etiqueta: string;
	nota?: string;
	href: string;
}) {
	return (
		<Link
			href={href}
			className="flex flex-col justify-between rounded-lg border border-azul/20 bg-azul/[.04] p-5 transition-colors hover:bg-azul/[.07] focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
		>
			<p className="text-[12px] font-medium text-azul/70">{etiqueta}</p>
			<div className="mt-3">
				<p className="tabular text-[28px] font-semibold leading-none tracking-tight text-azul">
					{valor}
				</p>
				{nota && <p className="mt-1 text-[12px] text-black/45">{nota}</p>}
			</div>
		</Link>
	);
}

function MetricaSecundaria({
	valor,
	etiqueta,
	nota,
	href,
	peligro,
}: {
	valor: string | number;
	etiqueta: string;
	nota?: string;
	href: string;
	peligro?: boolean;
}) {
	return (
		<Link
			href={href}
			className="flex flex-col rounded-lg border border-black/10 bg-white p-4 transition-colors hover:bg-black/[.02] focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
		>
			<p className="text-[12px] font-medium text-black/45">{etiqueta}</p>
			<p
				className={`tabular mt-2 text-[22px] font-semibold leading-none tracking-tight ${
					peligro && Number(valor) > 0 ? "text-advertencia" : "text-black"
				}`}
			>
				{valor}
			</p>
			{nota && <p className="mt-1 text-[11px] text-black/35">{nota}</p>}
		</Link>
	);
}

export default function PaginaResumen() {
	const { datos: metricas, cargando, error } = useDatos<MetricasAdmin>(
		() => apiConSesion<MetricasAdmin>("/api/admin/metricas"),
		[],
	);

	return (
		<div>
			<h1 className="text-[18px] font-medium leading-tight">Resumen</h1>
			<p className="mt-0.5 text-[12px] text-black/45">
				La plataforma de un vistazo. Toca una cifra para ir a su lista.
			</p>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}
			{cargando && !metricas && (
				<div className="mt-3">
					<Cargando />
				</div>
			)}

			{metricas && (
				<>
					{/* Hero + supporting: jerarquía, no grid de iguales. */}
					<div className="mt-4 grid gap-3 lg:grid-cols-[1fr_2fr]">
						<HeroMetrica
							etiqueta="Ventas hoy"
							valor={pesos(metricas.ventasHoy)}
							nota={`${pesos(metricas.ventasTotales)} acumulados`}
							href="/admin/pedidos"
						/>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							<MetricaSecundaria
								etiqueta="Negocios"
								valor={metricas.negociosTotales}
								nota={`${metricas.negociosAprobados} aprobados`}
								href="/admin/negocios"
							/>
							<MetricaSecundaria
								etiqueta="Pendientes"
								valor={metricas.negociosPendientes}
								nota="por revisar"
								href="/admin/negocios?filtro=pendientes"
								peligro
							/>
							<MetricaSecundaria
								etiqueta="Usuarios"
								valor={metricas.usuariosTotales}
								href="/admin/usuarios"
							/>
							<MetricaSecundaria
								etiqueta="Pedidos"
								valor={metricas.pedidosTotales}
								href="/admin/pedidos"
							/>
						</div>
					</div>
				</>
			)}

			<SeccionAdmin titulo="Accesos rápidos">
				<div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{[
						{ href: "/admin/negocios?filtro=pendientes", label: "Aprobar negocios", hint: `${metricas?.negociosPendientes ?? 0} pendientes` },
						{ href: "/admin/pedidos", label: "Ver pedidos", hint: "Listado global" },
						{ href: "/admin/usuarios", label: "Gestionar usuarios", hint: "Roles y cuentas" },
					].map(({ href, label, hint }) => (
						<Link
							key={href}
							href={href}
							className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-4 py-3 transition-colors hover:bg-black/[.02] focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
						>
							<div>
								<p className="text-[13px] font-medium">{label}</p>
								<p className="text-[11px] text-black/40">{hint}</p>
							</div>
							<span aria-hidden className="text-black/25">
								→
							</span>
						</Link>
					))}
				</div>
			</SeccionAdmin>
		</div>
	);
}
