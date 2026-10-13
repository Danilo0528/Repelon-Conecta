package com.repelonconecta.RepelonConecta.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import com.repelonconecta.RepelonConecta.repository.ConfigTextoRepository;

/**
 * Textos del home: guardar, leer, restaurar por defecto (valor vacio)
 * y la lista blanca de claves.
 */
@SpringBootTest
@ActiveProfiles("test")
class ConfigTextosTests {

	private static final UUID ADMIN_ID =
			UUID.fromString("00000000-0000-4000-8000-0000000000ad");

	@Autowired
	private ConfigService config;

	@Autowired
	private ConfigTextoRepository textos;

	@AfterEach
	void limpiar() {
		textos.deleteAll();
		SecurityContextHolder.clearContext();
	}

	@Test
	void guardaLeeYRestauraPorDefecto() {
		autenticarComoAdmin();

		Map<String, String> guardado = config.actualizarTextosInicio(
				Map.of("inicio.hero.titulo1", "  El pueblo a la mano  "));
		assertEquals("El pueblo a la mano", guardado.get("inicio.hero.titulo1"));

		// Leer no necesita sesion: el home lo pide como invitado.
		SecurityContextHolder.clearContext();
		assertEquals("El pueblo a la mano",
				config.textosInicio().get("inicio.hero.titulo1"));

		// Valor vacio = borrar el override (vuelve al defecto).
		autenticarComoAdmin();
		Map<String, String> trasBorrar = config.actualizarTextosInicio(
				Map.of("inicio.hero.titulo1", "   "));
		assertFalse(trasBorrar.containsKey("inicio.hero.titulo1"));
		assertTrue(textos.findById("inicio.hero.titulo1").isEmpty());
	}

	@Test
	void claveFueraDeLaListaBlancaEs400() {
		autenticarComoAdmin();

		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of("inicio.hack", "no deberia guardarse")));
		assertTrue(textos.findById("inicio.hack").isEmpty());
	}

	@Test
	void sinRolAdminNoGuarda() {
		autenticar(UUID.randomUUID());

		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of("inicio.hero.titulo1", "x")));
	}

	@Test
	void cuerpoVacioEs400() {
		autenticarComoAdmin();
		assertThrows(ApiException.class,
				() -> config.actualizarTextosInicio(Map.of()));
	}

	@Test
	void valorDemasiadoLargoEs400() {
		autenticarComoAdmin();

		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of("inicio.hero.titulo1", "x".repeat(2001))));
	}

	@Test
	void listarSoloDevuelveClavesConocidas() {
		textos.save(new com.repelonconecta.RepelonConecta.entity.ConfigTexto(
				"inicio.vieja", "basura de una version anterior"));

		Map<String, String> actuales = config.textosInicio();
		assertFalse(actuales.containsKey("inicio.vieja"),
				"claves huerfanas no deben filtrarse al home");
	}

	// ---- El deslizamiento automatico del hero ------------------------

	@Test
	void guardaLeeYRestauraLasImagenesDelHero() {
		autenticarComoAdmin();

		String lista = "[\"/img/hero.jpg\",\"https://cdn.repelon.co/campo.png\"]";
		Map<String, String> guardado =
				config.actualizarTextosInicio(Map.of(ConfigService.CLAVE_IMAGENES_HERO, lista));
		assertEquals(lista, guardado.get(ConfigService.CLAVE_IMAGENES_HERO));

		SecurityContextHolder.clearContext();
		assertEquals(lista, config.textosInicio().get(ConfigService.CLAVE_IMAGENES_HERO));

		// Vacio = volver a las cinco imagenes que trae el frontend.
		autenticarComoAdmin();
		Map<String, String> trasBorrar = config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, "  "));
		assertFalse(trasBorrar.containsKey(ConfigService.CLAVE_IMAGENES_HERO));
	}

	@Test
	void imagenesDelHeroRechazanJsonRoto() {
		autenticarComoAdmin();

		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, "no soy una lista")));
		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, "{}")));
		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, "[1, 2]")));
		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, "[]")));
		assertTrue(textos.findById(ConfigService.CLAVE_IMAGENES_HERO).isEmpty(),
				"nada de lo rechazado debe quedar en la base");
	}

	@Test
	void imagenesDelHeroRechazanEsquemasQueElNavegadorNoCarga() {
		autenticarComoAdmin();

		assertThrows(ApiException.class, () -> config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, "[\"javascript:alert(1)\"]")));
	}

	@Test
	void imagenesDelHeroNoPasanDeDiez() {
		autenticarComoAdmin();

		String once = "[" + String.join(",", java.util.Collections.nCopies(11, "\"/img/a.jpg\"")) + "]";
		ApiException error = assertThrows(ApiException.class,
				() -> config.actualizarTextosInicio(
						Map.of(ConfigService.CLAVE_IMAGENES_HERO, once)));
		assertTrue(error.getMessage().contains("hasta"), error.getMessage());

		// Justo diez sí caben.
		String diez = "[" + String.join(",", java.util.Collections.nCopies(10, "\"/img/a.jpg\"")) + "]";
		assertEquals(diez, config.actualizarTextosInicio(
				Map.of(ConfigService.CLAVE_IMAGENES_HERO, diez))
				.get(ConfigService.CLAVE_IMAGENES_HERO));
	}


	private void autenticarComoAdmin() {
		autenticar(ADMIN_ID);
	}

	private void autenticar(UUID id) {
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(id.toString(), "n/a", List.of()));
	}
}
