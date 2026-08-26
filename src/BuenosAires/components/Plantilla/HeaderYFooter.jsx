import Navbar from '../Navbar/Navbar';
import AlpaLogo from '../../assets/Images/alpaLogo.png';
import { Box, Typography } from "@mui/material";
import { pageContainer } from "../../../styles/alpacladdFvDesignTokens";

function HeaderYFooter({ children, titulo, color, routes }) {
  const contentStyle = {
    flexGrow: 1,
  };

  return (
    <Box sx={{ ...pageContainer, overflowX: 'hidden' }}>
      <div
        className="CladdHome"
        style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}
      >
        <Navbar
          Titulo={titulo ? titulo : ""}
          color={color === "enod" ? "enod" : "alpacladd"}
          plantaLogo={AlpaLogo}
          Routes={routes}
        />
      </div>

      <div style={contentStyle}>
        {children}
      </div>

      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
        <Typography variant="caption" color="white">Dirección Industrial</Typography>
      </Box>
    </Box>
  );
}

export default HeaderYFooter;
