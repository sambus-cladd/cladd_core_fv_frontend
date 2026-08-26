import { Box, Paper, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { colors, dashboardCard, statusCard, typography } from "../../../../styles/alpacladdFvDesignTokens";

function ProductividadAccesoCard({ title, description, icon: Icon, onClick, external = false }) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        ...dashboardCard,
        ...statusCard,
        p: { xs: 1.6, md: 2 },
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderTop: `3px solid ${colors.brand}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "10px",
            bgcolor: "rgba(26, 72, 98, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.brand,
            flexShrink: 0,
          }}
        >
          {Icon ? <Icon sx={{ fontSize: 24 }} /> : null}
        </Box>
        {external ? <OpenInNewIcon sx={{ fontSize: 18, color: colors.textMuted }} /> : null}
      </Box>

      <Typography
        sx={{
          ...typography.cardTitle,
          fontSize: { xs: "0.92rem", md: "1rem" },
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>

      {description ? (
        <Typography
          sx={{
            ...typography.muted,
            fontSize: { xs: "0.78rem", md: "0.84rem" },
            lineHeight: 1.4,
            flexGrow: 1,
          }}
        >
          {description}
        </Typography>
      ) : null}
    </Paper>
  );
}

export default ProductividadAccesoCard;
