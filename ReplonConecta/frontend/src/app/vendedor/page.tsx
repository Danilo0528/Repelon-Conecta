"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MapaSelector } from "@/components/Mapa";
import {
	Aviso,
	Cargando,
	CLASE_BOTON_AZUL,
	CLASE_BOTON_NEUTRO,
	InsigniaAbierto,
	Vacio,
} from "@/components/ui";
import { useSesion } from "@/context/SesionContext";
import { apiConSesion } from "@/lib/api";
import { pesos } from "@/lib/format";
import type { MetricasVendedor, Negocio, NegocioDetalle } from "@/lib/tipos";
import { useDatos } from "@/lib/useDatos";

export default function PanelVendedor() {
	const router = useRouter();
	const { perfil, cargando: cargandoSesion, refrescarPerfil } = useSesion();

	useEffect(() => {
		if (!cargandoSesion && !perfil) {
			router.replace("/entrar?next=/vendedor");
		}
	}, [cargandoSesion, perfil, router]);

	const {
		datos: negocios,
		cargando,
		error,
		setDatos,
	} = useDatos<Negocio[]>(
		() => apiConSesion<Negocio[]>("/api/negocios/mios"),
		[perfil?.id],
	);

	if (cargandoSesion || (perfil && cargando)) return <Cargando />;
	if (!perfil) return null;

	async function alCrear(negocio: NegocioDetalle) {
		const actualizados = await apiConSesion<Negocio[]>("/api/negocios/mios");
		setDatos(actualizados);
		await refrescarPerfil();
		void negocio;
	}

	return (
		<div className="px-4 pt-6">
			<h1 className="font-display text-2xl font-semibold text-ink">
				Mi negocio
			</h1>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			{(negocios ?? []).length === 0 && !cargando ? (
				<>
					<Vacio
						titulo="Aún no tienes un negocio"
						texto="Crea el tuyo y empieza a recibir pedidos de todo Repelón."
					/>
					<FormularioNegocio onCreado={alCrear} />
				</>
			) : (
				<ul className="mt-4 grid gap-4 md:grid-cols-2">
					{(negocios ?? []).map((n) => (
						<TarjetaNegocio key={n.id} negocio={n} />
					))}
					<li>
						<details>
							<summary className="cursor-pointer text-sm font-medium text-azul">
								+ Crear otro negocio
							</summary>
							<div className="mt-3">
								<FormularioNegocio onCreado={alCrear} />
							</div>
						</details>
					</li>
				</ul>
			)}
		</div>
	);
}

