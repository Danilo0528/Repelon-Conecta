"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, Cargando, CLASE_BOTON_AZUL, CLASE_BOTON_NEUTRO } from "@/components/ui";
import { useSesion } from "@/context/SesionContext";
import { COMPRAS_ACTIVAS } from "@/lib/compras";
import { apiConSesion } from "@/lib/api";
import type { Direccion, Usuario } from "@/lib/tipos";

export default function Perfil() {
	const router = useRouter();
	const { perfil, cargando, refrescarPerfil, salir } = useSesion();

	useEffect(() => {
		if (!cargando && !perfil) {
			router.replace("/entrar?next=/perfil");
		}
	}, [cargando, perfil, router]);

	if (cargando) return <Cargando />;
	if (!perfil) return null;

	return (
		<div className="px-4 pt-4">
			<h1 className="text-xl font-bold">Mi perfil</h1>

			<PanelRol />

		{/*
		 * En PC dos columnas: los datos de la cuenta a la izquierda y
		 * las direcciones a la derecha, para que todo se vea sin
		 * bajar la página.
		 *
		 * Las direcciones (y "Mis pedidos") están ocultas mientras
		 * COMPRAS_ACTIVAS sea false: la app es solo intermediaria y
		 * no pide entregas. El código sigue aquí, no se borró.
		 */}
		<div className="md:grid md:grid-cols-2 md:items-start md:gap-8">
			<DatosPerfil perfil={perfil} onGuardado={refrescarPerfil} />
			{COMPRAS_ACTIVAS && <Direcciones />}
		</div>

		<div className="mt-6 max-w-md space-y-3">
			{COMPRAS_ACTIVAS && (
				<Link href="/pedidos" className={CLASE_BOTON_NEUTRO}>
					Mis pedidos
				</Link>
			)}

				<button
					type="button"
					onClick={async () => {
						await salir();
						router.replace("/");
					}}
					className={`${CLASE_BOTON_NEUTRO} text-black/70`}
				>
					Cerrar sesión
				</button>
			</div>
		</div>
	);
}

/*
 * El panel del vendedor vive en Perfil y no en la barra inferior.
 *
 * La barra abajo tiene cuatro destinos y solo cuatro: es la que decide
 * en qué pantalla se está, y meterle un quinto icono que además solo
 * aparece para algunos hace que todos los demás la calculen mal. Quien
 * vende entra por aquí, que además es la pantalla donde ya está mirando
 * quién es.
 */
function PanelRol() {
	const { perfil } = useSesion();
	if (!perfil) return null;

	// En PC el botón no se estira al ancho de la pantalla.
	if (perfil.rol === "ADMIN") {
		return (
			<Link
				href="/admin"
				className={`${CLASE_BOTON_AZUL} mt-4 md:max-w-md`}
			>
				Panel de administrador
			</Link>
		);
	}

	if (perfil.rol === "VENDEDOR") {
		return (
			<Link href="/vendedor" className={`${CLASE_BOTON_AZUL} mt-4 md:max-w-md`}>
				Mi negocio
			</Link>
		);
	}

	return (
		<Link href="/vendedor" className={`${CLASE_BOTON_AZUL} mt-4 md:max-w-md`}>
			Quiero vender en Repelón Conecta
		</Link>
	);
}

