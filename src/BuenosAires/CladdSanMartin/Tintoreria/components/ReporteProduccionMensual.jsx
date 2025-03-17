import {useEffect, useState, React} from 'react';
import axios from 'axios'
// MUI Libreria
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker   }   from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';

// Otra Libreria
import es from 'date-fns/locale/es';

import ReporteCalidadTabla from "./ReporteProduccionTabla"

// import { GetReporteCALIDAD } from "../API/APIFunctions";

export default function ReporteProduccion()  {
    
    let Fecha = new Date(Date.now())
    let DiaAnterior= new Date(Fecha.getTime() - 1000 * 60 * 60 * 24)
    const mes=Fecha.getMonth()+1 

    // let obj;
    // let array_aux=[];
    // let ProduccionFechas_aux=[];
    let dataRAW;

    const [DatosProduccion, setDatosProduccion]                       = useState(0)             ;
    

    async function GetReporteProduccion () 
    {
        
        dataRAW = await axios.get('http://192.168.40.95:4500/infotintPRODUCCION')
        setDatosProduccion(dataRAW.data)
        console.log("BOTN")
 
    }

    const handleButtonClick = ( ) =>
    {
        GetReporteProduccion ( )
    }; 
   
    return (  
        <>
       { console.log(dataRAW)}
        <Grid xs={12} sm={12} md={12}>
             {/*Se colocan br al inicio y fin del h2 para separar el título */}
            <br />
                <h2>-- PRODUCCIÓN MENSUAL --</h2>
                <h4>-- En Contrucción --</h4>
            <br />
        </Grid>

        <Grid  width={'100%'} sx={{boxSizing: 'content-box'}}>
            
             <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ minWidth: 275, height:80, p:2}} >    
                <Grid container spacing={2} sx={{alignItems: 'center'}}>
                <Grid item xs={4} md={4} lg={3}></Grid>
                    
                    <Grid item xs={3} md={3} lg={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                           
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3} md={3} lg={3}>
                        <Button variant="contained"
                            onClick={() => {
                            handleButtonClick();
                            // alert('clicked');
                            }}
                            >Generar Informe
                        </Button>
              
                    </Grid>
                </Grid>
            </Card>

        </Grid>  

        <br />
        <Grid item xs={12} md={12} lg={12}>
            <ReporteCalidadTabla  Titulo={"Producción"}   Serie={DatosProduccion}   Labels={[' ' ]} />
        </Grid>
    
  </Grid>
  </>
  )
    
}

