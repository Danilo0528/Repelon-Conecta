package com.repelonconecta.RepelonConecta.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Reglas de acceso de la API y respuestas de error de seguridad.
 *
 * La verificacion del token vive en {@link JwtDecoderConfig}, el mapeo
 * de claims a roles en {@link JwtAuthoritiesConfig} y los origenes
 * permitidos en {@link CorsConfig}. Esta clase solo decide que rutas
 * son publicas y cuales exigen JWT.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http,
			CorsConfigurationSource corsConfigurationSource,
			JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
		http
			// Sin cookies de sesion: es API stateless, el token va en el header.
			.csrf(AbstractHttpConfigurer::disable)
			.cors(cors -> cors.configurationSource(corsConfigurationSource))
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
						"/api/zonas",
						// Publicaciones de Cultura: el feed se lee sin sesion.
						"/api/cultura/publicaciones")
					.permitAll()
				// Asistente IA del home: lo usa el visitante sin sesion,
				// asi que va abierto. La key de Groq NO sale de aca: vive
				// en el servidor (GROQ_API_KEY) y el rate limit por IP
				// limita el abuso.
				.requestMatchers(HttpMethod.POST, "/api/ia/**")
					.permitAll()
				.requestMatchers("/actuator/health").permitAll()
				// Todo lo demas exige un JWT valido de Supabase.
				// OJO: los pedidos NO son publicos, aunque se puedan crear sin
				// haber iniciado sesion antes; hacen falta si o si para saber
				// quien compra.
				.anyRequest().authenticated())
			.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
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
}
