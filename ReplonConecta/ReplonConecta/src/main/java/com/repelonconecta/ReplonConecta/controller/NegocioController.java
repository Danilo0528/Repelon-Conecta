package com.repelonconecta.ReplonConecta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.ReplonConecta.dto.NegocioDtos;
import com.repelonconecta.ReplonConecta.entity.Usuario;
import com.repelonconecta.ReplonConecta.service.CurrentUserService;
import com.repelonconecta.ReplonConecta.service.NegocioService;

import jakarta.validation.Valid;

/**
 * Catalogo de negocios.
 *
 * Los GET son publicos: la gente tiene que poder ver los negocios antes
 * de decidir si le conviene crear una cuenta. El POST (registro de
 * negocio) si exige sesion.
 */
@RestController
@RequestMapping("/api/negocios")
public class NegocioController {

	private final NegocioService negocios;
	private final CurrentUserService currentUser;

	public NegocioController(NegocioService negocios, CurrentUserService currentUser) {
		this.negocios = negocios;
		this.currentUser = currentUser;
	}

	/**
	 * Buscador del home. Los cuatro filtros se pueden usar juntos o por
	 * separado:
	 *
	 *   GET /api/negocios?texto=panaderia&barrio=Centro&abierto=true&categoriaId=...
	 */
	@GetMapping
	public List<NegocioDtos.NegocioResponse> buscar(
			@RequestParam(required = false) String texto,
			@RequestParam(required = false) String barrio,
			@RequestParam(required = false) Boolean abierto,
			@RequestParam(required = false) UUID categoriaId) {

		return negocios.buscar(texto, barrio, abierto, categoriaId);
	}

	/** Negocios destacados, para la franja superior del inicio. */
	@GetMapping("/destacados")
	public List<NegocioDtos.NegocioResponse> destacados() {
		return negocios.destacados();
	}

	/** Barrios que tienen negocios: alimenta el selector de zona. */
	@GetMapping("/barrios")
	public List<String> barrios() {
		return negocios.barrios();
	}

	@GetMapping("/slug/{slug}")
	public NegocioDtos.NegocioDetalleResponse porSlug(@PathVariable String slug) {
		return negocios.detallePorSlug(slug);
	}

	/** Negocios del usuario que esta sesión. */
	@GetMapping("/mios")
	public List<NegocioDtos.NegocioResponse> mios() {
		Usuario usuario = currentUser.actual();
		return negocios.misNegocios(usuario);
	}

	/** Alta de negocio. Lo usa el formulario "Quiero vender". */
	@PostMapping
	public NegocioDtos.NegocioDetalleResponse registrar(
			@Valid @RequestBody NegocioDtos.RegistroNegocioRequest request) {
		return negocios.registrar(request);
	}

	/**
	 * Editar perfil, horario y foto. Solo se toca lo que llega informado,
	 * asi que el frontend puede mandar formularios parciales.
	 *
	 * Aunque el GET de /api/negocios/** es publico, este PUT exige sesion:
	 * en SecurityConfig cualquier peticion que no sea GET cae en
	 * anyRequest().authenticated().
	 */
	@PutMapping("/{negocioId}")
	public NegocioDtos.NegocioDetalleResponse actualizar(@PathVariable UUID negocioId,
			@Valid @RequestBody NegocioDtos.NegocioUpdateRequest request) {
		return negocios.actualizar(negocioId, request);
	}

	/**
	 * Interruptor abierto/cerrado. En el panel del vendedor es un solo
	 * boton grande: "Abrir mi negocio" / "Cerrar mi negocio".
	 */
	@PatchMapping("/{negocioId}/abierto")
	public NegocioDtos.NegocioDetalleResponse cambiarAbierto(@PathVariable UUID negocioId,
			@RequestParam boolean abierto) {
		return negocios.cambiarEstadoAbierto(negocioId, abierto);
	}
}