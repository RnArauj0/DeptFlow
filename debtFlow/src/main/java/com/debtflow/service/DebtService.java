package com.debtflow.service;

import com.debtflow.dto.request.DebtRequestDto;
import com.debtflow.dto.response.DebtResponseDto;
import com.debtflow.mapper.exception.BusinessException;
import com.debtflow.mapper.exception.ResourceNotFoundException;
import com.debtflow.mapper.DebtMapper;
import com.debtflow.model.entity.Client;
import com.debtflow.model.entity.Debt;
import com.debtflow.model.enums.DebtStatus;
import com.debtflow.repository.DebtRepository;
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
public class DebtService {

    private final DebtRepository debtRepository;
    private final DebtMapper debtMapper;
    private final ClientService clientService;

    @Transactional(readOnly = true)
    public Page<DebtResponseDto> findByClient(Long clientId, Pageable pageable) {
        return debtRepository.findAllByClientId(clientId, pageable)
                .map(debtMapper::toDto);
    }

    @Transactional(readOnly = true)
    public DebtResponseDto findById(Long id) {
        return debtMapper.toDto(getDebtOrThrow(id));
    }

    @Transactional
    public DebtResponseDto create(DebtRequestDto dto) {
        Client client = clientService.getActiveClientOrThrow(dto.clientId());
        Debt saved = debtRepository.save(debtMapper.toEntity(dto, client));
        log.info("Deuda creada id={} para cliente id={}", saved.getId(), dto.clientId());
        return debtMapper.toDto(saved);
    }

    @Transactional
    public DebtResponseDto updateStatus(Long id, DebtStatus newStatus) {
        Debt debt = getDebtOrThrow(id);
        validateStatusTransition(debt.getStatus(), newStatus);
        debt.setStatus(newStatus);
        log.info("Estado de deuda id={} cambiado a {}", id, newStatus);
        return debtMapper.toDto(debtRepository.save(debt));
    }

    @Transactional
    public void delete(Long id) {
        Debt debt = getDebtOrThrow(id);
        if (debt.getStatus() == DebtStatus.PAID) {
            throw new BusinessException(
                    "No se puede eliminar una deuda ya pagada");
        }
        debtRepository.delete(debt);
        log.info("Deuda eliminada id={}", id);
    }

    // Job automático: marca como OVERDUE las deudas vencidas
    @Scheduled(cron = "0 0 1 * * *")  // cada día a la 1 AM
    @Transactional
    public void markOverdueDebts() {
        List<Debt> overdue = debtRepository
                .findAllByDueDateBeforeAndStatusNot(LocalDate.now(), DebtStatus.PAID);
        overdue.forEach(d -> d.setStatus(DebtStatus.OVERDUE));
        debtRepository.saveAll(overdue);
        log.info("Marcadas {} deudas como OVERDUE", overdue.size());
    }

    private void validateStatusTransition(DebtStatus current, DebtStatus next) {
        boolean invalid = switch (current) {
            case PAID, CANCELLED -> true;
            case PENDING -> next == DebtStatus.PAID;
            default -> false;
        };
        // Regla: no se puede pasar de PAID o CANCELLED a ningún otro estado
        if (current == DebtStatus.PAID || current == DebtStatus.CANCELLED) {
            throw new BusinessException(
                    "No se puede cambiar el estado de una deuda " + current);
        }
    }

    public Debt getDebtOrThrow(Long id) {
        return debtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deuda", id));
    }

    @Transactional(readOnly = true)
    public Page<DebtResponseDto> findAll(Pageable pageable) {
        return debtRepository.findAll(pageable)
                .map(debtMapper::toDto);
    }

}