package com.debtflow.service.chatbot;

import org.springframework.stereotype.Component;

@Component
public class IntentResolver {

    public enum Intent {
        GREETING,
        QUERY_DEBT,
        SIMULATE_INSTALLMENTS,
        REGISTER_COMMITMENT,
        QUERY_COMMITMENT,
        REGISTER_PAYMENT,
        FAREWELL,
        UNKNOWN
    }

    private static final String[] GREETING_KEYWORDS =
            {"hola", "buenos", "buenas", "hi", "saludos", "buen dia", "buendia"};

    private static final String[] QUERY_DEBT_KEYWORDS =
            {"deuda", "debo", "cuanto debo", "saldo", "pendiente", "cuanto tengo",
                    "mi deuda", "ver deuda", "consultar"};

    private static final String[] SIMULATE_KEYWORDS =
            {"cuotas", "simular", "simulacion", "plan de pago", "pagar en",
                    "dividir", "financiar", "plazo"};

    private static final String[] COMMITMENT_KEYWORDS =
            {"compromiso", "me comprometo", "voy a pagar", "pagare", "pagaré",
                    "acuerdo", "fecha de pago", "promesa"};

    private static final String[] PAYMENT_KEYWORDS =
            {"registrar pago", "abonar", "abono", "pague", "pagué", "hice un pago"};

    private static final String[] FAREWELL_KEYWORDS =
            {"adios", "adiós", "bye", "chau", "hasta luego", "gracias", "ok gracias"};

    public Intent resolve(String message) {
        String normalized = normalize(message);

        if (matches(normalized, GREETING_KEYWORDS))    return Intent.GREETING;
        if (matches(normalized, FAREWELL_KEYWORDS))    return Intent.FAREWELL;
        if (matches(normalized, PAYMENT_KEYWORDS))     return Intent.REGISTER_PAYMENT;
        if (matches(normalized, COMMITMENT_KEYWORDS))  return Intent.REGISTER_COMMITMENT;
        if (matches(normalized, SIMULATE_KEYWORDS))    return Intent.SIMULATE_INSTALLMENTS;
        if (matches(normalized, QUERY_DEBT_KEYWORDS))  return Intent.QUERY_DEBT;

        return Intent.UNKNOWN;
    }

    private boolean matches(String text, String[] keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }

    private String normalize(String text) {
        return text.toLowerCase()
                .trim()
                .replace("á", "a").replace("é", "e")
                .replace("í", "i").replace("ó", "o")
                .replace("ú", "u").replace("ñ", "n");
    }
}