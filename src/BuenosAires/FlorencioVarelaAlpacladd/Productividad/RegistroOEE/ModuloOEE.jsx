import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Navbar } from '../../../../components';
import { Navigate } from 'react-router-dom';
import RegistroDatosOEE from './RegistroOEE/RegistroDatosOEE';
import GenerarOEE from './GenerarOEE/GenerarOEE';
import ReportesOEE from './ReportesOEE/ReportesOEE';
import HomeIcon from '@mui/icons-material/Home';
import AddCardIcon from '@mui/icons-material/AddCard';
import SearchIcon from '@mui/icons-material/Search';
import DvrIcon from '@mui/icons-material/Dvr';

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
                <Box sx={{ p: 2 }}>
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

const ModuloOEE = () => {
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
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

    useEffect(() => {
        document.title = "CladdCore FV - OEE";
    }, []);

    return (
        <>
        <div style={contentStyle}>
            {/* <Box sx={{ position: "sticky", top: 0, zIndex: 1100, bgcolor: "white", boxShadow: 2 }}> */}
            <Box sx={{ top: 0, zIndex: 1100, bgcolor: "white", boxShadow: 2 }}>
                <Navbar Titulo="MODULO OEE" color="alpacladd" />
                <Box sx={{ width: '100%', bgcolor: "#d3d3d3", display: 'flex', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                    <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons="on" allowScrollButtonsMobile >
                        <Tab label="Home" sx={{ minWidth: '120px', padding: '4px 6px', fontSize: '0.75rem' }} icon={<HomeIcon />} />
                        <Tab label="Registro OEE" sx={{ minWidth: '120px', padding: '4px 6px', fontSize: '0.75rem' }} icon={<AddCardIcon />} />
                        <Tab label="Reportes OEE" sx={{ minWidth: '120px', padding: '4px 6px', fontSize: '0.75rem' }} icon={<SearchIcon />} />
                        <Tab label="Graficos OEE" sx={{ minWidth: '120px', padding: '4px 6px', fontSize: '0.75rem' }} icon={<DvrIcon />} />
                    </Tabs>
                </Box>
            </Box>

            <Box sx={{ width: '100%' }}>
                <CustomTabPanel value={value} index={0}>
                    <Navigate to='/BuenosAires/FlorencioVarela/AlpacladdHome'></Navigate>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <RegistroDatosOEE />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                    <GenerarOEE />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={3}>
                    <ReportesOEE />
                </CustomTabPanel>
            </Box>

            <Box display={"flex"} flexDirection={"column"}
                sx={{ position: "fixed", bottom: 16, right: 16, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "4px 8px", borderRadius: "4px", }}
            >
                <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
                <Typography variant="caption" color="white">Dirección Industrial</Typography>
            </Box>
        </div>
        </>
    );
};

export default ModuloOEE;
