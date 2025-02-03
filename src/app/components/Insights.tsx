// src/app/components/Insights.tsx
"use client";

import React from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button
} from "@mui/material";

export default function Insights() {
  const insightsData = [
    {
      time: "00:05",
      emotion: "Tristeza",
      description: "Inicio de la sesión con tono bajo."
    },
    {
      time: "00:15",
      emotion: "Alegría",
      description: "Mejora notable en el estado anímico."
    },
    {
      time: "00:25",
      emotion: "Ansiedad",
      description: "Se observó tensión en momentos clave."
    }
  ];

  const handleDownload = () => {
    // Aquí se implementaría la generación y descarga del PDF.
    console.log("Descargando reporte en PDF...");
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Insights Detallados
        </Typography>
        <List>
          {insightsData.map((insight, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`${insight.time} - ${insight.emotion}`}
                secondary={insight.description}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ mt: 3 }}
        >
          Descargar Reporte PDF
        </Button>
      </Box>
    </Paper>
  );
}
