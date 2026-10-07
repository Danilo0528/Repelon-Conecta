package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.repelonconecta.RepelonConecta.entity.Negocio;

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
	 *
	 * El alcance se aplica con NOT EXISTS: un negocio que tenga al menos
	 * un producto de una categoria fuera de :alcance (ferreteria,
	 * drogueria, tienda...) no aparece para el comprador, aunque sus
	 * demas productos sean del proyecto. Sin productos es visible: no
	 * hay nada fuera de alcance que ocultar.
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
			  AND NOT EXISTS (
			        SELECT p FROM Producto p
			        WHERE p.negocio = n
			          AND p.categoria IS NOT NULL
			          AND p.categoria.slug NOT IN :alcance)
			ORDER BY n.destacado DESC, n.nombre ASC
			""")
	List<Negocio> buscarPublico(@Param("texto") String texto,
			@Param("barrio") String barrio,
			@Param("abierto") Boolean abierto,
			@Param("categoriaId") UUID categoriaId,
			@Param("alcance") List<String> alcance);

	/**
	 * Negocios destacados para la franja superior del home: mismas
	 * reglas de visibilidad que el catalogo (aprobado + alcance).
	 */
	@Query("""
			SELECT n FROM Negocio n
			WHERE n.aprobado = true AND n.destacado = true
			  AND NOT EXISTS (
			        SELECT p FROM Producto p
			        WHERE p.negocio = n
			          AND p.categoria IS NOT NULL
			          AND p.categoria.slug NOT IN :alcance)
			ORDER BY n.nombre ASC
			""")
	List<Negocio> destacadosPublicos(@Param("alcance") List<String> alcance);

	/**
	 * Barrios distintos que tienen negocios: alimenta el filtro de zona.
	 * Solo cuenta barrios visibles para el comprador, para que el filtro
	 * no promita una zona donde todo esta oculto.
	 */
	@Query("""
			SELECT DISTINCT n.barrio FROM Negocio n
			WHERE n.aprobado = true
			  AND n.barrio IS NOT NULL
			  AND NOT EXISTS (
			        SELECT p FROM Producto p
			        WHERE p.negocio = n
			          AND p.categoria IS NOT NULL
			          AND p.categoria.slug NOT IN :alcance)
			ORDER BY n.barrio
			""")
	List<String> barriosPublicos(@Param("alcance") List<String> alcance);

	/** Todos los negocios, para el panel del admin. */
	List<Negocio> findAllByOrderByCreadoEnDesc();
}