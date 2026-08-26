/**
 * Tokens visuales Alpacladd (referencia La Rioja) — Florencio Varela y layout compartido.
 * Reutilizar estos valores en lugar de duplicar literales en componentes.
 */

export const colors = {
  brand: "#1A4862",
  brandDark: "#163f55",
  white: "#ffffff",
  pageTop: "#f4f7fb",
  pageBottom: "#e9eef5",
  textSlate: "#0f172a",
  textMuted: "#4a6177",
  tabSelected: "#1565c0",
  tabIndicator: "#1976d2",
  borderCard: "#dbe6f3",
  borderSlate08: "rgba(15, 23, 42, 0.08)",
  borderSlate14: "rgba(15, 23, 42, 0.14)",
  headerDivider: "rgba(26, 72, 98, 0.25)",
  goldAccent: "#FFD700",
  capsuleBg: "rgba(255, 255, 255, 0.88)",
};

export const shadows = {
  dashboard: "0 8px 22px rgba(18, 64, 120, 0.12)",
  dashboardLg: "0 10px 22px rgba(15, 23, 42, 0.1)",
  status: "0 4px 14px rgba(15, 23, 42, 0.12)",
  statusHover: "0 10px 22px rgba(15, 23, 42, 0.18)",
  capsule: "0 8px 20px rgba(15, 23, 42, 0.08)",
};

export const gradients = {
  page: `linear-gradient(180deg, ${colors.pageTop} 0%, ${colors.pageBottom} 100%)`,
  kpiHeader: `linear-gradient(180deg, ${colors.brand} 0%, ${colors.brandDark} 100%)`,
};

/** Contenedor página completa (style={{}} o sx con spread) */
export const pageContainer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: gradients.page,
};

export const typography = {
  fontFamily: '"Poppins", sans-serif',
  titleApp: {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 700,
    color: colors.white,
    letterSpacing: { xs: "0.05rem", md: "0.1rem" },
  },
  cardTitle: {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 700,
    color: colors.brand,
    fontSize: "1rem",
  },
  kpiValue: {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 700,
    color: colors.brand,
  },
  muted: {
    fontFamily: '"Poppins", sans-serif',
    color: colors.textMuted,
    fontWeight: 600,
  },
};

/** Card métricas / gráficos (MUI sx) */
export const dashboardCard = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.borderCard}`,
  borderRadius: "14px",
  boxShadow: shadows.dashboard,
  overflow: "hidden",
};

export const headerDividerSx = {
  borderBottom: `1px solid ${colors.headerDivider}`,
  my: 1.5,
};

/** Banda pestañas bajo header (compacta; la cápsula no debe “flotar” con demasiado aire) */
export const tabsBand = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  py: 0.45,
  px: 1,
  boxSizing: "border-box",
};

export const tabsCapsule = {
  maxWidth: "min(960px, calc(100% - 48px))",
  width: "auto",
  mx: "auto",
  backgroundColor: colors.capsuleBg,
  borderRadius: "12px",
  border: `1px solid ${colors.borderSlate08}`,
  boxShadow: shadows.capsule,
  px: { xs: 0.5, sm: 1 },
  py: 0.35,
};

export const tabsRootSx = {
  fontFamily: typography.fontFamily,
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px",
    backgroundColor: colors.tabIndicator,
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    transition: "color 0.2s ease",
    "&.Mui-selected": {
      color: colors.tabSelected,
    },
  },
};

/** Card estado / lista (MUI sx base; combinar con borderTop dinámico) */
export const statusCard = {
  borderRadius: "12px",
  border: `1px solid ${colors.borderSlate14}`,
  boxShadow: shadows.status,
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: shadows.statusHover,
  },
};

export const chartPieColors = ["#1A4862", "#2d5f7a", "#4a7b8d", "#6b9ab0", "#8eb4c4"];

/** Km enteros en home Alpacladd FV: separador de miles con punto (es-AR). */
export function formatKmEntero(value) {
  const n = Math.trunc(Number(value)) || 0;
  return n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}
