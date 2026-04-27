package com.debtflow.dto.response;

import com.debtflow.model.enums.DebtStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DebtResponseDto(
        Long id,
        Long clientId,
        String clientName,
        BigDecimal amount,
        BigDecimal paidAmount,
        BigDecimal remainingAmount,
        String description,
        LocalDate dueDate,
        DebtStatus status,
        LocalDateTime createdAt
) {}