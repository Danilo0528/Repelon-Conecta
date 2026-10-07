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

import com.repelonconecta.RepelonConecta.dto.ZonaDtos;
import com.repelonconecta.RepelonConecta.service.CurrentUserService;
import com.repelonconecta.RepelonConecta.service.ZonaTuristicaService;

import jakarta.validation.Valid;

/**
 * Zonas turísticas del home.
 *
 * El GET es público (el home lo pide sin sesión); escribir exige rol
 * ADMIN, verificado aquí y otra vez en SecurityConfig. Mismo patrón
 * que las categorías en CatalogoController.
 */
@RestController
@RequestMapping("/api")
public class ZonaTuristicaController {

	private final ZonaTuristicaService zonas;
	private final CurrentUserService currentUser;

	public ZonaTuristicaController(ZonaTuristicaService zonas, CurrentUserService currentUser) {
		this.zonas = zonas;
		this.currentUser = currentUser;
	}

	/** Zonas en el orden del home. Sin sesión. */
	@GetMapping("/zonas")
	public List<ZonaDtos.ZonaResponse> zonas() {
		return zonas.zonas();
	}

	@PostMapping("/zonas")
	@ResponseStatus(HttpStatus.CREATED)
	public ZonaDtos.ZonaResponse crear(@Valid @RequestBody ZonaDtos.ZonaRequest request) {
		currentUser.actualAdmin();
		return zonas.crear(request);
	}

	@PutMapping("/zonas/{zonaId}")
	public ZonaDtos.ZonaResponse actualizar(@PathVariable UUID zonaId,
			@Valid @RequestBody ZonaDtos.ZonaRequest request) {
		currentUser.actualAdmin();
		return zonas.actualizar(zonaId, request);
	}

	@DeleteMapping("/zonas/{zonaId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable UUID zonaId) {
		currentUser.actualAdmin();
		zonas.eliminar(zonaId);
	}
}
