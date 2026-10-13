package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

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

	private static final JsonMapper JSON = JsonMapper.builder().build();
	private static final int MAX_IMAGENES = 4;

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
		List<String> imagenes = request.imagenes() == null
				? imagenesLegadas(request.imagenUrl())
				: limpiarImagenes(request.imagenes());
		zona.setImagenes(escribirImagenes(imagenes));
		zona.setImagenUrl(imagenes.isEmpty() ? null : imagenes.get(0));
		zona.setMotivo(limpiar(request.motivo()));
	}

	private static List<String> imagenesLegadas(String imagenUrl) {
		String imagen = limpiar(imagenUrl);
		return imagen == null ? List.of() : List.of(imagen);
	}

	private static List<String> limpiarImagenes(List<String> imagenes) {
		if (imagenes.size() > MAX_IMAGENES) {
			throw ApiException.peticionInvalida(
					"La galería admite hasta " + MAX_IMAGENES + " imágenes");
		}
		List<String> resultado = imagenes.stream()
				.map(ZonaTuristicaService::limpiar)
				.filter(url -> url != null)
				.distinct()
				.toList();
		for (String url : resultado) {
			if (url.length() > 500) {
				throw ApiException.peticionInvalida(
						"Cada URL de imagen admite hasta 500 caracteres");
			}
			if (!(url.startsWith("https://") || url.startsWith("http://") || url.startsWith("/"))) {
				throw ApiException.peticionInvalida(
						"Cada imagen debe ser una URL http(s) o una ruta del sitio que empiece con /");
			}
		}
		return resultado;
	}

	private static String escribirImagenes(List<String> imagenes) {
		try {
			return JSON.writeValueAsString(imagenes);
		} catch (JacksonException e) {
			throw ApiException.peticionInvalida("No se pudo guardar la galería turística");
		}
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
				leerImagenes(zona.getImagenes(), zona.getImagenUrl()),
				zona.getMotivo(),
				zona.getOrden());
	}

	private static List<String> leerImagenes(String json, String imagenUrl) {
		if (json != null && !json.isBlank()) {
			try {
				List<String> imagenes = JSON.readValue(json, new TypeReference<List<String>>() {});
				if (imagenes != null) {
					return imagenes.stream()
							.filter(url -> url != null && !url.isBlank())
							.toList();
				}
			} catch (JacksonException | ClassCastException e) {
				throw new IllegalStateException("La galería turística guardada no es JSON válido", e);
			}
		}
		String legado = limpiar(imagenUrl);
		return legado == null ? List.of() : List.of(legado);
	}
}
