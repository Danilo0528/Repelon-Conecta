package com.repelonconecta.RepelonConecta.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.repelonconecta.RepelonConecta.entity.Negocio;

/**
 * Tests del emparejador de negocios del asistente IA.
 *
 * Es un metodo estatico puro, asi que se prueba sin levantar Spring ni
 * la base: si la IA responde "la panaderia esta en el centro", aqui se
 * decide si el chat pinta una tarjeta o no.
 */
class IaAsistenteServiceTests {

	private static Negocio negocio(String nombre) {
		Negocio n = new Negocio();
		n.setNombre(nombre);
		return n;
	}

	private static final List<Negocio> CANDIDATOS = List.of(
			negocio("Panadería La Esquina"),
			negocio("La Esquina"),
			negocio("Agro Repelón"),
			negocio("Pescadería El Carmen"),
			negocio("Droguería San José"));

	@Test
	void encuentraElNegocioQueElTextoMenciona() {
		List<Negocio> resultado = IaAsistenteService.emparejarNegocios(
				"Te recomiendo Agro Repelón, tienen buena yuca.", CANDIDATOS);

		assertThat(resultado).extracting(Negocio::getNombre).containsExactly("Agro Repelón");
	}

	@Test
	void noLeImportanLasTildesNiLasMayusculas() {
		List<Negocio> resultado = IaAsistenteService.emparejarNegocios(
				"pas por la PANADERIA la esquina, abre temprano", CANDIDATOS);

		assertThat(resultado).extracting(Negocio::getNombre)
				.contains("Panadería La Esquina");
	}

	@Test
	void conDosNombresEncoladosPrefiereElMasLargo() {
		// Las dos existen en la base; solo debe salir la más completa.
		List<Negocio> resultado = IaAsistenteService.emparejarNegocios(
				"Pregunta en Panadería La Esquina", CANDIDATOS);

		assertThat(resultado).extracting(Negocio::getNombre)
				.containsExactly("Panadería La Esquina");
	}

	@Test
	void cuandoNadaCoincideNoHayTarjetas() {
		assertThat(IaAsistenteService.emparejarNegocios(
				"¿Cómo está el clima mañana?", CANDIDATOS)).isEmpty();
	}

	@Test
	void noPasaDeTresTarjetas() {
		List<Negocio> resultado = IaAsistenteService.emparejarNegocios(
				"Agro Repelón, Pescadería El Carmen, Droguería San José y Panadería La Esquina",
				CANDIDATOS);

		assertThat(resultado).hasSize(3);
	}

	@Test
	void textoVacioONuloNoDevuelveNada() {
		assertThat(IaAsistenteService.emparejarNegocios(null, CANDIDATOS)).isEmpty();
		assertThat(IaAsistenteService.emparejarNegocios("   ", CANDIDATOS)).isEmpty();
	}

	@Test
	void sinCandidatosNoDevuelveNada() {
		assertThat(IaAsistenteService.emparejarNegocios("Agro Repelón", List.of())).isEmpty();
		assertThat(IaAsistenteService.emparejarNegocios("Agro Repelón", null)).isEmpty();
	}

	@Test
	void unNegocioSinNombreNoSeConsidera() {
		List<Negocio> conSinNombre = List.of(negocio("Agro Repelón"), negocio(null));

		assertThat(IaAsistenteService.emparejarNegocios("Agro Repelón", conSinNombre))
				.extracting(Negocio::getNombre)
				.containsExactly("Agro Repelón");
	}
}
