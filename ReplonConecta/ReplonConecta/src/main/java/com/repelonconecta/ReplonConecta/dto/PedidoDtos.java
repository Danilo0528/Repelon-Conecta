package com.repelonconecta.ReplonConecta.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.repelonconecta.ReplonConecta.entity.EstadoPedido;
import com.repelonconecta.ReplonConecta.entity.MetodoEntrega;
import com.repelonconecta.ReplonConecta.entity.MetodoPago;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Respuestas y peticiones de pedidos. */
public final class PedidoDtos {

	private PedidoDtos() {
	}

	public record LineaResponse(
			UUID productoId,
			String nombre,
			String imagenUrl,
			long precioUnitario,
			int cantidad,
			long subtotal) {
	}

	/** Vista de lista: lo justo para pintar un renglon de historial. */
	public record PedidoResponse(
			UUID id,
			String numero,
			UUID negocioId,
			String negocioNombre,
			EstadoPedido estado,
			String estadoEtiqueta,
			MetodoEntrega metodoEntrega,
			MetodoPago metodoPago,
			long total,
			boolean pagoConfirmado,
			int cantidadItems,
			Instant creadoEn) {
	}

	/** Vista completa con lineas, direccion y el link de WhatsApp. */
	public record PedidoDetalleResponse(
			UUID id,
			String numero,
			EstadoPedido estado,
			String estadoEtiqueta,
			MetodoEntrega metodoEntrega,
			MetodoPago metodoPago,
			long total,
			boolean pagoConfirmado,
			String notas,
			String compradorNombre,
			String compradorTelefono,
			String entregaDireccion,
			String entregaBarrio,
			String entregaVereda,
			String entregaReferencia,
			UUID negocioId,
			String negocioNombre,
			String negocioTelefono,
			String negocioWhatsapp,
			String negocioDireccion,
			List<LineaResponse> items,
			/**
			 * Link wa.me ya armado con el resumen del pedido. Se construye
			 * en el servidor para que el boton de WhatsApp del frontend sea
			 * un solo href y no una concatenacion frágil en el cliente.
			 */
			String whatsappResumenUrl,
			Instant creadoEn,
			Instant actualizadoEn) {
	}

	/** Linea que el cliente pide. Solo el id y la cantidad: nada de precios. */
	public record LineaRequest(
			@NotNull(message = "Falta el producto")
			UUID productoId,

			@NotNull(message = "Falta la cantidad")
			@Min(value = 1, message = "La cantidad minima es 1")
			@Max(value = 99, message = "Maximo 99 unidades por producto")
			Integer cantidad) {
	}

	/**
	 * Creacion del pedido.
	 *
	 * El cliente NO manda precios ni totales: el servidor los lee del
	 * catalogo. Si se confiaran, cualquiera podria pedir un producto de
	 * $50.000 por $1.
	 */
	public record CrearPedidoRequest(
			@NotNull(message = "El negocio es obligatorio")
			UUID negocioId,

			@NotEmpty(message = "El carrito esta vacio")
			@Size(max = 50, message = "Maximo 50 productos por pedido")
			@Valid
			List<LineaRequest> items,

			@NotNull(message = "Elige como quieres recibir el pedido")
			MetodoEntrega metodoEntrega,

			@NotNull(message = "Elige como vas a pagar")
			MetodoPago metodoPago,

			// Direccion. Obligatoria si el metodo es DOMICILIO: se valida en
			// el servicio, no con @NotBlank, porque en RECOGER_EN_TIENDA el
			// comprador no manda direccion.

			@Size(max = 200)
			String direccion,

			@Size(max = 100)
			String barrio,

			@Size(max = 100)
			String vereda,

			// Sin @NotBlank a proposito: al recoger en tienda no hay
			// direccion ni referencia que dar. El servicio la exige solo
			// cuando el metodo de entrega es DOMICILIO.
			@Size(max = 300)
			String referencia,

			@Size(max = 20)
			String telefonoContacto,

			@Size(max = 500)
			String notas) {
	}

	/** Cambio de estado hecho por el negocio. */
	public record CambiarEstadoRequest(
			@NotNull(message = "Falta el nuevo estado")
			EstadoPedido estado,

			/** El negocio confirma que ya recibio el dinero. */
			Boolean pagoConfirmado) {
	}
}