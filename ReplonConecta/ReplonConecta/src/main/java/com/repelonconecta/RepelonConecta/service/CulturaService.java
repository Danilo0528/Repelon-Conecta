package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.dto.CulturaDtos;
import com.repelonconecta.RepelonConecta.entity.CulturaPublicacion;
import com.repelonconecta.RepelonConecta.repository.CulturaPublicacionRepository;

/**
 * Publicaciones del feed de Cultura (/cultura).
 *
 * La lista pública es la que sirve la página; crear, editar y borrar es
 * trabajo del panel del admin (rol ADMIN, verificado en el controller).
 * Borrar borra de verdad: nada más apunta a una publicación.
 */
@Service
public class CulturaService {

	/** Foto: URL web o archivo del propio sitio, como en las zonas. */
	private static final Pattern ESQUEMA_FOTO = Pattern.compile("^(https?://|/).{1,500}$");

	/** Video: URL web (mp4, YouTube,…) o el ID pelado de YouTube. */
	private static final Pattern ESQUEMA_VIDEO = Pattern.compile("^https?://.{1,500}$");
	private static final Pattern ID_YOUTUBE = Pattern.compile("^[A-Za-z0-9_-]{6,20}$");

	private final CulturaPublicacionRepository publicaciones;

	public CulturaService(CulturaPublicacionRepository publicaciones) {
		this.publicaciones = publicaciones;
	}

	/** Feed completo en orden (el más reciente primero). Público. */
	public List<CulturaDtos.PublicacionResponse> publicaciones() {
		return publicaciones.findAllByOrderByFechaDescCreadoEnDesc().stream()
				.map(CulturaService::aRespuesta)
				.toList();
	}

	@Transactional
	public CulturaDtos.PublicacionResponse crear(CulturaDtos.PublicacionRequest request) {
		CulturaPublicacion publicacion = new CulturaPublicacion();
		aplicar(publicacion, request);
		return aRespuesta(publicaciones.save(publicacion));
	}

	@Transactional
	public CulturaDtos.PublicacionResponse actualizar(UUID publicacionId,
			CulturaDtos.PublicacionRequest request) {
		CulturaPublicacion publicacion = buscar(publicacionId);
		aplicar(publicacion, request);
		return aRespuesta(publicaciones.save(publicacion));
	}

	@Transactional
	public void eliminar(UUID publicacionId) {
		publicaciones.delete(buscar(publicacionId));
	}

	private CulturaPublicacion buscar(UUID publicacionId) {
		return publicaciones.findById(publicacionId)
				.orElseThrow(() -> ApiException.noEncontrado("La publicación"));
	}

	/*
	 * El medio se valida según el tipo porque son cosas distintas: una
	 * foto tiene que ser una URL de imagen; un video puede ser una URL
	 * (mp4 en el bucket, enlace de YouTube) o el ID pelado de YouTube
	 * (la parte después de "v="). Rechazarlo acá evita publicaciones
	 * con un medio que la página ni siquiera intentaría reproducir.
	 */
	private static void validarMedio(String tipo, String mediaUrl) {
		boolean foto = CulturaPublicacion.TIPO_FOTO.equals(tipo);
		boolean ok = foto
				? ESQUEMA_FOTO.matcher(mediaUrl).matches()
				: ESQUEMA_VIDEO.matcher(mediaUrl).matches() || ID_YOUTUBE.matcher(mediaUrl).matches();
		if (!ok) {
			throw ApiException.peticionInvalida(foto
					? "La foto debe ser una URL https:// o una ruta del sitio que empiece con /"
					: "El video debe ser una URL https:// o el ID de YouTube");
		}
	}

	private static void aplicar(CulturaPublicacion publicacion, CulturaDtos.PublicacionRequest request) {
		String mediaUrl = request.mediaUrl().trim();
		validarMedio(request.tipo(), mediaUrl);

		publicacion.setAutor(request.autor().trim());
		publicacion.setLugar(limpiar(request.lugar()));
		publicacion.setFecha(request.fecha());
		publicacion.setTexto(request.texto().trim());
		publicacion.setTipo(request.tipo());
		publicacion.setMediaUrl(mediaUrl);
		publicacion.setCredito(limpiar(request.credito()));
	}

	private static String limpiar(String texto) {
		if (texto == null) {
			return null;
		}
		String recortado = texto.trim();
		return recortado.isEmpty() ? null : recortado;
	}

	private static CulturaDtos.PublicacionResponse aRespuesta(CulturaPublicacion publicacion) {
		return new CulturaDtos.PublicacionResponse(
				publicacion.getId(),
				publicacion.getAutor(),
				publicacion.getLugar(),
				publicacion.getFecha(),
				publicacion.getTexto(),
				publicacion.getTipo(),
				publicacion.getMediaUrl(),
				publicacion.getCredito());
	}
}
