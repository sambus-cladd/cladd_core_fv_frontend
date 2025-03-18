import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';

// Iconos

import HomeIcon from '@mui/icons-material/Home';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import DvrIcon from '@mui/icons-material/Dvr';

import AlpaLogo from '../../assets/Images/alpaLogo.png';
// import { Navbar } from '../../components/Navbar/Navbar';

import CargarArticulos from './CargarArticulos';
import TablaArtDetalles from './TablaArtDetalles';
import DetallesArticulos from './DetallesArticulos';
import Navbar from '../Navbar/Navbar';




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


export const Articulos = ({ rol = 'lr' }) => {
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

    return (
        <>
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <div className="CladdHome">
                        <Navbar Titulo="FICHA TECNICA" color="alpacladd" plantaLogo={AlpaLogo} />
                    </div>

                    <Box sx={{ width: '100%', bgcolor: " #d3d3d3", paddingRight: '20px' }}>
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab label="Home" icon={<HomeIcon />} />
                            <Tab label="" disabled />
                            <Tab label="Detalles Articulos" icon={<ManageSearchIcon />} />
                            <Tab label="Registros" icon={<DvrIcon />} />
                            { rol !== "fv" &&
                                < Tab label="Agregar Articulo" icon={<AddIcon />} />
                            }
                        </Tabs>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <CustomTabPanel value={value} index={0}>
                            {
                                rol !== "fv" 
                                ? <Navigate to='/LaRioja/Alpacladd/Productividad/Calidad/'></Navigate>
                                : <Navigate to='/BuenosAires/FlorencioVarela/Terminacion'></Navigate>
                            }
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <></>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <DetallesArticulos></DetallesArticulos>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            <TablaArtDetalles></TablaArtDetalles>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={4}>
                            <CargarArticulos></CargarArticulos>
                        </CustomTabPanel>
                    </Box>
                </div>
            </div>

            {/* Footer */}
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
                <Typography variant="caption" color="white">
                © Automatización - La Rioja
                </Typography>
                <Typography variant="caption" color="white">
                IT - Depto. Aplicaciones
                </Typography>
            </Box>
                </>
    );
};

export default Articulos;