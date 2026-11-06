package com.repelonconecta.RepelonConecta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.CulturaDtos;
import com.repelonconecta.RepelonConecta.service.CulturaService;
import com.repelonconecta.RepelonConecta.service.CurrentUserService;

import jakarta.validation.Valid;

/**
 * Publicaciones de Cultura (/cultura).
 *
 * El GET es público (la página lo pide sin sesión); escribir exige rol
 * ADMIN, verificado aquí y otra vez en SecurityConfig. Mismo patrón que
 * las zonas turísticas en ZonaTuristicaController.
 */
@RestController
@RequestMapping("/api/cultura")
public class CulturaController {

	private final CulturaService cultura;
	private final CurrentUserService currentUser;

	public CulturaController(CulturaService cultura, CurrentUserService currentUser) {
		this.cultura = cultura;
		this.currentUser = currentUser;
	}

	/** Feed completo, del más reciente al más viejo. Sin sesión. */
	@GetMapping("/publicaciones")
	public List<CulturaDtos.PublicacionResponse> publicaciones() {
		return cultura.publicaciones();
	}

	@PostMapping("/publicaciones")
	@ResponseStatus(HttpStatus.CREATED)
	public CulturaDtos.PublicacionResponse crear(
			@Valid @RequestBody CulturaDtos.PublicacionRequest request) {
		currentUser.actualAdmin();
		return cultura.crear(request);
	}

	@PutMapping("/publicaciones/{publicacionId}")
	public CulturaDtos.PublicacionResponse actualizar(
			@PathVariable UUID publicacionId,
			@Valid @RequestBody CulturaDtos.PublicacionRequest request) {
		currentUser.actualAdmin();
		return cultura.actualizar(publicacionId, request);
	}

	@DeleteMapping("/publicaciones/{publicacionId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable UUID publicacionId) {
		currentUser.actualAdmin();
		cultura.eliminar(publicacionId);
	}
}
