import React, { useMemo, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ScienceIcon from "@mui/icons-material/Science";
import OpacityIcon from "@mui/icons-material/Opacity";
import InsightsIcon from "@mui/icons-material/Insights";
import FactoryIcon from "@mui/icons-material/Factory";
import BuildIcon from "@mui/icons-material/Build";
import { tabsBand, tabsCapsule, colors } from "../../../styles/alpacladdFvDesignTokens";

const MENU_ICON_BY_KEY = {
  Home: <HomeIcon sx={{ fontSize: 24 }} />,
  Laboratorio: <ScienceIcon sx={{ fontSize: 24 }} />,
  Calidad: <OpacityIcon sx={{ fontSize: 24 }} />,
  TERMINACION: <FactoryIcon sx={{ fontSize: 24 }} />,
  Productividad: <InsightsIcon sx={{ fontSize: 24 }} />,
  PanelEquipos: <BuildIcon sx={{ fontSize: 24 }} />,
};

const FALLBACK_ICON = <HomeIcon sx={{ fontSize: 24 }} />;

function getIconForRoute(route) {
  return MENU_ICON_BY_KEY[route.key] ?? FALLBACK_ICON;
}

function getActiveLeafKey(pathname, routes) {
  let bestKey = null;
  let bestLen = -1;

  for (const route of routes) {
    if (route.children?.length) {
      for (const sub of route.children) {
        const r = sub.route;
        if (!r || typeof r !== "string" || r.startsWith("http")) continue;
        if (pathname === r || pathname.startsWith(`${r}/`)) {
          if (r.length > bestLen) {
            bestLen = r.length;
            bestKey = route.key;
          }
        }
      }
      continue;
    }

    const r = route.route;
    if (!r || typeof r !== "string" || r.startsWith("http")) continue;
    if (pathname === r || pathname.startsWith(`${r}/`)) {
      if (r.length > bestLen) {
        bestLen = r.length;
        bestKey = route.key;
      }
    }
  }

  return bestKey;
}

const labelSx = {
  textTransform: "uppercase",
  fontWeight: 600,
  fontFamily: '"Poppins", sans-serif',
  fontSize: { xs: "0.68rem", sm: "0.74rem", md: "0.8rem" },
  textAlign: "center",
  lineHeight: 1.2,
  maxWidth: 150,
};

function LeafMenuItem({ route, active, onNavigate }) {
  return (
    <Box
      role="tab"
      tabIndex={0}
      aria-selected={active}
      onClick={() => onNavigate(route.route, route.target)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate(route.route, route.target);
        }
      }}
      sx={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
        py: 0.4,
        cursor: "pointer",
        minHeight: 56,
        minWidth: 60,
        color: active ? colors.tabSelected : colors.textMuted,
        borderBottom: active ? `2px solid ${colors.tabIndicator}` : "2px solid transparent",
        borderRadius: "3px 3px 0 0",
        transition: "color 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          color: colors.tabSelected,
        },
      }}
    >
      <Box sx={{ color: "inherit", mb: 0.35, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {getIconForRoute(route)}
      </Box>
      <Box sx={{ ...labelSx, color: "inherit" }}>{String(route.name || "").trim()}</Box>
    </Box>
  );
}

function DropdownMenuItem({ route, active, onNavigateExternal }) {
  const [anchor, setAnchor] = useState(null);
  const menuOpen = Boolean(anchor);
  const isActive = active || menuOpen;

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <>
      <Box
        role="tab"
        tabIndex={0}
        aria-selected={isActive}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e);
          }
        }}
        sx={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          py: 0.4,
          cursor: "pointer",
          minHeight: 56,
          minWidth: 60,
          color: isActive ? colors.tabSelected : colors.textMuted,
          borderBottom: isActive ? `2px solid ${colors.tabIndicator}` : "2px solid transparent",
          transition: "color 0.2s ease, border-color 0.2s ease",
          "&:hover": { color: colors.tabSelected },
        }}
      >
        <Box sx={{ color: "inherit", mb: 0.35, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {getIconForRoute(route)}
        </Box>
        <Box sx={{ ...labelSx, color: "inherit" }}>{String(route.name || "").trim()}</Box>
      </Box>
      <Menu
        anchorEl={anchor}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            minWidth: 300,
            fontFamily: '"Poppins", sans-serif',
            mt: 0.5,
            borderRadius: "12px",
            border: `1px solid ${colors.borderSlate08}`,
            boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
          },
        }}
      >
        {route.children.map((sub) => (
          <MenuItem
            key={sub.key}
            onClick={() => {
              onNavigateExternal(sub.route, sub.target);
              handleClose();
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
    </>
  );
}

function AlpacladdFvMainMenu({ routes }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeLeafKey = useMemo(() => getActiveLeafKey(pathname, routes), [pathname, routes]);

  const handleNavigate = (href, target = "_self") => {
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
  };

  return (
    <Box
      sx={{
        ...tabsBand,
        display: { xs: "none", md: "flex" },
      }}
    >
      <Box
        sx={{
          ...tabsCapsule,
        }}
      >
        <Box
          role="tablist"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
            gap: 0.25,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(15,23,42,0.2)",
              borderRadius: 3,
            },
          }}
        >
          {routes.map((route) =>
            route.children?.length ? (
              <DropdownMenuItem
                key={route.key}
                route={route}
                active={activeLeafKey === route.key}
                onNavigateExternal={handleNavigate}
              />
            ) : (
              <LeafMenuItem
                key={route.key}
                route={route}
                active={activeLeafKey === route.key}
                onNavigate={handleNavigate}
              />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AlpacladdFvMainMenu;
