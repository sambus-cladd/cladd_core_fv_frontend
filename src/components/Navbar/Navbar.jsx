import * as React from "react";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
import { colors } from "../../styles/alpacladdFvDesignTokens";

const menuButtonSx = {
  color: "white",
  fontFamily: '"Poppins", sans-serif',
  fontSize: "0.8rem",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: colors.goldAccent,
    transform: "scale(1.05)",
  },
};

const Navbar = ({ Titulo, Routes = [], color, showDesktopRoutes = true }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
const [submenuItems, setSubmenuItems] = useState([]);

const handleMenuOpen = (event, children) => {
  setAnchorEl(event.currentTarget);
  setSubmenuItems(children);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSubmenuItems([]);
};

  const handleNavigation = (href, target = "_self") => {
    if (!href) return;
    if (href.startsWith("http")) {
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    } else {
      navigate(href);
    }
    setDrawerOpen(false);
    handleMenuClose();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: getColor(color) }}>
      {/* Desktop Navbar */}
      <Toolbar
        variant="dense"
        sx={{
          justifyContent: showDesktopRoutes ? "space-between" : "center",
          display: { xs: "none", md: "flex" },
          minHeight: { md: showDesktopRoutes ? 52 : 56 },
          maxHeight: { md: showDesktopRoutes ? 52 : 56 },
          py: 0,
          px: { md: 2 },
        }}
      >
        <Typography
          component="div"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            color: colors.white,
            letterSpacing: showDesktopRoutes ? { xs: "0.05rem", md: "0.1rem" } : "0.14em",
            flexGrow: showDesktopRoutes ? 1 : 0,
            textAlign: "center",
            textTransform: !showDesktopRoutes && color === "alpacladd" ? "uppercase" : "none",
            fontSize: showDesktopRoutes
              ? { md: "clamp(1.15rem, 1.8vw, 1.35rem)" }
              : { md: "clamp(1.45rem, 2.6vw, 1.85rem)" },
            lineHeight: 1.12,
          }}
        >
          {Titulo}
        </Typography>

        {/* Menú de escritorio (oculto si el menú va en cápsula bajo el AppBar) */}
        {showDesktopRoutes ? (
        <Box>
  {Routes.map((route) =>
    route.children ? (
      <React.Fragment key={route.key}>
        <Button
          color="inherit"
          onClick={(e) => handleMenuOpen(e, route.children)}
          sx={menuButtonSx}
        >
          {route.name}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && submenuItems.length > 0}
          onClose={handleMenuClose}
          PaperProps={{ sx: { minWidth: 200 } }}
        >
          {submenuItems.map((sub) => (
            <MenuItem
              key={sub.key}
              onClick={() => {
                handleNavigation(sub.route, sub.target);
              }}
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "0.85rem",
                color: colors.textSlate,
                "&:hover": { backgroundColor: "rgba(26,72,98,0.08)", color: colors.tabSelected },
              }}
            >
              {sub.name}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    ) : (
      <Button
        key={route.key}
        onClick={() => handleNavigation(route.route, route.target)}
        sx={menuButtonSx}
      >
        {route.name}
      </Button>
    )
  )}
</Box>
        ) : null}

      </Toolbar>

      {/* Mobile Navbar */}
      <Toolbar
        variant="dense"
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          minHeight: 52,
          maxHeight: 52,
          py: 0,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          size="small"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="div"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            color: colors.white,
            letterSpacing: "0.08em",
            flexGrow: 1,
            textAlign: "center",
            textTransform: !showDesktopRoutes && color === "alpacladd" ? "uppercase" : "none",
            fontSize: "clamp(1.05rem, 3.5vw, 1.35rem)",
            lineHeight: 1.12,
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
        <Box sx={{ width: 250, textAlign: "center", pt: 2, fontFamily: '"Poppins", sans-serif' }}>
          <img
            src={CladdCore}
            alt="Logo CladdCore"
            style={{ width: "120px", marginBottom: "16px" }}
          />
          <Divider sx={{ mb: 1 }} />
          <List>
  {Routes.map((route) =>
    route.children ? (
      <React.Fragment key={route.key}>
        <ListItemButton>
          <ListItemText primary={route.name} />
        </ListItemButton>
        {route.children.map((sub) => (
          <ListItemButton
            key={sub.key}
            sx={{ pl: 4 }}
            onClick={() => handleNavigation(sub.route, sub.target)}
          >
            <ListItemText primary={sub.name} />
          </ListItemButton>
        ))}
      </React.Fragment>
    ) : (
      <ListItemButton
        key={route.key}
        onClick={() => handleNavigation(route.route, route.target)}
      >
        <ListItemText primary={route.name} />
      </ListItemButton>
    )
  )}
</List>

        </Box>
      </Drawer>
    </AppBar>
  );
};

function getColor(colorName) {
  const map = {
    cladd: "#45474e",
    enod: "#4C7766",
    alpacladd: colors.brand,
  };
  return map[colorName] || map.cladd;
}

export default Navbar;
