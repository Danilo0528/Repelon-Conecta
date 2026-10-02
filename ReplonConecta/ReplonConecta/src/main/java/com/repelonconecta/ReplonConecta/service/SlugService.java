package com.repelonconecta.ReplonConecta.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.repelonconecta.ReplonConecta.repository.NegocioRepository;

/**
 * Genera slugs para las URLs de negocio.
 *
 * Sin acentos y en minusculas, porque la gente escribe "Panadería La
 * Esquina" y eso tiene que terminar en /negocio/panaderia-la-esquina.
 * Si se dejara la tilde, el link tendria que ir escapado y se rompe al
 * compartirlo por WhatsApp.
 *
 * Si el slug ya existe se le pega un numero. "Panaderia La Esquina"
 * repetido en la calle 10 y en la calle 20 son dos negocios distintos y
 * necesitan dos URLs.
 */
@Service
public class SlugService {

	private final NegocioRepository negocios;

	public SlugService(NegocioRepository negocios) {
		this.negocios = negocios;
	}

	public String unico(String nombre) {
		String base = limpiar(nombre);

		if (base.isEmpty()) {
			base = "negocio";
		}

		String candidato = base;
		int intento = 2;

		while (negocios.findBySlug(candidato).isPresent()) {
			candidato = base + "-" + intento;
			intento++;
		}

		return candidato;
	}

	/**
	 * Pasa a minusculas sin acentos y convierte espacios en guiones.
	 *
	 * NFD separa la "n" de la tilde en "ñ", y el regex descarta los
	 * caracteres que quedan marcados como combinantes. Sin esto,
	 * "Niño" quedaria como "nino" con una combinante pegada.
	 */
	private String limpiar(String texto) {
		if (texto == null) {
			return "";
		}

		String sinAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD);
		sinAcentos = sinAcentos.replaceAll("\\p{M}", "");

		return sinAcentos
				.toLowerCase(Locale.ROOT)
				.replaceAll("[^a-z0-9]+", "-")
				.replaceAll("^-+|-+$", "");
	}
}