package com.debtflow.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PaymentResponseDto(
        Long id,
        Long debtId,
        BigDecimal amountPaid,
        LocalDate paymentDate,
        String paymentMethod,
        String notes,
        LocalDateTime createdAt
) {}