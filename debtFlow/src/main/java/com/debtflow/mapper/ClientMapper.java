package com.debtflow.mapper;

import com.debtflow.dto.request.ClientRequestDto;
import com.debtflow.dto.response.ClientResponseDto;
import com.debtflow.model.entity.Client;
import com.debtflow.model.enums.ClientStatus;
import com.debtflow.model.enums.DebtStatus;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public Client toEntity(ClientRequestDto dto) {
        return Client.builder()
                .name(dto.name())
                .dni(dto.dni())
                .email(dto.email())
                .phone(dto.phone())
                .status(ClientStatus.ACTIVE)
                .active(true)
                .build();
    }

    public ClientResponseDto toDto(Client client) {
        long overdueCount = client.getDebts() == null ? 0 :
                client.getDebts().stream()
                        .filter(d -> d.getStatus() == DebtStatus.OVERDUE)
                        .count();

        return new ClientResponseDto(
                client.getId(),
                client.getName(),
                client.getDni(),
                client.getEmail(),
                client.getPhone(),
                client.getStatus(),
                client.getActive(),
                client.getCreatedAt(),
                client.getDebts() == null ? 0 : client.getDebts().size(),
                resolveRiskLevel(overdueCount)
        );
    }

    private String resolveRiskLevel(long overdueCount) {
        if (overdueCount == 0) return "LOW";
        if (overdueCount <= 2) return "MEDIUM";
        return "HIGH";
    }
}