package com.debtflow.dto.response;

import java.math.BigDecimal;

public record DashboardResponseDto(
        long totalClients,
        long activeDebts,
        long overdueDebts,
        BigDecimal totalDebtAmount,
        BigDecimal totalCollected,
        BigDecimal totalPending,
        double collectionRate        // % de cobro
) {}