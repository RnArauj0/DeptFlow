package com.debtflow.controller;

import com.debtflow.dto.request.CommitmentRequestDto;
import com.debtflow.dto.response.CommitmentResponseDto;
import com.debtflow.model.enums.CommitmentStatus;
import com.debtflow.service.CommitmentService;
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
@RequestMapping("/api/v1/commitments")
@RequiredArgsConstructor
public class CommitmentController {

    private final CommitmentService commitmentService;

    @GetMapping("/debt/{debtId}")
    public ResponseEntity<ApiResponse<Page<CommitmentResponseDto>>> findByDebt(
            @PathVariable Long debtId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(commitmentService.findByDebt(debtId, pageable),
                        "Compromisos obtenidos"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommitmentResponseDto>> create(
            @Valid @RequestBody CommitmentRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(commitmentService.create(dto), "Compromiso creado"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CommitmentResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam CommitmentStatus status) {
        return ResponseEntity.ok(
                ApiResponse.ok(commitmentService.updateStatus(id, status),
                        "Estado actualizado"));
    }
}