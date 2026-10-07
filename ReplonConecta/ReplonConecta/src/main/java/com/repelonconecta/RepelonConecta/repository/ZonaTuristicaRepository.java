package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.RepelonConecta.entity.ZonaTuristica;

public interface ZonaTuristicaRepository extends JpaRepository<ZonaTuristica, UUID> {

	List<ZonaTuristica> findAllByOrderByOrdenAsc();
}
