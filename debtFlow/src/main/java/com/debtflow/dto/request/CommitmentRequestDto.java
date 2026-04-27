package com.debtflow.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;


import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record CommitmentRequestDto(

        @NotNull(message = "El ID de la deuda es obligatorio")
        Long debtId,

        @NotNull(message = "El monto acordado es obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
        BigDecimal agreedAmount,

        @NotNull(message = "La fecha acordada es obligatoria")
        @Future(message = "La fecha acordada debe ser futura")
        LocalDate agreedDate,

        @Size(max = 255)
        String notes
) {}
