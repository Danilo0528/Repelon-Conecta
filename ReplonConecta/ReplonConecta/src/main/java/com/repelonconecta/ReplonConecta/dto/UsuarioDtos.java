package com.repelonconecta.ReplonConecta.dto;

import java.time.Instant;
import java.util.UUID;

import com.repelonconecta.ReplonConecta.entity.Rol;

/** Perfil del usuario que ya existe en Supabase. */
public final class UsuarioDtos {

	private UsuarioDtos() {
	}

	public record UsuarioResponse(
			UUID id,
			String email,
			String nombre,
			String telefono,
			Rol rol,
			boolean activo,
			boolean tieneNegocio,
			Instant creadoEn) {
	}
}