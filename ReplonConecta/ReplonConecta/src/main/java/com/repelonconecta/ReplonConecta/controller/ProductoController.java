package com.repelonconecta.ReplonConecta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.ReplonConecta.dto.ProductoDtos;
import com.repelonconecta.ReplonConecta.service.ProductoService;

import jakarta.validation.Valid;

/**
 * Productos.
 *
 * El GET es publico (ver el catalogo no requiere cuenta). Todo lo demas
 * pasa por ProductoService, que verifica que el negocio pertenezca al
 * usuario antes de tocar nada.
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

	private final ProductoService productos;

	public ProductoController(ProductoService productos) {
		this.productos = productos;
	}

	/** Catalogo de un negocio, con filtro opcional por categoria. */
	@GetMapping("/negocio/{negocioId}")
	public List<ProductoDtos.ProductoResponse> porNegocio(
			@PathVariable UUID negocioId,
			@RequestParam(required = false) UUID categoriaId) {
		return productos.listar(negocioId, categoriaId);
	}

	@PostMapping("/negocio/{negocioId}")
	public ProductoDtos.ProductoResponse crear(@PathVariable UUID negocioId,
			@Valid @RequestBody ProductoDtos.ProductoRequest request) {
		return productos.crear(negocioId, request);
	}

	@PutMapping("/{productoId}")
	public ProductoDtos.ProductoResponse actualizar(@PathVariable UUID productoId,
			@Valid @RequestBody ProductoDtos.ProductoRequest request) {
		return productos.actualizar(productoId, request);
	}

	/**
	 * Interruptor disponible/no disponible. Es la accion mas frecuente
	 * del panel: el tendero la usa cuando se le acaba algo.
	 */
	@PatchMapping("/{productoId}/disponibilidad")
	public ProductoDtos.ProductoResponse cambiarDisponibilidad(@PathVariable UUID productoId,
			@RequestParam boolean disponible) {
		return productos.cambiarDisponibilidad(productoId, disponible);
	}

	@DeleteMapping("/{productoId}")
	@ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable UUID productoId) {
		productos.eliminar(productoId);
	}
}