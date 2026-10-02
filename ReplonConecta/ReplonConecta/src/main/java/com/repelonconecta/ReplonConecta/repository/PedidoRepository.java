package com.repelonconecta.ReplonConecta.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.repelonconecta.ReplonConecta.entity.EstadoPedido;
import com.repelonconecta.ReplonConecta.entity.Pedido;

/**
 * Acceso a pedidos.
 *
 * NOTA sobre el JPQL: los nombres de los enums van con el paquete
 * completo dentro de las queries a proposito. El parser de Spring Data 4
 * NO acepta la sentencia "import" de JPQL: si se usa, falla al crear el
 * repositorio con "mismatched input 'import'". Es un detalle que solo se
 * ve al levantar el contexto, no al compilar.
 */
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

	List<Pedido> findByCompradorIdOrderByCreadoEnDesc(UUID compradorId);

	List<Pedido> findByNegocioIdOrderByCreadoEnDesc(UUID negocioId);

	/** Cuantos pedidos ha recibido un negocio en total. Para el admin. */
	long countByNegocioId(UUID negocioId);

	/** Pedidos que el negocio tiene sin despachar. Alimenta el badge del panel. */
	List<Pedido> findByNegocioIdAndEstadoInOrderByCreadoEnAsc(UUID negocioId, List<EstadoPedido> estados);

	List<Pedido> findByEstadoInOrderByCreadoEnDesc(List<EstadoPedido> estados);

	/**
	 * Ventas de un negocio desde una fecha.
	 *
	 * Excluye CANCELADO y RECHAZADO a proposito: un pedido que no se
	 * entrego no es una venta, y sumarlos inflaria las metricas del
	 * panel con dinero que nunca entro.
	 */
	@Query("""
			SELECT COALESCE(SUM(p.total), 0) FROM Pedido p
			WHERE p.negocio.id = :negocioId
			  AND p.creadoEn >= :desde
			  AND p.estado NOT IN (com.repelonconecta.ReplonConecta.entity.EstadoPedido.CANCELADO,
			                      com.repelonconecta.ReplonConecta.entity.EstadoPedido.RECHAZADO)
			""")
	long ventasDesde(@Param("negocioId") UUID negocioId, @Param("desde") Instant desde);

	/**
	 * Conteo de pedidos de un negocio en una ventana de tiempo.
	 *
	 * Existe para que las metricas no traigan la lista completa de pedidos
	 * y la cuenten en memoria: con el historial de un negocio activo eso
	 * son miles de filas por cada recarga de la pantalla.
	 */
	@Query("""
			SELECT COUNT(p) FROM Pedido p
			WHERE p.negocio.id = :negocioId
			  AND p.creadoEn >= :desde
			  AND p.estado NOT IN (com.repelonconecta.ReplonConecta.entity.EstadoPedido.CANCELADO,
			                      com.repelonconecta.ReplonConecta.entity.EstadoPedido.RECHAZADO)
			""")
	long contarVentasDesde(@Param("negocioId") UUID negocioId, @Param("desde") Instant desde);

	/** Pedidos recibidos y en preparacion: lo que falta por despachar. */
	@Query("""
			SELECT COUNT(p) FROM Pedido p
			WHERE p.negocio.id = :negocioId
			  AND p.estado IN (com.repelonconecta.ReplonConecta.entity.EstadoPedido.PEDIDO_RECIBIDO,
			                   com.repelonconecta.ReplonConecta.entity.EstadoPedido.EN_PREPARACION)
			""")
	long contarSinDespachar(@Param("negocioId") UUID negocioId);

	/** Igual que ventasDesde pero para toda la plataforma (admin). */
	@Query("""
			SELECT COALESCE(SUM(p.total), 0) FROM Pedido p
			WHERE p.creadoEn >= :desde
			  AND p.estado NOT IN (com.repelonconecta.ReplonConecta.entity.EstadoPedido.CANCELADO,
			                      com.repelonconecta.ReplonConecta.entity.EstadoPedido.RECHAZADO)
			""")
	long ventasTotalesDesde(@Param("desde") Instant desde);
}