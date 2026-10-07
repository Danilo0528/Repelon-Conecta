package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.repelonconecta.RepelonConecta.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, UUID> {

	/** Catalogo de un negocio. Filtra por categoria si llega. */
	List<Producto> findByNegocioIdOrderByNombreAsc(UUID negocioId, UUID categoriaId);

	/** Solo lo que el comprador puede agregar al carrito. */
	List<Producto> findByNegocioIdAndDisponibleTrueOrderByNombreAsc(UUID negocioId);

	long countByNegocioId(UUID negocioId);

	/** Productos apagados: los que el vendedor marco como no disponibles. */
	long countByNegocioIdAndDisponibleFalse(UUID negocioId);

	/**
	 * Candidatos del buscador publico: productos de las categorias del
	 * alcance (los slugs que llegan en :slugs) en negocios aprobados,
	 * con filtros opcionales de categoria y barrio.
	 *
	 * El filtro por TEXTO no esta aqui a proposito: lo hace el servicio
	 * token por token para poder descartar numeros y palabras de relleno
	 * ("20 kilos de yuca" termina buscando "yuca"), que un LIKE de una
	 * sola pieza no puede hacer.
	 */
	@Query("""
			SELECT p FROM Producto p
			WHERE p.negocio.aprobado = true
			  AND p.categoria.slug IN :slugs
			  AND (:categoriaSlug IS NULL OR p.categoria.slug = :categoriaSlug)
			  AND (:barrio IS NULL OR LOWER(p.negocio.barrio) = LOWER(CAST(:barrio AS string)))
			ORDER BY p.negocio.destacado DESC, p.nombre ASC
			""")
	List<Producto> buscarCandidatos(@Param("slugs") List<String> slugs,
			@Param("categoriaSlug") String categoriaSlug,
			@Param("barrio") String barrio);
}