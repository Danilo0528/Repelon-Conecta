package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.ProductoDtos;
import com.repelonconecta.RepelonConecta.entity.Categoria;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.CategoriaRepository;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;

@Service
public class ProductoService {

	private final ProductoRepository productos;
	private final CategoriaRepository categorias;
	private final NegocioService negocioService;
	private final CurrentUserService currentUser;

	public ProductoService(ProductoRepository productos, CategoriaRepository categorias,
			NegocioService negocioService, CurrentUserService currentUser) {
		this.productos = productos;
		this.categorias = categorias;
		this.negocioService = negocioService;
		this.currentUser = currentUser;
	}

	// =====================================================================
	// CONSULTA
	// =====================================================================

	/** Catalogo de un negocio, con filtro opcional por categoria. */
	public List<ProductoDtos.ProductoResponse> listar(UUID negocioId, UUID categoriaId) {
		return productos.findByNegocioIdOrderByNombreAsc(negocioId, categoriaId).stream()
				.map(NegocioService::aProducto)
				.toList();
	}

	// =====================================================================
	// CRUD DEL VENDEDOR
	// =====================================================================

	@Transactional
	public ProductoDtos.ProductoResponse crear(UUID negocioId, ProductoDtos.ProductoRequest request) {
		Usuario usuario = currentUser.actualVendedorOAdmin();

		// Verifica que el negocio es suyo ANTES de crear nada.
		Negocio negocio = negocioService.negocioDelUsuario(negocioId, usuario);

		Producto producto = new Producto(negocio, resolverCategoria(request.categoriaId()),
				request.nombre().trim(), request.precio());

		aplicar(producto, request);

		return NegocioService.aProducto(productos.save(producto));
	}

	@Transactional
	public ProductoDtos.ProductoResponse actualizar(UUID productoId,
			ProductoDtos.ProductoRequest request) {

		Usuario usuario = currentUser.actualVendedorOAdmin();

		Producto producto = productos.findById(productoId)
				.orElseThrow(() -> ApiException.noEncontrado("El producto"));

		negocioService.negocioDelUsuario(producto.getNegocio().getId(), usuario);

		if (request.nombre() != null && !request.nombre().isBlank()) {
			producto.setNombre(request.nombre().trim());
		}
		if (request.descripcion() != null) {
			producto.setDescripcion(request.descripcion());
		}
		if (request.precio() != null) {
			producto.setPrecio(request.precio());
		}
		if (request.imagenUrl() != null) {
			producto.setImagenUrl(request.imagenUrl().isBlank() ? null : request.imagenUrl().trim());
		}
		if (request.categoriaId() != null) {
			producto.setCategoria(resolverCategoria(request.categoriaId()));
		}
		if (request.disponible() != null) {
			producto.setDisponible(request.disponible());
		}
		if (request.stock() != null) {
			producto.setStock(request.stock());
		}

		// Si el stock bajo a cero, el producto se apaga solo.
		producto.ajustarDisponibilidad();
		producto.tocar();

		return NegocioService.aProducto(productos.save(producto));
	}

	/**
	 * Interruptor de disponibilidad. Es la operacion mas frecuente del
	 * panel: el tendero lo toca cuando se le acaba algo.
	 */
	@Transactional
	public ProductoDtos.ProductoResponse cambiarDisponibilidad(UUID productoId, boolean disponible) {
		Usuario usuario = currentUser.actualVendedorOAdmin();

		Producto producto = productos.findById(productoId)
				.orElseThrow(() -> ApiException.noEncontrado("El producto"));

		negocioService.negocioDelUsuario(producto.getNegocio().getId(), usuario);

		producto.setDisponible(disponible);

		// Al volver a encender un producto que aun tiene stock, se
		// respeta la decision del vendedor.
		producto.ajustarDisponibilidad();
		producto.tocar();

		return NegocioService.aProducto(productos.save(producto));
	}

	/**
	 * Borrar un producto.
	 *
	 * Los pedidos que ya lo compraron NO se borran: ItemPedido guarda
	 * nombre y precio en el momento de la compra. El producto queda
	 * borrado del catalogo pero el historial de ventas sigue entero.
	 */
	@Transactional
	public void eliminar(UUID productoId) {
		Usuario usuario = currentUser.actualVendedorOAdmin();

		Producto producto = productos.findById(productoId)
				.orElseThrow(() -> ApiException.noEncontrado("El producto"));

		negocioService.negocioDelUsuario(producto.getNegocio().getId(), usuario);

		productos.delete(producto);
	}

	// =====================================================================
	// UTILIDADES
	// =====================================================================

	private void aplicar(Producto producto, ProductoDtos.ProductoRequest request) {
		producto.setDescripcion(request.descripcion());
		producto.setImagenUrl(request.imagenUrl() == null || request.imagenUrl().isBlank()
				? null
				: request.imagenUrl().trim());

		if (request.disponible() != null) {
			producto.setDisponible(request.disponible());
		}

		producto.setStock(request.stock());
		producto.ajustarDisponibilidad();
		producto.tocar();
	}

	private Categoria resolverCategoria(UUID categoriaId) {
		if (categoriaId == null) {
			return null;
		}
		return categorias.findById(categoriaId)
				.orElseThrow(() -> ApiException.peticionInvalida("La categoria no existe"));
	}
}