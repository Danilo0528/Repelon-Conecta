package com.repelonconecta.RepelonConecta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.CatalogoDtos;
import com.repelonconecta.RepelonConecta.dto.MetricasDtos;
import com.repelonconecta.RepelonConecta.service.CatalogoService;
import com.repelonconecta.RepelonConecta.service.CurrentUserService;

import jakarta.validation.Valid;

/**
 * Categorias, direcciones y metricas.
 *
 * El GET de categorias es publico (alimenta la pantalla de inicio). El
 * resto exige sesion.
 */
@RestController
@RequestMapping("/api")
public class CatalogoController {

	private final CatalogoService catalogo;
	private final CurrentUserService currentUser;

	public CatalogoController(CatalogoService catalogo, CurrentUserService currentUser) {
		this.catalogo = catalogo;
		this.currentUser = currentUser;
	}

	// =====================================================================
	// CATEGORIAS
	// =====================================================================

	@GetMapping("/categorias")
	public List<CatalogoDtos.CategoriaResponse> categorias() {
		return catalogo.categorias();
	}

	@PostMapping("/categorias")
	@ResponseStatus(HttpStatus.CREATED)
	public CatalogoDtos.CategoriaResponse crearCategoria(@Valid @RequestBody CategoriaRequest request) {
		currentUser.actualAdmin();
		return catalogo.crearCategoria(request.nombre(), request.slug(), request.icono());
	}

	/** Desactiva la categoria. No la borra: sus productos la seguirian usando. */
	@DeleteMapping("/categorias/{categoriaId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminarCategoria(@PathVariable UUID categoriaId) {
		currentUser.actualAdmin();
		catalogo.eliminarCategoria(categoriaId);
	}

	/** Todas las categorias (activas y apagadas). Solo para el panel. */
	@GetMapping("/admin/categorias")
	public List<CatalogoDtos.CategoriaResponse> categoriasAdmin() {
		currentUser.actualAdmin();
		return catalogo.categoriasTodas();
	}

	// =====================================================================
	// DIRECCIONES
	// =====================================================================

	@GetMapping("/direcciones")
	public List<CatalogoDtos.DireccionResponse> direcciones() {
		return catalogo.misDirecciones();
	}

	@PostMapping("/direcciones")
	@ResponseStatus(HttpStatus.CREATED)
	public CatalogoDtos.DireccionResponse guardarDireccion(
			@Valid @RequestBody CatalogoDtos.DireccionRequest request) {
		return catalogo.guardarDireccion(request);
	}

	@DeleteMapping("/direcciones/{direccionId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminarDireccion(@PathVariable UUID direccionId) {
		catalogo.eliminarDireccion(direccionId);
	}

	// =====================================================================
	// METRICAS
	// =====================================================================

	/** Cifras del panel del vendedor. */
	@GetMapping("/negocios/{negocioId}/metricas")
	public MetricasDtos.MetricasVendedorResponse metricas(@PathVariable UUID negocioId) {
		return catalogo.metricasVendedor(negocioId);
	}

	/** Cifras generales. Solo admin. */
	@GetMapping("/admin/metricas")
	public MetricasDtos.MetricasAdminResponse metricasAdmin() {
		return catalogo.metricasAdmin();
	}

	public record CategoriaRequest(
			@jakarta.validation.constraints.NotBlank(message = "El nombre es obligatorio")
			String nombre,

			String slug,

			String icono) {
	}
}