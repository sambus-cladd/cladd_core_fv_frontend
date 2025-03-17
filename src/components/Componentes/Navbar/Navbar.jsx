import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AlpacladdLogo from "../assets/Imagenes/ALPACLADD.png";
import EnodLogo from "../assets/Imagenes/ENOD.png";
import AustraltexLogo from "../assets/Imagenes/AUTRALTEX.png";
import CladdLogo from "../assets/Imagenes/CLADD.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4A4A4A",
      light: "#5C5C5C",
      dark: "#383838",
    },
    secondary: {
      main: "#DAA520",
      light: "#e6b94d",
    },
  },
  spacing: 8,
});

const logos = [
  { src: AustraltexLogo, alt: "Australtex Logo" },
  { src: CladdLogo, alt: "Cladd Logo" },
  { src: EnodLogo, alt: "Enod Logo" },
  { src: AlpacladdLogo, alt: "Alpacladd Logo" },
];

const Navbar = () => {
  const gradientPrimary = `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`;
  const gradientSecondary = `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 50%, ${theme.palette.secondary.main} 100%)`;

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: "100%", background: "transparent", zIndex: theme.zIndex.appBar }}
      >
        <Toolbar disableGutters sx={{ width: "100%", position: "relative" }}>
          {/* Barra principal con gradiente */}
          <Box
            sx={{
              background: gradientPrimary,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: theme.spacing(2),
              py: theme.spacing(2), // Padding vertical
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Logos con hover effect */}
            {logos.map((logo, index) => (
              <Box
                key={index}
                sx={{
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  transition: "transform 0.3s ease, filter 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    filter: "brightness(1.1)",
                  },
                }}
              >
                <img
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  style={{
                    height: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Línea dorada inferior */}
          <Box
            sx={{
              width: "100%",
              height: 6,
              background: gradientSecondary,
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 1, // Mantener el zIndex menor que otros elementos superpuestos
              boxShadow: `0 -1px 3px ${theme.palette.secondary.light}`,
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Espaciador para compensar el AppBar fixed */}
      <Toolbar sx={{ height: "calc(60px + 6px)" }} />
    </ThemeProvider>
  );
};

export default Navbar;
