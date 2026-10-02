"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { LineaCarrito, Producto } from "@/lib/tipos";

/*
 * Carrito del comprador, guardado en localStorage.
 *
 * REGLA DE NEGOCIO: un pedido pertenece a un solo negocio. Si el
 * comprador agrega algo de otro negocio, se le avisa y, si acepta, el
 * carrito arranca de cero con el negocio nuevo. Esto es deliberado: la
 * entrega, el pago y el chat de WhatsApp se cierran con un negocio, y
 * mezclar dos obligaría a partir el pedido después.
 */
export interface Carrito {
	negocioId: string;
	negocioNombre: string;
	negocioWhatsapp: string | null;
	items: LineaCarrito[];
}

const CLAVE = "repelon.carrito";

export interface ResultadoAgregar {
	reemplazo: boolean;
}

interface ValorCarrito {
	carrito: Carrito | null;
	listo: boolean;
	cantidadTotal: number;
	total: number;
	agregar: (producto: Producto, cantidad?: number) => ResultadoAgregar;
	cambiarCantidad: (productoId: string, cantidad: number) => void;
	quitar: (productoId: string) => void;
	vaciar: () => void;
}

const ContextoCarrito = createContext<ValorCarrito | null>(null);

function leerGuardado(): Carrito | null {
	if (typeof window === "undefined") return null;
	try {
		const crudo = window.localStorage.getItem(CLAVE);
		if (!crudo) return null;
		const datos = JSON.parse(crudo) as Carrito;
		if (!datos || !Array.isArray(datos.items)) return null;
		return datos;
	} catch {
		// Un localStorage corrupto no debe romper la app: se ignora.
		return null;
	}
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
	const [carrito, setCarrito] = useState<Carrito | null>(null);
	const [listo, setListo] = useState(false);

	// Se lee después del montaje para que el HTML del servidor y el del
	// cliente coincidan (localStorage no existe en el servidor).
	useEffect(() => {
		setCarrito(leerGuardado());
		setListo(true);
	}, []);

	useEffect(() => {
		if (!listo) return;
		if (carrito && carrito.items.length > 0) {
			window.localStorage.setItem(CLAVE, JSON.stringify(carrito));
		} else {
			window.localStorage.removeItem(CLAVE);
		}
	}, [carrito, listo]);

	const agregar = useCallback(
		(producto: Producto, cantidad = 1): ResultadoAgregar => {
			// El reemplazo se decide antes de tocar el estado: meterlo en
			// el updater lo volvería impuro y React puede invocarlo dos
			// veces en modo estricto.
			const reemplazo =
				carrito != null && carrito.negocioId !== producto.negocioId;

			setCarrito((actual) => {
				const esOtroNegocio =
					actual != null && actual.negocioId !== producto.negocioId;

				const base: Carrito =
					actual == null || esOtroNegocio
						? {
								negocioId: producto.negocioId,
								negocioNombre: producto.negocioNombre,
								negocioWhatsapp: null,
								items: [],
							}
						: actual;

				const existente = base.items.find((i) => i.productoId === producto.id);
				const items = existente
					? base.items.map((i) =>
							i.productoId === producto.id
								? { ...i, cantidad: Math.min(99, i.cantidad + cantidad) }
								: i,
						)
					: [
							...base.items,
							{
								productoId: producto.id,
								nombre: producto.nombre,
								precio: producto.precio,
								imagenUrl: producto.imagenUrl,
								cantidad: Math.min(99, cantidad),
							},
						];

				return { ...base, items };
			});

			return { reemplazo };
		},
		[carrito],
	);

	const cambiarCantidad = useCallback((productoId: string, cantidad: number) => {
		setCarrito((actual) => {
			if (!actual) return actual;
			const items = actual.items
				.map((i) =>
					i.productoId === productoId
						? { ...i, cantidad: Math.max(0, Math.min(99, cantidad)) }
						: i,
				)
				.filter((i) => i.cantidad > 0);

			if (items.length === 0) return null;
			return { ...actual, items };
		});
	}, []);

	const quitar = useCallback((productoId: string) => {
		setCarrito((actual) => {
			if (!actual) return actual;
			const items = actual.items.filter((i) => i.productoId !== productoId);
			return items.length === 0 ? null : { ...actual, items };
		});
	}, []);

	const vaciar = useCallback(() => setCarrito(null), []);

	const { cantidadTotal, total } = useMemo(() => {
		if (!carrito) return { cantidadTotal: 0, total: 0 };
		return carrito.items.reduce(
			(acc, i) => ({
				cantidadTotal: acc.cantidadTotal + i.cantidad,
				total: acc.total + i.precio * i.cantidad,
			}),
			{ cantidadTotal: 0, total: 0 },
		);
	}, [carrito]);

	return (
		<ContextoCarrito.Provider
			value={{
				carrito,
				listo,
				cantidadTotal,
				total,
				agregar,
				cambiarCantidad,
				quitar,
				vaciar,
			}}
		>
			{children}
		</ContextoCarrito.Provider>
	);
}

export function useCarrito(): ValorCarrito {
	const contexto = useContext(ContextoCarrito);
	if (!contexto) {
		throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
	}
	return contexto;
}
