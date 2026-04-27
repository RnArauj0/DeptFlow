package com.debtflow.dto.request;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record PaymentRequestDto(
    @NotNull(message = "El ID de la deuda es obligatorio")
    Long debtId,

    @NotNull(message = "El monto pagado es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    BigDecimal amountPaid,

    @NotNull(message = "La fecha de pago es obligatoria")
    LocalDate paymentDate,

    @Size(max = 50)
    String paymentMethod,

    @Size(max = 255)
    String notes
) {}
