package com.repelonconecta.RepelonConecta.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.repelonconecta.RepelonConecta.config.Alcance;
import com.repelonconecta.RepelonConecta.dto.BusquedaDtos;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.entity.Producto;
import com.repelonconecta.RepelonConecta.repository.ProductoRepository;

/**
 * Buscador publico: "donde consigo 20 kilos de yuca".
 *
 * El servicio hace dos cosas que la base no puede hacer sola:
 *
 * 1. ACOTA el alcance. Solo buscan productos las categorias del
 *    proyecto (agro y pesca); turismo es ficha sin productos y los
 *    rubros fuera del acuerdo (ferreteria, drogueria, tienda) no entran
 *    aunque el cliente los tenga cargados.
 *
 * 2. LIMPIA la consulta. "20 kilos de yuca" no se busca tal cual: se
 *    quitan los numeros y las palabras de relleno (incluidas las
 *    unidades) y quedan los tokens que de verdad dicen algo ("yuca").
 *    Todos los tokens tienen que aparecer en el producto.
 *
 * El matching es simple a proposito (contains, sin stemmer): el catalogo
 * de un pueblo cabe entero en memoria y una busqueda exacta por tokens
 * ya cumple lo que el cliente pidio. Si un dia se quiere "frijol"
 * encontrando "frijoles", ahi si vale la pena un indice de texto.
 */
@Service
public class BusquedaService {

	/**
	 * Categorias con productos, en su orden de importancia. Turismo no
	 * esta: su seccion muestra direcciones y zonas, sin precios.
	 * Definicion unica del alcance: Alcance.CON_PRODUCTO.
	 */
	static final List<String> CATEGORIAS_CON_PRODUCTO = Alcance.CON_PRODUCTO;

	/**
	 * Rellenos que no dicen nada de lo que se busca. Incluyen las
	 * unidades: "kilos" y "libras" se descartan porque la unidad ya
	 * viaja en el propio producto.
	 */
	private static final Set<String> PALABRAS_VACIAS = Set.of(
			"de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas",
			"y", "o", "a", "en", "con", "para", "por", "que", "se", "mi",
			"kilo", "kilos", "libra", "libras");

	private final ProductoRepository productos;

	public BusquedaService(ProductoRepository productos) {
		this.productos = productos;
	}

	/**
	 * Resultados para la consulta publica.
	 *
	 * q, categoria y barrio son todos opcionales: sin nada, devuelve el
	 * catalogo completo del alcance (asi el home puede listar todo con
	 * el mismo endpoint).
	 */
	@Transactional(readOnly = true)
	public List<BusquedaDtos.ResultadoBusquedaResponse> buscar(String q, String categoria, String barrio) {

		String slug = textoVacioANulo(categoria);
		if (slug != null) {
			slug = slug.toLowerCase(Locale.ROOT);
			// Una categoria fuera del alcance no abre la puerta a rubros
			// que el cliente dejo fuera: devuelve vacio, no todo.
			if (!CATEGORIAS_CON_PRODUCTO.contains(slug)) {
				return List.of();
			}
		}

		List<String> tokens = tokens(q);

		return productos.buscarCandidatos(CATEGORIAS_CON_PRODUCTO, slug, textoVacioANulo(barrio)).stream()
				.filter(producto -> coincide(producto, tokens))
				.map(BusquedaService::aResultado)
				.toList();
	}

	/**
	 * Todos los tokens tienen que aparecer en el producto (nombre o
	 * descripcion), en cualquier posicion y sin importar mayusculas.
	 * Con la lista vacia (consulta sin texto) no filtra nada.
	 */
	private static boolean coincide(Producto producto, List<String> tokens) {
		if (tokens.isEmpty()) {
			return true;
		}

		String texto = (producto.getNombre() + " "
				+ (producto.getDescripcion() != null ? producto.getDescripcion() : ""))
				.toLowerCase(Locale.ROOT);

		return tokens.stream().allMatch(texto::contains);
	}

	/**
	 * Normaliza la consulta en tokens comparables: minusculas, sin
	 * numeros, sin palabras vacias. "20 kilos de yuca" -> [yuca].
	 */
	static List<String> tokens(String consulta) {
		if (consulta == null || consulta.isBlank()) {
			return List.of();
		}

		String sinNumeros = consulta.toLowerCase(Locale.ROOT).replaceAll("[0-9]+", " ");

		List<String> tokens = new ArrayList<>();
		for (String palabra : sinNumeros.split("[^\\p{L}]+")) {
			if (!palabra.isEmpty() && !PALABRAS_VACIAS.contains(palabra)) {
				tokens.add(palabra);
			}
		}
		return tokens;
	}

	private static BusquedaDtos.ResultadoBusquedaResponse aResultado(Producto producto) {
		Negocio negocio = producto.getNegocio();

		return new BusquedaDtos.ResultadoBusquedaResponse(
				producto.getId(),
				producto.getNombre(),
				producto.getDescripcion(),
				producto.getPrecio(),
				producto.getUnidad(),
				producto.getImagenUrl(),
				producto.isDisponible(),
				negocio.getId(),
				negocio.getNombre(),
				negocio.getSlug(),
				negocio.getDireccion(),
				negocio.getBarrio(),
				negocio.getLatitud(),
				negocio.getLongitud(),
				negocio.getWhatsapp(),
				negocio.isAbierto(),
				producto.getCategoria() != null ? producto.getCategoria().getNombre() : null);
	}

	private static String textoVacioANulo(String texto) {
		if (texto == null) {
			return null;
		}
		String recortado = texto.trim();
		return recortado.isEmpty() ? null : recortado;
	}
}
