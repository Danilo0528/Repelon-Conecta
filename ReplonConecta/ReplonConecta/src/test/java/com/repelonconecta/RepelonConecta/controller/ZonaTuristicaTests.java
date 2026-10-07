package com.repelonconecta.RepelonConecta.controller;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

import tools.jackson.databind.ObjectMapper;

/**
 * Zonas turísticas: el GET público que sirve el home y el CRUD del
 * panel con las guardas de rol, de punta a punta por HTTP con un JWT
 * firmado con el secreto del perfil test.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ZonaTuristicaTests {

	private static final UUID ADMIN_ID =
			UUID.fromString("00000000-0000-4000-8000-0000000000ad");
	private static final String SECRETO =
			"secreto-solo-para-tests-no-usar-en-produccion";

	@Autowired
	private MockMvc mvc;

	@Autowired
	private ObjectMapper json;

	@Test
	void publicoListaLasZonasDelSeedSinSesion() throws Exception {
		mvc.perform(get("/api/zonas"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(6)))
				.andExpect(jsonPath("$[?(@.nombre=='Embalse del Guájaro')]").exists());
	}

	@Test
	void adminCreaEditaYBorra() throws Exception {
		String nombre = "Zona Prueba " + System.nanoTime();
		String cuerpo = json.writeValueAsString(Map.of(
				"nombre", nombre,
				"descripcion", "Para probar el CRUD de zonas",
				"direccion", "Calle 1 # 2-3, Repelón, Atlántico",
				"latitud", 10.49,
				"longitud", -75.12,
				"motivo", "agua"));

		String creada = mvc.perform(post("/api/zonas")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo)
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.nombre").value(nombre))
				.andExpect(jsonPath("$.motivo").value("agua"))
				.andReturn().getResponse().getContentAsString();
		String id = json.readTree(creada).get("id").asText();

		assertTrue(publicaContiene(nombre), "recién creada: visible sin sesión");

		String editado = nombre + " editada";
		mvc.perform(put("/api/zonas/" + id)
						.contentType(MediaType.APPLICATION_JSON)
						.content(json.writeValueAsString(Map.of(
								"nombre", editado,
								"direccion", "Calle 1 # 2-3, Repelón, Atlántico")))
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.nombre").value(editado));

		mvc.perform(delete("/api/zonas/" + id)
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isNoContent());
		assertFalse(publicaContiene(editado), "borrada: ya no aparece al público");
	}

	@Test
	void coordenadasIncompletasSeRechazan() throws Exception {
		String cuerpo = json.writeValueAsString(Map.of(
				"nombre", "Sin longitud",
				"direccion", "Calle 1 # 2-3, Repelón, Atlántico",
				"latitud", 10.49));

		mvc.perform(post("/api/zonas")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo)
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void sinRolAdminNoCrea() throws Exception {
		String cuerpo = json.writeValueAsString(Map.of(
				"nombre", "Zona Sin Rol",
				"direccion", "Calle 1 # 2-3, Repelón, Atlántico"));

		/*
		 * El token lleva un correo unico a proposito: sin fila en
		 * usuarios, actual() la crea con el email del JWT, y el correo
		 * por defecto ("sin-correo@...") ya existe de otros tests que
		 * comparten la misma H2.
		 */
		mvc.perform(post("/api/zonas")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo)
						.header("Authorization", conToken(UUID.randomUUID(),
								"sin-rol-zonas-" + System.nanoTime() + "@test.local")))
				.andExpect(status().isForbidden());
	}

	@Test
	void sinSesionNoSeCrea() throws Exception {
		String cuerpo = json.writeValueAsString(Map.of(
				"nombre", "Zona Sin Sesión",
				"direccion", "Calle 1 # 2-3, Repelón, Atlántico"));

		mvc.perform(post("/api/zonas")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void nombreVacioSeRechaza() throws Exception {
		String cuerpo = json.writeValueAsString(Map.of(
				"nombre", "   ",
				"direccion", "Calle 1 # 2-3, Repelón, Atlántico"));

		mvc.perform(post("/api/zonas")
						.contentType(MediaType.APPLICATION_JSON)
						.content(cuerpo)
						.header("Authorization", conToken(ADMIN_ID)))
				.andExpect(status().isBadRequest());
	}

	/** ¿El nombre aparece en el GET público? */
	private boolean publicaContiene(String nombre) throws Exception {
		String lista = mvc.perform(get("/api/zonas"))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
		return lista.contains(nombre);
	}

	/** Bearer HS256 con el secreto del perfil test, como el de verdad. */
	private String conToken(UUID id) {
		return conToken(id, null);
	}

	private String conToken(UUID id, String email) {
		long ahora = System.currentTimeMillis() / 1000;
		String cuerpo = "{\"sub\":\"" + id + "\",\"iat\":" + ahora
				+ ",\"exp\":" + (ahora + 3600)
				+ (email != null ? ",\"email\":\"" + email + "\"" : "") + "}";
		String base = b64("{\"alg\":\"HS256\",\"typ\":\"JWT\"}") + "." + b64(cuerpo);
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
