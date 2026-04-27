package com.debtflow.controller;

import com.debtflow.service.chatbot.ChatbotService;
import com.debtflow.mapper.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    // Inicia una sesión anónima (sin cliente identificado aún)
    @PostMapping("/session")
    public ResponseEntity<ApiResponse<Map<String, Long>>> createSession(
            @RequestParam(required = false) Long clientId) {

        Long sessionId = clientId != null
                ? chatbotService.createSession(clientId)
                : chatbotService.createAnonymousSession();

        return ResponseEntity.ok(
                ApiResponse.ok(Map.of("sessionId", sessionId), "Sesión iniciada"));
    }

    // Envía un mensaje y recibe la respuesta del bot
    @PostMapping("/message")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendMessage(
            @RequestBody Map<String, String> body) {

        Long sessionId = Long.parseLong(body.get("sessionId"));
        String message = body.get("message");

        String response = chatbotService.processMessage(sessionId, message);

        return ResponseEntity.ok(
                ApiResponse.ok(Map.of("response", response), "OK"));
    }
}