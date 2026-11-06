"use client";

import { NegociosModal } from "./NegociosModal";
import { NegociosTabla } from "./NegociosTabla";
import type { FiltroNegocios } from "./negocios-form";
import { SeccionAdmin } from "./ui-admin";
import { useNegociosAdmin } from "./useNegociosAdmin";

/*
 * Sección "Negocios" — lista densa + ventana flotante grande para
 * crear y editar (datos, ubicación con mapa, logo y fotos de
 * productos). El formulario sale de la API: RegistroNegocioRequest
 * para alta, NegocioUpdateRequest para edición.
 *
 * El estado y las llamadas viven en useNegociosAdmin; la UI se reparte
 * entre NegociosTabla (lista) y NegociosModal (alta/edición). Este
 * archivo solo compone las tres piezas.
 */

export type { FiltroNegocios } from "./negocios-form";

export function SeccionNegocios({ filtroInicial }: { filtroInicial?: FiltroNegocios }) {
	const admin = useNegociosAdmin(filtroInicial);

	return (
		<SeccionAdmin
			titulo="Negocios"
			descripcion="Aprueba, destaca o elimina negocios; crea nuevos y edita sus datos en una ventana."
		>
			<NegociosTabla admin={admin} />
			<NegociosModal admin={admin} />
		</SeccionAdmin>
	);
}
