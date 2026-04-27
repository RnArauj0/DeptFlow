package com.debtflow.controller;

import com.debtflow.dto.response.DashboardResponseDto;
import com.debtflow.service.DashboardService;
import com.debtflow.mapper.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponseDto>> getSummary() {
        return ResponseEntity.ok(
                ApiResponse.ok(dashboardService.getSummary(), "Resumen obtenido"));
    }
}