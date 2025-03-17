import React from 'react'
import HeaderYFooter from '../../../../components/Plantilla/HeaderYFooter';
import Menu from '../../../../components/Plantilla/Menu';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import LogoutIcon from '@mui/icons-material/Logout';
import ReporteIngresoRollos from './ReporteIngresoRollos';
import ReporteSalidaRollos from './ReporteSalidaRollos';
import { Navigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
const ReportesProductividad = () => {

    const tabsConfig = [
        { label: "Home", icon: <HomeIcon />, component: <Navigate to="/BuenosAires/FlorencioVarela/Productividad" /> },
        { label: "Ingreso Rollos", icon: <MoveToInboxIcon />, component: <ReporteIngresoRollos /> },
        { label: "Salida Rollos", icon: <LogoutIcon />, component: <ReporteSalidaRollos /> },
    ]
    return (
        <HeaderYFooter titulo="REPORTES DE PRODUCTIVIDAD" >
            <Menu tabsConfig={tabsConfig} defaultTab={1} />
        </HeaderYFooter>
    )
}

export default ReportesProductividad