"use client";

import { useSesion } from "@/context/SesionContext";

import { SeccionUsuarios } from "../SeccionUsuarios";

/* Módulo Usuarios del panel (el layout ya garantiza el rol ADMIN). */
export default function PaginaUsuarios() {
	const { perfil } = useSesion();
	if (!perfil) return null;
	return <SeccionUsuarios perfilId={perfil.id} />;
}
