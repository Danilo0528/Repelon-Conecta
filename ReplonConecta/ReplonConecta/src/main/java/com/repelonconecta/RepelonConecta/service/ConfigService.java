package com.repelonconecta.RepelonConecta.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import com.repelonconecta.RepelonConecta.entity.ConfigTexto;
import com.repelonconecta.RepelonConecta.repository.ConfigTextoRepository;

/**
 * Textos del home que el admin puede cambiar desde el panel.
 *
 * El modelo es "overrides": el frontend trae sus textos por defecto y
 * aqui solo viven los que alguien cambio. Si el admin deja un campo
 * vacio se borra la clave y el home vuelve al texto original: asi
 * "restaurar por defecto" no necesita un boton ni una version antigua
 * guardada.
 *
 * La lista blanca de claves es el limite de este sistema: no es un
 * editor de paginas, son 9 campos con nombre conocido.
 */
@Service
public class ConfigService {

	/** Los unicos textos que el panel acepta editar. */
	public static final Set<String> CLAVES_INICIO = Set.of(
			"inicio.hero.titulo1",
			"inicio.hero.titulo2",
			"inicio.hero.texto",
			"inicio.hero.imagenes",
			"inicio.mapa.texto",
			"inicio.turismo.texto",
			"inicio.fondo.titulo",
			"inicio.fondo.texto",
			"inicio.cta.titulo",
			"inicio.cta.texto");

	/**
	 * El slider del hero no guarda un texto sino la lista de imagenes
	 * que rotan solas, como un array JSON de URLs en una sola clave.
	 */
	public static final String CLAVE_IMAGENES_HERO = "inicio.hero.imagenes";

	/** Cuantas imagenes caben en el deslizamiento automatico. */
	public static final int MAX_IMAGENES_HERO = 10;

	/** Toda imagen tiene que ser una URL web o un archivo del propio sitio. */
	private static final Pattern ESQUEMA_IMAGEN = Pattern.compile("^(https?://|/).{1,500}$");

	/** El array llega como texto, igual que el horario de los negocios. */
	private static final JsonMapper JSON = JsonMapper.builder().build();

	private static final String PREFIJO_INICIO = "inicio.";

	private static final int MAX_VALOR = 2000;

	private final ConfigTextoRepository textos;
	private final CurrentUserService currentUser;

	public ConfigService(ConfigTextoRepository textos, CurrentUserService currentUser) {
		this.textos = textos;
		this.currentUser = currentUser;
	}

	/**
	 * Overrides guardados para el home. Es publico: lo pide cualquiera
	 * que abra la pagina, sin sesion.
	 */
	public Map<String, String> textosInicio() {
		Map<String, String> resultado = new LinkedHashMap<>();
		for (ConfigTexto texto : textos.findByClaveStartingWithOrderByClaveAsc(PREFIJO_INICIO)) {
			if (CLAVES_INICIO.contains(texto.getClave())) {
				resultado.put(texto.getClave(), texto.getValor());
			}
		}
		return resultado;
	}

	/**
	 * Guarda los cambios del panel. Solo admin.
	 *
	 * Reglas:
	 *  - clave fuera de la lista blanca -> 400 (nadie inyecta claves
	 *    arbitrarias en la base);
	 *  - valor vacio o en blanco -> se borra la clave (restaura el
	 *    texto por defecto del frontend);
	 *  - mas de 2000 caracteres -> 400;
	 *  - el slider del hero admite ademas una lista de imagenes, y
	 *    esa lista se valida aparte.
	 */
	@Transactional
	public Map<String, String> actualizarTextosInicio(Map<String, String> cambios) {
		currentUser.actualAdmin();

		if (cambios == null || cambios.isEmpty()) {
			throw ApiException.peticionInvalida("No llegaron textos para guardar");
		}

		for (Map.Entry<String, String> entry : cambios.entrySet()) {
			String clave = entry.getKey();
			String valor = entry.getValue();

			if (!CLAVES_INICIO.contains(clave)) {
				throw ApiException.peticionInvalida("Texto no reconocido: " + clave);
			}
			if (valor != null && valor.length() > MAX_VALOR) {
				throw ApiException.peticionInvalida(
						"El texto de \"" + clave + "\" pasa de " + MAX_VALOR + " caracteres");
			}

			boolean vacio = valor == null || valor.isBlank();

			if (CLAVE_IMAGENES_HERO.equals(clave) && !vacio) {
				validarImagenesHero(valor);
			}

			if (vacio) {
				textos.deleteById(clave);
			} else {
				ConfigTexto guardado = textos.findById(clave)
						.orElseGet(() -> new ConfigTexto(clave, valor.trim()));
				guardado.setValor(valor.trim());
				guardado.tocar();
				textos.save(guardado);
			}
		}

		return textosInicio();
	}

	/**
	 * El slider del hero pinta cada entrada como url(...) en el home,
	 * asi que no basta con que sea texto: tiene que llegar como una
	 * lista JSON de URLs. Se valida en el servidor y no solo en el
	 * panel porque este valor es lo unico que separa la portada de un
	 * fondo en blanco o de algo que el navegador ni siquiera intenta
	 * cargar.
	 *
	 * Un valor vacio no pasa por acá: es la forma de restaurar las
	 * imagenes por defecto.
	 */
	private void validarImagenesHero(String valor) {
		List<String> urls;
		try {
			urls = JSON.readValue(valor, new TypeReference<List<String>>() {});
		} catch (JacksonException e) {
			throw ApiException.peticionInvalida(
					"Las imágenes del inicio tienen que ser una lista JSON");
		}

		if (urls == null || urls.isEmpty()) {
			throw ApiException.peticionInvalida("La lista de imágenes no puede quedar vacía");
		}
		if (urls.size() > MAX_IMAGENES_HERO) {
			throw ApiException.peticionInvalida(
					"El deslizamiento admite hasta " + MAX_IMAGENES_HERO + " imágenes");
		}
		for (String url : urls) {
			if (url == null || !ESQUEMA_IMAGEN.matcher(url.trim()).matches()) {
				throw ApiException.peticionInvalida(
						"Cada imagen tiene que ser una URL https:// o un archivo del sitio que empiece con /");
			}
		}
	}
}
