import * as React from "react";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

// Imágenes
import CladdCore from "../../assets/Images/CLADDCORE.png";

const Navbar = ({ Titulo, Routes, color }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (href) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      navigate(href);
    }
    setDrawerOpen(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: getColor(color) }}>
      {/* Desktop Navbar */}
      <Toolbar
        sx={{
          justifyContent: "space-between",
          display: { xs: "none", md: "flex" },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.1rem",
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          {Titulo}
        </Typography>

        {/* Menú de escritorio */}
        <Box>
          {Routes.map((route) => (
            <Button
              key={route.key}
              onClick={() => handleNavigation(route.route)}
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "0.8rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#FFD700", // Un dorado suave
                  transform: "scale(1.05)", // Efecto leve de zoom
                },
              }}
            >
              {route.name}
            </Button>
          ))}
        </Box>
      </Toolbar>

      {/* Mobile Navbar */}
      <Toolbar
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "white",
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          {Titulo}
        </Typography>
      </Toolbar>

      {/* Drawer para móvil */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, textAlign: "center", pt: 2 }}>
          <img
            src={CladdCore}
            alt="Logo CladdCore"
            style={{ width: "120px", marginBottom: "16px" }}
          />
          <Divider sx={{ mb: 1 }} />
          <List>
            {Routes.map((route) => (
              <ListItemButton
                key={route.key}
                onClick={() => handleNavigation(route.route)}
              >
                <ListItemText primary={route.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

function getColor(colorName) {
  const colors = {
    cladd: "#45474e",
    enod: "#4C7766",
    alpacladd: "#1A4862",
  };
  return colors[colorName] || colors.cladd;
}

Navbar.defaultProps = {
  Routes: [
    {
      name: " ",
      key: " ",
      route: " ",
      target: " ",
    },
  ],
};

export default Navbar;
