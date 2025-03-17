import React from "react";
import { Box, Typography } from "@mui/material";

const BackgroundWithSVG = ({ children }) => {
  return (
    <Box
      sx={{
        height: "100vh", // Ocupa toda la altura de la ventana
        backgroundImage: 'url("/assets/svg/background.svg")', // Ruta relativa a la carpeta public
        backgroundSize: "cover", // Escalado de la imagen
        backgroundPosition: "center", // Centrado
        backgroundRepeat: "no-repeat", // Sin repetir
        overflowY: "auto",
        position: "relative",
      }}
    >
      {children}
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,

          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <Typography variant="caption" color="white">
          &copy; 2024 - Automatización - La Rioja
        </Typography>
        <Typography variant="caption" color="white">
          IT - Depto. Aplicaciones
        </Typography>
      </Box>
    </Box>
  );
};

export default BackgroundWithSVG;