function DatosPerfil({
	perfil,
	onGuardado,
}: {
	perfil: Usuario;
	onGuardado: () => Promise<void>;
}) {
	const [nombre, setNombre] = useState(perfil.nombre);
	const [telefono, setTelefono] = useState(perfil.telefono ?? "");
	const [guardando, setGuardando] = useState(false);
	const [ok, setOk] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function guardar(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setOk(false);
		setGuardando(true);
		try {
			await apiConSesion<Usuario>("/api/me", {
				method: "PUT",
				body: JSON.stringify({ nombre: nombre.trim(), telefono: telefono.trim() }),
			});
			await onGuardado();
			setOk(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo guardar.");
		} finally {
			setGuardando(false);
		}
	}

	return (
		<form onSubmit={guardar} className="mt-4 space-y-3">
			<p className="text-sm text-black/55">
				{perfil.email} ·{" "}
				<span className="font-medium text-black">
					{perfil.rol === "ADMIN"
						? "Administrador"
						: perfil.rol === "VENDEDOR"
							? "Vendedor"
							: "Comprador"}
				</span>
			</p>

			{error && <Aviso tono="error">{error}</Aviso>}
			{ok && <Aviso tono="ok">Datos guardados.</Aviso>}

			<label className="block">
				<span className="text-sm font-medium">Nombre</span>
				<input
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
					className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
			</label>
			<label className="block">
				<span className="text-sm font-medium">Teléfono</span>
				<input
					value={telefono}
					onChange={(e) => setTelefono(e.target.value)}
					placeholder="300 000 0000"
					className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
			</label>
			<button
				type="submit"
				disabled={guardando}
				className={CLASE_BOTON_AZUL}
			>
				{guardando ? "Guardando…" : "Guardar cambios"}
			</button>
		</form>
	);
}

function Direcciones() {
	const [lista, setLista] = useState<Direccion[] | null>(null);
	const [alias, setAlias] = useState("");
	const [direccion, setDireccion] = useState("");
	const [barrio, setBarrio] = useState("");
	const [referencia, setReferencia] = useState("");
	const [telefono, setTelefono] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [guardando, setGuardando] = useState(false);

	async function recargar() {
		try {
			setLista(await apiConSesion<Direccion[]>("/api/direcciones"));
		} catch {
			setLista([]);
		}
	}

	useEffect(() => {
		void recargar();
	}, []);

	async function agregar(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!direccion.trim() || !referencia.trim()) {
			setError("La dirección y la referencia son obligatorias.");
			return;
		}

		setGuardando(true);
		try {
			await apiConSesion<Direccion>("/api/direcciones", {
				method: "POST",
				body: JSON.stringify({
					alias: alias.trim(),
					direccion: direccion.trim(),
					barrio: barrio.trim(),
					vereda: "",
					referencia: referencia.trim(),
					telefonoContacto: telefono.trim(),
					predeterminada: (lista?.length ?? 0) === 0,
				}),
			});
			setAlias("");
			setDireccion("");
			setBarrio("");
			setReferencia("");
			setTelefono("");
			await recargar();
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo guardar.");
		} finally {
			setGuardando(false);
		}
	}

	async function eliminar(id: string) {
		try {
			await apiConSesion(`/api/direcciones/${id}`, { method: "DELETE" });
			await recargar();
		} catch {
			// Si falla, se deja la lista como está.
		}
	}

	return (
		<section className="mt-6">
			<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
				Mis direcciones
			</h2>

			{lista === null && <Cargando texto="Cargando direcciones…" />}

			{(lista ?? []).length > 0 && (
				<ul className="mt-2 space-y-2">
					{(lista ?? []).map((d) => (
						<li
							key={d.id}
							className="flex items-start justify-between gap-2 rounded-2xl border border-black/10 p-3"
						>
							<div className="text-sm">
								<p className="font-medium">
									{d.alias || d.barrio || "Dirección"}
									{d.predeterminada && (
										<span className="ml-2 rounded-full bg-verde px-2 py-0.5 text-xs text-white">
											Predeterminada
										</span>
									)}
								</p>
								<p className="text-black/60">{d.direccion}</p>
								<p className="text-black/50">{d.referencia}</p>
							</div>
							<button
								type="button"
								onClick={() => eliminar(d.id)}
								className="shrink-0 rounded-lg border border-black/15 px-3 py-2 text-sm text-black/70"
							>
								Eliminar
							</button>
						</li>
					))}
				</ul>
			)}

			<form onSubmit={agregar} className="mt-3 space-y-2">
				{error && <Aviso tono="error">{error}</Aviso>}
				<input
					value={alias}
					onChange={(e) => setAlias(e.target.value)}
					placeholder="Alias (Casa, Trabajo…)"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
				<input
					value={direccion}
					onChange={(e) => setDireccion(e.target.value)}
					placeholder="Dirección"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
				<div className="flex gap-2">
					<input
						value={barrio}
						onChange={(e) => setBarrio(e.target.value)}
						placeholder="Barrio"
						className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
					/>
					<input
						value={telefono}
						onChange={(e) => setTelefono(e.target.value)}
						placeholder="Teléfono"
						className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
					/>
				</div>
				<input
					value={referencia}
					onChange={(e) => setReferencia(e.target.value)}
					placeholder="Referencia para llegar"
					className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-azul"
				/>
				<button
					type="submit"
					disabled={guardando}
					className="min-h-12 w-full rounded-xl border border-azul px-4 py-3 font-semibold text-azul disabled:opacity-50"
				>
					{guardando ? "Guardando…" : "Agregar dirección"}
				</button>
			</form>
		</section>
	);
}
