import { useState, React } from 'react';
import { Navbar } from '../../../../components';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import AlpaLogo from '../../../../assets/Images/alpaLogo.png';

// Mui Icons
import AddCardIcon from '@mui/icons-material/AddCard';
import DvrIcon from '@mui/icons-material/Dvr';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import FormSubproducto from './FormSubproducto';
import DashboardSubProd from './DashboardSubProd';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


function SubProducto() {
    const [value, setValue] = useState(2);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // Iicio - Estructura para usar toda la pantalla sin que se corte al haber pocos elementos
    const containerStyle = {
        minHeight: '100vh', // Establece el contenedor principal para ocupar al menos el 100% del alto de la pantalla
        display: 'flex',
        flexDirection: 'column',
    };

    const contentStyle = {
        flexGrow: 1, // Permite que el contenido se expanda y llene el espacio disponible
    };
    // Fin - Estructura para usar toda la pantalla sin que se corte al haber pocos elementos

    const footerStyle = {
        backgroundColor: '#1A4862',
        padding: '5px',
        textAlign: 'center',
        color: 'white',
        fontSize: '15px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
    };

    return (
        <>
            <div style={containerStyle}> {/* Contenedor principal */}
                <div style={contentStyle}> {/* Contenido de la página */}

                    <div className="CladdHome">
                        <Navbar Titulo="SUBPRODUCTO" color={"alpacladd"} plantaLogo={AlpaLogo} />
                    </div>
                    <Box sx={{ width: '100%', bgcolor: " #d3d3d3", paddingRight: '20px' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                        >
                            <Tab label= "Atras" icon={<ArrowBackIcon  />} />
                            <Tab disabled />
                            <Tab label="Dashboard" icon={<DvrIcon/>}/>
                            <Tab label="Registro" icon={<AddCardIcon/>} />
                            <Tab label="Reportes"  icon={<AssessmentIcon/>} disabled />                           
                        </Tabs>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <CustomTabPanel value={value} index={0}>
                            <Navigate to='/BuenosAires/FlorencioVarela/Productividad'></Navigate>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <></>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <DashboardSubProd/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            <FormSubproducto/>
                        </CustomTabPanel>
                    </Box>


                </div>

                {/* Footer */}
                <footer style={footerStyle}>
                    CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
                </footer>

            </div>
        </>
    )
}
export default SubProducto;