import { useEffect, useState, React } from 'react';
import { Navbar } from '../../../components';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Navigate, Route } from 'react-router-dom';
import AlpaLogo from '../../../assets/Images/alpaLogo.png';
import FormAgregarRollo from './components/FormAgregarRollo';
import FormDescontarRollo from './components/FormDescontarRollo';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
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


function AgregarRolloFV() {
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
                        <Navbar Titulo="MANEJO DE ROLLOS" color={"alpacladd"} plantaLogo={AlpaLogo} />
                    </div>
                    <Box sx={{ width: '100%', bgcolor: " #d3d3d3", paddingRight: '20px' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                        >
                            <Tab label="Home" icon={<HomeIcon />} />
                            <Tab disabled />
                            <Tab label="Agregar Rollo" icon={<AddIcon/>} />
                            <Tab label="Descontar Rollo" icon={<RemoveIcon/>} />
                            
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
                            <FormAgregarRollo />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            <FormDescontarRollo />
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
export default AgregarRolloFV;