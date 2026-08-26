import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AddCardIcon from '@mui/icons-material/AddCard';
import DvrIcon from '@mui/icons-material/Dvr';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import HeaderYFooter from '../../../../components/Plantilla/HeaderYFooter';
import Menu from '../../../../components/Plantilla/Menu';
import FormSubproducto from './FormSubproducto';
import DashboardSubProd from './DashboardSubProd';

function SubProducto() {
    const [value, setValue] = useState(1);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    const tabsConfig = useMemo(
        () => [
            {
                key: 'atras',
                label: 'Atras',
                icon: <ArrowBackIcon />,
                component: <Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" replace />,
            },
            {
                key: 'dashboard',
                label: 'Dashboard',
                icon: <DvrIcon />,
                component: <DashboardSubProd />,
            },
            {
                key: 'registro',
                label: 'Registro',
                icon: <AddCardIcon />,
                component: <FormSubproducto />,
            },
            {
                key: 'reportes',
                label: 'Reportes',
                icon: <AssessmentIcon />,
                component: <></>,
            },
        ],
        []
    );

    return (
        <HeaderYFooter titulo="SUBPRODUCTO" color="alpacladd" showMainMenu={false}>
            <Menu tabsConfig={tabsConfig} value={value} onChange={handleChange} />
        </HeaderYFooter>
    );
}

export default SubProducto;
