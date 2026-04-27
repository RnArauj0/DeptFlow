package com.debtflow.dto.response;

import com.debtflow.model.enums.CommitmentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CommitmentResponseDto(
        Long id,
        Long debtId,
        BigDecimal agreedAmount,
        LocalDate agreedDate,
        String notes,
        CommitmentStatus status,
        LocalDateTime createdAt
) {}