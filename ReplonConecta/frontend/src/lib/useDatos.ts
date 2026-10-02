"use client";

import { useEffect, useState } from "react";

/*
 * Hook de carga de datos para componentes de cliente.
 *
 * Todas las pantallas piden datos después del montaje (no en el servidor)
 * por una razón práctica: así `next build` no necesita que el backend
 * esté arriba, y el catálogo se refresca cuando el usuario navega.
 */
export function useDatos<T>(
	cargar: () => Promise<T>,
	deps: readonly unknown[] = [],
) {
	const [datos, setDatos] = useState<T | null>(null);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let vivo = true;
		setCargando(true);
		setError(null);

		cargar()
			.then((d) => {
				if (vivo) setDatos(d);
			})
			.catch((e: unknown) => {
				if (vivo) {
					setError(e instanceof Error ? e.message : "Ocurrió un error");
				}
			})
			.finally(() => {
				if (vivo) setCargando(false);
			});

		return () => {
			vivo = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return { datos, cargando, error, setDatos };
}
