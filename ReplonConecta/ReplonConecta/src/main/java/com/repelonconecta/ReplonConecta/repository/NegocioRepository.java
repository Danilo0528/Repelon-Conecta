package com.repelonconecta.ReplonConecta.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.repelonconecta.ReplonConecta.entity.Negocio;

public interface NegocioRepository extends JpaRepository<Negocio, UUID> {

	Optional<Negocio> findBySlug(String slug);

	List<Negocio> findByDuenoId(UUID duenoId);

	long countByAprobadoTrue();

	/**
	 * Catalogo visible para el comprador: solo negocios aprobados, con
	 * los filtros opcionales del buscador.
	 *
	 * Cada filtro se activa solo si llega con valor, asi que el mismo
	 * query sirve para el home (todo), la busqueda por texto, el filtro
	 * por barrio y el de "abierto ahora" sin escribir cuatro metodos.
	 *
	 * Los parametros null se comparan con "IS NULL" no funciona para
	 * este patron, por eso se prueban con <#param> de SpEL y las
	 * condiciones se injectan en el WHERE.
	 *
	 * El filtro por categoria usa EXISTS sobre productos: se quiere el
	 * negocio que TIENE productos de esa categoria, no el que tiene la
	 * categoria como atributo propio (no la tiene).
	 */
	@Query("""
			SELECT DISTINCT n FROM Negocio n
			WHERE n.aprobado = true
			  AND (:texto IS NULL OR LOWER(n.nombre) LIKE LOWER(CONCAT('%', CAST(:texto AS string), '%'))
			                    OR LOWER(COALESCE(n.descripcion, '')) LIKE LOWER(CONCAT('%', CAST(:texto AS string), '%')))
			  AND (:barrio IS NULL OR LOWER(n.barrio) = LOWER(CAST(:barrio AS string)))
			  AND (:abierto IS NULL OR n.abierto = :abierto)
			  AND (:categoriaId IS NULL OR EXISTS (
			        SELECT p FROM Producto p
			        WHERE p.negocio = n AND p.categoria.id = :categoriaId))
			ORDER BY n.destacado DESC, n.nombre ASC
			""")
	List<Negocio> buscarPublico(@Param("texto") String texto,
			@Param("barrio") String barrio,
			@Param("abierto") Boolean abierto,
			@Param("categoriaId") UUID categoriaId);

	/** Negocios destacados para la franja superior del home. */
	List<Negocio> findByAprobadoTrueAndDestacadoTrueOrderByNombreAsc();

	/** Barrios distintos que tienen negocios: alimenta el filtro de zona. */
	@Query("SELECT DISTINCT n.barrio FROM Negocio n WHERE n.aprobado = true AND n.barrio IS NOT NULL ORDER BY n.barrio")
	List<String> barriosPublicos();

	/** Todos los negocios, para el panel del admin. */
	List<Negocio> findAllByOrderByCreadoEnDesc();
}