"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Aviso, CLASE_BOTON_AZUL, Cargando, EtiquetaEstado, Vacio } from "@/components/ui";import { useSesion } from "@/context/SesionContext";
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
					<Link href="/" className={CLASE_BOTON_AZUL}>
						Ver el mapa
					</Link>
				</Vacio>
			)}

			{/* Cada pedido es una fila que se abre de un toque. El color del
			    estado es lo único que cambia de una a otra: la lista se lee
			    de un vistazo y sin tener que leer texto. */}
			<ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{(datos ?? []).map((p) => (
					<li key={p.id}>
						<Link
							href={`/pedidos/${p.id}`}
							className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 active:bg-black/[.03]"
						>
							<div className="min-w-0 flex-1">
								<p className="font-semibold leading-tight">{p.negocioNombre}</p>
								<p className="mt-0.5 text-sm text-black/55">
									Pedido {p.numero} · {p.cantidadItems}{" "}
									{p.cantidadItems === 1 ? "ítem" : "ítems"}
								</p>
								<p className="mt-0.5 text-xs text-black/45">{fecha(p.creadoEn)}</p>
							</div>

							<div className="shrink-0 text-right">
								<EtiquetaEstado estado={p.estado} />
								<p className="mt-1.5 font-bold">{pesos(p.total)}</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
