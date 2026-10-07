"use client";

import { SeccionZonas } from "../SeccionZonas";

/*
 * Módulo Zonas turísticas: los atractivos de la sección "Turismo en
 * Repelón" del home. Ruta propia (antes vivía apilada en Contenido):
 * es el módulo más pesado del panel — CRUD con ventana flotante,
 * geolocalización y geocoder — y el cliente lo nombra por su nombre.
 * Como en Negocios/Pedidos/Usuarios, el encabezado lo pone la propia
 * sección (h2 "Zonas turísticas"); la página no duplica el título.
 */
export default function PaginaZonas() {
	return <SeccionZonas />;
}
