"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, Cargando, Vacio } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";
import { apiConSesion } from "@/lib/api";
import { fecha, pesos } from "@/lib/format";
import type { MetricasAdmin, NegocioAdmin } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function PanelAdmin() {
	const router = useRouter();
	const { perfil, cargando: cargandoSesion } = useSesion();

	useEffect(() => {
		if (!cargandoSesion && !perfil) {
			router.replace("/entrar?next=/admin");
		}
	}, [cargandoSesion, perfil, router]);

	const { datos: metricas } = useDatos<MetricasAdmin>(
		() => apiConSesion<MetricasAdmin>("/api/admin/metricas"),
		[perfil?.id],
	);

	const {
		datos: negocios,
		cargando,
		error,
		setDatos,
	} = useDatos<NegocioAdmin[]>(
		() => apiConSesion<NegocioAdmin[]>("/api/admin/negocios"),
		[perfil?.id],
	);

	const [errorAccion, setErrorAccion] = useState<string | null>(null);

	if (cargandoSesion) return <Cargando />;
	if (!perfil) return null;

	if (perfil.rol !== "ADMIN") {
		return (
			<div className="px-4 pt-4">
				<Aviso tono="error">Esta sección es solo para administradores.</Aviso>
			</div>
		);
	}

	async function cambiar(
		n: NegocioAdmin,
		cambios: { aprobado?: boolean; destacado?: boolean },
	) {
		setErrorAccion(null);
		try {
			const actualizado = await apiConSesion<NegocioAdmin>(
				`/api/admin/negocios/${n.id}`,
				{ method: "PATCH", body: JSON.stringify(cambios) },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) => (x.id === n.id ? actualizado : x)),
			);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo actualizar.");
		}
	}

	async function eliminar(n: NegocioAdmin) {
		if (!window.confirm(`¿Eliminar "${n.nombre}"? Los pedidos impiden borrarlo.`)) {
			return;
		}
		setErrorAccion(null);
		try {
			await apiConSesion(`/api/admin/negocios/${n.id}`, { method: "DELETE" });
			setDatos((actual) => (actual ?? []).filter((x) => x.id !== n.id));
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo eliminar.");
		}
	}

	return (
		<div className="px-4 pt-4">
			<h1 className="text-xl font-bold">Panel de administración</h1>

			{metricas && (
				<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
					<Cifra etiqueta="Negocios" valor={metricas.negociosTotales} />
					<Cifra etiqueta="Pendientes" valor={metricas.negociosPendientes} />
					<Cifra etiqueta="Usuarios" valor={metricas.usuariosTotales} />
					<Cifra etiqueta="Pedidos" valor={metricas.pedidosTotales} />
					<Cifra etiqueta="Ventas totales" valor={pesos(metricas.ventasTotales)} />
					<Cifra etiqueta="Ventas hoy" valor={pesos(metricas.ventasHoy)} />
				</div>
			)}

			<h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-black/50">
				Negocios
			</h2>

			{errorAccion && (
				<div className="mt-2">
					<Aviso tono="error">{errorAccion}</Aviso>
				</div>
			)}
			{error && (
				<div className="mt-2">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			{cargando && <Cargando />}
			{!cargando && (negocios ?? []).length === 0 && (
				<Vacio titulo="No hay negocios registrados" />
			)}

			{/* En PC los negocios salen en varias columnas; en móvil, uno
			    debajo del otro como siempre. */}
			<ul className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
				{(negocios ?? []).map((n) => (
					<li key={n.id} className="rounded-2xl border border-black/10 p-4">
						<div className="flex items-start justify-between gap-2">
							<div>
								<p className="font-semibold">{n.nombre}</p>
								<p className="text-xs text-black/55">
									{n.barrio ?? "Repelón"} · {n.cantidadProductos} productos ·{" "}
									{n.pedidosRecibidos} pedidos
								</p>
								<p className="text-xs text-black/45">
									Dueño: {n.duenoNombre} ({n.duenoEmail}) · {fecha(n.creadoEn)}
								</p>
							</div>
							<div className="flex shrink-0 flex-col items-end gap-1">
								<span
									className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
										n.aprobado ? "bg-verde text-white" : "bg-black/60 text-white"
									}`}
								>
									{n.aprobado ? "Aprobado" : "Pendiente"}
								</span>
								{n.destacado && (
									<span className="rounded-full bg-azul px-2 py-0.5 text-xs font-semibold text-white">
										Destacado
									</span>
								)}
							</div>
						</div>

						<div className="mt-3 flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => cambiar(n, { aprobado: !n.aprobado })}
								className="rounded-lg border border-black/15 px-3 py-1.5 text-sm"
							>
								{n.aprobado ? "Suspender" : "Aprobar"}
							</button>
							<button
								type="button"
								onClick={() => cambiar(n, { destacado: !n.destacado })}
								className="rounded-lg border border-black/15 px-3 py-1.5 text-sm"
							>
								{n.destacado ? "Quitar destacado" : "Destacar"}
							</button>
							<button
								type="button"
								onClick={() => eliminar(n)}
								className="rounded-lg border border-black/15 px-3 py-1.5 text-sm text-black/60"
							>
								Eliminar
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function Cifra({ etiqueta, valor }: { etiqueta: string; valor: string | number }) {
	return (
		<div className="rounded-xl bg-black/[.04] px-3 py-3">
			<p className="text-sm font-bold">{valor}</p>
			<p className="text-[11px] text-black/55">{etiqueta}</p>
		</div>
	);
}
