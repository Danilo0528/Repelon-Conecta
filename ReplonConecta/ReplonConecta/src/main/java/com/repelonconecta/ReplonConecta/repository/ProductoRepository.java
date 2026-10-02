package com.repelonconecta.ReplonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.ReplonConecta.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, UUID> {

	/** Catalogo de un negocio. Filtra por categoria si llega. */
	List<Producto> findByNegocioIdOrderByNombreAsc(UUID negocioId, UUID categoriaId);

	/** Solo lo que el comprador puede agregar al carrito. */
	List<Producto> findByNegocioIdAndDisponibleTrueOrderByNombreAsc(UUID negocioId);

	long countByNegocioId(UUID negocioId);

	/** Productos apagados: los que el vendedor marco como no disponibles. */
	long countByNegocioIdAndDisponibleFalse(UUID negocioId);
}