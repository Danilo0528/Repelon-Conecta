"use client";

import type { Session } from "@supabase/supabase-js";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import { apiConSesion } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Usuario } from "@/lib/tipos";

/*
 * Sesión del usuario.
 *
 * Supabase guarda el token; la fila en la base la crea el backend la
 * primera vez que se llama a /api/me. Por eso, cada vez que cambia la
 * sesión, se pide el perfil: es lo que materializa al usuario en Spring
 * y de paso trae su rol para decidir qué se le muestra.
 */
interface ValorSesion {
	sesion: Session | null;
	perfil: Usuario | null;
	cargando: boolean;
	entrar: (email: string, clave: string) => Promise<void>;
	registrar: (
		email: string,
		clave: string,
		nombre: string,
	) => Promise<{ requiereConfirmacion: boolean }>;
	salir: () => Promise<void>;
	refrescarPerfil: () => Promise<void>;
}

const ContextoSesion = createContext<ValorSesion | null>(null);

/** Traduce los errores más comunes de Supabase Auth al español. */
function traducirError(mensaje: string): string {
	const m = mensaje.toLowerCase();
	if (m.includes("invalid login credentials")) {
		return "Correo o clave incorrectos.";
	}
	if (m.includes("already registered") || m.includes("already been registered")) {
		return "Ese correo ya tiene una cuenta. Inicia sesión.";
	}
	if (m.includes("password should be at least")) {
		return "La clave debe tener al menos 6 caracteres.";
	}
	if (m.includes("email not confirmed")) {
		return "Falta confirmar tu correo. Revisa tu bandeja.";
	}
	if (m.includes("unable to validate email") || m.includes("invalid email")) {
		return "Ese correo no es válido.";
	}
	if (m.includes("rate limit") || m.includes("too many")) {
		return "Demasiados intentos. Espera un momento.";
	}
	return mensaje;
}

export function SesionProvider({ children }: { children: React.ReactNode }) {
	const [sesion, setSesion] = useState<Session | null>(null);
	const [perfil, setPerfil] = useState<Usuario | null>(null);
	const [cargando, setCargando] = useState(true);

	const cargarPerfil = useCallback(async () => {
		try {
			setPerfil(await apiConSesion<Usuario>("/api/me"));
		} catch {
			// Un perfil que no carga no debe tumbar la app: se navega como
			// invitado y las rutas protegidas redirigen a /entrar.
			setPerfil(null);
		}
	}, []);

	useEffect(() => {
		let vivo = true;

		void supabase.auth.getSession().then(async ({ data }) => {
			if (!vivo) return;
			setSesion(data.session);
			if (data.session) {
				await cargarPerfil();
			}
			if (vivo) setCargando(false);
		});

		const { data: sub } = supabase.auth.onAuthStateChange((_evento, nueva) => {
			setSesion(nueva);
			if (nueva) {
				void cargarPerfil();
			} else {
				setPerfil(null);
			}
		});

		return () => {
			vivo = false;
			sub.subscription.unsubscribe();
		};
	}, [cargarPerfil]);

	const entrar = useCallback(async (email: string, clave: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password: clave,
		});
		if (error) throw new Error(traducirError(error.message));
	}, []);

	const registrar = useCallback(
		async (email: string, clave: string, nombre: string) => {
			const { data, error } = await supabase.auth.signUp({
				email,
				password: clave,
				options: { data: { nombre } },
			});
			if (error) throw new Error(traducirError(error.message));

			// Si el proyecto exige confirmar el correo, signUp no devuelve
			// sesión: hay que avisarle al usuario que revise su bandeja.
			return { requiereConfirmacion: data.session === null };
		},
		[],
	);

	const salir = useCallback(async () => {
		await supabase.auth.signOut();
		setPerfil(null);
	}, []);

	return (
		<ContextoSesion.Provider
			value={{
				sesion,
				perfil,
				cargando,
				entrar,
				registrar,
				salir,
				refrescarPerfil: cargarPerfil,
			}}
		>
			{children}
		</ContextoSesion.Provider>
	);
}

export function useSesion(): ValorSesion {
	const contexto = useContext(ContextoSesion);
	if (!contexto) {
		throw new Error("useSesion debe usarse dentro de <SesionProvider>");
	}
	return contexto;
}
