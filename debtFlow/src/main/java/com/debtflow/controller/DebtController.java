package com.debtflow.controller;

import com.debtflow.dto.request.DebtRequestDto;
import com.debtflow.dto.response.DebtResponseDto;
import com.debtflow.model.enums.DebtStatus;
import com.debtflow.service.DebtService;
import com.debtflow.mapper.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/debts")
@RequiredArgsConstructor
public class DebtController {

    private final DebtService debtService;

    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<Page<DebtResponseDto>>> findByClient(
            @PathVariable Long clientId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(debtService.findByClient(clientId, pageable),
                        "Deudas obtenidas"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DebtResponseDto>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok(debtService.findById(id), "Deuda encontrada"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DebtResponseDto>> create(
            @Valid @RequestBody DebtRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(debtService.create(dto), "Deuda registrada"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DebtResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam DebtStatus status) {
        return ResponseEntity.ok(
                ApiResponse.ok(debtService.updateStatus(id, status),
                        "Estado actualizado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        debtService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Deuda eliminada"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DebtResponseDto>>> findAll(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(debtService.findAll(pageable), "Deudas obtenidas"));
    }
}