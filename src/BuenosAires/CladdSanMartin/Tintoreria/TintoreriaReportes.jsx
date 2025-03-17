
import {useEffect, useState ,React} from 'react';

// import {useEffect, useState ,React} from 'react';
// import { Header } from '../../components/Header';

import { Navbar } from '../../../components'
import LogoCladd from '../../../assets/Images/claddLogo.png';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import FmdBadIcon from '@mui/icons-material/FmdBad';

import ReporteProduccionxFechas from './components/ReporteProduccionxFechas';
import ReporteHistorialXMaquina from './components/ReporteHistorialXMaquina';
import ReporteParosxFechas from './components/ReporteParosxFechas';
import ReporteGruposParosxFechas from './components/ReporteGruposParosxFechas';
import ReporteEficienciaxMaquinas from './components/ReporteEficienciaxMaquinas';
import ReporteIntroduccion from '../Tintoreria/components/ReporteIntroduccion';
import ReporteAlarmasTabla from '../Tintoreria/components/ReporteAlarmasTabla';
import ReporteParosTotalMaquinas from '../Tintoreria/components/ReporteParosGruposMaquinas';


import AlertaConexionAPI from '../../../components/AlertaAPI/AlertaConexionAPI';

function TintoreriaReportes() 
{
    const [item,setitem] = useState("")
    const handleButtonClick = (data) => { setitem(data) }; 

    function renderSwitch(key)
        {
            switch (key) {
                            case 'Produccion':
                                return   <ReporteProduccionxFechas />;        
                                break;
                            
                            case 'HistorialMaquina':
                                return   <ReporteHistorialXMaquina />;        
                                break;
                                
                            // case 'Paros':
                            //     return   <ReporteParosxFechas />;        
                            //     break;

                            case 'ParosTotalMaquinas':
                                return   <ReporteParosTotalMaquinas />;       
                                break;
                            
                            // case 'ParosGrupo':
                            //     return   <ReporteGruposParosxFechas />;       
                            //     break;
                            
                            // case 'EficienciaMaquinas':
                            //     return   <ReporteEficienciaxMaquinas />;       
                            //     break;
                            
                            case 'AlarmasMaquinas':
                                return   <ReporteAlarmasTabla />;       
                                break;

                            default:
                                return <ReporteIntroduccion />;
                                break;
                        }
        }

        let ItemsSidebar=
                    [
                      {key:"Produccion", icono:<LeaderboardIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Análisis de Producción General", disabled:false},
                      {key:"HistorialMaquina", icono:<LineAxisIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Análisis de Producción por Máquina", disabled:false},
                      {key:"ParosTotalMaquinas", icono:<FmdBadIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Análisis de Paros General", disabled:false},
                    //   {key:"Paros", icono:<WatchLaterIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Tiempo de Paros Por Fechas", disabled:false},
                    //   {key:"ParosGrupo", icono:<DonutSmallIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Cantidad de Paros Por Fechas", disabled:false},
                    //   {key:"EficienciaMaquinas", icono:<LineAxisIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Eficiencia de Máquinas Por Fechas", disabled:false},
                      {key:"AlarmasMaquinas", icono:<AddAlertIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Alarmas y Paros en Tiempo Real", disabled:false},
                    //   {key:"HistorialRollo", icono:<AssignmentIcon  sx={{ fontFamily:'Poppins', fontSize: 40, color: 'white'}}/>,Texto:"Historial por Rollo", disabled:false},
                        
                    ]


    return (
    <>
    
    <div>
      
      <Navbar Titulo="-- REPORTES ÁREA TINTORERÍA  --" plantaLogo={LogoCladd}/>
    
    
    <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100%", mt:"0rem"}} columnSpacing={0.5} rowSpacing={0} columns={12}>
        <Grid xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
        <Typography sx={{ fontSize: 30, color: 'white', backgroundColor: '#115393', fontFamily: 'Poppins', fontWeight:'500'}} > ELEGIR REPORTE </Typography>
        <Typography sx={{ fontSize: 25, color: 'white', backgroundColor: '#115393', fontFamily: 'Poppins', fontWeight:'light'}} > **************** </Typography>
            {  SideBar(ItemsSidebar) }
        </Grid>

        <Grid xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} style={{ marginTop: '20px' }}>
           <AlertaConexionAPI URLAPI="http://192.168.40.95:4500/" /> 
            { renderSwitch(item)}
        </Grid>
    
   
    </Grid>
    </div>
    </>
  
  )
    // SIDE BAR //

 function SideBar(Items)
 {
    return(
        <Box
        sx={{
          boxSizing: 'content-box',
          width: "100%",
          float: 'left',
          height: "100%",
          backgroundColor: '#115393',
          pt:0,
          mt:0,
        }}
      >
        <Grid container sx={{alignItems: 'left', justifyContent: 'left', width:"100%", mt:"0rem"}} columnSpacing={0.1} rowSpacing={1} columns={12}>
            {
                // Recorro el vector para ir formando los botones creados en el vector ItemsSidebar
                Items.map((Item) =>
                {
                    return <Grid xs={6} sm={6} md={12} lg={12} xl={12} >
                    <Button  variant="contained" disabled={Item.disabled} sx={{width:"98%", border: '1.5px dashed grey',p:1,m:0,backgroundColor: 'rgba(0, 0, 0,0.3)'}}
                            onClick={() => { handleButtonClick(Item.key); }}
                    >    
                        <Grid container sx={{alignItems: 'center',width:"100%",justifyContent:'space-around'}} columnSpacing={1} rowSpacing={0} columns={12}>
                            <Grid xs={2} sm={2} md={2} lg={2} xl={2} >
                                 { Item.icono}
                            </Grid>
                            <Grid xs={10} sm={10} md={10} lg={10} xl={10} >
                                <Typography fontFamily={ "poppins"} sx={{ margin: "0px",fontSize: 15,color:"white"}}variant="text" gutterBottom>
                                    { Item.Texto}
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

export default TintoreriaReportes