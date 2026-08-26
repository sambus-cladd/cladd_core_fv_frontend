import { Box, Typography, LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { colors, typography } from "../../../styles/alpacladdFvDesignTokens";

const ProgressBar = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  border: `1px solid ${colors.borderCard}`,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "rgba(26, 72, 98, 0.12)",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
  },
}));

const labelSx = {
  ...typography.muted,
  fontSize: "0.8rem",
};

const FabricProgress = ({ crudoValue, denimValue, totalCrudo, totalDenim }) => {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" sx={labelSx}>
          Crudo
        </Typography>
        <Typography variant="body2" sx={labelSx}>
          Denim
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "50%", mr: 1 }}>
          <ProgressBar
            variant="determinate"
            value={crudoValue}
            sx={{
              [`& .${linearProgressClasses.bar}`]: {
                backgroundColor: colors.tabIndicator,
              },
            }}
          />
        </Box>
        <Box sx={{ width: "50%", ml: 1 }}>
          <ProgressBar
            variant="determinate"
            value={denimValue}
            sx={{
              [`& .${linearProgressClasses.bar}`]: {
                backgroundColor: colors.brand,
              },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" sx={labelSx}>
          {totalCrudo} km
        </Typography>
        <Typography variant="body2" sx={labelSx}>
          {totalDenim} km
        </Typography>
      </Box>
    </Box>
  );
};

export default FabricProgress;
