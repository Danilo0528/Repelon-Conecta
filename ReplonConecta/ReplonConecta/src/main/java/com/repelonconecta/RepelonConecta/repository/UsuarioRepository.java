package com.repelonconecta.RepelonConecta.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.repelonconecta.RepelonConecta.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

	Optional<Usuario> findByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCase(String email);

	/** Todos los usuarios, del mas reciente al mas viejo. Para el admin. */
	List<Usuario> findAllByOrderByCreadoEnDesc();
}