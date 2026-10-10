"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Aviso, Cargando, CLASE_BOTON_AZUL } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";

function FormularioEntrar() {
	const router = useRouter();
	const buscar = useSearchParams();
	const siguiente = buscar.get("next");
	const { entrar } = useSesion();

	const [email, setEmail] = useState("");
	const [clave, setClave] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function enviar(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setEnviando(true);
		try {
			const perfil = await entrar(email.trim(), clave);
			const destino =
				siguiente ??
				(perfil?.rol === "ADMIN"
					? "/admin"
					: perfil?.rol === "VENDEDOR"
						? "/vendedor"
						: "/");
			router.replace(destino);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo entrar.");
			setEnviando(false);
		}
	}

	return (
		<div className="px-4 pt-6 md:mx-auto md:max-w-md">
			<h1 className="font-display text-2xl font-semibold text-ink">Entrar</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Usa el correo con el que te registraste.
			</p>

			{error && (
				<div className="mt-4">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			<form onSubmit={enviar} className="mt-5 space-y-3">
				<label className="block">
					<span className="text-sm font-medium text-ink">Correo</span>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						className="mt-1 w-full min-h-12 rounded-xl border border-black/15 px-3 py-3 text-ink outline-none transition-colors focus:border-azul focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
					/>
				</label>
				<label className="block">
					<span className="text-sm font-medium text-ink">Clave</span>
					<input
						type="password"
						required
						value={clave}
						onChange={(e) => setClave(e.target.value)}
						autoComplete="current-password"
						className="mt-1 w-full min-h-12 rounded-xl border border-black/15 px-3 py-3 text-ink outline-none transition-colors focus:border-azul focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
					/>
				</label>

				<button type="submit" disabled={enviando} className={CLASE_BOTON_AZUL}>
					{enviando ? "Entrando…" : "Entrar"}
				</button>
			</form>

			<p className="mt-4 text-center text-sm text-muted-foreground">
				¿No tienes cuenta?{" "}
				<Link href="/registro" className="font-medium text-azul">
					Crear una
				</Link>
			</p>
		</div>
	);
}

export default function Entrar() {
	return (
		<Suspense fallback={<Cargando />}>
			<FormularioEntrar />
		</Suspense>
	);
}
