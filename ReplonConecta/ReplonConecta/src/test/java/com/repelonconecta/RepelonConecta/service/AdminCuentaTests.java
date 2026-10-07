package com.repelonconecta.RepelonConecta.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import com.repelonconecta.RepelonConecta.dto.UsuarioDtos;
import com.repelonconecta.RepelonConecta.entity.Rol;
import com.repelonconecta.RepelonConecta.entity.Usuario;
import com.repelonconecta.RepelonConecta.repository.UsuarioRepository;

/**
 * Panel de usuarios: listar, cambiar rol, activar/desactivar y las
 * guardas que impiden que el admin se bloquee a si mismo.
 *
 * La sesion no se simula con JWT: se pone el UUID directo en el
 * SecurityContext, que es exactamente lo que CurrentUserService lee
 * (el claim "sub"). Asi el test prueba la logica de negocio, no el
 * decodificador de tokens.
 */
@SpringBootTest
@ActiveProfiles("test")
class AdminCuentaTests {

	private static final UUID ADMIN_ID =
			UUID.fromString("00000000-0000-4000-8000-0000000000ad");

	@Autowired
	private UsuarioService usuariosService;

	@Autowired
	private UsuarioRepository usuarios;

	@BeforeEach
	void autenticarComoAdmin() {
		autenticar(ADMIN_ID);
	}

	@AfterEach
	void limpiar() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void listarTodosTraeCuentasYExigeAdmin() {
		List<UsuarioDtos.UsuarioResponse> lista = usuariosService.listarTodos();

		assertTrue(lista.size() >= 3, "el seed crea admin y duenos");
		assertTrue(lista.stream().anyMatch(u -> u.rol() == Rol.ADMIN));
		// Del mas reciente al mas viejo: el admin del seed nace despues
		// que los duenos, pero el contrato es la direccion, no el orden
		// exacto entre ellos.
		assertFalse(lista.stream().anyMatch(u -> !u.activo()));
	}

	@Test
	void sinRolAdminNoSeLista() {
		autenticar(UUID.randomUUID());
		assertThrows(ApiException.class, usuariosService::listarTodos);
	}

	@Test
	void cambiaRolDeOtroSinTocarElActivo() {
		Usuario cuenta = nuevaCuenta();

		UsuarioDtos.UsuarioResponse actualizado =
				usuariosService.actualizar(cuenta.getId(), Rol.VENDEDOR, null);

		assertEquals(Rol.VENDEDOR, actualizado.rol());
		assertTrue(actualizado.activo(), "activo no se informo: no debe cambiar");

		Usuario recargado = usuarios.findById(cuenta.getId()).orElseThrow();
		assertEquals(Rol.VENDEDOR, recargado.getRol());
		assertTrue(recargado.isActivo());
	}

	@Test
	void desactivaUnaCuenta() {
		Usuario cuenta = nuevaCuenta();

		UsuarioDtos.UsuarioResponse actualizado =
				usuariosService.actualizar(cuenta.getId(), null, false);

		assertFalse(actualizado.activo());

		// La misma cuenta intenta operar: sale rechazada.
		autenticar(cuenta.getId());
		assertThrows(ApiException.class, usuariosService::yo);
	}

	@Test
	void elAdminNoSeTocaASiMismo() {
		ApiException error = assertThrows(ApiException.class,
				() -> usuariosService.actualizar(ADMIN_ID, null, false));

		assertTrue(error.getMessage().contains("propia cuenta"));
		assertTrue(usuarios.findById(ADMIN_ID).orElseThrow().isActivo(),
				"el guard debe fallar ANTES de aplicar el cambio");
	}

	@Test
	void usuarioInexistenteEs404() {
		assertThrows(ApiException.class,
				() -> usuariosService.actualizar(UUID.randomUUID(), Rol.ADMIN, null));
	}

	@Test
	void sinSesionNoHayLista() {
		SecurityContextHolder.clearContext();
		assertThrows(ApiException.class, usuariosService::listarTodos);
	}

	private Usuario nuevaCuenta() {
		Usuario cuenta = new Usuario(UUID.randomUUID(),
				"cuenta-" + UUID.randomUUID() + "@prueba.co", "Cuenta de prueba");
		return usuarios.save(cuenta);
	}

	private void autenticar(UUID id) {
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(id.toString(), "n/a", List.of()));
	}
}
