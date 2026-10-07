package com.repelonconecta.RepelonConecta.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.service.ConfigService;

/**
 * Textos del home.
 *
 * GET es publico (el home lo pide sin sesion); PUT solo lo guarda el
 * admin, y la lista blanca de claves vive en ConfigService.
 */
@RestController
@RequestMapping("/api/inicio")
public class InicioController {

	private final ConfigService config;

	public InicioController(ConfigService config) {
		this.config = config;
	}

	@GetMapping("/textos")
	public Map<String, String> textos() {
		return config.textosInicio();
	}

	@PutMapping("/textos")
	public Map<String, String> actualizar(@RequestBody Map<String, String> cambios) {
		return config.actualizarTextosInicio(cambios);
	}
}
