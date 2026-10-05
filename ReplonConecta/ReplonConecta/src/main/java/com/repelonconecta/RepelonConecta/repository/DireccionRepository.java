package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.RepelonConecta.entity.Direccion;

public interface DireccionRepository extends JpaRepository<Direccion, UUID> {

	List<Direccion> findByUsuarioIdOrderByPredeterminadaDescCreadoEnDesc(UUID usuarioId);

	List<Direccion> findByUsuarioIdAndPredeterminadaTrue(UUID usuarioId);
}