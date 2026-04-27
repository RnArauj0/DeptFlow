package com.debtflow.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public String generate(String systemContext, String userMessage) {
        try {
            Map<String, Object> body = buildRequestBody(systemContext, userMessage);

            Map<String, Object> response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            return extractText(response);

        } catch (Exception e) {
            log.error("Error al consumir Gemini API: {}", e.getMessage());
            return "En este momento no puedo procesar tu consulta. " +
                    "Por favor intenta de nuevo o contáctanos directamente.";
        }
    }

    // ── Método extraído (sugerencia del IDE) ────────────────────────────────
    private Map<String, Object> buildRequestBody(String systemContext, String userMessage) {
        String fullPrompt = systemContext + "\n\nUsuario: " + userMessage;

        return Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", fullPrompt)
                        ))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 300
                )
        );
    }

    // ── Tipado explícito para eliminar Raw use warnings ──────────────────────
    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.get("candidates");

            Map<String, Object> content =
                    (Map<String, Object>) candidates.getFirst().get("content");

            List<Map<String, Object>> parts =
                    (List<Map<String, Object>>) content.get("parts");

            return (String) parts.getFirst().get("text");

        } catch (Exception e) {
            log.error("Error al parsear respuesta de Gemini", e);
            return "No pude entender la respuesta. Por favor intenta de nuevo.";
        }
    }
}