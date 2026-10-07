package com.repelonconecta.RepelonConecta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.RepelonConecta.entity.ConfigTexto;

public interface ConfigTextoRepository extends JpaRepository<ConfigTexto, String> {

	List<ConfigTexto> findByClaveStartingWithOrderByClaveAsc(String prefijo);
}
