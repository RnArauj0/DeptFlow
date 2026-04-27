package com.debtflow.dto.response;

import com.debtflow.model.enums.ClientStatus;

import java.time.LocalDateTime;

public record ClientResponseDto(
        Long id,
        String name,
        String dni,
        String email,
        String phone,
        ClientStatus status,
        Boolean active,
        LocalDateTime createdAt,
        int totalDebts,
        String riskLevel        // Semáforo: LOW, MEDIUM, HIGH
) {}