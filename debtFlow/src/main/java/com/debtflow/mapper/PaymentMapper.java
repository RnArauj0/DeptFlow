package com.debtflow.mapper;


import com.debtflow.dto.request.PaymentRequestDto;
import com.debtflow.dto.response.PaymentResponseDto;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public Payment toEntity(PaymentRequestDto dto, Debt debt) {
        return Payment.builder()
                .debt(debt)
                .amountPaid(dto.amountPaid())
                .paymentDate(dto.paymentDate())
                .paymentMethod(dto.paymentMethod())
                .notes(dto.notes())
                .build();
    }

    public PaymentResponseDto toDto(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getDebt().getId(),
                payment.getAmountPaid(),
                payment.getPaymentDate(),
                payment.getPaymentMethod(),
                payment.getNotes(),
                payment.getCreatedAt()
        );
    }
}