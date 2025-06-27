import React from 'react'
import { useState } from 'react';
import { Box, Tabs, Tab} from '@mui/material/';
import Grid from '@mui/material/Unstable_Grid2';
import LaRioja from './assets/Images/LARIOJAblanco.png';
import { Navigate } from 'react-router-dom'
import IntroduccionReporte from './assets/Images/ReporteQuimicos.jpg';
import StockCalidad from './components/StockCalidad.jsx';
import PersonIcon from '@mui/icons-material/Person';
import BuscadorRutina from './BuscadorRutina.jsx';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormularioEnsayos from './components/FormularioEnsayos.jsx'
import { useAuth } from '../../AuthContext';
import ScienceIcon from '@mui/icons-material/Science';

export default function FVLaboratorio() {

    const [Tabvalue, setTabvalue] = useState('RutinasActivas');
    const [rutina, setRutina] = useState('');
    const { auth } = useAuth();
    const [scrollPos, setScrollPos] = useState(0);



    const handleTabsChange = (event, newValue, rutina = '') => {
        setTabvalue(newValue);
        setRutina(rutina);

    };

    function renderSwitch(key) {
        switch (key) {
            case 'GENERAL':
                <Box sx={{ backgroundImage: `url(${IntroduccionReporte})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", opacity: '2' }}>
                    <div style={{ height: "90vh", position: 'relative' }}></div>
                </Box>

            case 'info':
                return auth?.usuario
            case 'BUENOS AIRES':
                return <Navigate to={"/BuenosAires/FlorencioVarela/AlpacladdHome"} />;
            case 'RutinasActivas':
                return <BuscadorRutina handleTabChange={handleTabsChange} />;
            case 'FormularioRegistro':
                return <FormularioEnsayos rutina={rutina} handleTabChange={handleTabsChange}/>;
            case 'StockCalidad':
                return <StockCalidad />;
            default:
                return (
                    <Box sx={{ backgroundImage: `url(${IntroduccionReporte})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", opacity: '2' }}>
                        <div style={{ height: "90vh", position: 'relative' }}></div>
                    </Box>
                );
        }
    }


    return (
        <>

            <Grid container width={'100%'} sx={{ boxSizing: 'content-box' }}>

                <Grid item xs={12} md={12} lg={12} sx={{ background: 'rgba(	200, 200, 200,0.5)', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={Tabvalue} onChange={handleTabsChange}  >
                            <hr />
                            <Tab icon={<img src={LaRioja} alt="LA RIOJA" style={{ width: '35px', height: '40px' }} />} value="BUENOS AIRES" label="BUENOS AIRES" />
                            <hr />
                            <Tab disabled/>
                            <hr />
                            <Tab icon={<FormatListNumberedIcon />} value="RutinasActivas" label="RUTINAS ACTIVAS" />
                            <hr />
                            <Tab icon={<ScienceIcon />} value="FormularioRegistro" label="Formulario" />
                            <hr />
                            <Tab value="info" disabled label={auth?.usuario} icon={<PersonIcon />} />
                        </Tabs>
                    </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={12} mt={1} p={1} >
                    {renderSwitch(Tabvalue)}
                </Grid>
            </Grid>

        </>

    )
}
