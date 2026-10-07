package com.repelonconecta.RepelonConecta.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
			"inicio.mapa.texto",
			"inicio.turismo.texto",
			"inicio.fondo.titulo",
			"inicio.fondo.texto",
			"inicio.cta.titulo",
			"inicio.cta.texto");

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
	 *  - mas de 2000 caracteres -> 400.
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
}
