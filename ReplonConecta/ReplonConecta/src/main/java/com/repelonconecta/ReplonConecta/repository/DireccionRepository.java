package com.repelonconecta.ReplonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.ReplonConecta.entity.Direccion;

public interface DireccionRepository extends JpaRepository<Direccion, UUID> {

	List<Direccion> findByUsuarioIdOrderByPredeterminadaDescCreadoEnDesc(UUID usuarioId);

	List<Direccion> findByUsuarioIdAndPredeterminadaTrue(UUID usuarioId);
}