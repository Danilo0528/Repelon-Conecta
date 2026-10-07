"use client";

import { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import { Cargando } from "@/components/ui";

import { SeccionNegocios, type FiltroNegocios } from "../SeccionNegocios";

/*
 * Módulo Negocios. El filtro llega en la URL (la métrica "Pendientes"
 * del resumen enlaza con ?filtro=pendientes), por eso la página se
 * envuelve en <Suspense>: useSearchParams lo exige en Next.
 */

const FILTROS: FiltroNegocios[] = ["todos", "pendientes", "aprobados"];

function NegociosConFiltro() {
	const params = useSearchParams();
	const crudo = params.get("filtro");
	const filtro = FILTROS.includes(crudo as FiltroNegocios)
		? (crudo as FiltroNegocios)
		: "todos";
	return <SeccionNegocios filtroInicial={filtro} />;
}

export default function PaginaNegocios() {
	return (
		<Suspense fallback={<Cargando />}>
			<NegociosConFiltro />
		</Suspense>
	);
}
