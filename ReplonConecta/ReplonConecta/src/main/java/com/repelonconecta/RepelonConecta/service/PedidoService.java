package com.repelonconecta.RepelonConecta.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.PedidoDtos;
import com.repelonconecta.RepelonConecta.entity.EstadoPedido;
import com.repelonconecta.RepelonConecta.entity.ItemPedido;
import com.repelonconecta.RepelonConecta.entity.MetodoEntrega;
import com.repelonconecta.RepelonConecta.entity.MetodoPago;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Pedido;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;
import com.repelonconecta.RepelonConecta.repository.PedidoRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;

@Service
public class PedidoService {

	private static final ZoneId ZONA = ZoneId.of("America/Bogota");

	private static final DateTimeFormatter HORA_PEDIDO =
			DateTimeFormatter.ofPattern("dd/MM/yyyy h:mm a").withZone(ZONA);

	private final PedidoRepository pedidos;
	private final ProductoRepository productos;
	private final NegocioRepository negocios;
	private final CurrentUserService currentUser;

	public PedidoService(PedidoRepository pedidos, ProductoRepository productos,
			NegocioRepository negocios, CurrentUserService currentUser) {
		this.pedidos = pedidos;
		this.productos = productos;
		this.negocios = negocios;
		this.currentUser = currentUser;
	}

	// =====================================================================
	// CREAR PEDIDO
	// =====================================================================

	/**
	 * Crea un pedido desde el carrito.
	 *
	 * Decisiones que importan y no son obvias:
	 *
	 * 1. Los precios se leen del catalogo, NUNCA del request. Si se
	 *    confiaran, cualquiera podria pedir algo de $50.000 por $1.
	 * 2. Un pedido es de UN solo negocio. Se valida que todos los
	 *    productos pertenezcan al negocio declarado; si no, 400. Es la
	 *    regla que el usuario pidio explicitamente.
	 * 3. La disponibilidad se revalida en el servidor. El producto pudo
	 *    agotarse entre que el comprador lo vio y confirmo.
	 * 4. El stock se descuenta al confirmar. Si queda en cero, el
	 *    producto se apaga solo para que no aparezca disponible.
	 * 5. El total se calcula con long, sin coma flotante: sumar miles de
	 *    precios en double es como aparecen los errores de un peso.
	 */
	@Transactional
	public PedidoDtos.PedidoDetalleResponse crear(PedidoDtos.CrearPedidoRequest request) {
		Usuario comprador = currentUser.actual();

		Negocio negocio = negocios.findById(request.negocioId())
				.orElseThrow(() -> ApiException.noEncontrado("El negocio"));

		if (!negocio.isAprobado()) {
			throw ApiException.peticionInvalida("Este negocio aun no esta activo en la plataforma");
		}

		// --- Validar y resolver lineas ---------------------------------
		Map<UUID, Integer> consolidated = new LinkedHashMap<>();

		for (PedidoDtos.LineaRequest linea : request.items()) {
			UUID productoId = linea.productoId();
			Integer cantidad = linea.cantidad();

			if (productoId == null || cantidad == null || cantidad < 1) {
				throw ApiException.peticionInvalida("Hay productos con cantidad invalida en el carrito");
			}

			// Si el mismo producto viene dos veces, se suman las cantidades en
			// vez de crear dos lineas iguales.
			consolidated.merge(productoId, cantidad, Integer::sum);
		}

		List<Producto> aComprar = new ArrayList<>();
		Map<UUID, Integer> cantidades = new HashMap<>();

		for (Map.Entry<UUID, Integer> entry : consolidated.entrySet()) {
			Producto producto = productos.findById(entry.getKey())
					.orElseThrow(() -> ApiException.peticionInvalida(
							"Uno de los productos del carrito ya no existe"));

			// Regla de un negocio por pedido. Sin esta comprobacion un
			// cliente podria meter productos de dos tiendas y el pedido
			// quedaria sin dueno claro de a quien pertenece.
			if (!producto.getNegocio().getId().equals(negocio.getId())) {
				throw ApiException.peticionInvalida(
						"El carrito tiene productos de dos negocios distintos. "
						+ "Por ahora cada pedido es de un solo negocio.");
			}

			if (!producto.isDisponible()) {
				throw ApiException.peticionInvalida(
						"\"" + producto.getNombre() + "\" ya no esta disponible");
			}

			int cantidad = entry.getValue();

			// Stock insuficiente. Se avisa con el nombre del producto y
			// cuanto queda: el cliente puede quitarlo y seguir.
			if (producto.getStock() != null && cantidad > producto.getStock()) {
				throw ApiException.peticionInvalida(producto.getStock() == 0
						? "\"" + producto.getNombre() + "\" se agoto"
						: "Solo quedan " + producto.getStock() + " de \""
								+ producto.getNombre() + "\"");
			}

			// Tope de unidades por linea, para que un carrito no sea un
			// pedido de 5000 panes que nadie puede despachar.
			if (cantidad > 99) {
				throw ApiException.peticionInvalida("Maximo 99 unidades por producto");
			}

			aComprar.add(producto);
			cantidades.put(producto.getId(), cantidad);
		}

		// --- Validar entrega -------------------------------------------
		String direccion = limpiar(request.direccion());
		String barrio = limpiar(request.barrio());
		String vereda = limpiar(request.vereda());
		String referencia = limpiar(request.referencia());
		String telefono = limpiar(request.telefonoContacto());

		if (request.metodoEntrega() == MetodoEntrega.DOMICILIO) {
			if (direccion == null || barrio == null) {
				throw ApiException.peticionInvalida(
						"Escribe la direccion y el barrio para el domicilio");
			}
			if (referencia == null) {
				throw ApiException.peticionInvalida(
						"Agrega una referencia: sin ella el domiciliario no encuentra la casa");
			}
		}

		// --- Construir el pedido ----------------------------------------
		Pedido pedido = new Pedido();
		pedido.setNumero(generarNumero());
		pedido.setComprador(comprador);
		pedido.setNegocio(negocio);
		pedido.setEstado(EstadoPedido.PEDIDO_RECIBIDO);
		pedido.setMetodoEntrega(request.metodoEntrega());
		pedido.setMetodoPago(request.metodoPago());

		// Snapshot del comprador: si mañana cambia su nombre o su
		// telefono, este pedido sigue diciendo a quien se le entregó.
		pedido.setCompradorNombre(comprador.getNombre());
		pedido.setCompradorTelefono(
				telefono != null ? telefono : comprador.getTelefono());

		if (request.metodoEntrega() == MetodoEntrega.DOMICILIO) {
			pedido.setEntregaDireccion(direccion);
			pedido.setEntregaBarrio(barrio);
			pedido.setEntregaVereda(vereda);
			pedido.setEntregaReferencia(referencia);
		}

		pedido.setNotas(limpiar(request.notas()));

		for (Producto producto : aComprar) {
			int cantidad = cantidades.get(producto.getId());

			// ItemPedido copia nombre y precio del producto ahora. Es un
			// snapshot a proposito.
			pedido.agregarItem(new ItemPedido(producto, cantidad));

			// Descontar stock.
			if (producto.getStock() != null) {
				producto.setStock(producto.getStock() - cantidad);
				producto.ajustarDisponibilidad();
				producto.tocar();
			}
		}

		pedido.recalcularTotal();

		Pedido guardado = pedidos.save(pedido);

		return aDetalle(guardado);
	}

