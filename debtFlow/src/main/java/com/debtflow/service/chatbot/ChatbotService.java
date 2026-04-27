package com.debtflow.service.chatbot;

import com.debtflow.config.GeminiClient;
import com.debtflow.model.entity.ChatMessage;
import com.debtflow.model.entity.ChatSession;
import com.debtflow.model.entity.Client;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.enums.DebtStatus;
import com.debtflow.model.enums.MessageSender;
import com.debtflow.repository.ChatMessageRepository;
import com.debtflow.repository.ChatSessionRepository;
import com.debtflow.repository.ClientRepository;
import com.debtflow.repository.DebtRepository;
import com.debtflow.service.chatbot.IntentResolver.Intent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final IntentResolver intentResolver;
    private final GeminiClient geminiClient;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ClientRepository clientRepository;
    private final DebtRepository debtRepository;

    private static final String SYSTEM_CONTEXT = """
        Eres un asistente virtual de cobranzas llamado DebtFlow Assistant.
        Tu función es ayudar a los clientes a consultar su deuda, simular planes
        de pago y registrar compromisos de pago.
        Responde siempre en español, de forma amable, clara y concisa.
        No inventes información financiera. Si no tienes datos del cliente,
        pídele su DNI para buscarlo,
        Máximo 3 oraciones por respuesta.
        """;

    @Transactional
    public String processMessage(Long sessionId, String userMessage) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        // Guardar mensaje del usuario
        saveMessage(session, userMessage, MessageSender.USER);

        // Resolver intención
        Intent intent = intentResolver.resolve(userMessage);
        log.info("Sesión={} Intent={} mensaje='{}'", sessionId, intent, userMessage);

        String botResponse = switch (intent) {
            case GREETING           -> handleGreeting(session);
            case FAREWELL           -> handleFarewell();
            case QUERY_DEBT         -> handleQueryDebt(session, userMessage);
            case SIMULATE_INSTALLMENTS -> handleSimulate(session, userMessage);
            case REGISTER_COMMITMENT -> handleCommitment(session);
            case QUERY_COMMITMENT   -> handleQueryCommitment(session);
            case REGISTER_PAYMENT   -> handlePaymentInfo();
            case UNKNOWN            -> handleUnknown(session, userMessage);
        };


        // Guardar respuesta del bot
        saveMessage(session, botResponse, MessageSender.BOT);

        return botResponse;
    }

    @Transactional
    public Long createSession(Long clientId) {
        Optional<Client> client = clientRepository.findById(clientId);
        ChatSession session = ChatSession.builder()
                .client(client.orElse(null))
                .build();
        return chatSessionRepository.save(session).getId();
    }

    @Transactional
    public Long createAnonymousSession() {
        ChatSession session = ChatSession.builder().build();
        return chatSessionRepository.save(session).getId();
    }

    // ─── Handlers de intención propia ───────────────────────────────────────

    private String handleQueryCommitment(ChatSession session) {
        if (session.getClient() == null) {
            return "Para consultar tus compromisos de pago, necesito identificarte. " +
                    "¿Me puedes indicar tu DNI?";
        }
        return "Para consultar tus compromisos de pago registrados, " +
                "por favor contacta a nuestro equipo de cobranzas.";
    }


    private String handleGreeting(ChatSession session) {
        String name = session.getClient() != null
                ? ", " + session.getClient().getName().split(" ")[0]
                : "";
        return "¡Hola" + name + "! Soy DebtFlow Assistant 👋 " +
                "Puedo ayudarte a consultar tu deuda, simular un plan de cuotas " +
                "o registrar un compromiso de pago. ¿En qué te ayudo hoy?";
    }

    private String handleFarewell() {
        return "¡Hasta luego! Recuerda que puedes contactarnos cuando necesites. " +
                "Que tengas un excelente día 😊";
    }

    private String handleQueryDebt(ChatSession session, String message) {
        if (session.getClient() != null) {
            return buildDebtSummary(session.getClient());
        }

        String dni = extractDni(message);
        log.info("DNI extraído del mensaje: '{}'", dni);  // ← ver qué extrae

        if (dni != null) {
            Optional<Client> client = clientRepository.findByDniAndActiveTrue(dni);
            log.info("Cliente encontrado: {}", client.isPresent());  // ← ver si lo encuentra

            if (client.isPresent()) {
                session.setClient(client.get());
                chatSessionRepository.save(session);
                return buildDebtSummary(client.get());
            }
            return "No encontré ningún cliente con el DNI " + dni +
                    ". Por favor verifica el número e intenta de nuevo.";
        }

        return "Para consultar tu deuda necesito tu número de DNI. " +
                "¿Me lo puedes proporcionar?";
    }

    private String buildDebtSummary(Client client) {
        List<Debt> debts = debtRepository
                .findAllByClientIdAndStatus(client.getId(), DebtStatus.PENDING);
        debts.addAll(debtRepository
                .findAllByClientIdAndStatus(client.getId(), DebtStatus.OVERDUE));

        if (debts.isEmpty()) {
            return "¡Buenas noticias, " + client.getName().split(" ")[0] +
                    "! No tienes deudas pendientes en este momento 🎉";
        }

        BigDecimal total = debts.stream()
                .map(Debt::getRemainingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        StringBuilder sb = new StringBuilder();
        sb.append("Hola ").append(client.getName().split(" ")[0])
                .append(", tienes ").append(debts.size())
                .append(debts.size() == 1 ? " deuda pendiente" : " deudas pendientes")
                .append(" por un total de S/. ").append(total.setScale(2, RoundingMode.HALF_UP))
                .append(".\n");

        debts.forEach(d -> sb.append("• S/. ")
                .append(d.getRemainingAmount().setScale(2, RoundingMode.HALF_UP))
                .append(" — vence ").append(d.getDueDate())
                .append(" [").append(d.getStatus()).append("]\n"));

        sb.append("\n¿Deseas simular un plan de cuotas o registrar un compromiso de pago?");
        return sb.toString();
    }

    private String handleSimulate(ChatSession session, String message) {
        if (session.getClient() == null) {
            return "Para simular un plan de cuotas primero necesito saber tu deuda. " +
                    "¿Me puedes dar tu DNI?";
        }

        // Extraer número de cuotas del mensaje
        int installments = extractNumber(message);
        if (installments < 2 || installments > 24) {
            installments = 3; // default
        }

        List<Debt> debts = debtRepository
                .findAllByClientIdAndStatus(session.getClient().getId(), DebtStatus.PENDING);
        debts.addAll(debtRepository
                .findAllByClientIdAndStatus(session.getClient().getId(), DebtStatus.OVERDUE));

        if (debts.isEmpty()) {
            return "No tienes deudas pendientes para simular un plan de cuotas.";
        }

        BigDecimal total = debts.stream()
                .map(Debt::getRemainingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal cuota = total.divide(
                BigDecimal.valueOf(installments), 2, RoundingMode.CEILING);

        return "📊 Simulación de plan de pagos:\n" +
                "• Deuda total: S/. " + total.setScale(2, RoundingMode.HALF_UP) + "\n" +
                "• Cuotas: " + installments + "\n" +
                "• Monto por cuota: S/. " + cuota + "\n\n" +
                "¿Deseas registrar este compromiso de pago?";
    }

    private String handleCommitment(ChatSession session) {
        if (session.getClient() == null) {
            return "Para registrar un compromiso necesito identificarte primero. " +
                    "¿Me puedes indicar tu DNI?";
        }
        return "Para registrar tu compromiso de pago, indícame el monto y la fecha " +
                "en que realizarás el pago. Ejemplo: 'Me comprometo a pagar S/. 500 " +
                "el 30 de marzo'.";
    }

    private String handlePaymentInfo() {
        return "Para registrar un pago, por favor comunícate con nuestro equipo " +
                "de cobranzas o acércate a nuestras oficinas. " +
                "También puedes indicarme tu DNI para que un asesor te contacte.";
    }

    private String handleUnknown(ChatSession session, String message) {
        // Intentar extraer DNI aunque la intención sea UNKNOWN
        String dni = extractDni(message);
        if (dni != null) {
            log.info("DNI encontrado en mensaje UNKNOWN: {}", dni);
            Optional<Client> client = clientRepository.findByDniAndActiveTrue(dni);
            if (client.isPresent()) {
                session.setClient(client.get());
                chatSessionRepository.save(session);
                return buildDebtSummary(client.get());
            }
            return "No encontré ningún cliente con el DNI " + dni +
                    ". Por favor verifica el número e intenta de nuevo.";
        }

        // Sin DNI — delegar a Gemini
        String contextExtra = "";
        if (session.getClient() != null) {
            contextExtra = "\nContexto: El cliente " + session.getClient().getName() +
                    " tiene deudas pendientes en nuestro sistema.";
        }
        return geminiClient.generate(SYSTEM_CONTEXT + contextExtra, message);
    }

    // ─── Utilidades ─────────────────────────────────────────────────────────

    private void saveMessage(ChatSession session, String text, MessageSender sender) {
        chatMessageRepository.save(ChatMessage.builder()
                .session(session)
                .message(text)
                .sender(sender)
                .build());
    }

    private String extractDni(String message) {
        // Busca exactamente 8 dígitos consecutivos en el mensaje
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("\\b\\d{8}\\b")
                .matcher(message);
        return m.find() ? m.group() : null;
    }

    private int extractNumber(String message) {
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("\\b(\\d{1,2})\\b")
                .matcher(message);
        return m.find() ? Integer.parseInt(m.group()) : 0;
    }
}