package com.repelonconecta.RepelonConecta.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Panel de categorias: crear, listar (activas y apagadas) y desactivar,
 * con las guardas de rol en la puerta.
 *
 * A diferencia de los tests de servicio, aqui se entra por HTTP con un
 * JWT firmado con el secreto del perfil test: asi queda cubierto el
 * filtro de seguridad de punta a punta (el mismo camino que recorre el
 * navegador), no solo la logica interna.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminCategoriaTests {

	private static final UUID ADMIN_ID =
			UUID.fromString("00000000-0000-4000-8000-0000000000ad");
	private static final String SECRETO =
			"secreto-solo-para-tests-no-usar-en-produccion";

	@Autowired
	private MockMvc mvc;

	@Autowired
	private ObjectMapper json;

	@Test
	void crearListarYDesactivarComoAdmin() throws Exception {
		String slug = "categoria-prueba-" + System.nanoTime();
		String cuerpo = json.writeValueAsString(
				Map.of("nombre", "Categoria Prueba", "slug", slug, "icono", "prueba"));

		String creada = mvc.perform(post("/api/categorias")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo)
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.slug").value(slug))
				.andExpect(jsonPath("$.activa").value(true))
				.andReturn().getResponse().getContentAsString();
		String id = json.readTree(creada).get("id").asText();

		// El admin la ve activa en su listado (activas + apagadas).
		assertTrue(adminTiene(slug, true), "recien creada: activa en /api/admin/categorias");

		// Desactivar no borra: la fila sigue ahi, pero apagada.
		mvc.perform(delete("/api/categorias/" + id)
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isNoContent());
		assertTrue(adminTiene(slug, false), "desactivada: el admin aun la ve");

		// El publico ya no.
		String publica = mvc.perform(get("/api/categorias"))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		assertFalse(publica.contains(slug), "desactivada no aparece al comprador");
	}

	@Test
	void sinRolAdminNoLista() throws Exception {
		mvc.perform(get("/api/admin/categorias")
						.header("Authorization", conToken(UUID.randomUUID())))
				.andExpect(status().isForbidden());
	}

	@Test
	void sinSesionNoSeCrea() throws Exception {
		String cuerpo = json.writeValueAsString(
				Map.of("nombre", "Sin Sesion", "slug", "sin-sesion"));

		mvc.perform(post("/api/categorias")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo))
				.andExpect(status().isUnauthorized());
	}

	/** Busca el slug en GET /api/admin/categorias y compara el estado. */
	private boolean adminTiene(String slug, boolean activa) throws Exception {
		String lista = mvc.perform(get("/api/admin/categorias")
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();

		for (JsonNode c : json.readTree(lista)) {
			if (slug.equals(c.get("slug").asText())) {
				assertEquals(activa, c.get("activa").asBoolean(),
						"estado de " + slug + " en el listado admin");
				return true;
			}
		}
		return false;
	}

	/** Bearer HS256 con el secreto del perfil test, como el de verdad. */
	private String conToken(UUID id) {
		long ahora = System.currentTimeMillis() / 1000;
		String base = b64("{\"alg\":\"HS256\",\"typ\":\"JWT\"}")
				+ "." + b64("{\"sub\":\"" + id + "\",\"iat\":" + ahora
						+ ",\"exp\":" + (ahora + 3600) + "}");
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(SECRETO.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
			String firma = Base64.getUrlEncoder().withoutPadding()
					.encodeToString(mac.doFinal(base.getBytes(StandardCharsets.UTF_8)));
			return "Bearer " + base + "." + firma;
		} catch (GeneralSecurityException e) {
			throw new IllegalStateException("No se pudo firmar el token de prueba", e);
		}
	}

	private static String b64(String texto) {
		return Base64.getUrlEncoder().withoutPadding()
				.encodeToString(texto.getBytes(StandardCharsets.UTF_8));
	}
}
