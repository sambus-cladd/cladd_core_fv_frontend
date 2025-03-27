import { Box, Typography, LinearProgress, linearProgressClasses } from "@mui/material"
import { styled } from "@mui/material/styles"

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  border: "1px solid #b7b5b5", 
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
  },
}))

const FabricProgress = ({ crudoValue, denimValue, totalCrudo, totalDenim }) => {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
          Crudo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
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
                backgroundColor: "#a7c2b0",
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
                backgroundColor: "#4A7B8D",
              },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
          {totalCrudo} km
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
          {totalDenim} km
        </Typography>
      </Box>
    </Box>
  )
}

export default FabricProgress