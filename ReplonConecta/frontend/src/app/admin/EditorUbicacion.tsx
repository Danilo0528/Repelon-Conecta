"use client";

import { useEffect, useRef, useState } from "react";

import { MapaSelector } from "@/components/Mapa";
import { BTN_SECUNDARIO, INPUT } from "./ui-admin";

/*
 * Editor de ubicación del panel (comercios y zonas turísticas).
 *
 * Tres piezas que antes estaban sueltas y separadas:
 *
 *  1. el campo dirección, que mientras escribes va pidiendo sugerencias
 *     a /api/geocode (Nominatim, encerrado en Repelón) y las muestra en
 *     una lista: elegir una pone el punto EXACTO de esa coincidencia,
 *     en vez de quedarse con lo primero que devuelva el geocoder;
 *  2. "Usar mi ubicación" (GPS del equipo) y "Buscar en el mapa"
 *     (geocodifica el texto tal cual);
 *  3. el mapa con el pin arrastrable: al soltarlo o tocar el mapa, el
 *     punto se traduce a dirección (Nominatim inverso). Si el campo
 *     estaba vacío se llena solo; si ya tenía texto no se pisa y aparece
 *     un botón para adoptar la dirección del pin.
 *
 * Todo vuelve al padre por callbacks: quien decide si eso se guarda en
 * la base es la sección que monta este componente.
 */

type Resultado = { lat: number; lng: number; texto: string | null };

export type UbicacionEditada = {
	direccion: string;
	lat: number | null;
	lng: number | null;
};

