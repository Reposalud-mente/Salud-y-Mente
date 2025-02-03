// src/app/components/SessionAnalysis.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Slider,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Emotion = "Happiness" | "Sadness" | "Anger" | "Surprise" | "Disgust" | "Fear";

interface DataPoint {
  time: string;
  emotions: Record<Emotion, number>;
}

const EMOTIONS: Emotion[] = ["Happiness", "Sadness", "Anger", "Surprise", "Disgust", "Fear"];

/**
 * Función que genera datos simulados para el análisis.
 * Se generan "points" datos, espaciados según la frecuencia de muestreo (en segundos).
 */
const generateSimulatedData = (samplingFrequency: number, points: number = 10): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = dayjs();
  for (let i = 0; i < points; i++) {
    const time = now.subtract((points - i) * samplingFrequency, "second").format("HH:mm:ss");
    const emotions: Record<Emotion, number> = {
      Happiness: Math.floor(Math.random() * 100),
      Sadness: Math.floor(Math.random() * 100),
      Anger: Math.floor(Math.random() * 100),
      Surprise: Math.floor(Math.random() * 100),
      Disgust: Math.floor(Math.random() * 100),
      Fear: Math.floor(Math.random() * 100)
    };
    data.push({ time, emotions });
  }
  return data;
};

export default function SessionAnalysis() {
  // Estados para manejar carga, frecuencia de muestreo, selección de emociones, datos y modo avanzado
  const [loading, setLoading] = useState<boolean>(true);
  const [samplingFrequency, setSamplingFrequency] = useState<number>(10); // en segundos
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>(EMOTIONS);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Simulación de la obtención de datos (podría ser una llamada a un API)
  const fetchAnalysisData = () => {
    setLoading(true);
    setTimeout(() => {
      const simulatedData = generateSimulatedData(samplingFrequency, 15);
      setDataPoints(simulatedData);
      setLoading(false);
    }, 2000);
  };

  // Actualizar datos al cambiar la frecuencia de muestreo
  useEffect(() => {
    fetchAnalysisData();
  }, [samplingFrequency]);

  // Calcula el promedio de cada emoción seleccionada para mostrar en el gráfico de barras
  const calculateAverageEmotions = (): { labels: string[]; averages: number[] } => {
    const totals: Record<Emotion, number> = {
      Happiness: 0,
      Sadness: 0,
      Anger: 0,
      Surprise: 0,
      Disgust: 0,
      Fear: 0
    };
    dataPoints.forEach((dp) => {
      selectedEmotions.forEach((emotion) => {
        totals[emotion] += dp.emotions[emotion];
      });
    });
    const averages: number[] = selectedEmotions.map(
      (emotion) => totals[emotion] / dataPoints.length
    );
    return { labels: selectedEmotions, averages };
  };

  // Configuración del gráfico de barras (promedio de emociones)
  const barChartData = (() => {
    const avgData = calculateAverageEmotions();
    return {
      labels: avgData.labels,
      datasets: [
        {
          label: "Promedio de Emociones (%)",
          data: avgData.averages,
          backgroundColor: "#1976d2"
        }
      ]
    };
  })();



  // Función para asignar colores consistentes a cada emoción
  const getEmotionColor = (emotion: Emotion): string => {
    const colorMap: Record<Emotion, string> = {
      Happiness: "#FFD700", // dorado
      Sadness: "#1E90FF",   // azul
      Anger: "#FF4500",     // rojo anaranjado
      Surprise: "#32CD32",  // verde lima
      Disgust: "#8A2BE2",   // violeta
      Fear: "#FF1493"       // rosa fuerte
    };
    return colorMap[emotion] || "#1976d2";
  };

// Configuración del gráfico de líneas (evolución temporal)
const lineChartData = (() => {
  const datasets = selectedEmotions.map((emotion) => ({
    label: emotion,
    data: dataPoints.map((dp) => dp.emotions[emotion]),
    fill: false,
    borderColor:getEmotionColor(emotion),
    tension: 0.2
  }));
  return {
    labels: dataPoints.map((dp) => dp.time),
    datasets
  };
})();

  // Manejo del cambio en la selección de emociones
  const handleEmotionSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as Emotion[];
    setSelectedEmotions(value);
  };

  // Manejo del slider de frecuencia de muestreo
  const handleSamplingChange = (event: Event, newValue: number | number[]) => {
    setSamplingFrequency(newValue as number);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Análisis Emocional de la Sesión
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ajusta la frecuencia de muestreo y filtra las emociones a analizar para obtener resultados personalizados.
      </Typography>

      {/* Controles de configuración */}
      <Box mb={3}>
        <FormControl fullWidth>
          <FormLabel id="sampling-frequency-label">Frecuencia de muestreo (segundos)</FormLabel>
          <Slider
            value={samplingFrequency}
            onChange={handleSamplingChange}
            aria-labelledby="sampling-frequency-label"
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={30}
          />
        </FormControl>
      </Box>

      <Box mb={3}>
        <FormControl fullWidth>
          <FormLabel id="emotion-selection-label">Selecciona las emociones a analizar</FormLabel>
          <Select
            labelId="emotion-selection-label"
            multiple
            value={selectedEmotions}
            onChange={handleEmotionSelectionChange}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {EMOTIONS.map((emotion) => (
              <MenuItem key={emotion} value={emotion}>
                {emotion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              name="advancedToggle"
              color="primary"
            />
          }
          label="Mostrar detalles avanzados"
        />
      </Box>

      {/* Visualización de datos */}
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" role="status">
          <CircularProgress aria-label="Cargando análisis" />
          <Typography variant="body2" style={{ marginTop: 10 }}>
            Procesando análisis...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Gráfico de barras: Promedio de emociones */}
          <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h6" gutterBottom>
              Tendencias Emocionales (Promedio)
            </Typography>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Promedio de Emociones" }
                },
                scales: { y: { beginAtZero: true, max: 100 } }
              }}
            />
          </Paper>

          {/* Gráfico de líneas: Evolución temporal */}
          <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h6" gutterBottom>
              Evolución Temporal de Emociones
            </Typography>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  title: { display: true, text: "Evolución de Emociones a lo largo del tiempo" }
                },
                scales: { y: { beginAtZero: true, max: 100 } }
              }}
            />
          </Paper>

          {/* Modo avanzado: Tabla de datos y botón de refresco */}
          {showAdvanced && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="advanced-content" id="advanced-header">
                <Typography variant="h6">Detalles Avanzados</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Datos Detallados de Muestreo:
                  </Typography>
                  <Table aria-label="Tabla de datos de análisis">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tiempo</TableCell>
                        {selectedEmotions.map((emotion) => (
                          <TableCell key={emotion}>{emotion} (%)</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataPoints.map((dp, index) => (
                        <TableRow key={index}>
                          <TableCell>{dp.time}</TableCell>
                          {selectedEmotions.map((emotion) => (
                            <TableCell key={emotion}>{dp.emotions[emotion]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" onClick={fetchAnalysisData} aria-label="Refrescar datos de análisis">
                      Refrescar Datos
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </Box>
  );
}
