// src/app/components/Reports.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Definición de la interfaz para los datos de reporte
interface ReportData {
  timestamp: string;
  emotionMetrics: {
    Happiness: number;
    Sadness: number;
    Anger: number;
    Surprise: number;
    Disgust: number;
    Fear: number;
  };
  riskScore: number;
  prescriptionOptimization: number;
  insuranceCodingDistribution: { [code: string]: number };
  patientProgress: number;
}

// Función para generar datos simulados de reporte
const generateDummyReportData = (numPoints: number = 10): ReportData[] => {
  const data: ReportData[] = [];
  for (let i = 0; i < numPoints; i++) {
    data.push({
      timestamp: dayjs().subtract(numPoints - i, "day").format("YYYY-MM-DD"),
      emotionMetrics: {
        Happiness: Math.floor(Math.random() * 100),
        Sadness: Math.floor(Math.random() * 100),
        Anger: Math.floor(Math.random() * 100),
        Surprise: Math.floor(Math.random() * 100),
        Disgust: Math.floor(Math.random() * 100),
        Fear: Math.floor(Math.random() * 100)
      },
      riskScore: Math.floor(Math.random() * 100),
      prescriptionOptimization: Math.floor(Math.random() * 100),
      insuranceCodingDistribution: {
        "ICD-10": Math.floor(Math.random() * 100),
        "CPT": Math.floor(Math.random() * 100),
        "Other": Math.floor(Math.random() * 100)
      },
      patientProgress: Math.floor(Math.random() * 100)
    });
  }
  return data;
};

