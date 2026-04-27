package com.debtflow.controller;

import com.debtflow.dto.request.ClientRequestDto;
import com.debtflow.dto.response.ClientResponseDto;
import com.debtflow.mapper.util.ApiResponse;
import com.debtflow.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ClientResponseDto>>> findAll(
            @PageableDefault(size = 10, sort = "name") Pageable pageable,
            @RequestParam(required = false) String search) {

        Page<ClientResponseDto> result = (search != null && !search.isBlank())
                ? clientService.search(search, pageable)
                : clientService.findAll(pageable);

        return ResponseEntity.ok(ApiResponse.ok(result, "Clientes obtenidos"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponseDto>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok(clientService.findById(id), "Cliente encontrado"));
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<ApiResponse<ClientResponseDto>> findByDni(@PathVariable String dni) {
        return ResponseEntity.ok(
                ApiResponse.ok(clientService.findByDni(dni), "Cliente encontrado"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientResponseDto>> create(
            @Valid @RequestBody ClientRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(clientService.create(dto), "Cliente creado"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequestDto dto) {
        return ResponseEntity.ok(
                ApiResponse.ok(clientService.update(id, dto), "Cliente actualizado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        clientService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cliente desactivado"));
    }
}