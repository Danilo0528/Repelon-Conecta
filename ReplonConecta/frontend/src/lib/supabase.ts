import { createClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/*
 * Cliente de Supabase para autenticación (correo + clave) y para subir
 * imágenes al bucket de Storage.
 *
 * Si no hay credenciales se crea igual con valores de mentira: así el
 * bundle compila y la página muestra el aviso de configuración en vez de
 * lanzar una excepción al importar el módulo, que dejaría la app en
 * blanco sin explicar por qué.
 */
export const supabase = createClient(
	SUPABASE_URL || "http://localhost:54321",
	SUPABASE_ANON_KEY || "anon-sin-configurar",
	{
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			// No usamos el flujo de recuperación por URL en el MVP.
			detectSessionInUrl: false,
		},
	},
);
