package com.debtflow.controller;

import com.debtflow.dto.request.PaymentRequestDto;
import com.debtflow.dto.response.PaymentResponseDto;
import com.debtflow.service.PaymentService;
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
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/debt/{debtId}")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDto>>> findByDebt(
            @PathVariable Long debtId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(paymentService.findByDebt(debtId, pageable),
                        "Pagos obtenidos"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDto>> register(
            @Valid @RequestBody PaymentRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(paymentService.register(dto), "Pago registrado"));
    }
}
