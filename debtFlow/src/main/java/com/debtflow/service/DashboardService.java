package com.debtflow.service;

import com.debtflow.dto.response.DashboardResponseDto;
import com.debtflow.model.enums.DebtStatus;
import com.debtflow.repository.ClientRepository;
import com.debtflow.repository.DebtRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ClientRepository clientRepository;
    private final DebtRepository debtRepository;

    @Transactional(readOnly = true)
    public DashboardResponseDto getSummary() {
        long totalClients = clientRepository.count();
        long activeDebts  = debtRepository.countByStatus(DebtStatus.PENDING)
                + debtRepository.countByStatus(DebtStatus.NEGOTIATING);
        long overdueDebts = debtRepository.countByStatus(DebtStatus.OVERDUE);

        BigDecimal totalPending   = nullSafe(debtRepository.sumTotalPending());
        BigDecimal totalCollected = nullSafe(debtRepository.sumTotalCollected());
        BigDecimal totalAmount    = totalPending.add(totalCollected);

        double collectionRate = totalAmount.compareTo(BigDecimal.ZERO) == 0 ? 0 :
                totalCollected
                        .divide(totalAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();

        return new DashboardResponseDto(
                totalClients,
                activeDebts,
                overdueDebts,
                totalAmount,
                totalCollected,
                totalPending,
                collectionRate
        );
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}