	// =====================================================================
	// CAMBIAR ESTADO
	// =====================================================================

	/**
	 * El negocio mueve su pedido por el flujo.
	 *
	 * Las transiciones validas las decide EstadoPedido.puedeIrA. Sin esa
	 * comprobacion un vendedor podria volver a "en preparacion" un pedido
	 * ya entregado, y el cliente veria un pedido que retrocede.
	 */
	@Transactional
	public PedidoDtos.PedidoDetalleResponse cambiarEstado(UUID pedidoId,
			PedidoDtos.CambiarEstadoRequest request, Usuario actor) {

		Pedido pedido = pedidos.findById(pedidoId)
				.orElseThrow(() -> ApiException.noEncontrado("El pedido"));

		boolean soyAdmin = actor.getRol() == com.repelonconecta.RepelonConecta.entity.Rol.ADMIN;

		// Solo el dueno del negocio (o el admin) toca el estado. Un
		// comprador no puede marcarse su propio pedido como entregado.
		if (!soyAdmin && !pedido.getNegocio().getDueno().getId().equals(actor.getId())) {
			throw ApiException.prohibido("Este pedido es de otro negocio");
		}

		EstadoPedido actual = pedido.getEstado();
		EstadoPedido destino = request.estado();

		// Confirmar el pago sin mover el pedido es valido: el vendedor
		// suele cobrar antes de preparar y no tiene por que adelantar el
		// estado solo para marcar que ya le pagaron. Se distingue del
		// cambio de estado normal para que no sirva de puerta trasera y
		// permita reescribir un pedido ya entregado sin cambiar nada.
		boolean soloConfirmaPago =
				destino == actual && request.pagoConfirmado() != null;

		if (!soloConfirmaPago && !actual.puedeIrA(destino)) {
			throw ApiException.peticionInvalida(actual.isTerminal()
					? "Este pedido ya está en estado final (\"" + actual.getEtiqueta()
							+ "\") y no se puede cambiar"
					: "No se puede pasar de \"" + actual.getEtiqueta()
							+ "\" a \"" + destino.getEtiqueta() + "\"");
		}

		pedido.setEstado(destino);

		if (request.pagoConfirmado() != null) {
			pedido.setPagoConfirmado(request.pagoConfirmado());
		}

		pedido.tocar();

		return aDetalle(pedidos.save(pedido));
	}

