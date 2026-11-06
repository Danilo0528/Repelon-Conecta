"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { api, apiConSesion } from "@/lib/api";
import { subirImagen } from "@/lib/subirImagen";
import type { Categoria, NegocioAdmin, NegocioDetalle, Producto } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";
import {
	FORM_VACIO,
	PRODUCTO_VACIO,
	aNumero,
	formDesdeDetalle,
	cuerpoFotoProducto,
	cuerpoNegocio,
	type FiltroNegocios,
	type FormNegocio,
	type FormProducto,
} from "./negocios-form";

/**
 * Estado y acciones del módulo Negocios.
 *
 * La lista, el modal, el detalle y el catálogo de productos viven en un
 * solo hook para que los componentes visuales (`NegociosTabla` y
 * `NegociosModal`) queden delgados y compartan exactamente las mismas
 * acciones. Las llamadas a la API son idénticas a las del componente
 * original: esto es un refactor de forma, no de comportamiento.
 */
export function useNegociosAdmin(filtroInicial?: FiltroNegocios) {
	const { datos: negocios, cargando, error, setDatos } = useDatos<NegocioAdmin[]>(
		() => apiConSesion<NegocioAdmin[]>("/api/admin/negocios"),
		[],
	);

	const [filtro, setFiltro] = useState<FiltroNegocios>(filtroInicial ?? "todos");
	const [texto, setTexto] = useState("");
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [aviso, setAviso] = useState<string | null>(null);

	// Modal: null = cerrado; "crear" = alta; id de negocio = edición.
	const [modo, setModo] = useState<"crear" | string | null>(null);
	const [form, setForm] = useState<FormNegocio>(FORM_VACIO);
	const [guardando, setGuardando] = useState(false);
	const [cargandoDetalle, setCargandoDetalle] = useState(false);

	// Detalle completo del negocio en edición (descripción, tel, etc.).
	const [detalle, setDetalle] = useState<NegocioDetalle | null>(null);

	// Fotos y productos del negocio en edición.
	const [subiendo, setSubiendo] = useState<string | null>(null);
	const [productos, setProductos] = useState<Producto[]>([]);
	const [categorias, setCategorias] = useState<Categoria[]>([]);

	// Formulario de nuevo producto (dentro del modal de edición).
	const [nuevoProd, setNuevoProd] = useState<FormProducto>(PRODUCTO_VACIO);
	const [creandoProd, setCreandoProd] = useState(false);
	const [mostrarFormProd, setMostrarFormProd] = useState(false);

	const termino = texto.trim().toLocaleLowerCase("es");
	const filtrados = (negocios ?? []).filter(
		(n) =>
			(filtro === "todos" ||
				(filtro === "pendientes" && !n.aprobado) ||
				(filtro === "aprobados" && n.aprobado)) &&
			(!termino ||
				n.nombre.toLocaleLowerCase("es").includes(termino) ||
				n.duenoNombre.toLocaleLowerCase("es").includes(termino)),
	);

	function campo<K extends keyof FormNegocio>(k: K, v: FormNegocio[K]) {
		setForm((f) => ({ ...f, [k]: v }));
	}

	function limpiar() {
		setForm(FORM_VACIO);
		setDetalle(null);
		setProductos([]);
		setSubiendo(null);
		setErrorAccion(null);
		setAviso(null);
		setNuevoProd(PRODUCTO_VACIO);
		setMostrarFormProd(false);
		setCreandoProd(false);
	}

	function abrirCrear() {
		limpiar();
		setModo("crear");
	}

	function abrirEditar(n: NegocioAdmin) {
		limpiar();
		setModo(n.id);
		void cargarDetalle(n);
	}

	function cerrarModal() {
		setModo(null);
		limpiar();
	}

	/**
	 * Carga el detalle completo y los productos para el modal de edición.
	 * Usa GET /api/negocios/slug/{slug} (endpoint público) porque el
	 * backend no expone GET por ID. El slug viene de la lista admin.
	 */
	async function cargarDetalle(n: NegocioAdmin) {
		setCargandoDetalle(true);
		setErrorAccion(null);
		try {
			const [d, ps, cats] = await Promise.all([
				api<NegocioDetalle>(`/api/negocios/slug/${n.slug}`),
				api<Producto[]>(`/api/productos/negocio/${n.id}`),
				api<Categoria[]>("/api/categorias"),
			]);
			setDetalle(d);
			setProductos(ps);
			setCategorias(cats.filter((c) => c.activa));
			setForm(formDesdeDetalle(d));
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo cargar el negocio.");
		} finally {
			setCargandoDetalle(false);
		}
	}

	function coordenadas(): { lat: number | null; lng: number | null } {
		return { lat: aNumero(form.latitud), lng: aNumero(form.longitud) };
	}

	async function guardar(e: FormEvent) {
		e.preventDefault();
		setErrorAccion(null);
		setAviso(null);

		if (!form.nombre.trim()) {
			setErrorAccion("El nombre es obligatorio.");
			return;
		}
		if (!form.direccion.trim()) {
			setErrorAccion("La dirección es obligatoria.");
			return;
		}
		const { lat, lng } = coordenadas();
		if ((lat == null) !== (lng == null)) {
			setErrorAccion("Falta un valor del par de coordenadas.");
			return;
		}

		setGuardando(true);
		try {
			if (modo === "crear") {
				const nuevo = await apiConSesion<NegocioDetalle>("/api/negocios", {
					method: "POST",
					body: cuerpoNegocio(form, true),
				});
				// Refrescar la lista y pasar a modo edición con el nuevo ID,
				// así el usuario puede subir el logo y los productos al toque.
				const lista = await apiConSesion<NegocioAdmin[]>("/api/admin/negocios");
				setDatos(lista);
				setAviso(`Negocio "${nuevo.nombre}" creado. Ahora puedes subir su logo y productos.`);
				setModo(nuevo.id);
				setDetalle(nuevo);
				// Cargar productos Y categorías del negocio nuevo: sin las
				// categorías el dropdown de productos quedaría vacío y todo
				// producto se crearía sin categoría (invisible en la búsqueda).
				try {
					const [ps, cats] = await Promise.all([
						api<Producto[]>(`/api/productos/negocio/${nuevo.id}`),
						api<Categoria[]>("/api/categorias"),
					]);
					setProductos(ps);
					setCategorias(cats.filter((c) => c.activa));
				} catch {
					setProductos([]);
				}
			} else {
				const id = modo;
				if (!id) return;
				const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${id}`, {
					method: "PUT",
					body: cuerpoNegocio(form, false),
				});
				setDatos((actual) =>
					(actual ?? []).map((x) =>
						x.id === id
							? {
									...x,
									nombre: actualizado.nombre,
									direccion: actualizado.direccion,
									barrio: actualizado.barrio,
									latitud: actualizado.latitud,
									longitud: actualizado.longitud,
									logoUrl: actualizado.logoUrl,
								}
							: x,
					),
				);
				setAviso(`Negocio "${actualizado.nombre}" actualizado.`);
			}
		} catch (e2) {
			setErrorAccion(e2 instanceof Error ? e2.message : "No se pudo guardar.");
		} finally {
			setGuardando(false);
		}
	}

	async function cambiarEstado(n: NegocioAdmin, cambios: { aprobado?: boolean; destacado?: boolean }) {
		setErrorAccion(null);
		try {
			const actualizado = await apiConSesion<NegocioAdmin>(
				`/api/admin/negocios/${n.id}`,
				{ method: "PATCH", body: JSON.stringify(cambios) },
			);
			setDatos((actual) =>
				(actual ?? []).map((x) => (x.id === n.id ? actualizado : x)),
			);
			setAviso(`"${n.nombre}" ${actualizado.aprobado ? "aprobado" : "suspendido"}.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo actualizar.");
		}
	}

	async function eliminar(n: NegocioAdmin) {
		if (!window.confirm(`¿Eliminar "${n.nombre}"? Los pedidos impiden borrarlo.`)) {
			return;
		}
		setErrorAccion(null);
		try {
			await apiConSesion(`/api/admin/negocios/${n.id}`, { method: "DELETE" });
			setDatos((actual) => (actual ?? []).filter((x) => x.id !== n.id));
			setAviso(`Negocio "${n.nombre}" eliminado.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo eliminar.");
		}
	}

	// --- Fotos (solo en modo edición) ---

	async function subirLogo(id: string, evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;
		setErrorAccion(null);
		setSubiendo(`logo-${id}`);
		try {
			const url = await subirImagen("negocios", id, archivo);
			await aplicarLogo(id, url);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir el logo.");
		} finally {
			setSubiendo(null);
		}
	}

	async function aplicarLogo(id: string, url: string) {
		const actualizado = await apiConSesion<NegocioDetalle>(`/api/negocios/${id}`, {
			method: "PUT",
			body: JSON.stringify({ logoUrl: url }),
		});
		setDetalle((d) => (d ? { ...d, logoUrl: actualizado.logoUrl } : d));
		setDatos((actual) =>
			(actual ?? []).map((x) => (x.id === id ? { ...x, logoUrl: actualizado.logoUrl } : x)),
		);
	}

	async function subirFotoProducto(p: Producto, evento: ChangeEvent<HTMLInputElement>) {
		const archivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!archivo) return;
		setErrorAccion(null);
		setSubiendo(`foto-${p.id}`);
		try {
			const url = await subirImagen("productos", p.id, archivo);
			await actualizarFotoProducto(p, url);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo subir la foto.");
		} finally {
			setSubiendo(null);
		}
	}

	async function actualizarFotoProducto(p: Producto, imagenUrl: string) {
		const actualizado = await apiConSesion<Producto>(`/api/productos/${p.id}`, {
			method: "PUT",
			body: cuerpoFotoProducto(p, imagenUrl),
		});
		setProductos((ps) => ps.map((x) => (x.id === p.id ? actualizado : x)));
	}

	// --- Crear y eliminar productos (solo en modo edición) ---

	async function crearProducto() {
		if (!nuevoProd.nombre.trim() || !nuevoProd.precio.trim()) return;
		const negocioIdReal = modo === "crear" ? detalle?.id : modo;
		if (!negocioIdReal) {
			setErrorAccion("Guarda el negocio primero antes de agregar productos.");
			return;
		}

		setCreandoProd(true);
		setErrorAccion(null);
		try {
			const precio = Math.round(Number(nuevoProd.precio));
			if (!Number.isFinite(precio) || precio < 0) {
				setErrorAccion("El precio debe ser un número positivo.");
				return;
			}
			const cuerpo = JSON.stringify({
				nombre: nuevoProd.nombre.trim(),
				descripcion: nuevoProd.descripcion.trim() || null,
				precio,
				unidad: nuevoProd.unidad,
				imagenUrl: nuevoProd.imagenUrl.trim() || null,
				categoriaId: nuevoProd.categoriaId || null,
				disponible: true,
				stock: nuevoProd.stock ? Number(nuevoProd.stock) : null,
			});
			const creado = await apiConSesion<Producto>(`/api/productos/negocio/${negocioIdReal}`, {
				method: "POST",
				body: cuerpo,
			});
			setProductos((ps) => [...ps, creado]);
			setAviso(`Producto "${creado.nombre}" creado.`);
			setNuevoProd(PRODUCTO_VACIO);
			setMostrarFormProd(false);
		} catch (e2) {
			setErrorAccion(e2 instanceof Error ? e2.message : "No se pudo crear el producto.");
		} finally {
			setCreandoProd(false);
		}
	}

	async function eliminarProducto(p: Producto) {
		if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
		setErrorAccion(null);
		try {
			await apiConSesion(`/api/productos/${p.id}`, { method: "DELETE" });
			setProductos((ps) => ps.filter((x) => x.id !== p.id));
			setAviso(`Producto "${p.nombre}" eliminado.`);
		} catch (e) {
			setErrorAccion(e instanceof Error ? e.message : "No se pudo eliminar el producto.");
		}
	}

	const negocioId = modo !== null && modo !== "crear" ? modo : null;
	const editando = negocioId !== null;
	const negocioEditando = negocioId
		? (negocios ?? []).find((n) => n.id === negocioId)
		: null;

	return {
		negocios,
		cargando,
		error,
		filtro,
		setFiltro,
		texto,
		setTexto,
		filtrados,
		errorAccion,
		setErrorAccion,
		aviso,
		setAviso,
		modo,
		negocioId,
		form,
		campo,
		guardando,
		cargandoDetalle,
		detalle,
		setDetalle,
		subiendo,
		productos,
		categorias,
		nuevoProd,
		setNuevoProd,
		creandoProd,
		mostrarFormProd,
		setMostrarFormProd,
		abrirCrear,
		abrirEditar,
		cerrarModal,
		guardar,
		cambiarEstado,
		eliminar,
		subirLogo,
		aplicarLogo,
		subirFotoProducto,
		actualizarFotoProducto,
		crearProducto,
		eliminarProducto,
		editando,
		negocioEditando,
	};
}

export type NegociosAdminState = ReturnType<typeof useNegociosAdmin>;
