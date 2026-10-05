package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.RepelonConecta.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

	List<Categoria> findByActivaTrueOrderByOrdenAsc();

	List<Categoria> findAllByOrderByOrdenAsc();
}