	/** El comprador cancela mientras el pedido no haya salido. */
	@Transactional
	public PedidoDtos.PedidoDetalleResponse cancelar(UUID pedidoId, Usuario actor) {
		Pedido pedido = pedidos.findById(pedidoId)
				.orElseThrow(() -> ApiException.noEncontrado("El pedido"));

		boolean soyComprador = pedido.getComprador().getId().equals(actor.getId());
		boolean soyDueno = pedido.getNegocio().getDueno().getId().equals(actor.getId());
		boolean soyAdmin = actor.getRol() == com.repelonconecta.RepelonConecta.entity.Rol.ADMIN;

		if (!soyComprador && !soyDueno && !soyAdmin) {
			throw ApiException.prohibido("Este pedido no es tuyo");
		}

		// Cancelar un pedido ya entregado o en camino genera friccion
		// con el cliente: hay producto moviendose y la gente ya lo pago.
		if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
			throw ApiException.peticionInvalida("Este pedido ya fue entregado");
		}
		if (pedido.getEstado() == EstadoPedido.EN_CAMINO) {
			throw ApiException.peticionInvalida(
					"El pedido ya está en camino. Llama al negocio para cancelarlo.");
		}
		if (pedido.getEstado() == EstadoPedido.RECHAZADO) {
			throw ApiException.peticionInvalida("Este pedido ya fue rechazado");
		}

		pedido.setEstado(EstadoPedido.CANCELADO);
		pedido.tocar();

		// Se devuelve el stock: el producto no se consumio.
		for (ItemPedido item : pedido.getItems()) {
			Producto producto = item.getProducto();
			if (producto != null && producto.getStock() != null) {
				producto.setStock(producto.getStock() + item.getCantidad());
				producto.setDisponible(true);
				producto.tocar();
				productos.save(producto);
			}
		}

