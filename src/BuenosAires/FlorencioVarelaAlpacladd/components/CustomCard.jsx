import { Card, CardContent, Typography, Box } from "@mui/material"

const CustomCard = ({ title, cantidadCrudo }) => (
  <Card
    sx={{
      textAlign: "center",
      borderRadius: "16px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      marginTop: "20px",
      background: "linear-gradient(145deg, #2c4356, #1e2c3a)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <CardContent sx={{ padding: "24px" }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          color: "#E2F1E7",
          marginBottom: "16px",
          fontWeight: 600,
          fontSize: {
            xs: "1rem",
            sm: "1.25rem",
            md: "1.5rem",
          },
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          component="p"
          sx={{
            color: "#629584",
            fontWeight: 700,
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
            },
          }}
        >
          {cantidadCrudo} km
        </Typography>
      </Box>
    </CardContent>
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at top right, rgba(98, 149, 132, 0.15), transparent 70%)",
        zIndex: 0,
      }}
    />
  </Card>
)

export default CustomCard

