"use client";

import { useState } from "react";

import { Cargando } from "@/components/ui";
import { api, apiConSesion } from "@/lib/api";
import { TEXTO_INICIO, type ClaveTextoInicio } from "@/lib/inicio";
import { useDatos } from "@/lib/useDatos";
import {
	AvisosSeccion,
	BTN_PRIMARIO,
	BTN_SECUNDARIO,
	INPUT,
	SeccionAdmin,
	TARJETA,
	VentanaAdmin,
} from "./ui-admin";

/*
 * Sección "Textos del inicio" del panel (P2, fila 13 — alcance
 * "texto editable del home", no CMS).
 *
 * Los valores por defecto viven en lib/inicio.ts; el servidor guarda
 * solo los cambios encima de ellos. El formulario no copia el estado
 * del servidor en otro useState: cada campo muestra
 * `edicion[clave] ?? servidor ?? defecto`, así que no hace falta un
 * efecto que sincronice dos estados. Dejar un campo vacío y guardar
 * RESTAURA el texto original: el backend borra la clave en vez de
 * guardar un string vacío.
 */

const CAMPOS: { clave: ClaveTextoInicio; etiqueta: string; largo?: boolean }[] = [
	{ clave: "inicio.hero.titulo1", etiqueta: "Título del inicio (parte 1)" },
	{ clave: "inicio.hero.titulo2", etiqueta: "Título del inicio (parte en cursiva)" },
	{ clave: "inicio.hero.texto", etiqueta: "Párrafo del inicio", largo: true },
	{ clave: "inicio.mapa.texto", etiqueta: "Subtítulo del mapa" },
	{ clave: "inicio.turismo.texto", etiqueta: "Subtítulo de turismo" },
	{ clave: "inicio.fondo.titulo", etiqueta: "Título de Fondo Emprender" },
	{ clave: "inicio.fondo.texto", etiqueta: "Texto de Fondo Emprender", largo: true },
	{ clave: "inicio.cta.titulo", etiqueta: "Título de la invitación final" },
	{ clave: "inicio.cta.texto", etiqueta: "Texto de la invitación final" },
];

export function SeccionTextosInicio() {
	const {
		datos,
		cargando,
		error,
		setDatos,
	} = useDatos<Record<string, string>>(() =>
		api<Record<string, string>>("/api/inicio/textos"),
	);

	// Solo lo que el estudiante tocó en esta sesión; el resto sale del
	// servidor o del defecto.
	const [edicion, setEdicion] = useState<Record<string, string>>({});
	const [guardando, setGuardando] = useState(false);
	const [ventana, setVentana] = useState(false);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	function valor(clave: ClaveTextoInicio): string {
		return edicion[clave] ?? datos?.[clave] ?? TEXTO_INICIO[clave];
	}

	function tocar(clave: ClaveTextoInicio, valorNuevo: string) {
		setEdicion((actual) => ({ ...actual, [clave]: valorNuevo }));
	}

	// Cerrar descarta lo que se estaba editando (Cancelar, ✕ y Escape);
	// guardar ya deja el servidor como estaba.
	function cerrar() {
		setEdicion({});
		setVentana(false);
	}

	async function guardar() {
		setErrorAccion(null);
		setAviso(null);
		setGuardando(true);
		try {
			const cuerpo: Record<string, string> = {};
			for (const { clave } of CAMPOS) {
				cuerpo[clave] = valor(clave);
			}

			const guardados = await apiConSesion<Record<string, string>>(
				"/api/inicio/textos",
				{ method: "PUT", body: JSON.stringify(cuerpo) },
			);
			setDatos(guardados);
			setAviso("Guardado. El inicio ya muestra estos textos.");
			cerrar();
		} catch (e) {
			// La ventana queda abierta con el error visible dentro.
			setErrorAccion(e instanceof Error ? e.message : "No se pudo guardar.");
		} finally {
			setGuardando(false);
		}
	}

	const avisos = (
		<AvisosSeccion accion={errorAccion} exito={aviso} carga={error} />
	);

	return (
		<SeccionAdmin
			titulo="Textos del inicio"
			descripcion="Así se ven hoy los textos del home; pulsa Editar textos para cambiarlos."
		>
			{!ventana && avisos}

			{cargando ? (
				<div className="mt-3">
					<Cargando />
				</div>
			) : (
				<>
					{/* Vista previa de lo que el público ve hoy. */}
					<dl className="mt-3 space-y-2">
						{CAMPOS.map(({ clave, etiqueta }) => (
							<div key={clave} className={TARJETA}>
								<dt className="text-[11px] font-semibold uppercase tracking-wide text-black/45">
									{etiqueta}
								</dt>
								<dd className="truncate text-sm">{valor(clave)}</dd>
							</div>
						))}
					</dl>

					<div className="mt-3">
						<button
							type="button"
							onClick={() => {
								setErrorAccion(null);
								setAviso(null);
								setVentana(true);
							}}
							className={BTN_PRIMARIO}
						>
							Editar textos
						</button>
					</div>

					<VentanaAdmin
						abierto={ventana}
						onCerrar={cerrar}
						titulo="Editar textos del inicio"
						ancho="ancho"
					>
						{avisos}
						<p className="text-xs text-black/55">
							Deja un campo vacío y guarda para volver al texto original.
						</p>

						<div className="mt-3 grid gap-3 sm:grid-cols-2">
							{CAMPOS.map(({ clave, etiqueta, largo }) =>
								largo ? (
									<label
										key={clave}
										className="text-xs text-black/55 sm:col-span-2"
									>
										{etiqueta}
										<textarea
											value={valor(clave)}
											onChange={(e) => tocar(clave, e.target.value)}
											rows={2}
											maxLength={2000}
											className={INPUT}
										/>
									</label>
								) : (
									<label key={clave} className="text-xs text-black/55">
										{etiqueta}
										<input
											value={valor(clave)}
											onChange={(e) => tocar(clave, e.target.value)}
											maxLength={2000}
											className={INPUT}
										/>
									</label>
								),
							)}

							<div className="flex flex-wrap gap-3 sm:col-span-2">
								<button
									type="button"
									onClick={() => void guardar()}
									disabled={guardando}
									className={BTN_PRIMARIO}
								>
									{guardando ? "Guardando…" : "Guardar textos"}
								</button>
								<button
									type="button"
									onClick={cerrar}
									className={BTN_SECUNDARIO}
								>
									Cancelar
								</button>
							</div>
						</div>
					</VentanaAdmin>
				</>
			)}
		</SeccionAdmin>
	);
}
