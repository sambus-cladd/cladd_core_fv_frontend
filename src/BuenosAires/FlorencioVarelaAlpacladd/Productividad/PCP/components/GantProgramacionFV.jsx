import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Navbar } from '../../../../../components';
import AlpaLogo from '../../../../../assets/Images/alpaLogo.png';
import { Navigate } from 'react-router-dom';
import RollosPorOrden from './RollosPorOrden';
import HomeIcon from '@mui/icons-material/Home';
import AddCardIcon from '@mui/icons-material/AddCard';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import BarChartIcon from '@mui/icons-material/BarChart';
import DvrIcon from '@mui/icons-material/Dvr';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import FormularioGantPpc from './FormularioGantPcp';
import HistoricoGantt from './TablaHistoricoGant';
import MetrosXArticulos from './MetrosXArticulos'
import ModificacionGantPcp from './ModificacionGantPcp';

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

export const GantProgramacionFV = () => {
    const [value, setValue] = React.useState(3);
    const [orden, setOrden] = React.useState("");
    const [articulo, setArticulo] = React.useState("");
    const [maquina, setMaquina] = React.useState("");
    const handleChange = (event, newValue, orden, articulo, maquina) => {
        setValue(newValue);
        setOrden(orden);
        setArticulo(articulo);
        setMaquina(maquina);
        // Abrir una nueva ventana para PLANTAS
        if (newValue === 2) {
            const newWindow = window.open("/BuenosAires/FlorencioVarela/Productividad/PCP/GraficoGantFV", '_blank');
            if (newWindow) newWindow.focus();
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    };

    const contentStyle = {
        flexGrow: 1,
    };

    const footerStyle = {
        backgroundColor: '#1A4862',
        textAlign: 'center',
        color: 'white',
        fontSize: '15px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        padding: '5px'
    };

    return (
        <>
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <Navbar Titulo="GANTT PROGRAMACIÓN" color="alpacladd" plantaLogo={AlpaLogo} />

                    <Box sx={{ width: '100%', bgcolor: " #d3d3d3", display: 'flex', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                        <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons="on" allowScrollButtonsMobile>
                            <Tab label="Home" icon={<HomeIcon />} />
                            <Tab label="" disabled />
                            <Tab label="Grafico Producción" icon={<DvrIcon />} />
                            <Tab label="Registro Producción" icon={<AddCardIcon />} />
                            <Tab label="Modificaciones" icon={<DriveFileRenameOutlineIcon />} />
                            <Tab label="Metros x Articulo" icon={<ManageSearchIcon />} />
                            <Tab label="Historico" icon={<SearchIcon />} />
                            <Tab label="Rollos x Orden" icon={<SearchIcon />} />
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

                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={3}>
                            <FormularioGantPpc />
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={4}>
                            <ModificacionGantPcp />
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={5}>
                            <MetrosXArticulos />
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={6}>
                            <HistoricoGantt handleChange={handleChange} />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={7}>
                            <RollosPorOrden orden={orden} articulo={articulo} maquina={maquina} />
                        </CustomTabPanel>
                    </Box>
                </div>

                <footer style={footerStyle}>
                    CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
                </footer>
            </div>
        </>
    );
};

export default GantProgramacionFV;