function TarjetaNegocio({ negocio }: { negocio: Negocio }) {
	const [abierto, setAbierto] = useState(negocio.abierto);
	const [cambiando, setCambiando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { datos: metricas } = useDatos<MetricasVendedor>(
		() => apiConSesion<MetricasVendedor>(`/api/negocios/${negocio.id}/metricas`),
		[negocio.id],
	);

	async function alternar(valor: boolean) {
		setError(null);
		setCambiando(true);
		try {
			const actualizado = await apiConSesion<NegocioDetalle>(
				`/api/negocios/${negocio.id}/abierto?abierto=${valor}`,
				{ method: "PATCH" },
			);
			setAbierto(actualizado.abierto);
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo cambiar.");
		} finally {
			setCambiando(false);
		}
	}

	return (
		<li className="rounded-2xl border border-black/10 p-4">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<p className="font-semibold leading-tight text-ink">{negocio.nombre}</p>
					<p className="text-xs text-muted-foreground">
						{negocio.barrio ?? "Repelón"} · {negocio.cantidadProductos} productos
					</p>
				</div>
				<InsigniaAbierto abierto={abierto} />
			</div>

			{error && (
				<div className="mt-2">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			<div className="mt-3 grid grid-cols-3 gap-2 text-center">
				<Cifra etiqueta="Hoy" valor={pesos(metricas?.ventasHoy ?? 0)} />
				<Cifra etiqueta="Semana" valor={pesos(metricas?.ventasSemana ?? 0)} />
				<Cifra
					etiqueta="Por despachar"
					valor={String(metricas?.pedidosPendientes ?? 0)}
				/>
			</div>

			<div className="mt-4 flex gap-2">
				<Link
					href={`/vendedor/negocios/${negocio.id}`}
					className={`${CLASE_BOTON_AZUL} flex-1`}
				>
					Gestionar
				</Link>
				<button
					type="button"
					onClick={() => alternar(!abierto)}
					disabled={cambiando}
					className={`${CLASE_BOTON_NEUTRO} flex-1`}
				>
					{abierto ? "Cerrar" : "Abrir"}
				</button>
			</div>
		</li>
	);
}

function Cifra({ etiqueta, valor }: { etiqueta: string; valor: string }) {
	return (
		<div className="rounded-xl bg-black/[.04] px-2 py-2">
			<p className="text-base font-bold tabular-nums text-ink">{valor}</p>
			<p className="text-[11px] text-muted-foreground">{etiqueta}</p>
		</div>
	);
}

const CLASE_INPUT =
	"w-full min-h-12 rounded-xl border border-black/15 px-3 py-3 text-ink outline-none transition-colors focus:border-azul focus-visible:ring-2 focus-visible:ring-azul focus-visible:ring-offset-2";

function FormularioNegocio({
	onCreado,
}: {
	onCreado: (n: NegocioDetalle) => void | Promise<void>;
}) {
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [direccion, setDireccion] = useState("");
	const [barrio, setBarrio] = useState("");
	const [referencia, setReferencia] = useState("");
	const [lat, setLat] = useState<number | null>(null);
	const [lng, setLng] = useState<number | null>(null);
	const [whatsapp, setWhatsapp] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function crear(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!nombre.trim() || !direccion.trim()) {
			setError("El nombre y la dirección son obligatorios.");
			return;
		}

		setEnviando(true);
		try {
			const creado = await apiConSesion<NegocioDetalle>("/api/negocios", {
				method: "POST",
				body: JSON.stringify({
					nombre: nombre.trim(),
					descripcion: descripcion.trim(),
					direccion: direccion.trim(),
					barrio: barrio.trim(),
					latitud: lat,
					longitud: lng,
					referenciaUbicacion: referencia.trim(),
					telefono: "",
					whatsapp: whatsapp.trim(),
					horario: null,
				}),
			});
			await onCreado(creado);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo crear el negocio.");
			setEnviando(false);
		}
	}

	return (
		<form
			onSubmit={crear}
			className="space-y-3 rounded-2xl border border-black/10 p-4 md:max-w-2xl"
		>
			<h2 className="font-semibold text-ink">Crear mi negocio</h2>
			{error && <Aviso tono="error">{error}</Aviso>}

			<label className="block">
				<span className="sr-only">Nombre del negocio</span>
				<input
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
					placeholder="Nombre del negocio"
					className={CLASE_INPUT}
				/>
			</label>
			<label className="block">
				<span className="sr-only">Descripción</span>
				<textarea
					value={descripcion}
					onChange={(e) => setDescripcion(e.target.value)}
					rows={2}
					placeholder="¿Qué vendes?"
					className={`${CLASE_INPUT} min-h-[auto]`}
				/>
			</label>
			<label className="block">
				<span className="sr-only">Dirección</span>
				<input
					value={direccion}
					onChange={(e) => setDireccion(e.target.value)}
					placeholder="Dirección"
					className={CLASE_INPUT}
				/>
			</label>
			{/* En móvil uno debajo del otro; en PC comparten fila. */}
			<div className="flex flex-col gap-3 sm:flex-row">
				<label className="block flex-1">
					<span className="sr-only">Barrio</span>
					<input
						value={barrio}
						onChange={(e) => setBarrio(e.target.value)}
						placeholder="Barrio"
						className={CLASE_INPUT}
					/>
				</label>
				<label className="block flex-1">
					<span className="sr-only">WhatsApp</span>
					<input
						value={whatsapp}
						onChange={(e) => setWhatsapp(e.target.value)}
						placeholder="WhatsApp (300 000 0000)"
						className={CLASE_INPUT}
					/>
				</label>
			</div>
			<label className="block">
				<span className="sr-only">Referencia</span>
				<input
					value={referencia}
					onChange={(e) => setReferencia(e.target.value)}
					placeholder="Referencia (ej. frente a la plaza)"
					className={CLASE_INPUT}
				/>
			</label>

			<div>
				<p className="mb-1 text-xs font-medium text-muted-foreground">
					Marca tu ubicación en el mapa
				</p>
				<MapaSelector
					lat={lat}
					lng={lng}
					onCambiar={(la, ln) => {
						setLat(la);
						setLng(ln);
					}}
				/>
				{lat != null && lng != null && (
					<p className="mt-1 text-xs font-medium text-leaf">
						Ubicación lista: {lat.toFixed(5)}, {lng.toFixed(5)}
					</p>
				)}
			</div>

			<button type="submit" disabled={enviando} className={CLASE_BOTON_AZUL}>
				{enviando ? "Creando…" : "Crear negocio"}
			</button>
		</form>
	);
}
