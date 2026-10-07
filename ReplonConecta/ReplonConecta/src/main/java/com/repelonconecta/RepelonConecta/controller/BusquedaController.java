package com.repelonconecta.RepelonConecta.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.BusquedaDtos;
import com.repelonconecta.RepelonConecta.service.BusquedaService;

/**
 * Buscador publico de productos.
 *
 * GET /api/buscar?q=yuca&categoria=agro&barrio=Centro
 *
 * Los tres parametros son opcionales. Sin ninguno devuelve el catalogo
 * completo del alcance, asi el home y la pantalla de busqueda pueden
 * usar el mismo endpoint. No pide sesion: buscar es la puerta de
 * entrada de la app y tiene que funcionar para cualquiera.
 */
@RestController
@RequestMapping("/api")
public class BusquedaController {

	private final BusquedaService busqueda;

	public BusquedaController(BusquedaService busqueda) {
		this.busqueda = busqueda;
	}

	@GetMapping("/buscar")
	public List<BusquedaDtos.ResultadoBusquedaResponse> buscar(
			@RequestParam(required = false) String q,
			@RequestParam(required = false) String categoria,
			@RequestParam(required = false) String barrio) {

		return busqueda.buscar(q, categoria, barrio);
	}
}
