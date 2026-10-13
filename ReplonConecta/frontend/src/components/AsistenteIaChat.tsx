"use client";

import { useState } from "react";

import { ErrorApi, apiJson } from "@/lib/api";

export function AsistenteIaChat() {
	const [abierto, setAbierto] = useState(false);
	const [mensajes, setMensajes] = useState<{ rol: "user" | "ia"; texto: string }[]>([
		{ rol: "ia", texto: "¡Hola! Soy el asistente de Repelón Conecta. ¿En qué puedo ayudarte a encontrar hoy?" }
	]);
	const [entrada, setEntrada] = useState("");
	const [cargando, setCargando] = useState(false);

	const enviar = async () => {
		if (!entrada.trim() || cargando) return;

		const pregunta = entrada;
		setMensajes((m) => [...m, { rol: "user", texto: pregunta }]);
		setEntrada("");
		setCargando(true);

		try {
			const data = await apiJson<{ respuesta: string }>(
				"/api/ia/chat",
				"POST",
				{ mensaje: pregunta },
			);
			setMensajes((m) => [...m, { rol: "ia", texto: data.respuesta }]);
		} catch (e) {
			const texto =
				e instanceof ErrorApi
					? e.message
					: "Hubo un error al conectar con la IA.";
			setMensajes((m) => [...m, { rol: "ia", texto }]);
		} finally {
			setCargando(false);
		}
	};

	return (
		/*
		 * El FAB se sube sobre la barra inferior de destinos: sin esto
		 * cae encima del destino "Perfil" y los dos se pisan (el
		 * síntoma en Android es "todo enrredado"). Usa el mismo token
		 * de altura que reserva el contenido (--spacing-nav-total).
		 */
		<div className="fixed bottom-[calc(var(--spacing-nav-total)+0.5rem)] right-4 z-[1000]">
			{!abierto ? (
				<button
					onClick={() => setAbierto(true)}
					aria-label="Abrir asistente de Repelón Conecta"
					className="flex size-14 items-center justify-center rounded-full bg-leaf text-white shadow-xl transition hover:scale-105"
				>
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
						<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
					</svg>
				</button>
			) : (
				<div className="flex h-[400px] w-80 flex-col rounded-3xl border border-glass bg-white shadow-2xl">
					<div className="flex items-center justify-between border-b p-4">
						<span className="font-semibold text-ink">Asistente IA</span>
						<button
							onClick={() => setAbierto(false)}
							aria-label="Cerrar asistente"
							className="text-ink/60 transition hover:text-ink"
						>
							✕
						</button>
					</div>
					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{mensajes.map((m, i) => (
							<div key={i} className={`p-3 rounded-xl text-sm ${m.rol === "user" ? "bg-azul text-white self-end ml-10" : "bg-glass text-ink mr-10"}`}>
								{m.texto}
							</div>
						))}
						{cargando && <div className="text-xs text-muted-foreground italic">Repelón IA está pensando...</div>}
					</div>
					<div className="border-t p-3 flex gap-2">
						<input
							className="flex-1 rounded-lg border p-2 text-sm"
							placeholder="Pregunta por un negocio..."
							aria-label="Tu mensaje para el asistente"
							value={entrada}
							onChange={(e) => setEntrada(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && enviar()}
						/>
						<button
							onClick={enviar}
							disabled={cargando || !entrada.trim()}
							className="bg-leaf text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
						>
							Enviar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
