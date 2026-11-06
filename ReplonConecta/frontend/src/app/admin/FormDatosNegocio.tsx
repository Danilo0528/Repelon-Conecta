"use client";

import type { ReactNode } from "react";

import { INPUT } from "./ui-admin";
import type { FormNegocio } from "./negocios-form";

type Campo = <K extends keyof FormNegocio>(k: K, v: FormNegocio[K]) => void;

/**
 * Campos de datos básicos del negocio, compartidos por el alta y la
 * edición. El alta añade placeholders de ejemplo y el logo por URL;
 * la edición deja el logo en su propio bloque porque se sube aparte.
 */
export function FormDatosNegocio({
	legend,
	form,
	campo,
	conPlaceholders = false,
	children,
}: {
	legend: string;
	form: FormNegocio;
	campo: Campo;
	conPlaceholders?: boolean;
	children?: ReactNode;
}) {
	return (
		<fieldset className="space-y-2">
			<legend className="text-[12px] font-medium text-black/50">{legend}</legend>
			<label className="block text-[12px] text-black/55">
				Nombre *
				<input
					value={form.nombre}
					onChange={(e) => campo("nombre", e.target.value)}
					required
					maxLength={120}
					placeholder={conPlaceholders ? "Ej. Finca La Esperanza" : undefined}
					className={INPUT}
				/>
			</label>
			<label className="block text-[12px] text-black/55">
				Descripción
				<textarea
					value={form.descripcion}
					onChange={(e) => campo("descripcion", e.target.value)}
					maxLength={1000}
					rows={2}
					placeholder={conPlaceholders ? "Qué vende o qué ofrece…" : undefined}
					className={INPUT}
				/>
			</label>
			<div className="grid gap-2 sm:grid-cols-2">
				<label className="block text-[12px] text-black/55">
					Barrio
					<input
						value={form.barrio}
						onChange={(e) => campo("barrio", e.target.value)}
						maxLength={100}
						placeholder={conPlaceholders ? "Ej. Centro" : undefined}
						className={INPUT}
					/>
				</label>
				<label className="block text-[12px] text-black/55">
					Horario
					<input
						value={form.horario}
						onChange={(e) => campo("horario", e.target.value)}
						maxLength={60}
						placeholder="Ej. 7am – 5pm"
						className={INPUT}
					/>
				</label>
			</div>
			<div className="grid gap-2 sm:grid-cols-2">
				<label className="block text-[12px] text-black/55">
					Teléfono *
					<input
						value={form.telefono}
						onChange={(e) => campo("telefono", e.target.value)}
						pattern="[0-9+\s-]{7,20}"
						required
						placeholder={conPlaceholders ? "300 123 4567" : undefined}
						className={INPUT}
					/>
				</label>
				<label className="block text-[12px] text-black/55">
					WhatsApp
					<input
						value={form.whatsapp}
						onChange={(e) => campo("whatsapp", e.target.value)}
						pattern="[0-9+\s-]{7,20}"
						placeholder={conPlaceholders ? "300 123 4567" : undefined}
						className={INPUT}
					/>
				</label>
			</div>
			{children}
			<label className="block text-[12px] text-black/55">
				Fuente del logo (opcional)
				<input
					value={form.logoCredito}
					onChange={(e) => campo("logoCredito", e.target.value)}
					maxLength={300}
					placeholder="https://… o nombre del autor"
					className={INPUT}
				/>
			</label>
		</fieldset>
	);
}
