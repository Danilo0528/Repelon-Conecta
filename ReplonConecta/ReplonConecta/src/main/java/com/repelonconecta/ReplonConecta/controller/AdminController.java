package com.repelonconecta.ReplonConecta.controller;

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

import com.repelonconecta.ReplonConecta.dto.NegocioDtos;
import com.repelonconecta.ReplonConecta.service.AdminService;
import com.repelonconecta.ReplonConecta.service.CurrentUserService;

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

	public AdminController(AdminService admin, CurrentUserService currentUser) {
		this.admin = admin;
		this.currentUser = currentUser;
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
}