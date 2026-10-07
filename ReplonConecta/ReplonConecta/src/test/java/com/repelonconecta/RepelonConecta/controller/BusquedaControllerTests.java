package com.repelonconecta.RepelonConecta.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Prueba de la puerta de entrada: GET /api/buscar tiene que responder
 * 200 SIN token (es la primera pantalla de la app) y con el resultado
 * completo que el frontend necesita para pintar lista y mapa.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BusquedaControllerTests {

	@Autowired
	private MockMvc mvc;

	@Test
	void buscaSinSesionYNegocioEnLaMismaRespuesta() throws Exception {
		mvc.perform(get("/api/buscar").param("q", "20 kilos de yuca"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].productoNombre").value("Yuca"))
				.andExpect(jsonPath("$[0].unidad").value("KILO"))
				.andExpect(jsonPath("$[0].negocioNombre").value("Agro Repelón"))
				.andExpect(jsonPath("$[0].barrio").value("Vereda Rotinet"))
				.andExpect(jsonPath("$[0].whatsapp").isNotEmpty());
	}

	@Test
	void consultaVaciaRespondeElCatalogoDelAlcance() throws Exception {
		mvc.perform(get("/api/buscar"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(8));
	}
}
