package com.debtflow.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record DebtRequestDto(

        @NotNull(message = "El ID del cliente es obligatorio")
        Long clientId,

        @NotNull(message = "El monto es obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
        @Digits(integer = 10, fraction = 2, message = "Formato de monto inválido")
        BigDecimal amount,

        @Size(max = 255, message = "La descripción no puede superar 255 caracteres")
        String description,

        @NotNull(message = "La fecha de vencimiento es obligatoria")
        @Future(message = "La fecha de vencimiento debe ser futura")
        LocalDate dueDate
) {}