		return aDetalle(pedidos.save(pedido));
	}

	// =====================================================================
	// CONSULTAS
	// =====================================================================

	/** Historial del comprador. Ve sus propios pedidos y nada mas. */
	public List<PedidoDtos.PedidoResponse> misPedidos(UUID compradorId) {
		return pedidos.findByCompradorIdOrderByCreadoEnDesc(compradorId).stream()
				.map(this::aResumen)
				.toList();
	}

	/** Pedidos del negocio, del mas nuevo al mas viejo. */
	public List<PedidoDtos.PedidoResponse> pedidosDelNegocio(UUID negocioId) {
		return pedidos.findByNegocioIdOrderByCreadoEnDesc(negocioId).stream()
				.map(this::aResumen)
				.toList();
	}

	/**
	 * Detalle de un pedido, verificando que quien pide tiene derecho a
	 * verlo: el comprador, el dueno del negocio o el admin.
	 */
	public PedidoDtos.PedidoDetalleResponse detalle(UUID pedidoId, Usuario actor) {
		Pedido pedido = pedidos.findById(pedidoId)
				.orElseThrow(() -> ApiException.noEncontrado("El pedido"));

		boolean soyAdmin = actor.getRol() == com.repelonconecta.RepelonConecta.entity.Rol.ADMIN;
		boolean soyComprador = pedido.getComprador().getId().equals(actor.getId());
		boolean soyDueno = pedido.getNegocio().getDueno().getId().equals(actor.getId());

		if (!soyAdmin && !soyComprador && !soyDueno) {
			throw ApiException.prohibido("Este pedido no es tuyo");
		}

		return aDetalle(pedido);
	}

	// =====================================================================
	// MAPEO
	// =====================================================================

	private PedidoDtos.PedidoResponse aResumen(Pedido pedido) {
		return new PedidoDtos.PedidoResponse(
				pedido.getId(),
				pedido.getNumero(),
				pedido.getNegocio().getId(),
				pedido.getNegocio().getNombre(),
				pedido.getEstado(),
				pedido.getEstado().getEtiqueta(),
				pedido.getMetodoEntrega(),
				pedido.getMetodoPago(),
				pedido.getTotal(),
				pedido.isPagoConfirmado(),
				pedido.getItems().size(),
				pedido.getCreadoEn());
	}

	private PedidoDtos.PedidoDetalleResponse aDetalle(Pedido pedido) {
		List<PedidoDtos.LineaResponse> lineas = pedido.getItems().stream()
				.map(item -> new PedidoDtos.LineaResponse(
						item.getProducto() != null ? item.getProducto().getId() : null,
						item.getProductoNombre(),
						item.getProductoImagenUrl(),
						item.getPrecioUnitario(),
						item.getCantidad(),
						item.getSubtotal()))
				.toList();

		Negocio negocio = pedido.getNegocio();

		String textoLineas = lineas.stream()
				.map(l -> "- " + l.cantidad() + " x " + l.nombre()
						+ " ($" + WhatsappService.formatPesos(l.subtotal()) + ")")
				.reduce((a, b) -> a + "\n" + b)
				.orElse("");

		String direccion = pedido.getMetodoEntrega() == MetodoEntrega.DOMICILIO
				? pedido.getEntregaDireccion() + ", " + pedido.getEntregaBarrio()
				+ (pedido.getEntregaVereda() != null ? " (vereda " + pedido.getEntregaVereda() + ")" : "")
				+ (pedido.getEntregaReferencia() != null ? " - " + pedido.getEntregaReferencia() : "")
				: null;

		String whatsapp = WhatsappService.resumenPedido(
				negocio.getWhatsapp(),
				pedido.getNumero(),
				negocio.getNombre(),
				pedido.getCompradorNombre(),
				textoLineas,
				pedido.getTotal(),
				pedido.getMetodoEntrega() == MetodoEntrega.DOMICILIO
						? "Domicilio"
						: "Recoger en tienda",
				etiquetaPago(pedido.getMetodoPago()),
				direccion,
				HORA_PEDIDO.format(pedido.getCreadoEn()));

		return new PedidoDtos.PedidoDetalleResponse(
				pedido.getId(),
				pedido.getNumero(),
				pedido.getEstado(),
				pedido.getEstado().getEtiqueta(),
				pedido.getMetodoEntrega(),
				pedido.getMetodoPago(),
				pedido.getTotal(),
				pedido.isPagoConfirmado(),
				pedido.getNotas(),
				pedido.getCompradorNombre(),
				pedido.getCompradorTelefono(),
				pedido.getEntregaDireccion(),
				pedido.getEntregaBarrio(),
				pedido.getEntregaVereda(),
				pedido.getEntregaReferencia(),
				negocio.getId(),
				negocio.getNombre(),
				negocio.getTelefono(),
				negocio.getWhatsapp(),
				negocio.getDireccion(),
				lineas,
				whatsapp,
				pedido.getCreadoEn(),
				pedido.getActualizadoEn());
	}

	private String etiquetaPago(MetodoPago metodo) {
		return switch (metodo) {
			case EFECTIVO_CONTRA_ENTREGA -> "Efectivo contra entrega";
			case NEQUI -> "Nequi";
			case DAVIPLATA -> "Daviplata";
			case TRANSFERENCIA_BANCARIA -> "Transferencia bancaria";
		};
	}

	// =====================================================================
	// UTILIDADES
	// =====================================================================

	/**
	 * Numero de pedido legible: RM-7F3A9.
	 *
	 * Se usa el instante actual en epoch-seconds mas un factor aleatorio
	 * porque dos pedidos pueden crearse en el mismo milisegundo. El
	 * resultado se pasa a base 36 y se recortan los ultimos 5
	 * caracteres: suficiente para que no se repita en la practica, y
	 * sigue siendo corto para dictarlo por telefono.
	 */
	private String generarNumero() {
		String sufijo = Long.toString(
				Instant.now().getEpochSecond() * 1000 + ThreadLocalRandom.current().nextInt(1000),
				36).toUpperCase();
		return "RM-" + sufijo.substring(Math.max(0, sufijo.length() - 5));
	}

	/** Limpia strings vacios para no guardar "   " como si fuera un dato. */
	private String limpiar(String texto) {
		if (texto == null) {
			return null;
		}
		String recortado = texto.trim();
		return recortado.isEmpty() ? null : recortado;
	}

	/** Inicio del dia local en Bogota, para las metricas. */
	public static Instant inicioHoy() {
		return LocalDate.now(ZONA).atStartOfDay(ZONA).toInstant();
	}

	/** Hace siete dias, para la ventana semanal. */
	public static Instant haceSemana() {
		return inicioHoy().minusSeconds(7L * 24 * 3600);
	}

	/** Hace treinta dias, para la ventana mensual. */
	public static Instant haceMes() {
		return inicioHoy().minusSeconds(30L * 24 * 3600);
	}
}