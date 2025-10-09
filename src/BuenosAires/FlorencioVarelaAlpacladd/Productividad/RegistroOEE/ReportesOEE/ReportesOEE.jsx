// src/BuenosAires/FlorencioVarelaAlpacladd/Productividad/GenerarOEE/GenerarOEE.jsx
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

const ReportesOEE = () => {
  useEffect(() => {
    document.title = "CladdCore FV - Reportes OEE";
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        flexDirection: "column",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        Bienvenido
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Proximamente Módulo Reportes OEE
      </Typography>
    </Box>
  );
};

export default ReportesOEE;
