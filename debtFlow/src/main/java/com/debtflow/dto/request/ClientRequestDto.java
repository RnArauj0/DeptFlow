package com.debtflow.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ClientRequestDto(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String name,

        @NotBlank(message = "El DNI es obligatorio")
        @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 dígitos")
        String dni,

        @Email(message = "El email no tiene formato válido")
        String email,

        @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Teléfono inválido")
        String phone
) {}