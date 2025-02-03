// src/app/components/SessionUpload.tsx
"use client";

import React, { useState, useRef, useEffect, DragEvent } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { CloudUpload, Cancel, Refresh, Delete } from "@mui/icons-material";

const MAX_FILE_SIZE = 524288000; // 500 MB en bytes
const ALLOWED_TYPES = ["video/mp4", "video/x-msvideo", "video/quicktime"];

interface UploadHistoryItem {
  jobId: string;
  fileName: string;
  timestamp: string;
}

export default function SessionUpload() {
  // Estados principales
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [jobId, setJobId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
  const [isUploadCanceled, setIsUploadCanceled] = useState<boolean>(false);
  const [emotionPeaks, setEmotionPeaks] = useState<string[]>([]);

  // Referencias para AbortController y progreso
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Manejo de selección mediante input y drag & drop
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (event.target.files && event.target.files[0]) {
      validateAndSetFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError("");
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Validar archivo y crear preview
  const validateAndSetFile = (selectedFile: File) => {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Formato de video no permitido. Use MP4, AVI o MOV.");
      setFile(null);
      setPreviewUrl("");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("El archivo excede el tamaño máximo permitido de 500 MB.");
      setFile(null);
      setPreviewUrl("");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // Limpiar selección y estados relacionados
  const handleClearSelection = () => {
    setFile(null);
    setError("");
    setJobId("");
    setProgress(0);
    setPreviewUrl("");
    setIsUploadCanceled(false);
    setEmotionPeaks([]);
  };

  // Helper: Convertir segundos a "MM:SS"
  const formatSecondsToTimestamp = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Simulación: Generar timestamps de picos de emotividad
  const simulateEmotionPeaks = (): string[] => {
    // Supongamos que el video dura entre 300 y 600 segundos
    const videoLength = Math.floor(Math.random() * 300) + 300;
    const numberOfPeaks = Math.floor(Math.random() * 4) + 3; // entre 3 y 6 picos
    const peaks: Set<number> = new Set();
    while (peaks.size < numberOfPeaks) {
      peaks.add(Math.floor(Math.random() * videoLength));
    }
    return Array.from(peaks).sort((a, b) => a - b).map(formatSecondsToTimestamp);
  };

  // Manejo de la carga simulada (uso de async/await, try/catch)
  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setUploading(true);
    setProgress(0);
    setIsUploadCanceled(false);
    setJobId("");
    setEmotionPeaks([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          window.clearInterval(progressIntervalRef.current!);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retardo final
      const data = await response.json();
      setJobId(data.jobId || "ID de trabajo desconocido");
      setProgress(100);

      // Generar picos de emotividad simulados
      const peaks = simulateEmotionPeaks();
      setEmotionPeaks(peaks);

      const newHistoryItem: UploadHistoryItem = {
        jobId: data.jobId || "ID de trabajo desconocido",
        fileName: file.name,
        timestamp: new Date().toLocaleString()
      };
      setUploadHistory(prev => [newHistoryItem, ...prev]);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("La carga fue cancelada.");
      } else {
        console.error("Error en la carga:", err);
        setError("Error en la carga del archivo. Intente nuevamente.");
      }
    } finally {
      window.clearInterval(progressIntervalRef.current!);
      setUploading(false);
    }
  };

  // Cancelar la carga
  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploadCanceled(true);
      setUploading(false);
      window.clearInterval(progressIntervalRef.current!);
    }
  };

  // Reintentar la carga en caso de error
  const handleRetryUpload = () => {
    if (file) {
      handleUpload();
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography variant="h6" gutterBottom>
        Subir sesión grabada para análisis
      </Typography>
      <Typography variant="body2" gutterBottom>
        Arrastra y suelta el archivo de video o selecciónalo haciendo clic en el botón.
      </Typography>

      {/* Área de Drag & Drop */}
      <Paper
        variant="outlined"
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          padding: 2,
          textAlign: "center",
          borderStyle: "dashed",
          marginBottom: 2,
          cursor: "pointer"
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CloudUpload sx={{ fontSize: 40, color: "#1976d2" }} />
        <Typography variant="body2">Suelta el archivo aquí o haz clic para seleccionar.</Typography>
        <input
          accept="video/mp4,video/x-msvideo,video/quicktime"
          style={{ display: "none" }}
          id="upload-button-file"
          type="file"
          onChange={handleFileChange}
          aria-label="Seleccionar archivo de video"
        />
        <label htmlFor="upload-button-file">
          <Button variant="contained" color="primary" component="span" sx={{ mt: 1 }}>
            Seleccionar Archivo
          </Button>
        </label>
      </Paper>

      {/* Detalles y vista previa del archivo */}
      {file && (
        <Box
          sx={{
            width: { xs: "90%", sm: "70%", md: "50%" },
            border: "1px solid #ddd",
            padding: 2,
            borderRadius: 1,
            mb: 2
          }}
        >
          <Typography variant="subtitle1">Detalles del Archivo:</Typography>
          <Typography variant="body2"><strong>Nombre:</strong> {file.name}</Typography>
          <Typography variant="body2"><strong>Tamaño:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</Typography>
          <Typography variant="body2"><strong>Tipo:</strong> {file.type}</Typography>
          <Typography variant="body2">
            <strong>Última Modificación:</strong> {new Date(file.lastModified).toLocaleString()}
          </Typography>
          {previewUrl && (
            <Box mt={2}>
              <Typography variant="subtitle2">Vista Previa:</Typography>
              <video src={previewUrl} controls width="100%" style={{ borderRadius: 4 }} />
            </Box>
          )}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Tooltip title="Limpiar selección">
              <IconButton onClick={handleClearSelection} color="secondary" aria-label="Limpiar selección">
                <Delete />
              </IconButton>
            </Tooltip>
            {uploading && (
              <Tooltip title="Cancelar carga">
                <IconButton onClick={handleCancelUpload} color="error" aria-label="Cancelar carga">
                  <Cancel />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}

      {/* Barra de progreso y mensajes */}
      {uploading && (
        <Box width={{ xs: "90%", sm: "70%", md: "50%" }} mt={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            {progress}% completado...
          </Typography>
        </Box>
      )}
      {error && (
        <Box width={{ xs: "90%", sm: "70%", md: "50%" }} mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {jobId && !uploading && !error && (
        <Box width={{ xs: "90%", sm: "70%", md: "50%" }} mt={2}>
          <Alert severity="success">
            Archivo subido exitosamente. ID de trabajo: {jobId}.
          </Alert>
          {emotionPeaks.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Picos de emotividad detectados:</Typography>
              <List>
                {emotionPeaks.map((timestamp, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`Pico ${index + 1}: ${timestamp}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}

      {/* Botones de acción */}
      <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading || isUploadCanceled}
          startIcon={<CloudUpload />}
          aria-label="Subir y analizar video"
        >
          Subir y Analizar
        </Button>
        {error && file && !uploading && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRetryUpload}
            startIcon={<Refresh />}
            aria-label="Reintentar carga"
          >
            Reintentar
          </Button>
        )}
      </Box>

      {/* Historial de cargas */}
      {uploadHistory.length > 0 && (
        <Box width={{ xs: "90%", sm: "70%", md: "50%" }} mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Historial de Cargas
          </Typography>
          {uploadHistory.map((item, index) => (
            <Paper key={index} variant="outlined" sx={{ padding: 1, mb: 1 }}>
              <Typography variant="body2"><strong>{item.fileName}</strong> - {item.jobId}</Typography>
              <Typography variant="caption" color="textSecondary">{item.timestamp}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
