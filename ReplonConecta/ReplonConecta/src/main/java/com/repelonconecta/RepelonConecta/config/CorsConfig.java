package com.repelonconecta.RepelonConecta.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * CORS de la API.
 *
 * El frontend vive en otro origen (Vercel, localhost:3000), asi que el
 * navegador exige que el backend declare explicitamente que origenes
 * pueden llamarlo. La lista se configura con la variable de entorno
 * app.cors.allowed-origins, separada por comas.
 */
@Configuration
public class CorsConfig {

	@Value("${app.cors.allowed-origins:http://localhost:3000}")
	private String corsOrigins;

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
