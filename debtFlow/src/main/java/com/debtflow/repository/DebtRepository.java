package com.debtflow.repository;

import com.debtflow.model.entity.Debt;
import com.debtflow.model.enums.DebtStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, Long> {

    Page<Debt> findAllByClientId(Long clientId, Pageable pageable);
    List<Debt> findAllByClientIdAndStatus(Long clientId, DebtStatus status);
    List<Debt> findAllByDueDateBeforeAndStatusNot(LocalDate date, DebtStatus status);

    @Query("SELECT SUM(d.amount - d.paidAmount) FROM Debt d WHERE d.status != 'PAID'")
    BigDecimal sumTotalPending();

    @Query("SELECT SUM(d.paidAmount) FROM Debt d")
    BigDecimal sumTotalCollected();

    long countByStatus(DebtStatus status);
}