package com.debtflow.repository;

import com.debtflow.model.entity.PaymentCommitment;
import com.debtflow.model.enums.CommitmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CommitmentRepository extends JpaRepository<PaymentCommitment, Long> {
    Page<PaymentCommitment> findAllByDebtId(Long debtId, Pageable pageable);
    List<PaymentCommitment> findAllByAgreedDateBeforeAndStatus(
            LocalDate date, CommitmentStatus status);
}