"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Aviso, Cargando, Vacio } from "@/components/ui";

/*
 * Piezas compartidas del panel /admin.
 *
 * Antes cada sección repetía el mismo encabezado, la misma pila de
 * avisos y el dúo carga/vacío (cinco copias del mismo código con las
 * mismas clases). Acá viven una sola vez.
 *
 * Los botones y campos traen la convención del proyecto: `min-h-12`
 * son 48 px, el mínimo que la app se compromete a respetar en todo lo
 * que se toca con el pulgar (ver comentario de CLASE_BOTON_* en
 * components/ui.tsx). El panel no es la excepción.
 *
 * Superficies: se usa `glass` (la misma pastilla de vidrio del home y
 * la cabecera) para que el admin se lea como parte de la misma web,
 * con densidad de panel de trabajo (texto chico, poco aire).
 */

/** Botón principal de acción (crear, guardar). Ancho del contenido. */
export const BTN_PRIMARIO =
	"inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf px-4 text-sm font-semibold text-white disabled:opacity-50";

/** Botón secundario (editar, aprobar, cancelar…). Ancho del contenido. */
export const BTN_SECUNDARIO =
	"inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/15 px-4 text-sm font-semibold text-black/70 disabled:opacity-50";

/** Campo de texto / select del panel. */
export const INPUT =
	"mt-1 block w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm text-black";

/** Tarjeta de lista o de formulario (vidrio, como el resto de la web). */
export const TARJETA = "glass rounded-2xl p-4";

/**
 * Encabezado de sección del panel: el título en versalitas que usan
 * todas las pantallas de admin, con descripción opcional.
 */
export function SeccionAdmin({
	titulo,
	descripcion,
	children,
}: {
	titulo: string;
	descripcion?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="mt-10 first:mt-0">
			<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
				{titulo}
			</h2>
			{descripcion && <p className="mt-1 text-xs text-black/55">{descripcion}</p>}
			{children}
		</section>
	);
}

/**
 * Pila de avisos de una sección: error de una acción, éxito de la
 * última acción y error de la carga. Si no hay nada, no pinta nada.
 */
export function AvisosSeccion({
	accion,
	exito,
	carga,
}: {
	accion?: string | null;
	exito?: string | null;
	carga?: string | null;
}) {
	if (!accion && !exito && !carga) return null;
	return (
		<div className="mt-2 space-y-2">
			{accion && <Aviso tono="error">{accion}</Aviso>}
			{exito && <Aviso tono="ok">{exito}</Aviso>}
			{carga && <Aviso tono="error">{carga}</Aviso>}
		</div>
	);
}

/**
 * Estado de una lista: mientras carga muestra el spinner; si terminó
 * vacía, el mensaje de vacío; si hay datos, pinta a los hijos.
 */
export function BloqueEstado({
	cargando,
	vacio,
	vacioTitulo,
	children,
}: {
	cargando: boolean;
	vacio?: boolean;
	vacioTitulo?: string;
	children: ReactNode;
}) {
	if (cargando) {
		return (
			<div className="mt-3">
				<Cargando />
			</div>
		);
	}
	if (vacio) {
		return (
			<div className="mt-3">
				<Vacio titulo={vacioTitulo ?? "No hay registros"} />
			</div>
		);
	}
	return <>{children}</>;
}

/**
 * Ventana flotante para crear/editar (Zonas, Categorías y Textos).
 *
 * Mismo patrón que la ventana de turismo del home: capa trasera, vidrio,
 * Escape y fondo sin scroll — pero el cierre por clic FUERA no está
 * puesto a propósito: detrás hay un formulario a medio llenar y un
 * clic suelto no debe tirarlo. Se cierra con la ✕, con Escape o con
 * Cancelar.
 *
 * El listener de Escape se registra UNA sola vez por apertura (deps
 * solo [abierto]) y llama a onCerrar a través de un ref: si el effect
 * dependiera de la función, se re-registraría en cada render y
 * panel.focus() robaría el foco del input con cada tecla. Al cerrar,
 * el foco vuelve al botón que abrió la ventana.
 */
export function VentanaAdmin({
	abierto,
	onCerrar,
	titulo,
	ancho = "normal",
	children,
}: {
	abierto: boolean;
	onCerrar: () => void;
	titulo: string;
	ancho?: "normal" | "ancho";
	children: ReactNode;
}) {
	const panel = useRef<HTMLDivElement>(null);
	const alCerrar = useRef(onCerrar);
	const quienAbrio = useRef<HTMLElement | null>(null);

	useEffect(() => {
		alCerrar.current = onCerrar;
	}, [onCerrar]);

	useEffect(() => {
		if (!abierto) return;
		quienAbrio.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const alPulsar = (e: KeyboardEvent) => {
			if (e.key === "Escape") alCerrar.current();
		};
		document.addEventListener("keydown", alPulsar);
		document.body.style.overflow = "hidden";
		panel.current?.focus();
		return () => {
			document.removeEventListener("keydown", alPulsar);
			document.body.style.overflow = "";
			quienAbrio.current?.focus();
			quienAbrio.current = null;
		};
	}, [abierto]);

	if (!abierto) return null;

	return (
		<div className="fixed inset-0 z-[900] flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center">
			<div
				ref={panel}
				role="dialog"
				aria-modal="true"
				aria-label={titulo}
				tabIndex={-1}
				className={`ventana-flotante glass max-h-[85vh] w-full overflow-y-auto rounded-3xl outline-none ${
					ancho === "ancho" ? "max-w-2xl" : "max-w-lg"
				}`}
			>
				<div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-white/70 px-4 py-3 backdrop-blur">
					<h3 className="font-display text-base font-semibold">{titulo}</h3>
					<button
						type="button"
						onClick={onCerrar}
						aria-label="Cerrar ventana"
						className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/85 text-ink shadow-float hover:bg-white"
					>
						✕
					</button>
				</div>
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
}
