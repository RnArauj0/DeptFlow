package com.debtflow.model.entity;


import com.debtflow.model.enums.CommitmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_commitments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "debt")
public class PaymentCommitment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debt_id", nullable = false)
    private Debt debt;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal agreedAmount;

    @Column(nullable = false)
    private LocalDate agreedDate;

    @Column(length = 255)
    private String notes;

    @Enumerated(EnumType.STRING)          // ← clave para enums
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CommitmentStatus status = CommitmentStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