export default function Reports() {
  // Estados para manejar datos, carga, vista detallada y filtro por fecha.
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailedView, setDetailedView] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>("");

  // Simulación de la obtención de datos del reporte
  const fetchReportData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateDummyReportData(10);
      setReportData(data);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Filtrar datos por fecha, si se aplica filtro
  const filteredData = dateFilter
    ? reportData.filter((item) => item.timestamp === dateFilter)
    : reportData;

  // Función para calcular el promedio de las emociones a partir de los datos filtrados
  const averageEmotions = (): { [key: string]: number } => {
    const totals = {
      Happiness: 0,
      Sadness: 0,
      Anger: 0,
      Surprise: 0,
      Disgust: 0,
      Fear: 0
    };
    filteredData.forEach((item) => {
      totals.Happiness += item.emotionMetrics.Happiness;
      totals.Sadness += item.emotionMetrics.Sadness;
      totals.Anger += item.emotionMetrics.Anger;
      totals.Surprise += item.emotionMetrics.Surprise;
      totals.Disgust += item.emotionMetrics.Disgust;
      totals.Fear += item.emotionMetrics.Fear;
    });
    const count = filteredData.length || 1;
    return {
      Happiness: totals.Happiness / count,
      Sadness: totals.Sadness / count,
      Anger: totals.Anger / count,
      Surprise: totals.Surprise / count,
      Disgust: totals.Disgust / count,
      Fear: totals.Fear / count
    };
  };

  const avgEmotions = averageEmotions();

  // Configuración del gráfico de barras para el promedio de emociones
  const barChartData = {
    labels: Object.keys(avgEmotions),
    datasets: [
      {
        label: "Promedio de Emociones (%)",
        data: Object.values(avgEmotions),
        backgroundColor: "#1976d2"
      }
    ]
  };

  // Configuración del gráfico de líneas para la evolución de emociones
  const lineChartData = {
    labels: filteredData.map((item) => item.timestamp),
    datasets: Object.keys(avgEmotions).map((emotion) => ({
      label: emotion,
      data: filteredData.map((item) => item.emotionMetrics[emotion as keyof typeof item.emotionMetrics]),
      fill: false,
      borderColor:
        emotion === "Happiness"
          ? "#FFD700"
          : emotion === "Sadness"
          ? "#1E90FF"
          : emotion === "Anger"
          ? "#FF4500"
          : emotion === "Surprise"
          ? "#32CD32"
          : emotion === "Disgust"
          ? "#8A2BE2"
          : "#FF1493",
      tension: 0.2
    }))
  };

  // Función para agregar los totales de codificación de seguros
  const aggregateInsuranceCoding = () => {
    const totals: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      Object.entries(item.insuranceCodingDistribution).forEach(([code, value]) => {
        totals[code] = (totals[code] || 0) + value;
      });
    });
    return totals;
  };

  const insuranceTotals = aggregateInsuranceCoding();

  // Configuración del gráfico de pastel para codificación de seguros
  const pieChartData = {
    labels: Object.keys(insuranceTotals),
    datasets: [
      {
        label: "Distribución de Codificación de Seguros",
        data: Object.values(insuranceTotals),
        backgroundColor: ["#1976d2", "#dc004e", "#FFD700"]
      }
    ]
  };

  // Manejadores para filtros y acciones
  const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(event.target.value);
  };

  const handleRefresh = () => {
    fetchReportData();
  };

  const handleExportReport = () => {
    alert("Reporte exportado a PDF (simulación).");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Reportes Terapéuticos AI-Generated
      </Typography>
      <Typography variant="body1" gutterBottom>
        Revisa y analiza los reportes generados basados en el análisis de sesiones.
      </Typography>
      
      {/* Filtro y controles superiores */}
      <Box mb={3} display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <TextField
          label="Filtrar por fecha (YYYY-MM-DD)"
          variant="outlined"
          value={dateFilter}
          onChange={handleDateFilterChange}
          size="small"
          aria-label="Filtro de fecha para reportes"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          aria-label="Refrescar reportes"
        >
          Refrescar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleExportReport}
          startIcon={<DownloadIcon />}
          aria-label="Exportar reporte"
        >
          Exportar PDF
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" role="status">
          <CircularProgress aria-label="Cargando reportes" />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cargando reportes...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Sección: Resumen de Emociones */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Resumen de Emociones</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Promedio de Emociones
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Evolución de Emociones
                    </Typography>
                    <Line
                      data={lineChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: "bottom" },
                          title: { display: true, text: "Tendencia de Emociones" }
                        },
                        scales: { y: { beginAtZero: true, max: 100 } }
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Sección: Predicción de Riesgos */}
          <Accordion defaultExpanded sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h6">Predicción de Riesgos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Puntaje de Riesgo Promedio
                </Typography>
                <Typography variant="h4" color="error">
                  {(
                    filteredData.reduce((sum, item) => sum + item.riskScore, 0) /
                    (filteredData.length || 1)
                  ).toFixed(2)}
                </Typography>
              </Paper>
              {detailedView && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Detalles avanzados: El modelo de predicción utiliza factores múltiples para evaluar el riesgo de suicidio y patrones de no adherencia.
                  </Typography>
                </Paper>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Sección: Optimización de Prescripciones */}
          <Accordion defaultExpanded sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography variant="h6">Optimización de Prescripciones</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Indicador de Optimización
                </Typography>
                <Typography variant="h4" color="primary">
                  {(
                    filteredData.reduce((sum, item) => sum + item.prescriptionOptimization, 0) /
                    (filteredData.length || 1)
                  ).toFixed(2)}
                </Typography>
              </Paper>
              {detailedView && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Información adicional: Se analizan las interacciones farmacológicas y se aplica un firewall para prevenir interacciones adversas.
                  </Typography>
                </Paper>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Sección: Codificación de Seguros */}
          <Accordion defaultExpanded sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography variant="h6">Codificación de Seguros</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Distribución de Códigos
                </Typography>
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: true, text: "Distribución de Codificación" }
                    }
                  }}
                />
              </Paper>
            </AccordionDetails>
          </Accordion>

          {/* Sección: Seguimiento del Progreso del Paciente */}
          <Accordion defaultExpanded sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5a-content"
              id="panel5a-header"
            >
              <Typography variant="h6">Seguimiento del Progreso</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Progreso Promedio
                </Typography>
                <Line
                  data={{
                    labels: filteredData.map((item) => item.timestamp),
                    datasets: [
                      {
                        label: "Progreso",
                        data: filteredData.map((item) => item.patientProgress),
                        fill: false,
                        borderColor: "#32CD32",
                        tension: 0.2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Evolución del Progreso" }
                    },
                    scales: { y: { beginAtZero: true, max: 100 } }
                  }}
                />
              </Paper>
            </AccordionDetails>
          </Accordion>

          {/* Controles globales de vista y exportación */}
          <Box mt={3} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={detailedView}
                  onChange={(e) => setDetailedView(e.target.checked)}
                  color="primary"
                  aria-label="Alternar vista detallada"
                />
              }
              label="Vista Detallada"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportReport}
              startIcon={<DownloadIcon />}
              aria-label="Exportar reporte completo"
            >
              Exportar Reporte Completo
            </Button>
          </Box>

          {/* Resumen y mensaje final */}
          <Box mt={3}>
            <Alert severity="info">
              Nota: Los datos presentados son simulados para fines de demostración. Los reportes se actualizan automáticamente al refrescar.
            </Alert>
          </Box>
        </>
      )}
    </Box>
  );
}
