import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import Menu from '../../../components/Plantilla/Menu';
import FormAgregarRollo from './components/FormAgregarRollo';
import FormDescontarRollo from './components/FormDescontarRollo';

function AgregarRolloFV() {
    const [value, setValue] = useState(1);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    const tabsConfig = useMemo(
        () => [
            {
                key: 'home',
                label: 'Home',
                icon: <HomeIcon />,
                component: <Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" replace />,
            },
            {
                key: 'agregar',
                label: 'Agregar Rollo',
                icon: <AddIcon />,
                component: <FormAgregarRollo />,
            },
            {
                key: 'descontar',
                label: 'Descontar Rollo',
                icon: <RemoveIcon />,
                component: <FormDescontarRollo />,
            },
        ],
        []
    );

    return (
        <HeaderYFooter titulo="MANEJO DE ROLLOS" color="alpacladd" showMainMenu={false}>
            <Menu tabsConfig={tabsConfig} value={value} onChange={handleChange} />
        </HeaderYFooter>
    );
}

export default AgregarRolloFV;
