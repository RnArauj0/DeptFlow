package com.debtflow.service;

import com.debtflow.dto.request.ClientRequestDto;
import com.debtflow.dto.response.ClientResponseDto;
import com.debtflow.mapper.ClientMapper;
import com.debtflow.mapper.exception.BusinessException;
import com.debtflow.mapper.exception.ResourceNotFoundException;
import com.debtflow.model.entity.Client;
import com.debtflow.model.enums.ClientStatus;
import com.debtflow.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Transactional(readOnly = true)
    public Page<ClientResponseDto> findAll(Pageable pageable) {
        return clientRepository.findAllByActiveTrue(pageable)
                .map(clientMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ClientResponseDto> search(String query, Pageable pageable) {
        return clientRepository.searchByNameOrDni(query, pageable)
                .map(clientMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ClientResponseDto findById(Long id) {
        return clientMapper.toDto(getActiveClientOrThrow(id));
    }

    @Transactional(readOnly = true)
    public ClientResponseDto findByDni(String dni) {
        Client client = clientRepository.findByDniAndActiveTrue(dni)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cliente con DNI " + dni + " no encontrado"));
        return clientMapper.toDto(client);
    }

    @Transactional
    public ClientResponseDto create(ClientRequestDto dto) {
        if (clientRepository.existsByDni(dto.dni())) {
            throw new BusinessException(
                    "Ya existe un cliente con el DNI " + dto.dni());
        }
        Client saved = clientRepository.save(clientMapper.toEntity(dto));
        log.info("Cliente creado con id={}", saved.getId());
        return clientMapper.toDto(saved);
    }

    @Transactional
    public ClientResponseDto update(Long id, ClientRequestDto dto) {
        Client client = getActiveClientOrThrow(id);

        if (!client.getDni().equals(dto.dni())
                && clientRepository.existsByDni(dto.dni())) {
            throw new BusinessException(
                    "El DNI " + dto.dni() + " ya pertenece a otro cliente");
        }

        client.setName(dto.name());
        client.setDni(dto.dni());
        client.setEmail(dto.email());
        client.setPhone(dto.phone());

        log.info("Cliente actualizado id={}", id);
        return clientMapper.toDto(clientRepository.save(client));
    }

    @Transactional
    public void deactivate(Long id) {
        Client client = getActiveClientOrThrow(id);
        client.setActive(false);
        client.setStatus(ClientStatus.INACTIVE);
        clientRepository.save(client);
        log.info("Cliente desactivado id={}", id);
    }

    // Método interno reutilizable por otros servicios
    public Client getActiveClientOrThrow(Long id) {
        return clientRepository.findById(id)
                .filter(Client::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
    }
}