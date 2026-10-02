"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Aviso, Cargando, EtiquetaEstado, Vacio } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";
import { apiConSesion } from "@/lib/api";
import { fecha, pesos } from "@/lib/format";
import type { Pedido } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function MisPedidos() {
	const router = useRouter();
	const { perfil, cargando: cargandoSesion } = useSesion();

	useEffect(() => {
		if (!cargandoSesion && !perfil) {
			router.replace("/entrar?next=/pedidos");
		}
	}, [cargandoSesion, perfil, router]);

	const { datos, cargando, error } = useDatos<Pedido[]>(
		() => apiConSesion<Pedido[]>("/api/pedidos/mios"),
		[perfil?.id],
	);

	if (cargandoSesion || (perfil && cargando)) return <Cargando />;
	if (!perfil) return null;

	return (
		<div className="px-4 pt-4">
			<h1 className="text-xl font-bold">Mis pedidos</h1>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			{!cargando && !error && (datos ?? []).length === 0 && (
				<Vacio
					titulo="Todavía no tienes pedidos"
					texto="Cuando hagas tu primer pedido lo verás aquí."
				>
					<Link
						href="/"
						className="inline-block rounded-xl bg-azul px-4 py-2 text-sm font-semibold text-white"
					>
						Ver negocios
					</Link>
				</Vacio>
			)}

			<ul className="mt-3 space-y-3">
				{(datos ?? []).map((p) => (
					<li key={p.id}>
						<Link
							href={`/pedidos/${p.id}`}
							className="block rounded-2xl border border-black/10 p-4 shadow-sm active:bg-black/[.03]"
						>
							<div className="flex items-center justify-between gap-2">
								<span className="font-semibold">{p.negocioNombre}</span>
								<EtiquetaEstado estado={p.estado} />
							</div>
							<p className="mt-1 text-sm text-black/60">
								Pedido {p.numero} · {fecha(p.creadoEn)}
							</p>
							<p className="mt-1 text-sm">
								{p.cantidadItems} ítem(s) ·{" "}
								<span className="font-semibold">{pesos(p.total)}</span>
							</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
