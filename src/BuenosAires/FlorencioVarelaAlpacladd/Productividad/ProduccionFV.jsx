import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCardIcon from '@mui/icons-material/AddCard';

import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import Menu from '../../../components/Plantilla/Menu';
import FormProduccionReal from './components/FormProduccionReal';

function ProduccionFV() {
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
                key: 'registro',
                label: 'Registro Producción',
                icon: <AddCardIcon />,
                component: <FormProduccionReal />,
            },
        ],
        []
    );

    return (
        <HeaderYFooter titulo="PRODUCCIÓN" color="alpacladd" showMainMenu={false}>
            <Menu tabsConfig={tabsConfig} value={value} onChange={handleChange} />
        </HeaderYFooter>
    );
}

export default ProduccionFV;
