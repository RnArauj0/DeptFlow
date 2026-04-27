package com.debtflow.service;

import com.debtflow.dto.request.PaymentRequestDto;
import com.debtflow.dto.response.PaymentResponseDto;
import com.debtflow.mapper.exception.BusinessException;
import com.debtflow.mapper.PaymentMapper;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.entity.Payment;
import com.debtflow.model.enums.DebtStatus;
import com.debtflow.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final DebtService debtService;

    @Transactional(readOnly = true)
    public Page<PaymentResponseDto> findByDebt(Long debtId, Pageable pageable) {
        return paymentRepository.findAllByDebtId(debtId, pageable)
                .map(paymentMapper::toDto);
    }

    @Transactional
    public PaymentResponseDto register(PaymentRequestDto dto) {
        Debt debt = debtService.getDebtOrThrow(dto.debtId());

        if (debt.getStatus() == DebtStatus.PAID) {
            throw new BusinessException("La deuda ya está completamente pagada");
        }

        BigDecimal remaining = debt.getRemainingAmount();
        if (dto.amountPaid().compareTo(remaining) > 0) {
            throw new BusinessException(
                    "El monto ingresado (S/. " + dto.amountPaid() +
                            ") supera el saldo pendiente (S/. " + remaining + ")");
        }

        // Acumular pago en la deuda
        debt.setPaidAmount(debt.getPaidAmount().add(dto.amountPaid()));

        // Marcar como pagada si el saldo es 0
        if (debt.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0) {
            debt.setStatus(DebtStatus.PAID);
            log.info("Deuda id={} marcada como PAID", debt.getId());
        }

        Payment saved = paymentRepository.save(paymentMapper.toEntity(dto, debt));
        log.info("Pago registrado id={} por S/. {}", saved.getId(), dto.amountPaid());
        return paymentMapper.toDto(saved);
    }
}