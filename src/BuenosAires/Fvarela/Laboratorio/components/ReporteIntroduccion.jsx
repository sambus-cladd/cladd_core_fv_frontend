import React from 'react'
import Box from '@mui/material/Box';
import IntroduccionReporte   from '../../assets/Reporte3.png';

export default function ReporteIntroduccion() {
  return (
    <Box sx={{        
                backgroundImage: `url(${IntroduccionReporte})`,
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "cover",//"100% 100%",
                // filter: 'blur(0.04rem)',
                opacity: '2'
 
            }}>

        <div style={{height:"90vh", position: 'relative'}}> </div>
    </Box>
   
  )
}
