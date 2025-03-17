import { useEffect, useState, React } from 'react';
// import { Header } from '../../components/Header';
// MUI Libreria
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
// Mui Librerias Iconos
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import Button from '@mui/material/Button';
import MovingIcon from '@mui/icons-material/Moving';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CommitIcon from '@mui/icons-material/Commit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BiotechIcon from '@mui/icons-material/Biotech';
// Componenetes 

import ReporteIntroduccion from './components/ReporteIntroduccion';
import { Navbar } from '../../../components';
// Imagenes
 
import FormularioTerminado from './components/FormularioTerminado'

function ReportesLaboratorioCalidadFV() {
  const [item, setitem] = useState("")
  const handleButtonClick = (data) => { setitem(data) };
  function renderSwitch(key) {
    switch (key) {
      case 'Terminado':
        return <FormularioTerminado />;
        break;
      case 'EncoladoProduccion':
        // return <ReporteEncoladoProduccionporFecha />
        break;
      case 'TenidoProduccion':
        // return <ReporteTenidoProduccionporFecha />
        break;
      case 'ReporteLabProceso':
        // return <ReporteLabProcporOrden />
        break;
      case 'ReportesSupervisores':
        // return <ReportesSupervisores />;

        break;

      // case 'ProduccionArticulos':
      //     return   <ReporteProduccionArticulosporFecha />;

      // case 'Anudados':
      //         return   <ReporteAnudadosporFecha />;

      //     break;

      // case 'EficienciaTelares':
      //         return   <ReporteTurnoporFecha />;

      //     break;    
      default:
        return <ReporteIntroduccion />
        break;
    }
  }

  let TituloHeader = <Typography
    fontSize={{ xs: 15, sm: 15, md: 15, lg: 15 }}
    variant="text"
    fontWeight="light"
    sx={{ fontSize: "100%", color: "white" }} >
    Reportes Sector Humedo
  </Typography>;

  let ItemsSidebar =
    [
      { key: "Terminado",   icono: <AssessmentIcon  sx={{ fontSize: 40, color: 'white' }} />, Texto: "Terminado", disabled: false },
      { key: "Reprueba",    icono: <AssessmentIcon  sx={{ fontSize: 40, color: 'white' }} />, Texto: "Reprueba",  disabled: true },
      { key: "Crudo",       icono: <AssessmentIcon  sx={{ fontSize: 40, color: 'white' }} />, Texto: "Crudo",     disabled: true },
      { key: "LavPot",      icono: <BiotechIcon     sx={{ fontSize: 40, color: 'white' }} />, Texto: "Lav Pot",   disabled: true },
      { key: "3Ensayos",    icono: <AssignmentIcon  sx={{ fontSize: 40, color: 'white' }} />, Texto: "3 Ensayos", disabled: true },
      { key: "Otro",        icono: <SportsScoreIcon sx={{ fontSize: 40, color: 'white' }} />, Texto: "Otro",      disabled: true },
 
    ]

  return (
    <>
      <div className="" >

        <Navbar Titulo="-- Laboratorio --"   />

        <Grid container sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', width: "100%", mt: "0rem" }} columnSpacing={0.1} rowSpacing={0} columns={12}>
          <Grid xs={12} sm={12} md={2.5} lg={2.5} xl={2.5} >
            {SideBar(ItemsSidebar)}
          </Grid>
          <Grid xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} >
            {renderSwitch(item)}
          </Grid>


        </Grid>
      </div>
    </>

  )
  // SIDE BAR //

  function SideBar(Items) {
    return (
      <Box
        sx={{
          boxSizing: 'content-box',
          width: "100%",
          float: 'left',
          height: "100%",
          backgroundColor: '#115393',
          pt: 0,
          mt: 0,
        }}
      >
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center', width: "100%", mt: "0rem" }} columnSpacing={0.1} rowSpacing={1} columns={12}>
          {
            // Recorro el vector para ir formando los botones creados en el vector ItemsSidebar
            Items.map((Item) => {
              return <Grid xs={6} sm={6} md={12} lg={12} xl={12} >
                <Button variant="contained" disabled={Item.disabled} sx={{ width: "98%", border: '1.5px dashed grey', p: 1, m: 0, backgroundColor: 'rgba(0, 0, 0,0.3)' }}
                  onClick={() => { handleButtonClick(Item.key); }}
                >
                  <Grid container sx={{ alignItems: 'center', width: "100%", justifyContent: 'space-around' }} columnSpacing={1} rowSpacing={0} columns={12}>
                    <Grid xs={2} sm={2} md={2} lg={2} xl={2} >
                      {Item.icono}
                    </Grid>
                    <Grid xs={10} sm={10} md={10} lg={10} xl={10} >
                      <Typography fontFamily={"poppins"} sx={{ margin: "0px", fontSize: 15, color: "white" }} variant="text" gutterBottom>
                        {Item.Texto}
                      </Typography>
                    </Grid>
                  </Grid>
                </Button>


              </Grid>
            })
          }

        </Grid>

      </Box>
    )
  }

}

export default ReportesLaboratorioCalidadFV