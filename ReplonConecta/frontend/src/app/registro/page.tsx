"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Aviso, CLASE_BOTON_AZUL } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";

export default function Registro() {
	const router = useRouter();
	const { registrar } = useSesion();

	const [nombre, setNombre] = useState("");
	const [email, setEmail] = useState("");
	const [clave, setClave] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [confirmaCorreo, setConfirmaCorreo] = useState(false);

	async function enviar(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (clave.length < 6) {
			setError("La clave debe tener al menos 6 caracteres.");
			return;
		}

		setEnviando(true);
		try {
			const { requiereConfirmacion } = await registrar(
				email.trim(),
				clave,
				nombre.trim(),
			);
			if (requiereConfirmacion) {
				setConfirmaCorreo(true);
			} else {
				router.replace("/");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
			setEnviando(false);
		}
	}

	if (confirmaCorreo) {
		return (
			<div className="px-4 pt-6 md:mx-auto md:max-w-md">
				<Aviso tono="ok">
					Creamos tu cuenta. Revisa tu correo y confirma para poder entrar.
				</Aviso>
				<Link href="/entrar" className={`${CLASE_BOTON_AZUL} mt-4`}>
					Ir a entrar
				</Link>
			</div>
		);
	}

	return (
		<div className="px-4 pt-6 md:mx-auto md:max-w-md">
			<h1 className="font-display text-2xl font-semibold text-ink">
				Crear cuenta
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Con tu cuenta puedes pedir y también vender.
			</p>

			{error && (
				<div className="mt-4">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			<form onSubmit={enviar} className="mt-5 space-y-3">
				<label className="block">
					<span className="text-sm font-medium text-ink">Nombre</span>
					<input
						required
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						autoComplete="name"
						className="mt-1 w-full min-h-12 rounded-xl border border-black/15 px-3 py-3 text-ink outline-none transition-colors focus:border-azul focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
					/>
				</label>
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
						minLength={6}
						value={clave}
						onChange={(e) => setClave(e.target.value)}
						autoComplete="new-password"
						className="mt-1 w-full min-h-12 rounded-xl border border-black/15 px-3 py-3 text-ink outline-none transition-colors focus:border-azul focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2"
					/>
					<span className="mt-1 block text-xs text-muted-foreground">
						Mínimo 6 caracteres.
					</span>
				</label>

				<button type="submit" disabled={enviando} className={CLASE_BOTON_AZUL}>
					{enviando ? "Creando cuenta…" : "Crear cuenta"}
				</button>
			</form>

			<p className="mt-4 text-center text-sm text-muted-foreground">
				¿Ya tienes cuenta?{" "}
				<Link href="/entrar" className="font-medium text-azul">
					Entrar
				</Link>
			</p>
		</div>
	);
}
