"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Aviso, CLASE_BOTON_AZUL, Cargando, Vacio } from "@/components/ui";
import { useCarrito } from "@/context/CarritoContext";
import { useSesion } from "@/context/SesionContext";
import { apiConSesion } from "@/lib/api";
import { ETIQUETA_PAGO, pesos } from "@/lib/format";
import type {
	Direccion,
	MetodoEntrega,
	MetodoPago,
	PedidoDetalle,
} from "@/lib/tipos";

export default function Checkout() {
	const router = useRouter();
	const { perfil, cargando: cargandoSesion } = useSesion();
	const { carrito, listo, total, vaciar } = useCarrito();

	const [metodoEntrega, setMetodoEntrega] = useState<MetodoEntrega>("DOMICILIO");
	const [metodoPago, setMetodoPago] = useState<MetodoPago>(
		"EFECTIVO_CONTRA_ENTREGA",
	);
	const [direccion, setDireccion] = useState("");
	const [barrio, setBarrio] = useState("");
	const [vereda, setVereda] = useState("");
	const [referencia, setReferencia] = useState("");
	const [telefono, setTelefono] = useState("");
	const [notas, setNotas] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sin sesión no se puede pedir: se manda a entrar y se vuelve aquí.
	useEffect(() => {
		if (!cargandoSesion && !perfil) {
			router.replace("/entrar?next=/checkout");
		}
	}, [cargandoSesion, perfil, router]);

	// Precarga la dirección guardada y el teléfono del perfil.
	useEffect(() => {
		if (!perfil) return;
		setTelefono((t) => t || perfil.telefono || "");
		if (!carrito) return;

		let vivo = true;
		void apiConSesion<Direccion[]>("/api/direcciones")
			.then((lista) => {
				if (!vivo) return;
				const predeterminada =
					lista.find((d) => d.predeterminada) ?? lista[0];
				if (predeterminada) {
					setDireccion(predeterminada.direccion);
					setBarrio(predeterminada.barrio ?? "");
					setVereda(predeterminada.vereda ?? "");
					setReferencia(predeterminada.referencia);
				}
			})
			.catch(() => {
				// Sin direcciones guardadas el usuario escribe la suya.
			});
		return () => {
			vivo = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [perfil, carrito?.negocioId]);

	if (!listo || cargandoSesion) return <Cargando />;

	if (!carrito || carrito.items.length === 0) {
		return (
			<Vacio titulo="No hay nada para pedir" texto="Tu carrito está vacío.">
				<Link href="/" className={CLASE_BOTON_AZUL}>
					Ver el mapa
				</Link>
			</Vacio>
		);
	}

	async function confirmar(e: React.FormEvent) {
		e.preventDefault();
		if (!carrito) return;
		setError(null);

		if (metodoEntrega === "DOMICILIO") {
			if (!direccion.trim() || !barrio.trim()) {
				setError("Escribe la dirección y el barrio para el domicilio.");
				return;
			}
			if (!referencia.trim()) {
				setError("Agrega una referencia: sin ella el domiciliario no llega.");
				return;
			}
		}

		setEnviando(true);
		try {
			const detalle = await apiConSesion<PedidoDetalle>("/api/pedidos", {
				method: "POST",
				body: JSON.stringify({
					negocioId: carrito.negocioId,
					items: carrito.items.map((i) => ({
						productoId: i.productoId,
						cantidad: i.cantidad,
					})),
					metodoEntrega,
					metodoPago,
					direccion: metodoEntrega === "DOMICILIO" ? direccion.trim() : null,
					barrio: metodoEntrega === "DOMICILIO" ? barrio.trim() : null,
					vereda: metodoEntrega === "DOMICILIO" ? vereda.trim() : null,
					referencia: referencia.trim(),
					telefonoContacto: telefono.trim(),
					notas: notas.trim(),
				}),
			});
			vaciar();
			router.replace(`/pedidos/${detalle.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo crear el pedido.");
			setEnviando(false);
		}
	}

	/*
	 * El método de entrega y el de pago se eligen con un solo toque: el
	 * que está marcado es el que va, y se ve marcado. No hay radio button
	 * pequeño ni desplegable: son dos decisiones binarias y en el mostrador
	 * la gente las toma hablando.
	 */
	const estiloOpcion = (activo: boolean) =>
		`min-h-12 flex-1 rounded-xl border px-3 py-3 text-sm font-medium ${
			activo ? "border-azul bg-azul/10 text-azul" : "border-black/15 text-black/70"
		}`;

	// En PC el formulario se centra con ancho de lectura; en móvil
	// ocupa la pantalla como siempre.
	return (
		<form onSubmit={confirmar} className="px-4 pt-4 md:mx-auto md:max-w-2xl">
			<h1 className="text-xl font-bold">Confirmar pedido</h1>
			<p className="mt-1 text-sm text-black/60">
				Pedido a <span className="font-medium text-black">{carrito.negocioNombre}</span>
			</p>

			{error && (
				<div className="mt-3">
					<Aviso tono="error">{error}</Aviso>
				</div>
			)}

			<section className="mt-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
					¿Cómo lo recibes?
				</h2>
				<div className="mt-2 flex gap-2">
					<button
						type="button"
						onClick={() => setMetodoEntrega("DOMICILIO")}
						className={estiloOpcion(metodoEntrega === "DOMICILIO")}
					>
						Domicilio
					</button>
					<button
						type="button"
						onClick={() => setMetodoEntrega("RECOGER_EN_TIENDA")}
						className={estiloOpcion(metodoEntrega === "RECOGER_EN_TIENDA")}
					>
						Recoger en tienda
					</button>
				</div>
			</section>

			{metodoEntrega === "DOMICILIO" && (
				<section className="mt-5 space-y-3">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
						Dirección de entrega
					</h2>
					<Campo
						etiqueta="Dirección"
						valor={direccion}
						onChange={setDireccion}
						placeholder="Calle 8 # 5-23"
						requerido
					/>
					<div className="flex gap-3">
						<Campo
							etiqueta="Barrio"
							valor={barrio}
							onChange={setBarrio}
							placeholder="Centro"
							requerido
						/>
						<Campo
							etiqueta="Vereda (si aplica)"
							valor={vereda}
							onChange={setVereda}
							placeholder="Rotinet"
						/>
					</div>
					<Campo
						etiqueta="Referencia"
						valor={referencia}
						onChange={setReferencia}
						placeholder="Portón azul, frente a la iglesia"
						requerido
					/>
				</section>
			)}

			<section className="mt-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
					¿Cómo pagas?
				</h2>
				<div className="mt-2 grid grid-cols-2 gap-2">
					{OPCIONES_PAGO.map((op) => (
						<button
							key={op.valor}
							type="button"
							onClick={() => setMetodoPago(op.valor)}
							className={estiloOpcion(metodoPago === op.valor)}
						>
							{op.etiqueta}
						</button>
					))}
				</div>
			</section>

			<section className="mt-5 space-y-3">
				<Campo
					etiqueta="Tu teléfono"
					valor={telefono}
					onChange={setTelefono}
					placeholder="300 000 0000"
					tipo="tel"
				/>
				<label className="block">
					<span className="text-sm font-medium">Notas para el negocio</span>
					<textarea
						value={notas}
						onChange={(e) => setNotas(e.target.value)}
						rows={2}
						placeholder="Sin cebolla, tocar el timbre dos veces…"
						className="mt-1 w-full rounded-xl border border-black/15 px-3 py-3 outline-none focus:border-azul"
					/>
				</label>
			</section>

			{/* Total arriba del botón: el botón declara el método de pago que
			    se está eligiendo justo encima, así que la cifra que confirma
			    la decisión va a la vista. */}
			<div className="mt-6 flex items-end justify-between rounded-2xl bg-black/[.04] px-4 py-4">
				<span className="text-sm text-black/60">
					{carrito.items.length}{" "}
					{carrito.items.length === 1 ? "producto" : "productos"} de{" "}
					<span className="font-medium text-black">{carrito.negocioNombre}</span>
				</span>
				<span className="shrink-0 text-right">
					<span className="block text-xs text-black/50">Total a pagar</span>
					<span className="text-2xl font-bold">{pesos(total)}</span>
				</span>
			</div>

			<button
				type="submit"
				disabled={enviando}
				className={`${CLASE_BOTON_AZUL} mt-3 md:mx-auto md:max-w-md`}
			>
				{enviando ? "Enviando pedido…" : "Confirmar pedido"}
			</button>

			<p className="mt-2 text-center text-xs text-black/50">
				Te confirmamos por WhatsApp. Pagas {ETIQUETA_PAGO[metodoPago].toLowerCase()}.
			</p>
		</form>
	);
}

/*
 * Las cuatro formas de pago salen del mapa de `format.ts` en vez de una
 * lista propia: el mismo nombre tiene que aparecer en el botón, en el
 * resumen del pedido y en el mensaje de WhatsApp al negocio, y una lista
 * paralela es donde esos tres se desincronizan.
 */
const OPCIONES_PAGO = (
	Object.entries(ETIQUETA_PAGO) as [MetodoPago, string][]
).map(([valor, etiqueta]) => ({ valor, etiqueta }));

function Campo({
	etiqueta,
	valor,
	onChange,
	placeholder,
	tipo = "text",
	requerido = false,
}: {
	etiqueta: string;
	valor: string;
	onChange: (v: string) => void;
	placeholder?: string;
	tipo?: string;
	requerido?: boolean;
}) {
	return (
		<label className="block flex-1">
			<span className="text-sm font-medium">
				{etiqueta}
				{requerido && <span className="text-azul"> *</span>}
			</span>
			<input
				type={tipo}
				value={valor}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="mt-1 w-full rounded-xl border border-black/15 px-3 py-3 outline-none focus:border-azul"
			/>
		</label>
	);
}
