import { React } from 'react';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import Menu from '../../../components/Plantilla/Menu';
import DvrIcon from '@mui/icons-material/Dvr';
import HomeIcon from '@mui/icons-material/Home';
import { Navigate } from "react-router-dom";
import BalanceLaboratorio from './Components/BalanceLaboratorio';
import RutinasTerminadas from './Components/RutinasTerminadas';
import GraficosEnsayos from './Components/GraficosEnsayos';
import TiemposLaboratorio from './Components/TiemposLaboratorio';
function ReportesTerminacion() {

    const tabsConfig = [
        { label: 'Home', icon: <HomeIcon />, component: <Navigate to='/BuenosAires/FlorencioVarela/Terminacion' /> },
        { label: 'Balance Laboratorio', icon: <DvrIcon />, component: <BalanceLaboratorio/> },
        { label: 'Rutinas Terminadas', icon: <DvrIcon />, component: <RutinasTerminadas/> },
        { label: 'Ensayos por fecha', icon:<DvrIcon/>, component: <GraficosEnsayos/> },
        { label: 'Tiempos de Laboratorio', icon:<DvrIcon/>, component: <TiemposLaboratorio/> }
    ]
    return (

        <>
            <HeaderYFooter titulo="REPORTES DE TERMINACION" color="alpacladd" >
                <Menu tabsConfig={tabsConfig} defaultTab={1} />
            </HeaderYFooter>
        </>
    )

}

export default ReportesTerminacion