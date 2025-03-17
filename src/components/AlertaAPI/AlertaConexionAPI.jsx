import {useState,React,useEffect} from 'react';
import Typography from '@mui/material/Typography';
import { Alert ,Collapse  } from '@mui/material';
function AlertaConexionAPI({URLAPI, Nombre}) 
{
    const identificadorIntervaloDeTiempo = 30000//60000; // 1 minuto
    const [APIAlert, setAPIAlert] = useState(false); // estado para controlar si la API está Online
    
    async function APIOnline ()
    {
        fetch(URLAPI)
        .then(response => {
          if (response.ok) {
            // La API  está en línea, no muestra la alerta
            setAPIAlert(false);
          } else {
            // La API no está en línea, muestra la alerta
            setAPIAlert(true);
            
          }
        })
        .catch(error => {
          // Error al hacer la solicitud, muestra la alerta
          setAPIAlert(true);
        });
     
    }
 
    
    useEffect(() => 
    {
        APIOnline ()
     const interval = setInterval(() => 
    {
        APIOnline ()
      
    }, identificadorIntervaloDeTiempo);

    return () => clearInterval(interval);
  }, []);
  return (
    <>      
        {/* Alerta que se muestra si la API no está en línea */}
        <Collapse in={APIAlert}>
            <Alert variant="filled" severity="error"  >
                <Typography fontFamily={'Poppins'} fontSize= {12.5}   >
                    Se perdió la conexión con el servidor. Por favor, revisa tu conexión de red  {Nombre}
                </Typography>            
            </Alert>
        </Collapse>
    </>
  )
}

export default AlertaConexionAPI