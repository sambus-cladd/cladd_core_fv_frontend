import { Card, CardContent, Typography, Box } from "@mui/material";
import { dashboardCard, headerDividerSx, typography } from "../../../styles/alpacladdFvDesignTokens";

const CustomCard = ({ title, cantidadCrudo, sx, children }) => (
  <Card
    elevation={0}
    sx={{
      textAlign: "center",
      marginTop: "20px",
      ...dashboardCard,
      overflow: "hidden",
      position: "relative",
      ...sx,
    }}
  >
    <CardContent sx={{ padding: "24px", position: "relative", zIndex: 1 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          ...typography.cardTitle,
          fontSize: {
            xs: "1rem",
            sm: "1.25rem",
            md: "1.5rem",
          },
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Box sx={headerDividerSx} />
      {cantidadCrudo !== undefined && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100px",
            pt: 1,
          }}
        >
          <Typography variant="h4" component="p" sx={{ ...typography.kpiValue, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            {cantidadCrudo} km
          </Typography>
        </Box>
      )}
      {children}
    </CardContent>
  </Card>
);

export default CustomCard;
