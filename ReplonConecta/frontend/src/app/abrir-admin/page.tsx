"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/*
 * Atajo de desarrollo: /abrir-admin
 *
 * En local el backend corre con el perfil test (secreto de prueba), así
 * que el login real de Supabase no sirve y la cuenta admin del seed no
 * tiene clave. Esta página firma el mismo token de mentira que usa la
 * verificación (Playwright/CDP), lo deja en localStorage como si lo
 * hubiera dado Supabase y manda a /admin. Sirve para probar el panel en
 * cualquier navegador — el integrado de VS Code, por ejemplo — sin
 * depender de un script aparte.
 *
 * Doble candado para que no viaje a producción:
 *  - el secreto vive en NEXT_PUBLIC_DEV_ADMIN_SECRET, que solo existe en
 *    .env.local de desarrollo (en el hosting no está definido);
 *  - además exige hostname localhost en runtime.
 */

const ADMIN_ID = "00000000-0000-4000-8000-0000000000ad";

function b64u(bytes: Uint8Array): string {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function firmar(payload: object, secreto: string): Promise<string> {
	const codificar = new TextEncoder();
	const cabecera = b64u(
		codificar.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })),
	);
	const cuerpo = b64u(codificar.encode(JSON.stringify(payload)));
	const clave = await crypto.subtle.importKey(
		"raw",
		codificar.encode(secreto),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const firma = await crypto.subtle.sign(
		"HMAC",
		clave,
		codificar.encode(`${cabecera}.${cuerpo}`),
	);
	return `${cabecera}.${cuerpo}.${b64u(new Uint8Array(firma))}`;
}

export default function AbrirAdmin() {
	const [estado, setEstado] = useState<"cargando" | "no-disponible">(
		"cargando",
	);

	useEffect(() => {
		// Todo dentro de la función asíncrona: el primer setState ocurre
		// después del primer await, nunca en la ejecución síncrona del
		// efecto (regla react-hooks/set-state-in-effect).
		void (async () => {
			await Promise.resolve();
			const secreto = process.env.NEXT_PUBLIC_DEV_ADMIN_SECRET ?? "";
			if (!secreto || window.location.hostname !== "localhost") {
				setEstado("no-disponible");
				return;
			}

			const ahora = Math.floor(Date.now() / 1000);
			const token = await firmar(
				{ sub: ADMIN_ID, iat: ahora, exp: ahora + 86400 },
				secreto,
			);

			const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
			const ref = new URL(supabaseUrl).hostname.split(".")[0];
			const ahoraIso = new Date().toISOString();
			const sesion = {
				access_token: token,
				refresh_token: "refresco-falso",
				expires_at: ahora + 86400,
				expires_in: 86400,
				token_type: "bearer",
				user: {
					id: ADMIN_ID,
					aud: "authenticated",
					role: "authenticated",
					email: "admin@repelonmarket.demo",
					email_confirmed_at: ahoraIso,
					app_metadata: { provider: "email", providers: ["email"] },
					user_metadata: { nombre: "Admin Repelón" },
					created_at: ahoraIso,
					updated_at: ahoraIso,
				},
			};

			localStorage.setItem(`sb-${ref}-auth-token`, JSON.stringify(sesion));
			window.location.replace("/admin");
		})();
	}, []);

	if (estado === "no-disponible") {
		return (
			<main className="mx-auto max-w-md px-6 py-16">
				<h1 className="font-display text-2xl font-semibold text-ink">
					Atajo solo para local
				</h1>
				<p className="mt-3 text-sm text-muted-foreground">
					Esta página abre el panel de admin sin clave en desarrollo
					(localhost con el backend de prueba). Aquí no aplica: entra
					normal por{" "}
					<Link href="/entrar" className="text-leaf underline">
						/entrar
					</Link>
					.
				</p>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-md px-6 py-16">
			<p className="text-sm text-muted-foreground">
				Abriendo el panel de admin…
			</p>
		</main>
	);
}
