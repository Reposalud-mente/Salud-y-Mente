// src/app/components/SecureMessaging.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Paper
} from "@mui/material";

interface Message {
  id: number;
  sender: "therapist" | "patient";
  text: string;
  attachment?: string;
}

export default function SecureMessaging() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const message: Message = {
      id: Date.now(),
      sender: "therapist",
      text: newMessage,
      attachment: attachment ? attachment.name : undefined
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setAttachment(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Mensajería Segura
      </Typography>
      <Paper style={{ maxHeight: 300, overflowY: "auto", padding: 10, marginBottom: 20 }} aria-label="Historial de mensajes">
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText
                primary={`${msg.sender === "therapist" ? "Tú" : "Paciente"}: ${msg.text}`}
                secondary={msg.attachment ? `Adjunto: ${msg.attachment}` : ""}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box display="flex" flexDirection="column">
        <TextField
          label="Escribe tu mensaje"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          fullWidth
          multiline
          rows={2}
          aria-label="Entrada de mensaje"
        />
        <Box mt={1} display="flex" alignItems="center">
          <input
            accept="*"
            style={{ display: "none" }}
            id="message-attachment"
            type="file"
            onChange={handleFileChange}
            aria-label="Adjuntar archivo"
          />
          <label htmlFor="message-attachment">
            <Button variant="outlined" color="primary" component="span">
              Adjuntar Archivo
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            style={{ marginLeft: 10 }}
            aria-label="Enviar mensaje"
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
