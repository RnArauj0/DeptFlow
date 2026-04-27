package com.debtflow.repository;

import com.debtflow.model.entity.Client;
import com.debtflow.model.enums.ClientStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByDniAndActiveTrue(String dni);
    boolean existsByDni(String dni);
    Page<Client> findAllByActiveTrue(Pageable pageable);
    Page<Client> findAllByActiveTrueAndStatus(ClientStatus status, Pageable pageable);

    @Query("SELECT c FROM Client c WHERE c.active = true AND " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "c.dni LIKE CONCAT('%', :search, '%'))")
    Page<Client> searchByNameOrDni(@Param("search") String search, Pageable pageable);
}