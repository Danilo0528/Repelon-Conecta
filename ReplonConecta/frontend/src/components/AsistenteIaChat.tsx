"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ErrorApi, apiJson } from "@/lib/api";
import { fotoNegocio, fotoRespaldo } from "@/lib/imagenes";
import type { NegocioIa, RespuestaIa } from "@/lib/tipos";

type Mensaje = {
	rol: "user" | "ia";
	texto: string;
	/** Comercios que el asistente nombró: el chat les pinta tarjeta. */
	negocios?: NegocioIa[];
};

/** Enlace a Google Maps: por coordenadas si las hay, si no por dirección. */
function urlGoogleMaps(n: NegocioIa): string {
	if (n.latitud != null && n.longitud != null) {
		return `https://www.google.com/maps/search/?api=1&query=${n.latitud},${n.longitud}`;
	}
	const consulta = encodeURIComponent(`${n.direccion}, Repelón, Atlántico, Colombia`);
	return `https://www.google.com/maps/search/?api=1&query=${consulta}`;
}

/** Solo dígitos: wa.me no admite signos ni espacios. */
function soloDigitos(valor: string): string {
	return valor.replace(/\D/g, "");
}

/*
 * Tarjeta de un negocio recomendado por el asistente.
 *
 * El texto de la IA es plano, así que el enlace al negocio, el de Maps
 * y el de WhatsApp se arman aquí a partir de la ficha que manda el
 * backend. En un chat de 320px los botones van apilados en dos filas
 * para que cada uno conserve su área táctil de 44px.
 */
function TarjetaNegocioIa({ n }: { n: NegocioIa }) {
	const logo = fotoNegocio(n);
	const whatsapp = n.whatsapp ? soloDigitos(n.whatsapp) : "";

	return (
		<article className="rounded-2xl border border-glass bg-white p-3 shadow-sm">
			<div className="flex items-center gap-2.5">
				<div className="size-10 shrink-0 overflow-hidden rounded-xl">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={logo}
						alt={`Logo de ${n.nombre}`}
						loading="lazy"
						onError={(e) => {
							e.currentTarget.src = fotoRespaldo(n.nombre);
						}}
						className="size-full object-cover"
					/>
				</div>
				<div className="min-w-0">
					<h4 className="truncate font-display text-sm font-semibold text-ink">
						{n.nombre}
					</h4>
					<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span
							className={`size-1.5 shrink-0 rounded-full ${n.abierto ? "bg-leaf" : "bg-ink/30"}`}
							aria-hidden
						/>
						{n.abierto ? "Abierto ahora" : "Cerrado"}
						{n.barrio && <span className="truncate">· {n.barrio}</span>}
					</p>
				</div>
			</div>

			<a
				href={urlGoogleMaps(n)}
				target="_blank"
				rel="noreferrer"
				className="mt-2.5 flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-xs text-muted-foreground transition hover:bg-glass hover:text-ink"
			>
				<svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<path d="M12 21s-7-5.7-7-11a7 7 0 1 1 14 0c0 5.3-7 11-7 11z" strokeLinejoin="round" />
					<circle cx="12" cy="10" r="2.6" />
				</svg>
				<span className="truncate">{n.direccion}</span>
			</a>

			<div className="mt-1 flex gap-2">
				<Link
					href={`/negocios/${n.slug}`}
					className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-leaf text-sm font-semibold text-white transition hover:opacity-90"
				>
					Ver negocio
				</Link>
				{whatsapp && (
					<a
						href={`https://wa.me/${whatsapp}`}
						target="_blank"
						rel="noreferrer"
						aria-label={`Escribir por WhatsApp a ${n.nombre}`}
						className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-glass text-leaf transition hover:bg-glass"
					>
						<svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
							<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z" strokeLinejoin="round" />
						</svg>
					</a>
				)}
			</div>
		</article>
	);
}

/*
 * Video del FAB del asistente: /public/img/ia-fab.mp4.
 *
 * Va como componente aparte para que monte y desmonte con el botón
 * (cuando se abre/cierra el chat el FAB aparece y desaparece, y al
 * remontar el effect vuelve a arrancar el loop).
 *
 * El video tapa el SVG animado recién en onCanPlay, así no hay
 * flash negro; si el archivo falla, devuelve null y queda el SVG.
 * El autoplay NO va como atributo: se dispara desde el effect con
 * muted + play(), que es lo que mira la política de autoplay de
 * Chrome. Quien pide movimiento reducido se queda con el primer
 * cuadro quieto (pause y sin loop).
 */
