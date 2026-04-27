package com.debtflow.mapper;

import com.debtflow.dto.request.DebtRequestDto;
import com.debtflow.dto.response.DebtResponseDto;
import com.debtflow.model.entity.Client;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.enums.DebtStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DebtMapper {

    public Debt toEntity(DebtRequestDto dto, Client client) {
        return Debt.builder()
                .client(client)
                .amount(dto.amount())
                .paidAmount(BigDecimal.ZERO)
                .description(dto.description())
                .dueDate(dto.dueDate())
                .status(DebtStatus.PENDING)
                .build();
    }

    public DebtResponseDto toDto(Debt debt) {
        return new DebtResponseDto(
                debt.getId(),
                debt.getClient().getId(),
                debt.getClient().getName(),
                debt.getAmount(),
                debt.getPaidAmount(),
                debt.getRemainingAmount(),
                debt.getDescription(),
                debt.getDueDate(),
                debt.getStatus(),
                debt.getCreatedAt()
        );
    }
}