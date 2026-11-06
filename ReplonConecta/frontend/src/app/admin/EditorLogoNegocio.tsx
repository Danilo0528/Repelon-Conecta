"use client";

import type { ChangeEvent } from "react";

import { Foto } from "@/components/ui";
import { supabaseConfigurado } from "@/lib/env";
import type { NegocioDetalle } from "@/lib/tipos";
import { CampoUrlImagen } from "./CampoUrlImagen";
import { BTN_SUBIR } from "./ui-admin";

/**
 * Logo del negocio: subida a Supabase Storage o URL pegada. Solo se
 * muestra con el negocio ya guardado, porque el archivo se sube contra
 * su id.
 */
export function EditorLogoNegocio({
	negocioId,
	detalle,
	subiendo,
	onSubir,
	onAplicar,
}: {
	negocioId: string;
	detalle: NegocioDetalle | null;
	subiendo: string | null;
	onSubir: (id: string, evento: ChangeEvent<HTMLInputElement>) => void;
	onAplicar: (id: string, url: string) => Promise<void>;
}) {
	return (
		<fieldset className="mt-4 space-y-2">
			<legend className="text-[12px] font-medium text-black/50">Logo</legend>
			{!supabaseConfigurado && (
				<p className="text-[12px] text-black/50">
					Falta configurar Supabase para subir archivos; usa &quot;Poner URL&quot;.
				</p>
			)}
			<div className="flex items-center gap-3">
				<Foto
					src={detalle?.logoUrl ?? null}
					alt="Logo del negocio"
					className="size-10 shrink-0 rounded-md"
				/>
				<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
					<label className={BTN_SUBIR}>
						{subiendo === `logo-${negocioId}`
							? "Subiendo…"
							: detalle?.logoUrl
								? "Cambiar logo"
								: "Subir logo"}
						<input
							type="file"
							accept="image/*"
							className="sr-only"
							disabled={!supabaseConfigurado || subiendo !== null}
							onChange={(e) => void onSubir(negocioId, e)}
						/>
					</label>
					<CampoUrlImagen
						valor={detalle?.logoUrl ?? null}
						etiqueta="logo del negocio"
						onGuardar={async (url) => {
							await onAplicar(negocioId, url);
						}}
					/>
				</div>
			</div>
		</fieldset>
	);
}
