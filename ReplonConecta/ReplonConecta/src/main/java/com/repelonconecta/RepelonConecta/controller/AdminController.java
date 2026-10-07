package com.repelonconecta.RepelonConecta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.NegocioDtos;
import com.repelonconecta.RepelonConecta.dto.PedidoDtos;
import com.repelonconecta.RepelonConecta.dto.UsuarioDtos;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.service.AdminService;
import com.repelonconecta.RepelonConecta.service.CurrentUserService;
import com.repelonconecta.RepelonConecta.service.PedidoService;
import com.repelonconecta.RepelonConecta.service.UsuarioService;

import jakarta.validation.Valid;

/**
 * Panel del administrador.
 *
 * Cada endpoint llama a currentUser.actualAdmin() antes de nada: el rol
 * se comprueba dos veces, aqui y en SecurityConfig, porque una config de
 * seguridad mal escrita no debe ser la unica barrera de una accion
 * destructiva.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final AdminService admin;
	private final CurrentUserService currentUser;
	private final UsuarioService usuarios;
	private final PedidoService pedidos;

	public AdminController(AdminService admin, CurrentUserService currentUser,
			UsuarioService usuarios, PedidoService pedidos) {
		this.admin = admin;
		this.currentUser = currentUser;
		this.usuarios = usuarios;
		this.pedidos = pedidos;
	}

	/** Lista completa de negocios con su estado de aprobacion. */
	@GetMapping("/negocios")
	public List<NegocioDtos.NegocioAdminResponse> negocios() {
		currentUser.actualAdmin();
		return admin.listarTodos();
	}

	/** Aprueba, rechaza o destaca un negocio. Solo lo que llega informado. */
	@PatchMapping("/negocios/{negocioId}")
	public NegocioDtos.NegocioAdminResponse cambiar(@PathVariable UUID negocioId,
			@Valid @RequestBody NegocioDtos.NegocioAdminToggleRequest request) {
		currentUser.actualAdmin();
		return admin.cambiarEstado(negocioId, request);
	}

	/** Borra un negocio sin pedidos. Con pedidos, responde 409. */
	@DeleteMapping("/negocios/{negocioId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable UUID negocioId) {
		currentUser.actualAdmin();
		admin.eliminar(negocioId);
	}

	// =====================================================================
	// USUARIOS
	// =====================================================================

	/** Todas las cuentas de la plataforma, mas recientes primero. */
	@GetMapping("/usuarios")
	public List<UsuarioDtos.UsuarioResponse> usuarios() {
		return usuarios.listarTodos();
	}

	/** Cambia rol y/o estado de una cuenta. El admin no se toca a si mismo. */
	@PatchMapping("/usuarios/{usuarioId}")
	public UsuarioDtos.UsuarioResponse actualizarUsuario(@PathVariable UUID usuarioId,
			@RequestBody UsuarioDtos.AdminActualizarRequest request) {
		return usuarios.actualizar(usuarioId, request.rol(), request.activo());
	}

	// =====================================================================
	// PEDIDOS
	// =====================================================================

	/** Todos los pedidos de la plataforma, mas recientes primero. */
	@GetMapping("/pedidos")
	public List<PedidoDtos.PedidoResponse> pedidos() {
		currentUser.actualAdmin();
		return pedidos.todos();
	}

	/**
	 * Anula un pedido desde el panel. Va por el mismo cancelar del
	 * servicio: mismas reglas de estados (no se cancela lo entregado o
	 * en camino) y devuelve el stock al producto.
	 */
	@PatchMapping("/pedidos/{pedidoId}/cancelar")
	public PedidoDtos.PedidoDetalleResponse cancelarPedido(@PathVariable UUID pedidoId) {
		Usuario admin = currentUser.actualAdmin();
		return pedidos.cancelar(pedidoId, admin);
	}
}