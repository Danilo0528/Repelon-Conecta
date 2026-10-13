package com.repelonconecta.RepelonConecta.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.repelonconecta.RepelonConecta.config.Alcance;
import com.repelonconecta.RepelonConecta.entity.Negocio;
import com.repelonconecta.RepelonConecta.repository.NegocioRepository;

@Service
public class IaAsistenteService {

	@Autowired
	private NegocioRepository negocioRepository;

	/** Key de Groq: NUNCA en el codigo, siempre por variable de entorno. */
	@Value("${groq.api-key:}")
	private String groqApiKey;

	private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

	public String procesarPregunta(String preguntaUsuario) {
		if (groqApiKey == null || groqApiKey.isBlank()) {
			return "El asistente no esta configurado todavia. Explora los negocios en nuestro mapa interactivo.";
		}

        // 1. Obtener los negocios públicos y aprobados de Repelón desde Supabase usando FAMILIAS
        List<Negocio> negocios = negocioRepository.buscarPublico(null, null, null, null, Alcance.FAMILIAS);

        // 2. Construir el contexto estricto con los datos reales
        StringBuilder sbContexto = new StringBuilder();
        sbContexto.append("Negocios disponibles en Repelón Conecta:\n");
        for (Negocio n : negocios) {
            sbContexto.append("- Nombre: ").append(n.getNombre())
                      .append(" | Descripción: ").append(n.getDescripcion() != null ? n.getDescripcion() : "Sin descripción")
                      .append(" | Barrio: ").append(n.getBarrio() != null ? n.getBarrio() : "Centro")
                      .append(" | Dirección: ").append(n.getDireccion() != null ? n.getDireccion() : "Repelón")
                      .append(" | Estado: ").append(n.isAbierto() ? "Abierto" : "Cerrado")
                      .append(" | WhatsApp: ").append(n.getTelefono() != null ? n.getTelefono() : "No disponible")
                      .append("\n");
        }

        // 3. Preparar el payload para la API de Groq (formato OpenAI compatible)
        String systemPrompt =
            "Eres el asistente virtual oficial de 'Repelón Conecta', una plataforma local para Repelón (Atlántico, Colombia).\n" +
            "REGLAS ESTRICTAS:\n" +
            "1. Responde única y exclusivamente basándote en la lista de negocios proporcionada arriba.\n" +
            "2. Si la respuesta no está en la lista o el usuario pregunta por temas ajenos (política, religión, etc.), di amablemente que solo estás para ayudar a encontrar comercios en Repelón.\n" +
            "3. NUNCA inventes negocios, productos o números de teléfono que no estén en la lista.\n" +
            "4. Sé breve, amable, cercano y útil (máximo 3 o 4 líneas por respuesta), invitando a visitar el negocio o contactarlo.";

        List<Map<String, String>> messages = List.of(
            Map.of("role", "system", "content", systemPrompt + "\n\nDATOS ACTUALES DE SUPABASE:\n" + sbContexto.toString()),
            Map.of("role", "user", "content", preguntaUsuario)
        );

        Map<String, Object> requestBody = Map.of(
            "model", "llama-3.2-3b-preview",
            "messages", messages,
            "temperature", 0.3,
            "max_tokens", 300
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
			headers.setBearerAuth(groqApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_API_URL, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            return "¡Hola! En este momento el asistente inteligente está tomando un respiro, pero puedes explorar todos los negocios directamente en nuestro mapa interactivo.";
        }

        return "No pude procesar tu consulta en este momento, pero te invito a revisar el listado de comercios del pueblo.";
    }
}
