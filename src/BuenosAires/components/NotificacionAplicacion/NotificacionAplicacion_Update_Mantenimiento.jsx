import { useEffect, useState, React } from 'react';
import { Dialog, DialogTitle,CircularProgress  } from '@mui/material/';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import UpdateIcon from '@mui/icons-material/Update';
import BuildIcon from '@mui/icons-material/Build';
import { GetAplicacionStatusData } from '../../Sistemas/API/APIFunctions';
function NotificacionAplicacion() 
{
  const [EnableMensaje, setEnableMensaje]     = useState(false)
  const [TipoMensaje,   setTipoMensaje]       = useState(0)
  const [BgColor,       setBgColor]           = useState("")
  let identificadorIntervaloDeTiempo          = 1000;// 1/2 Minuto
  let contador=0;

  const getDataAPI = async () => 
  {
 
    let DataRaw = await GetAplicacionStatusData();
    if(DataRaw!==undefined && DataRaw!==null)
    {
      switch(DataRaw.EstadoAplicacion)
     {
        case 0:
          setEnableMensaje(false);
          break;
        case 1:
          setEnableMensaje(true);
          setTipoMensaje(1);
          setBgColor("#256EDC");
          break;
        case 2:
            setEnableMensaje(true);
            setTipoMensaje(2);
            setBgColor("#E87F18");
            break;
          default:
            setEnableMensaje(false);
            
            break;
 
    }
  }
   
  }
  useEffect(() => {
      getDataAPI()
    const interval = setInterval(() => {
 
      contador=contador+1;
      if (contador == 60) 
      {
          getDataAPI();
        contador = 0;
      }
 

    }, identificadorIntervaloDeTiempo);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Dialog open={EnableMensaje} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0' } }}>
        {/* {console.log("BgColor",BgColor)} */}
        {/* <Dialog open={openDialog} autoHideDuration={10000} disableBackdropClick PaperProps={{ style: { backgroundColor: 'transparent', padding: '0' } }}> */}
        <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: BgColor, color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
          {mensaje(TipoMensaje)} 
        </DialogTitle>
      </Dialog>

    </>
  )
}

function mensaje(TipoMensaje)
{

   if(TipoMensaje===1)
    {  
    return (
            <Grid container spacing={2}>
              <Grid xs={12} sx={{  display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <UpdateIcon sx={{ fontSize: 40 }} />
              </Grid>
              <Grid xs={12} sx={{  display: 'flex',justifyContent: 'center',alignItems: 'center',textAlign: 'center'}}>
                La aplicación se está actualizando 
                <br />
                Espere unos minutos para continuar
              </Grid>
              <Grid xs={12} sx={{  display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <CircularProgress color="inherit"/>
              </Grid>
          
            </Grid>
          )
    }
    else if(TipoMensaje===2)
    {
      return (
              <Grid container spacing={2}>
              <Grid xs={12} sx={{  display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <BuildIcon sx={{ fontSize: 40 }} />
              </Grid>
              <Grid xs={12} sx={{  display: 'flex',justifyContent: 'center',alignItems: 'center',textAlign: 'center'}}>
                La aplicación se encuentra en mantenimiento 
                <br />
                Espere unos minutos para continuar
              </Grid>
              <Grid xs={12} sx={{  display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <CircularProgress color="inherit"/>
              </Grid>
            </Grid>
            )
    }
}
export default NotificacionAplicacion