function VideoFab() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [listo, setListo] = useState(false);
	const [falla, setFalla] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		video.muted = true;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			video.pause();
			return;
		}
		void video.play().catch(() => {
			/* Autoplay bloqueado por el navegador: queda el SVG animado. */
		});
	}, []);

	if (falla) return null;

	return (
		<video
			ref={videoRef}
			src="/img/ia-fab.mp4"
			loop
			muted
			playsInline
			preload="auto"
			aria-hidden
			onCanPlay={() => setListo(true)}
			onError={() => setFalla(true)}
			className={`pointer-events-none absolute inset-0 size-full rounded-full object-cover transition-opacity duration-300 ${
				listo ? "opacity-100" : "opacity-0"
			}`}
		/>
	);
}

export function AsistenteIaChat() {
	const [abierto, setAbierto] = useState(false);
	const [mensajes, setMensajes] = useState<Mensaje[]>([
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
			const data = await apiJson<RespuestaIa>(
				"/api/ia/chat",
				"POST",
				{ mensaje: pregunta },
			);
			setMensajes((m) => [...m, { rol: "ia", texto: data.respuesta, negocios: data.negocios }]);
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
		<div className="fixed bottom-[calc(var(--spacing-nav-total)+0.5rem)] right-4 z-asistente">
			{!abierto ? (
				<button
					onClick={() => setAbierto(true)}
					aria-label="Abrir asistente de Repelón Conecta"
					className="relative flex size-14 items-center justify-center rounded-full bg-leaf text-white shadow-xl transition hover:scale-105"
				>
					{/*
					 * Halo que late hacia afuera (ia-halo): le da vida al
					 * botón incluso cuando nadie lo toca. Va dentro del
					 * botón y sin eventos para no estorbar al clic.
					 */}
					<span
						aria-hidden
						className="ia-halo pointer-events-none absolute inset-0 rounded-full border-2 border-leaf"
					/>
					{/*
					 * SVG vivo: la buruja se mece (ia-burbuja) y los tres
					 * puntos "escriben" en bucle (ia-punto, con delay
					 * escalonado por punto). El relleno es blanco sobre el
					 * verde del FAB y los puntos son verde hoja.
					 */}
					<svg
						viewBox="0 0 24 24"
						width="30"
						height="30"
						aria-hidden
						className="ia-burbuja relative"
					>
						<path
							fill="currentColor"
							d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
						/>
						<circle className="ia-punto" cx="8.4" cy="12.4" r="1.45" fill="var(--color-leaf)" style={{ animationDelay: "0s" }} />
						<circle className="ia-punto" cx="12" cy="12.4" r="1.45" fill="var(--color-leaf)" style={{ animationDelay: "0.15s" }} />
						<circle className="ia-punto" cx="15.6" cy="12.4" r="1.45" fill="var(--color-leaf)" style={{ animationDelay: "0.3s" }} />
					</svg>
					{/*
					 * El video (si existe y el navegador lo deja correr)
					 * queda encima del SVG en loop; mientras carga, el SVG
					 * animado sigue visible por debajo (opacity-0 solo
					 * cuando el video ya arrancó).
					 */}
					<VideoFab />
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
					<div className="flex-1 space-y-3 overflow-y-auto p-4">
						{mensajes.map((m, i) => (
							<div key={i} className="space-y-2">
								<div className={`rounded-xl p-3 text-sm ${m.rol === "user" ? "ml-10 bg-azul text-white" : "mr-10 bg-glass text-ink"}`}>
									{m.texto}
								</div>
								{m.negocios?.map((n) => (
									<TarjetaNegocioIa key={n.slug} n={n} />
								))}
							</div>
						))}
						{cargando && <div className="text-xs italic text-muted-foreground">Repelón IA está pensando...</div>}
					</div>
					<div className="flex gap-2 border-t p-3">
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
							className="rounded-lg bg-leaf px-3 py-2 text-sm text-white disabled:opacity-50"
						>
							Enviar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
