package com.repelonconecta.RepelonConecta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.PedidoDtos;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.service.CurrentUserService;
import com.repelonconecta.RepelonConecta.service.NegocioService;
import com.repelonconecta.RepelonConecta.service.PedidoService;

import jakarta.validation.Valid;

/**
 * Pedidos.
 *
 * Todos los endpoints exigen sesion: sin saber quien compra no se puede
 * crear un pedido ni verlo.
 */
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

	private final PedidoService pedidos;
	private final NegocioService negocios;
	private final CurrentUserService currentUser;

	public PedidoController(PedidoService pedidos, NegocioService negocios,
			CurrentUserService currentUser) {
		this.pedidos = pedidos;
		this.negocios = negocios;
		this.currentUser = currentUser;
	}

	/**
	 * Confirmar pedido. Es el endpoint mas importante del MVP: es donde
	 * el carrito del comprador se convierte en un pedido que el negocio ve.
	 *
	 * Devuelve 201 con el detalle ya armado, incluido el link de WhatsApp
	 * con el resumen, para que el frontend pueda pintar la pantalla de
	 * "pedido enviado" sin una segunda peticion.
	 */
	@PostMapping
	public ResponseEntity<PedidoDtos.PedidoDetalleResponse> crear(
			@Valid @RequestBody PedidoDtos.CrearPedidoRequest request) {

		PedidoDtos.PedidoDetalleResponse detalle = pedidos.crear(request);

		return ResponseEntity.status(HttpStatus.CREATED).body(detalle);
	}

	/** Historial del comprador, del mas reciente al mas viejo. */
	@GetMapping("/mios")
	public List<PedidoDtos.PedidoResponse> mios() {
		Usuario usuario = currentUser.actual();
		return pedidos.misPedidos(usuario.getId());
	}

	/** Pedidos que entaron a un negocio. Solo su dueno o el admin. */
	@GetMapping("/negocio/{negocioId}")
	public List<PedidoDtos.PedidoResponse> delNegocio(@PathVariable UUID negocioId) {
		Usuario usuario = currentUser.actualVendedorOAdmin();
		negocios.negocioDelUsuario(negocioId, usuario);
		return pedidos.pedidosDelNegocio(negocioId);
	}

	/**
	 * Detalle de un pedido. El servicio verifica que quien pide sea el
	 * comprador, el dueno del negocio o el admin.
	 */
	@GetMapping("/{pedidoId}")
	public PedidoDtos.PedidoDetalleResponse detalle(@PathVariable UUID pedidoId) {
		Usuario usuario = currentUser.actual();
		return pedidos.detalle(pedidoId, usuario);
	}

	/**
	 * Cambio de estado. Lo usa el vendedor para mover el pedido por
	 * recibido -> en preparacion -> en camino -> entregado, y para
	 * confirmar que recibio el pago.
	 */
	@PatchMapping("/{pedidoId}/estado")
	public PedidoDtos.PedidoDetalleResponse cambiarEstado(@PathVariable UUID pedidoId,
			@Valid @RequestBody PedidoDtos.CambiarEstadoRequest request) {

		Usuario usuario = currentUser.actualVendedorOAdmin();
		return pedidos.cambiarEstado(pedidoId, request, usuario);
	}

	/** Cancelar. Lo puede hacer el comprador o el negocio. */
	@PatchMapping("/{pedidoId}/cancelar")
	public PedidoDtos.PedidoDetalleResponse cancelar(@PathVariable UUID pedidoId) {
		Usuario usuario = currentUser.actual();
		return pedidos.cancelar(pedidoId, usuario);
	}
}