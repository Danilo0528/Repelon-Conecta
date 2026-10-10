package com.repelonconecta.RepelonConecta.config;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Seguridad de la API.
 *
 * Modelo: Supabase autentica, Spring Boot autoriza. Spring NO tiene
 * contrasenas ni emite tokens: solo verifica la FIRMA del JWT que
 * Supabase entrego y de ahi saca el rol.
 *
 * Sobre el algoritmo de firma hay dos modos, y el decoder soporta los
 * dos:
 *  - Proyectos clasicos: firman con HS256 usando el JWT Secret del
 *    proyecto (mismo secreto en ambos lados) -> SUPABASE_JWT_SECRET.
 *  - Proyectos nuevos con "JWT signing keys": firman con claves
 *    asimetricas ECC P-256 / RSA y publican la publica en un JWKS ->
 *    se valida contra {SUPABASE_URL}/auth/v1/.well-known/jwks.json.
 * El modo se elige solo: si hay JWT Secret se usa HS256; si no, JWKS.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

	@Value("${supabase.jwt-secret:}")
	private String jwtSecret;

	@Value("${supabase.jwks-uri:}")
	private String jwksUri;

	@Value("${supabase.url:}")
	private String supabaseUrl;

	@Value("${supabase.jwt-issuer:}")
	private String jwtIssuer;

	@Value("${app.cors.allowed-origins:http://localhost:3000}")
	private String corsOrigins;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			// Sin cookies de sesion: es API stateless, el token va en el header.
			.csrf(AbstractHttpConfigurer::disable)
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				// Estas rutas cuelgan de /api/negocios/** pero son privadas,
				// asi que van ANTES del permitAll de abajo. En Spring gana la
				// primera regla que coincide, no la mas especifica: si el
				// permitAll fuera primero, /api/negocios/mios quedaria
				// abierto y cualquiera veria los negocios de otros.
				.requestMatchers("/api/negocios/mios").authenticated()
				// Catalogo: consultable sin iniciar sesion. La gente tiene que
				// poder VER los negocios y sus productos antes de decidir si
				// le conviene crear una cuenta.
				.requestMatchers(HttpMethod.GET,
						"/api/buscar",
						"/api/negocios/**",
						"/api/productos/**",
						"/api/categorias/**",
						// Textos del home: el que abre la pagina sin
						// sesion tiene que poder leerlos.
						"/api/inicio/textos",
						// Zonas turisticas del home: mismo motivo que los
						// textos, el visitante sin sesion las tiene que ver.
						"/api/zonas")
					.permitAll()
				.requestMatchers("/actuator/health").permitAll()
				// Todo lo demas exige un JWT valido de Supabase.
				// OJO: los pedidos NO son publicos, aunque se puedan crear sin
				// haber iniciado sesion antes; hacen falta si o si para saber
				// quien compra.
				.anyRequest().authenticated())
			.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
				.authenticationEntryPoint((request, response, ex) -> {
					log.warn("JWT rechazado en {} {}: {}",
							request.getMethod(), request.getRequestURI(),
							ex != null ? ex.getMessage() : "sin excepcion");
					response.setStatus(401);
					response.setContentType("application/json");
					response.getWriter().write(
							"{\"error\":\"No autorizado\",\"detalle\":\"Sesion invalida o vencida\"}");
				}))
			.exceptionHandling(handling -> handling
				.accessDeniedHandler((request, response, ex) -> {
					response.setStatus(403);
					response.setContentType("application/json");
					response.getWriter().write(
							"{\"error\":\"Sin permisos\",\"detalle\":\"Tu rol no alcanza para esta accion\"}");
				}));

		return http.build();
	}

	/**
	 * Decodifica y VERIFICA el JWT de Supabase.
	 *
	 * Verificar la firma es lo que impide que alguien se fabrique su
	 * propio token con rol ADMIN: sin la clave secreta no puede
	 * producir una firma valida.
	 */
	@Bean
	public JwtDecoder jwtDecoder() {
		NimbusJwtDecoder decoder;

		if (jwtSecret != null && !jwtSecret.isBlank()) {
			// Modo historico: Supabase firma con HS256 usando el JWT Secret
			// del proyecto, que es el mismo secreto en ambos lados.
			SecretKey key = new SecretKeySpec(
					jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

			decoder = NimbusJwtDecoder.withSecretKey(key)
					.macAlgorithm(MacAlgorithm.HS256)
					.build();
		} else {
			// Modo "JWT signing keys": proyectos nuevos firman con claves
			// asimetricas (ECC P-256 / RSA) y publican la parte publica en un
			// JWKS. Aqui no hay secreto que copiar: se valida la firma
			// bajando las claves publicas de ese endpoint.
			String uri = resolverJwksUri();

			if (uri == null) {
				// Fallar aqui y no al recibir peticiones: un arranque limpio con
				// error explicito es mejor que una app que levanta y luego rechaza
				// todas las peticiones con un 401 sin explicar por que.
				throw new IllegalStateException(
						"Falta la configuracion de Supabase para validar el JWT. Define "
						+ "SUPABASE_JWT_SECRET (proyectos con HS256) o SUPABASE_URL/"
						+ "SUPABASE_JWKS_URI (proyectos con JWT signing keys asimetricas).");
			}

			log.info("Validando JWT con JWKS asimetrico: {}", uri);

			// Spring Security 7 restringe los algoritmos JWS a HMAC y RSA
			// por defecto: ES256 (ECDSA), que es lo que firma Supabase
			// nuevo, queda fuera y Nimbus responde "Another algorithm
			// expected, or no matching key(s) found". Se construye el
			// processor a mano para incluir la familia ECDSA en el
			// selector de claves.
			try {
				JWKSource<SecurityContext> jwkSource =
						new RemoteJWKSet<>(new URL(uri));

				// Nimbus 10 ya no trae las constantes FAMILY_*: se arma el
				// set de algoritmos a mano. ES256 es el que usa Supabase.
				var algoritmos = java.util.Set.of(
						JWSAlgorithm.HS256, JWSAlgorithm.HS384, JWSAlgorithm.HS512,
						JWSAlgorithm.RS256, JWSAlgorithm.RS384, JWSAlgorithm.RS512,
						JWSAlgorithm.PS256, JWSAlgorithm.PS384, JWSAlgorithm.PS512,
						JWSAlgorithm.ES256, JWSAlgorithm.ES384, JWSAlgorithm.ES512);

				DefaultJWTProcessor<SecurityContext> processor =
						new DefaultJWTProcessor<>();
				processor.setJWSKeySelector(new JWSVerificationKeySelector<>(
						algoritmos, jwkSource));

				decoder = new NimbusJwtDecoder(processor);
			} catch (Exception e) {
				throw new IllegalStateException(
						"No se pudo crear el decoder JWKS para " + uri, e);
			}
		}

		List<OAuth2TokenValidator<Jwt>> validators = new ArrayList<>();

		// 60s de tolerancia porque los relojes de telefono y servidor se
		// desincronizan un poco y produce 401 falsos.
		validators.add(new JwtTimestampValidator(Duration.ofSeconds(60)));

		if (jwtIssuer != null && !jwtIssuer.isBlank()) {
			// Exigir el issuer impide que un token firmado con la misma clave
			// desde otro proyecto de Supabase sea aceptado aqui.
			validators.add(new JwtClaimValidator<>("iss",
					iss -> iss != null && iss.equals(jwtIssuer)));
		} else {
			log.warn("supabase.jwt-issuer vacio: se aceptara cualquier emisor firmado con la "
					+ "misma clave. Configura SUPABASE_JWT_ISSUER para endurecerlo.");
		}

		// El claim sub es el UUID del usuario en Supabase y es la llave con la
		// que se busca en la tabla usuarios. Sin el, no hay identidad.
		// El parametro de tipo <String> es necesario: sin el, Java infiere
		// Object y la validacion no puede comprobar el contenido.
		validators.add(new JwtClaimValidator<String>("sub",
				sub -> sub != null && !sub.isBlank()));

		decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(validators));
		return decoder;
	}

	/**
	 * Devuelve la URL del JWKS de Supabase.
	 *
	 * Si se define supabase.jwks-uri se usa tal cual. Si no, se arma a
	 * partir de la URL del proyecto: el endpoint publico de claves de
	 * Supabase Auth es {url}/auth/v1/.well-known/jwks.json.
	 */
	private String resolverJwksUri() {
		if (jwksUri != null && !jwksUri.isBlank()) {
			return jwksUri;
		}

		if (supabaseUrl != null && !supabaseUrl.isBlank()) {
			return supabaseUrl.replaceAll("/+$", "") + "/auth/v1/.well-known/jwks.json";
		}

		return null;
	}

	/**
	 * Traduce el token a autoridades de Spring y define la identidad.
	 *
	 * De donde sale el rol:
	 *  - Supabase mete el rol de negocio en app_metadata.rol, dentro del
	 *    access token.
	 *  - El claim "role" de Supabase es OTRA cosa: vale "authenticated" o
	 *    "anon" y describe permisos de su API, no el rol del negocio.
	 *    Leerlo por error hace que todos los usuarios autenticados pasen
	 *    por el mismo rol y el control de acceso no protege nada.
	 *
	 * Principal: se usa "sub" y no el email porque el id de la tabla
	 * usuarios ES el UUID de Supabase. Asi getName() devuelve directo la
	 * llave que el repositorio necesita.
	 */
	@Bean
	public JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

		converter.setPrincipalClaimName("sub");

		converter.setJwtGrantedAuthoritiesConverter(this::autoridades);

		return converter;
	}

	private Collection<GrantedAuthority> autoridades(Jwt jwt) {
		Collection<GrantedAuthority> resultado = new ArrayList<>();

		Object appMetadata = jwt.getClaims().get("app_metadata");

		if (appMetadata instanceof Map<?, ?> mapa && mapa.get("rol") instanceof String rol
				&& !rol.isBlank()) {
			resultado.add(new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase()));
		} else {
			// Usuario nuevo sin rol asignado todavia: se trata como comprador.
			// Es el rol por defecto y el menos privilegiado.
			resultado.add(new SimpleGrantedAuthority("ROLE_COMPRADOR"));
		}

		return resultado;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of(corsOrigins.split("\\s*,\\s*")));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setExposedHeaders(List.of("Location"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}