package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.RepelonConecta.entity.CulturaPublicacion;

/**
 * Publicaciones de Cultura.
 *
 * El orden es el del feed: fecha más reciente primero; dos publicaciones
 * del mismo día se desempatan por creación (la última quedó arriba).
 */
public interface CulturaPublicacionRepository extends JpaRepository<CulturaPublicacion, UUID> {

	List<CulturaPublicacion> findAllByOrderByFechaDescCreadoEnDesc();
}
