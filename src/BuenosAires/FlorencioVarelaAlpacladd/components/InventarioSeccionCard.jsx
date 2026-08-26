import { Box, Typography, Paper, LinearProgress, linearProgressClasses } from "@mui/material";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import FactoryIcon from "@mui/icons-material/Factory";
import VerifiedIcon from "@mui/icons-material/Verified";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { colors, shadows, typography, dashboardCard, headerDividerSx, formatKmEntero } from "../../../styles/alpacladdFvDesignTokens";

const HEADER_ICONS = {
  cruda: ViewQuiltIcon,
  produccion: FactoryIcon,
  calidad: VerifiedIcon,
  terminado: Inventory2Icon,
};

/**
 * Escala única: mismos ratios entre título, icono, KPI y detalle en xs / sm / md.
 * (Sube todo junto al agrandar la card en desktop.)
 */
const invScale = {
  padX: { xs: 1.25, sm: 1.4, md: 1.55 },
  headerPt: { xs: 0.85, sm: 0.95, md: 1.05 },
  headerPb: { xs: 0.45, sm: 0.5, md: 0.55 },
  headerGap: { xs: 0.75, sm: 0.85, md: 0.95 },
  title: { xs: "0.74rem", sm: "0.8rem", md: "0.86rem" },
  titleLetterSpacing: { xs: "0.055em", sm: "0.058em", md: "0.06em" },
  icon: { xs: 24, sm: 27, md: 30 },
  dividerMx: { xs: 1.15, sm: 1.25, md: 1.4 },
  bodyPt: { xs: 0.55, sm: 0.62, md: 0.68 },
  bodyPb: { xs: 0.42, sm: 0.48, md: 0.52 },
  total: { xs: "1.62rem", sm: "1.82rem", md: "2.02rem" },
  totalMb: { xs: 0.52, sm: 0.58, md: 0.62 },
  colGap: { xs: 0.9, sm: 0.95, md: 1 },
  label: { xs: "0.64rem", sm: "0.68rem", md: "0.72rem" },
  subKm: { xs: "1rem", sm: "1.06rem", md: "1.14rem" },
  subKmMt: { xs: 0.12, sm: 0.14, md: 0.16 },
  barMt: { xs: 0.32, sm: 0.36, md: 0.38 },
  barH: { xs: 4, sm: 4.25, md: 4.5 },
  sepMy: { xs: 0.18, sm: 0.2, md: 0.22 },
  footerPy: { xs: 0.38, sm: 0.42, md: 0.46 },
  footer: { xs: "0.66rem", sm: "0.69rem", md: "0.72rem" },
};

function MiniBar({ value, barColor, barH, barMt }) {
  return (
    <LinearProgress
      variant="determinate"
      value={Math.min(100, Math.max(0, value))}
      sx={{
        mt: barMt,
        height: barH,
        borderRadius: 1,
        bgcolor: "rgba(26, 72, 98, 0.12)",
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 1,
          bgcolor: barColor || colors.tabIndicator,
        },
      }}
    />
  );
}

/**
 * Card estilo referencia: cabecera con título + icono, total, Crudo / Denim en columnas con barra.
 * Tipografía y espaciado escalan juntos por breakpoint.
 */
function InventarioSeccionCard({ title, variant = "cruda", largoTotal, largoCrudo, largoDenim }) {
  const crudo = Number(largoCrudo) || 0;
  const denim = Number(largoDenim) || 0;
  const total = Number(largoTotal) || 0;
  const pctCrudo = total > 0 ? (crudo / total) * 100 : 0;
  const pctDenim = total > 0 ? (denim / total) * 100 : 0;

  const HeaderIcon = HEADER_ICONS[variant] || ViewQuiltIcon;

  return (
    <Paper
      elevation={0}
      sx={{
        ...dashboardCard,
        boxShadow: shadows.dashboard,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "auto",
      }}
    >
      <Box
        sx={{
          px: invScale.padX,
          pt: invScale.headerPt,
          pb: invScale.headerPb,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: invScale.headerGap,
        }}
      >
        <Typography
          sx={{
            fontFamily: typography.fontFamily,
            fontWeight: 700,
            color: colors.brand,
            fontSize: invScale.title,
            letterSpacing: invScale.titleLetterSpacing,
            lineHeight: 1.22,
            textTransform: "uppercase",
            pr: 0.35,
          }}
        >
          {title}
        </Typography>
        <HeaderIcon sx={{ fontSize: invScale.icon, color: colors.brand, flexShrink: 0, opacity: 0.92 }} />
      </Box>
      <Box sx={{ ...headerDividerSx, my: 0, mx: invScale.dividerMx }} />
      <Box sx={{ px: invScale.padX, pt: invScale.bodyPt, pb: invScale.bodyPb }}>
        <Typography
          sx={{
            ...typography.kpiValue,
            textAlign: "center",
            fontSize: invScale.total,
            lineHeight: 1.08,
            mb: invScale.totalMb,
          }}
        >
          {formatKmEntero(total)} km
        </Typography>
        <Box sx={{ display: "flex", gap: invScale.colGap, alignItems: "stretch" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: invScale.label,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: "0.04em",
                fontFamily: typography.fontFamily,
              }}
            >
              CRUDO
            </Typography>
            <Typography
              sx={{
                ...typography.kpiValue,
                fontSize: invScale.subKm,
                lineHeight: 1.14,
                mt: invScale.subKmMt,
              }}
            >
              {formatKmEntero(crudo)} km
            </Typography>
            <MiniBar value={pctCrudo} barH={invScale.barH} barMt={invScale.barMt} />
          </Box>
          <Box sx={{ width: "1px", bgcolor: colors.borderCard, flexShrink: 0, my: invScale.sepMy }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: invScale.label,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: "0.04em",
                fontFamily: typography.fontFamily,
              }}
            >
              DENIM
            </Typography>
            <Typography
              sx={{
                ...typography.kpiValue,
                fontSize: invScale.subKm,
                lineHeight: 1.14,
                mt: invScale.subKmMt,
              }}
            >
              {formatKmEntero(denim)} km
            </Typography>
            <MiniBar value={pctDenim} barColor={colors.brand} barH={invScale.barH} barMt={invScale.barMt} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ borderTop: `1px solid ${colors.borderCard}`, px: invScale.padX, py: invScale.footerPy }}>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: invScale.footer,
            fontWeight: 600,
            color: colors.brand,
            fontFamily: typography.fontFamily,
          }}
        >
          {new Date().toLocaleDateString("es-AR")}
        </Typography>
      </Box>
    </Paper>
  );
}

export default InventarioSeccionCard;
