// src/app/components/AppointmentScheduler.tsx
"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Appointment {
  id: number;
  date: Dayjs;
  description: string;
}

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(dayjs());
  const [description, setDescription] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleAddAppointment = () => {
    if (selectedDate && selectedTime) {
      const appointmentDate = selectedDate
        .hour(selectedTime.hour())
        .minute(selectedTime.minute());
      const newAppointment: Appointment = {
        id: Date.now(),
        date: appointmentDate,
        description
      };
      setAppointments((prev) => [...prev, newAppointment]);
      // Simulación de recordatorio automático (email/SMS)
      alert("Recordatorio enviado para la cita programada.");
      setDescription("");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Programación de Citas
        </Typography>
        <Paper style={{ padding: 20, marginBottom: 20 }}>
          <DatePicker
            label="Selecciona la fecha"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            aria-label="Seleccionar fecha para la cita"
          />
          <TimePicker
            label="Selecciona la hora"
            value={selectedTime}
            onChange={(newValue) => setSelectedTime(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            aria-label="Seleccionar hora para la cita"
          />
          <TextField
            label="Descripción de la cita"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            aria-label="Descripción de la cita"
          />
          <Button variant="contained" color="primary" onClick={handleAddAppointment} aria-label="Agendar cita">
            Agendar Cita
          </Button>
        </Paper>
        <Typography variant="subtitle1" gutterBottom>
          Próximas Citas
        </Typography>
        <List>
          {appointments.map((appt) => (
            <ListItem key={appt.id}>
              <ListItemText
                primary={appt.date.format("DD/MM/YYYY HH:mm")}
                secondary={appt.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </LocalizationProvider>
  );
}
