"use client";

import Link from "next/link";

import { Aviso, Cargando } from "@/components/ui";
import { apiConSesion } from "@/lib/api";
import { pesos } from "@/lib/format";
import type { MetricasAdmin } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import { SeccionAdmin, TARJETA } from "./ui-admin";

/*
 * Resumen del panel: la puerta de entrada. Las cifras son botones que
 * llevan a la lista que las produce (Pendientes abre Negocios con el
 * filtro ya puesto), y abajo están los accesos a cada módulo — el
 * panel completo se ve de un vistazo, sin scrollear.
 */

const ACCESOS: { href: string; etiqueta: string; texto: string }[] = [
	{
		href: "/admin/negocios",
		etiqueta: "Negocios",
		texto: "Aprueba, destaca y carga fotos",
	},
	{ href: "/admin/usuarios", etiqueta: "Usuarios", texto: "Roles y cuentas" },
	{
		href: "/admin/pedidos",
		etiqueta: "Pedidos",
		texto: "Listado global y anulaciones",
	},
	{
		href: "/admin/contenido",
		etiqueta: "Contenido",
		texto: "Categorías y textos del home",
	},
	{
		href: "/admin/zonas",
		etiqueta: "Zonas turísticas",
		texto: "Atractivos del home con mapa",
	},
];

function Cifra({
	etiqueta,
	valor,
	nota,
	href,
}: {
	etiqueta: string;
	valor: string | number;
	nota?: string;
	href: string;
}) {
	return (
		<Link
			href={href}
			className={`${TARJETA} block transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2`}
		>
			<p className="text-lg font-bold leading-tight">{valor}</p>
			<p className="text-[11px] font-medium text-black/55">{etiqueta}</p>
			{nota && <p className="text-[11px] text-black/40">{nota}</p>}
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
			<h1 className="text-xl font-bold">Resumen</h1>
			<p className="mt-1 text-xs text-black/55">
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
				<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
					<Cifra
						etiqueta="Negocios"
						valor={metricas.negociosTotales}
						nota={`${metricas.negociosAprobados} aprobados`}
						href="/admin/negocios"
					/>
					<Cifra
						etiqueta="Pendientes"
						valor={metricas.negociosPendientes}
						nota="por revisar"
						href="/admin/negocios?filtro=pendientes"
					/>
					<Cifra
						etiqueta="Usuarios"
						valor={metricas.usuariosTotales}
						href="/admin/usuarios"
					/>
					<Cifra
						etiqueta="Pedidos"
						valor={metricas.pedidosTotales}
						href="/admin/pedidos"
					/>
					<Cifra
						etiqueta="Ventas totales"
						valor={pesos(metricas.ventasTotales)}
						href="/admin/pedidos"
					/>
					<Cifra
						etiqueta="Ventas hoy"
						valor={pesos(metricas.ventasHoy)}
						href="/admin/pedidos"
					/>
				</div>
			)}

			<SeccionAdmin
				titulo="Módulos del panel"
				descripcion="Cada módulo vive en su propia dirección; el menú de la izquierda siempre está a mano."
			>
				<div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{ACCESOS.map(({ href, etiqueta, texto }) => (
						<Link
							key={href}
							href={href}
							className={`${TARJETA} flex items-center justify-between gap-3 transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2`}
						>
							<div>
								<p className="font-semibold">{etiqueta}</p>
								<p className="text-xs text-black/55">{texto}</p>
							</div>
							<span aria-hidden className="text-black/40">
								→
							</span>
						</Link>
					))}
				</div>
			</SeccionAdmin>
		</div>
	);
}