export function EditorUbicacion({
	direccion,
	lat,
	lng,
	onDireccion,
	onPunto,
	onAviso,
	onError,
}: {
	direccion: string;
	lat: number | null;
	lng: number | null;
	onDireccion: (texto: string) => void;
	onPunto: (lat: number | null, lng: number | null) => void;
	onAviso?: (texto: string | null) => void;
	onError?: (texto: string | null) => void;
}) {
	const [sugerencias, setSugerencias] = useState<Resultado[]>([]);
	const [buscando, setBuscando] = useState(false);
	const [ubicando, setUbicando] = useState(false);
	const [direccionPin, setDireccionPin] = useState<string | null>(null);
	// Nominatim no tiene veredas ni lugares locales: si una búsqueda no
	// devuelve nada se avisa y se sugiere poner el pin en el mapa.
	const [sinResultados, setSinResultados] = useState(false);

	// Para ignorar respuestas que llegaron tarde (el usuario ya escribió
	// otra cosa) y no volver a buscar el texto que acabamos de aplicar.
	// `editadoRef` evita que al abrir el editor salgan sugerencias del
	// texto que ya estaba guardado: solo aparecen cuando se teclea.
	const peticionRef = useRef(0);
	const buscadoRef = useRef<string | null>(null);
	const editadoRef = useRef(false);

	async function buscar(texto: string, varias: boolean) {
		const numero = ++peticionRef.current;
		setBuscando(true);
		try {
			const url = `/api/geocode?q=${encodeURIComponent(texto)}${varias ? "&n=5" : ""}`;
			const r = await fetch(url);
			const d = (await r.json()) as {
				punto?: { lat: number; lng: number } | null;
				resultados?: Resultado[];
				error?: string;
			};
			if (numero !== peticionRef.current) return;

			if (!r.ok) {
				setSugerencias([]);
				setSinResultados(false);
				onError?.(d.error ?? "No se pudo buscar la dirección.");
				return;
			}
			if (varias) {
				const lista = d.resultados ?? [];
				setSugerencias(lista);
				setSinResultados(lista.length === 0);
				return;
			}
			if (!d.punto) {
				onError?.("No encontramos esa dirección en Repelón. Prueba con otra forma de escribirla.");
				return;
			}
			onPunto(d.punto.lat, d.punto.lng);
			setSugerencias([]);
			setSinResultados(false);
			onAviso?.("Dirección ubicada en Repelón.");
		} catch {
			if (numero === peticionRef.current) {
				onError?.("No se pudo consultar el mapa. Revisa tu conexión.");
			}
		} finally {
			if (numero === peticionRef.current) setBuscando(false);
		}
	}

	/*
	 * Escribir dispara la búsqueda con 450 ms de calma. Todo va dentro
	 * del temporizador: así no hay setState sincrónico en el cuerpo del
	 * efecto (regla de React) y se cancela si sigues tecleando.
	 */
	useEffect(() => {
		if (!editadoRef.current) return;
		const texto = direccion.trim();
		if (texto === buscadoRef.current) return;
		const id = setTimeout(() => {
			if (texto.length < 4) {
				setSugerencias([]);
				setSinResultados(false);
				return;
			}
			void buscar(texto, true);
		}, 450);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [direccion]);

	function aplicar(r: Resultado) {
		buscadoRef.current = (r.texto ?? direccion).trim();
		editadoRef.current = false;
		onPunto(r.lat, r.lng);
		if (r.texto) onDireccion(r.texto);
		setSugerencias([]);
		setSinResultados(false);
		onAviso?.("Punto tomado de la sugerencia elegida.");
	}

	/*
	 * El pin se movió: ahora la prioridad es que la dirección escrita
	 * coincida con el punto. Nominatim inverso da el texto; si el campo
	 * estaba vacío lo llena, y si no, se ofrece como sugerencia aparte.
	 */
	async function traducirPin(la: number, ln: number) {
		try {
			const r = await fetch(`/api/geocode?lat=${la}&lon=${ln}`);
			const d = (await r.json()) as { direccion?: string | null; error?: string };
			if (!r.ok) {
				setDireccionPin(null);
				onAviso?.(d.error ?? "Ese punto queda fuera de Repelón.");
				return;
			}
			if (!d.direccion) return;
			if (!direccion.trim()) {
				onDireccion(d.direccion);
				setDireccionPin(null);
				onAviso?.("Dirección tomada del punto del mapa.");
			} else {
				setDireccionPin(d.direccion);
			}
		} catch {
			setDireccionPin(null);
		}
	}

	function moverPin(la: number, ln: number) {
		onPunto(la, ln);
		setDireccionPin(null);
		onError?.(null);
		void traducirPin(la, ln);
	}

	function ubicarActual() {
		if (!navigator.geolocation) {
			onError?.("Este navegador no lee tu ubicación. Escribe la dirección o arrastra el pin.");
			return;
		}
		setUbicando(true);
		onError?.(null);
		onAviso?.(null);

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const la = pos.coords.latitude;
				const ln = pos.coords.longitude;
				setUbicando(false);
				onPunto(la, ln);
				if (direccion.trim()) {
					setDireccionPin(null);
					onAviso?.("Coordenadas de tu ubicación puestas.");
					return;
				}
				await traducirPin(la, ln);
			},
			(err) => {
				setUbicando(false);
				onError?.(
					err.code === 1
						? "Diste permiso de ubicación: actívalo en el candado de la barra de direcciones."
						: "No se pudo leer tu ubicación. Escribe la dirección o arrastra el pin.",
				);
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
		);
	}

	const conPin = lat != null && lng != null;

	return (
		<div className="mt-2">
			<label className="block text-xs text-black/55">
				Dirección (obligatoria)
				<input
					value={direccion}
					onChange={(e) => {
						editadoRef.current = true;
						onDireccion(e.target.value);
					}}
					onBlur={() => setTimeout(() => setSugerencias([]), 150)}
					maxLength={200}
					placeholder="Ej. Calle 10 # 25-30, Repelón, Atlántico"
					className={INPUT}
					aria-describedby="ayuda-ubicacion"
				/>
			</label>

			{sugerencias.length > 0 && (
				<ul
					aria-label="Sugerencias de dirección"
					className="mt-1 overflow-hidden rounded-xl border border-black/10"
				>
					{sugerencias.map((s, i) => (
						<li key={`${s.lat},${s.lng},${i}`}>
							<button
								type="button"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => aplicar(s)}
								className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs leading-snug transition-colors hover:bg-black/5"
							>
								<span aria-hidden className="mt-px shrink-0 font-semibold text-leaf">
									#
								</span>
								<span className="min-w-0 flex-1">
									{s.texto ?? `${s.lat}, ${s.lng}`}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}

			{sinResultados && !buscando && (
				<p className="mt-1 text-xs text-amber-700">
					No encontramos esa dirección en Repelón. Escríbela de otra forma o toca el
					mapa para poner el pin a mano.
				</p>
			)}

			<div className="mt-2 flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={ubicarActual}
					disabled={ubicando}
					className={BTN_SECUNDARIO}
				>
					{ubicando ? "Ubicando…" : "Usar mi ubicación"}
				</button>
				<button
					type="button"
					onClick={() => void buscar(direccion.trim(), false)}
					disabled={buscando || !direccion.trim()}
					className={BTN_SECUNDARIO}
				>
					{buscando ? "Buscando…" : "Buscar en el mapa"}
				</button>
				{conPin && (
					<button
						type="button"
						onClick={() => {
							onPunto(null, null);
							setDireccionPin(null);
							onAviso?.("Pin quitado. Toca el mapa para ponerlo otra vez.");
						}}
						className={BTN_SECUNDARIO}
					>
						Quitar pin
					</button>
				)}
			</div>

			<p id="ayuda-ubicacion" className="mt-1 text-xs text-black/55">
				{conPin
					? `Pin en ${lat?.toFixed(6)}, ${lng?.toFixed(6)} — es el punto que usa "Cómo llegar".`
					: "Sin pin todavía: busca la dirección, usa tu ubicación o arrastra el pin en el mapa."}
			</p>

			{direccionPin && (
				<p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/65">
					<span className="min-w-0">
						El pin está en: <strong>{direccionPin}</strong>
					</span>
					<button
						type="button"
						className={BTN_SECUNDARIO}
						onClick={() => {
							onDireccion(direccionPin);
							setDireccionPin(null);
							onAviso?.("Se adoptó la dirección del pin.");
						}}
					>
						Usar esta dirección
					</button>
				</p>
			)}

			<div className="mt-2">
				<MapaSelector lat={lat} lng={lng} onCambiar={moverPin} />
			</div>
		</div>
	);
}
