package br.cantinho.websocketchat.websocketchat.controller;

import br.cantinho.websocketchat.websocketchat.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import static br.cantinho.websocketchat.websocketchat.model.ChatMessage.*;

@Component
public class WebSocketEventListener {

  private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);

  @Autowired
  private SimpMessageSendingOperations messagingTemplate;

  @EventListener
  public void handleWebSocketConnectListener(final SessionConnectEvent event) {
    LOGGER.info("Received a new web socket connection");
  }

  @EventListener
  public void handleWebSocketDisconnectedListener(final SessionDisconnectEvent event) {
    final StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

    final String username = (String) headerAccessor.getSessionAttributes().get("username");
    if(username != null) {
      LOGGER.info("User disconnected: {}", username);

      ChatMessage chatMessage = new ChatMessage();
      chatMessage.setType(MessageType.LEAVE);
      chatMessage.setSender(username);

      messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
  }

}
