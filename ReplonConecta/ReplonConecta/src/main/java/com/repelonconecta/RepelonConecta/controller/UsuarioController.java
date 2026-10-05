package com.repelonconecta.RepelonConecta.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.UsuarioDtos;
import com.repelonconecta.RepelonConecta.service.UsuarioService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Perfil del usuario actual.
 *
 * No hay endpoint de registro: la cuenta se crea en Supabase y la fila en
 * la base la crea la primera llamada a GET /api/me. Asi el frontend tiene
 * una sola fuente de verdad para "quien soy" y no hay dos caminos que
 * puedan desincronizarse.
 */
@RestController
@RequestMapping("/api/me")
public class UsuarioController {

	private final UsuarioService usuarios;

	public UsuarioController(UsuarioService usuarios) {
		this.usuarios = usuarios;
	}

	@GetMapping
	public UsuarioDtos.UsuarioResponse yo() {
		return usuarios.yo();
	}

	/** Actualizar nombre y telefono. El rol no se cambia por aqui. */
	@PutMapping
	public UsuarioDtos.UsuarioResponse actualizar(@Valid @RequestBody PerfilRequest request) {
		return usuarios.actualizarPerfil(request.nombre(), request.telefono());
	}

	/**
	 * Boton "Quiero vender en Repelon Market". Marca el perfil como
	 * vendedor; el negocio se registra aparte en /api/negocios.
	 */
	@PatchMapping("/vendedor")
	public UsuarioDtos.UsuarioResponse registrarComoVendedor() {
		return usuarios.registrarComoVendedor();
	}

	public record PerfilRequest(
			@Size(max = 120, message = "El nombre no puede pasar de 120 caracteres")
			String nombre,

			@Pattern(regexp = "^$|^[0-9+\\s-]{7,20}$",
					message = "Telefono invalido: solo numeros, espacios, + y -")
			String telefono) {
	}
}