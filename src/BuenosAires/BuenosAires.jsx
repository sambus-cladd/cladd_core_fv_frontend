import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Box, Typography, Snackbar, Alert, Drawer, IconButton, List, ListItemButton, ListItemText, Collapse, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

import BackgroundImage1 from "./assets/img/home1.png";
import BackgroundImage2 from "./assets/img/home2.png";
import BackgroundImage3 from "./assets/img/home3.jpg";
import BackgroundImage4 from "./assets/img/home4.png";
import BackgroundImage5 from "./assets/img/home5.png";
import BackgroundImage6 from "./assets/img/home6.png";
import LogoImage from "./assets/img/PNG-BLANCO.png";

import CladdCore from '../assets/Images/CLADDCORE.png';

import './css/body.css';

const images = [BackgroundImage1, BackgroundImage2, BackgroundImage3, BackgroundImage4, BackgroundImage5, BackgroundImage6];

const StyledAppBar = styled(AppBar)`
  width: 90%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  background-color: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(7px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
  border: 3px solid #e2b23e;
`;

const StyledButton = styled(Button)`
  color: white;
  padding: 12px 24px;
  border-radius: 9999px;
  flex-grow: 1;
`;

const navItems = [
  { href: "/Home", label: "Home" },
  { href: "", label: "San Martín", showAlert: true },
  { href: "/BuenosAires/FlorencioVarela/AlpacladdHome", label: "Florencio Varela" },
  { href: "", label: "Morón", showAlert: true },
  { href: "http://192.168.0.18:3000/users/login", label: "CladdPro" },
];

const BuenosAires = () => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const handleNavigation = (event, href, showAlert) => {
    if (showAlert) {
      event.preventDefault();
      setOpenAlert(true);
      return;
    }
    href.startsWith("http") ? window.open(href, "_blank") : navigate(href);
    setDrawerOpen(false);
  };

  const backgroundImage = isMobile ? BackgroundImage1 : images[currentImage];
  const aspectRatio = isMobile ? "9/16" : "16/9";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        aspectRatio: aspectRatio
      }}
    >
      {/* Título */}
      <Typography
        variant="h1"
        sx={{
          fontSize: isMobile ? "30px" : "48px",  // Más chico en móvil
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Poppins', sans-serif",
          color: "white",
          fontWeight: "600",
          letterSpacing: "3px",
          textTransform: "uppercase",
          textShadow: "4px 4px 14px rgba(0, 0, 0, 0.9)",
          backgroundColor: "rgba(30, 30, 30, 0.8)",
          padding: "10px 20px",
          borderRadius: "10px"
        }}
      >
        Buenos Aires
      </Typography>

      {/* Menú */}
      {isMobile ? (
        <AppBar position="fixed" sx={{ backgroundColor: "rgba(30, 30, 30, 0.9)" }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      ) : (
        <StyledAppBar position="static" elevation={0}>
          <Toolbar>
            <Box sx={{ display: "flex", width: "100%" }}>
              {navItems.map((item) => (
                <StyledButton key={item.label} onClick={(e) => handleNavigation(e, item.href, item.showAlert)}>
                  {item.label}
                </StyledButton>
              ))}
            </Box>
          </Toolbar>
        </StyledAppBar>
      )}

      {/* Drawer Móvil */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, textAlign: 'center', pt: 2 }}>
          {/* Logo arriba del menú */}
          <img src={CladdCore} alt="Logo Cladd" style={{ width: '120px', marginBottom: '16px' }} />
          <Divider sx={{ mb: 1 }} /> 
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.label} onClick={(e) => handleNavigation(e, item.href, item.showAlert)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        </Box>
      </Drawer>

      {/* Logo */}
      <Box
        sx={{
          position: "fixed",
          bottom: 65,
          right: 45,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px"
        }}
      >
        <img src={LogoImage} alt="Logo" style={{ width: "100px", height: "auto" }} />
      </Box>

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
          borderRadius: "4px"
        }}
      >
        <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
        <Typography variant="caption" color="white">IT - Depto. Aplicaciones</Typography>
      </Box>

      {/* Alerta */}
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
        <Alert severity="info">Esta sección estará disponible próximamente.</Alert>
      </Snackbar>
    </Box>
  );
};

export default BuenosAires;
