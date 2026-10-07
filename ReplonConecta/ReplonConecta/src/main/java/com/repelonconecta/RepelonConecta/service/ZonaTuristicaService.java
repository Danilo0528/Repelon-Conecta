package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.ZonaDtos;
import com.repelonconecta.RepelonConecta.entity.ZonaTuristica;
import com.repelonconecta.RepelonConecta.repository.ZonaTuristicaRepository;

/**
 * Zonas turísticas del home.
 *
 * La lista pública es la que sirve el home; crear, editar y borrar es
 * trabajo del panel del estudiante (rol ADMIN, verificado en el
 * controller). A diferencia de las categorías, borrar una zona la
 * elimina de verdad: nada más apunta a ella.
 */
@Service
public class ZonaTuristicaService {

	private final ZonaTuristicaRepository zonas;

	public ZonaTuristicaService(ZonaTuristicaRepository zonas) {
		this.zonas = zonas;
	}

	public List<ZonaDtos.ZonaResponse> zonas() {
		return zonas.findAllByOrderByOrdenAsc().stream()
				.map(ZonaTuristicaService::aZona)
				.toList();
	}

	@Transactional
	public ZonaDtos.ZonaResponse crear(ZonaDtos.ZonaRequest request) {
		validarCoordenadas(request.latitud(), request.longitud());

		ZonaTuristica zona = new ZonaTuristica();
		aplicar(zona, request);
		if (request.orden() == null) {
			zona.setOrden((int) zonas.count());
		}
		return aZona(zonas.save(zona));
	}

	@Transactional
	public ZonaDtos.ZonaResponse actualizar(UUID zonaId, ZonaDtos.ZonaRequest request) {
		validarCoordenadas(request.latitud(), request.longitud());

		ZonaTuristica zona = zonas.findById(zonaId)
				.orElseThrow(() -> ApiException.noEncontrado("La zona"));

		aplicar(zona, request);
		if (request.orden() != null) {
			zona.setOrden(request.orden());
		}
		return aZona(zonas.save(zona));
	}

	@Transactional
	public void eliminar(UUID zonaId) {
		ZonaTuristica zona = zonas.findById(zonaId)
				.orElseThrow(() -> ApiException.noEncontrado("La zona"));
		zonas.delete(zona);
	}

	/*
	 * Coordenadas vienen en parejas: o las dos o ninguna. Con una sola
	 * el mapa de Google quedaría apuntando al mar y nadie sabría qué
	 * pasó; mejor rechazarlo en la puerta.
	 */
	private void validarCoordenadas(Double latitud, Double longitud) {
		if (latitud == null && longitud == null) {
			return;
		}
		if (latitud == null || longitud == null) {
			throw ApiException.peticionInvalida("Pon las dos coordenadas o ninguna");
		}
		if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
			throw ApiException.peticionInvalida("Las coordenadas no son válidas");
		}
	}

	private static void aplicar(ZonaTuristica zona, ZonaDtos.ZonaRequest request) {
		zona.setNombre(request.nombre().trim());
		zona.setDescripcion(limpiar(request.descripcion()));
		zona.setDireccion(request.direccion().trim());
		zona.setLatitud(request.latitud());
		zona.setLongitud(request.longitud());
		zona.setImagenUrl(limpiar(request.imagenUrl()));
		zona.setMotivo(limpiar(request.motivo()));
	}

	private static String limpiar(String texto) {
		if (texto == null) {
			return null;
		}
		String recortado = texto.trim();
		return recortado.isEmpty() ? null : recortado;
	}

	private static ZonaDtos.ZonaResponse aZona(ZonaTuristica zona) {
		return new ZonaDtos.ZonaResponse(
				zona.getId(),
				zona.getNombre(),
				zona.getDescripcion(),
				zona.getDireccion(),
				zona.getLatitud(),
				zona.getLongitud(),
				zona.getImagenUrl(),
				zona.getMotivo(),
				zona.getOrden());
	}
}
