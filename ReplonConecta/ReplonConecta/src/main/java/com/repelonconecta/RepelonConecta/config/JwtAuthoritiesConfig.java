package com.repelonconecta.RepelonConecta.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

/**
 * Traduce el JWT a la identidad y las autoridades de Spring.
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
@Configuration
public class JwtAuthoritiesConfig {

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
}
