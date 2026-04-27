package com.debtflow.mapper;

import com.debtflow.dto.request.CommitmentRequestDto;
import com.debtflow.dto.response.CommitmentResponseDto;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.entity.PaymentCommitment;
import com.debtflow.model.enums.CommitmentStatus;
import org.springframework.stereotype.Component;

@Component
public class CommitmentMapper {

    public PaymentCommitment toEntity(CommitmentRequestDto dto, Debt debt) {
        return PaymentCommitment.builder()
                .debt(debt)
                .agreedAmount(dto.agreedAmount())
                .agreedDate(dto.agreedDate())
                .notes(dto.notes())
                .status(CommitmentStatus.PENDING)
                .build();
    }

    public CommitmentResponseDto toDto(PaymentCommitment commitment) {
        return new CommitmentResponseDto(
                commitment.getId(),
                commitment.getDebt().getId(),
                commitment.getAgreedAmount(),
                commitment.getAgreedDate(),
                commitment.getNotes(),
                commitment.getStatus(),
                commitment.getCreatedAt()
        );
    }
}