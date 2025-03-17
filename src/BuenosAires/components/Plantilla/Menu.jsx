import { useState } from "react";
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };
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


};

const Menu = ({ defaultTab = 1, tabsConfig }) => {
    const [value, setValue] = useState(defaultTab);
    
    function handleChange(event, newValue) {
        setValue(newValue);
    }

    if (!Array.isArray(tabsConfig) || tabsConfig.length === 0) {
        return <Typography>No hay pestañas disponibles</Typography>;
    }
    return (
        <>
            <Box sx={{ width: '100%', bgcolor: '#d3d3d3', display: 'flex', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                <Tabs value={value} onChange={handleChange} centered={true} variant="scrollable" scrollButtons="on" allowScrollButtonsMobile>
                    {tabsConfig.map((tab, index) => (
                        <Tab key={index} label={tab.label} icon={tab.icon} />
                    ))}
                </Tabs>
            </Box>
            <Box sx={{ width: '100%' }}>
                {tabsConfig.map((tab, index) => (
                    <CustomTabPanel key={index} value={value} index={index}>
                        {tab.component}
                    </CustomTabPanel>
                ))}
            </Box>
        </>
    )
};

export default Menu;