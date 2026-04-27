package com.debtflow.repository;

import com.debtflow.model.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    Optional<ChatSession> findTopByClientIdOrderByCreatedAtDesc(Long clientId);

}