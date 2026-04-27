package com.debtflow.service;

import com.debtflow.dto.request.CommitmentRequestDto;
import com.debtflow.dto.response.CommitmentResponseDto;
import com.debtflow.mapper.exception.ResourceNotFoundException;
import com.debtflow.mapper.CommitmentMapper;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.entity.PaymentCommitment;
import com.debtflow.model.enums.CommitmentStatus;
import com.debtflow.repository.CommitmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommitmentService {

    private final CommitmentRepository commitmentRepository;
    private final CommitmentMapper commitmentMapper;
    private final DebtService debtService;

    @Transactional(readOnly = true)
    public Page<CommitmentResponseDto> findByDebt(Long debtId, Pageable pageable) {
        return commitmentRepository.findAllByDebtId(debtId, pageable)
                .map(commitmentMapper::toDto);
    }

    @Transactional
    public CommitmentResponseDto create(CommitmentRequestDto dto) {
        Debt debt = debtService.getDebtOrThrow(dto.debtId());
        PaymentCommitment saved = commitmentRepository
                .save(commitmentMapper.toEntity(dto, debt));
        log.info("Compromiso creado id={}", saved.getId());
        return commitmentMapper.toDto(saved);
    }

    @Transactional
    public CommitmentResponseDto updateStatus(Long id, CommitmentStatus newStatus) {
        PaymentCommitment commitment = commitmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compromiso", id));
        commitment.setStatus(newStatus);
        return commitmentMapper.toDto(commitmentRepository.save(commitment));
    }

    // Job: marca como BROKEN compromisos vencidos no cumplidos
    @Scheduled(cron = "0 0 2 * * *")  // cada día a las 2 AM
    @Transactional
    public void markBrokenCommitments() {
        List<PaymentCommitment> broken = commitmentRepository
                .findAllByAgreedDateBeforeAndStatus(
                        LocalDate.now(), CommitmentStatus.PENDING);
        broken.forEach(c -> c.setStatus(CommitmentStatus.BROKEN));
        commitmentRepository.saveAll(broken);
        log.info("Marcados {} compromisos como BROKEN", broken.size());
    }
}