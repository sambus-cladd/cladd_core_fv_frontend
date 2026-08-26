import { Paper, Typography, Box } from "@mui/material";
import { dashboardCard, headerDividerSx, typography } from "../../../styles/alpacladdFvDesignTokens";

/**
 * Contenedor tipo card para KPIs / gráficos (fondo blanco, borde y sombra de marca).
 * @param {object} [dividerSx] — sobrescribe márgenes del separador bajo el título (p. ej. charts más altos).
 * @param {boolean} [compactHeader] — título y divisor más bajos (cards de gráficos).
 * @param {boolean} [fillColumn] — columna flex: título fijo, cuerpo crece (alinear cards de igual alto).
 */
function DashboardSurface({ title, children, sx, dividerSx, compactHeader, fillColumn }) {
  const headerBlock =
    title != null ? (
      <Box sx={{ flexShrink: 0 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            ...typography.cardTitle,
            fontSize: compactHeader ? "0.88rem" : "0.95rem",
            lineHeight: compactHeader ? 1.22 : undefined,
            ...(compactHeader
              ? { textTransform: "uppercase", letterSpacing: "0.06em" }
              : {}),
          }}
        >
          {title}
        </Typography>
        <Box sx={{ ...headerDividerSx, my: compactHeader ? 0.32 : 0.85, ...dividerSx }} />
      </Box>
    ) : null;

  return (
    <Paper
      elevation={0}
      sx={{
        ...dashboardCard,
        p: { xs: 1.15, md: 1.35 },
        width: "100%",
        boxSizing: "border-box",
        ...(fillColumn
          ? {
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              flex: 1,
              width: "100%",
              alignSelf: "stretch",
            }
          : {}),
        ...sx,
      }}
    >
      {fillColumn ? (
        <>
          {headerBlock}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {children}
          </Box>
        </>
      ) : (
        <>
          {title != null ? (
            <>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  ...typography.cardTitle,
                  fontSize: compactHeader ? "0.88rem" : "0.95rem",
                  lineHeight: compactHeader ? 1.22 : undefined,
                  ...(compactHeader
                    ? { textTransform: "uppercase", letterSpacing: "0.06em" }
                    : {}),
                }}
              >
                {title}
              </Typography>
              <Box sx={{ ...headerDividerSx, my: compactHeader ? 0.32 : 0.85, ...dividerSx }} />
            </>
          ) : null}
          {children}
        </>
      )}
    </Paper>
  );
}

export default DashboardSurface;
