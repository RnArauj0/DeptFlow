package com.debtflow.repository;

import com.debtflow.model.entity.ChatMessage;
import com.debtflow.model.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findAllBySessionOrderByTimestampAsc(ChatSession session);

    List<ChatMessage> findTop10BySessionOrderByTimestampDesc(ChatSession session);
}