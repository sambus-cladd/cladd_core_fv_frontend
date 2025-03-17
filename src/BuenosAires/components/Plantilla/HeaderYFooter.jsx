import  Navbar  from '../Navbar/Navbar';
import AlpaLogo from '../../assets/Images/alpaLogo.png';
import { AppBar, Toolbar, Button, Box, Typography, Snackbar, Alert } from "@mui/material";

import LogoImage from "./PNG-BLANCO.png";

function HeaderYFooter({ children, titulo, color, routes }) {
  // Container and content styling
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const contentStyle = {
    flexGrow: 1,
  };

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <div 
        className="CladdHome" 
        style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
      >
        <Navbar Titulo={titulo ? titulo : ""} color={color === "enod" ? "enod" : "alpacladd"} plantaLogo={AlpaLogo} Routes={routes} />
      </div>



      {/* Main content */}
      <div style={contentStyle}>
        {children}
      </div>

      {/* Logo en la Esquina */}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: 65,
          right: 45,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <img src={LogoImage} alt="Logo" style={{ width: "100px", height: "auto" }} />
      </Box> */}

      {/* Footer */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
        <Typography variant="caption" color="white">IT - Depto. Aplicaciones</Typography>
      </Box>
    </div>
  );
}

export default HeaderYFooter;
