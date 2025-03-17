import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { getDatosDashboardSubProd } from '../../API/APIFunctions';

import CardDashboardSubProd from './CardDashboardSubProd';

function DashboardSubProd() {

    const[mesActual, setMesActual] = useState("");
    const[TotalPorcDenim, setTotalPorcDenim] = useState("");
    const[TotalPorcCrudo, setTotalPorcCrudo] = useState("");
    const[TotalPorcPuntera, setTotalPorcPuntera] = useState("");
    const[Subproducto, setSubproducto] = useState({
        kgTotal: 0,
        kgCrudo: 0,
        kgDenim: 0,
        porcTotal: 0
    });

    const[DatosDenim, setDatosDenim] = useState([]);
    const[DatosCrudo, setDatosCrudo] = useState([]);
    const[DatosPuntera, setDatosPuntera] = useState([]);
    const[TotalKgDenim, setTotalKgDenim] = useState("");
    const[TotalKgCrudo, setTotalKgCrudo] = useState("");
    const[TotalKgPuntera, setTotalKgPuntera] = useState("");

    useEffect(() => {
        const ObtenerDatosDash = async () => {
            try {
                const response = await getDatosDashboardSubProd();
                const datosKgyPorc = response.DatosPorcYKgTotal[0]
                const datosDenim = response.DatosDenim
                const datosCrudo = response.DatosCrudo
                const datosPuntera = response.DatosPuntera
                
                setMesActual(datosKgyPorc.Mes_Actual);
                setTotalPorcDenim(datosKgyPorc.Porc_Denim);
                setTotalPorcCrudo(datosKgyPorc.Porc_Crudo);
                setTotalPorcPuntera(datosKgyPorc.Porc_Puntera);

                setDatosDenim(datosDenim);
                setDatosCrudo(datosCrudo);
                setDatosPuntera(datosPuntera)
                setTotalKgDenim(parseFloat(datosKgyPorc.Total_Denim_kg).toFixed(0));
                setTotalKgCrudo(parseFloat(datosKgyPorc.Total_Crudo_kg).toFixed(0));
                setTotalKgPuntera(parseFloat(datosKgyPorc.Total_Puntera_kg).toFixed(0));

                setSubproducto({
                    kgTotal: parseInt(datosKgyPorc.Total_Denim_kg) + parseInt(datosKgyPorc.Total_Crudo_kg),
                    kgCrudo: parseInt(datosKgyPorc.Total_Crudo_kg),
                    kgDenim: parseInt(datosKgyPorc.Total_Denim_kg),
                    porcTotal: (parseInt(datosKgyPorc.Total_Crudo_kg) / (parseInt(datosKgyPorc.Total_Crudo_kg) + parseInt(datosKgyPorc.Total_Denim_kg))) * 100
                })

                // console.log("Response: ", response);
                
                
            } catch(error){
                console.error("Error al Obtener los datos: ", error)
            }
        }
        ObtenerDatosDash();
    },[]);

    //ESTILO DE LA BARRA DE PROGRESO
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 70,
        borderRadius: 5,
        // Color de fondo (incompleto)
        [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#4A7B8D'
        },
        // Color de la barra (completado)
        [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#E2F1E7'
        },
    }));
    // BARRA DE PROGRESO
    const ProgressWithText = ({ value, totalCrudo, totalDenim }) => {

        return (
        <Box position="relative" display="inline-flex" width="100%" flexDirection="column">
            {/* Barra de progreso */}
            <BorderLinearProgress variant="determinate" value={value} sx={{ width: '100%' }} />
            {/* Contenedor para el texto y los números */}
            <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
            >
            {/* Texto y cantidad para Crudo */}
            <Box textAlign="center">
                <Typography fontFamily='Poppins' fontWeight={"bold"}>
                Crudo
                </Typography>
                <Typography fontFamily='Poppins' fontWeight={"bold"}>
                {totalCrudo} Kg
                </Typography>
            </Box>
    
            {/* Texto y cantidad para Denim */}
            <Box textAlign="center">
                <Typography fontFamily='Poppins' fontWeight={"bold"}>
                Denim
                </Typography>
                <Typography fontFamily='Poppins' fontWeight={"bold"}>
                {totalDenim} Kg
                </Typography>
            </Box>
            </Box>
        </Box>
        );
    };
    
    return(
        <>
            <Grid container justifyContent="center" alignItems="center">
                <Typography fontFamily={"Poppins"} fontSize={30} fontWeight={500} style={{ marginTop: '6px'}}>
                    {mesActual.toUpperCase()}
                </Typography>
            </Grid>
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={10} md={10}>
                    <ProgressWithText value={isNaN(Subproducto.porcTotal) ? 0: Subproducto.porcTotal} totalCrudo={isNaN(Subproducto.kgCrudo) ? 0 : Subproducto.kgCrudo} totalDenim={isNaN(Subproducto.kgDenim) ? 0 : Subproducto.kgDenim} />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ padding: '20px' }}>
                <Grid item xs={12} md={4}>
                    <CardDashboardSubProd Titulo={"Crudo"} TotalKg={TotalKgCrudo} Datos={DatosCrudo}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <CardDashboardSubProd Titulo={"Denim"} TotalKg={TotalKgDenim} Datos={DatosDenim}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <CardDashboardSubProd Titulo={"Puntera"} TotalKg={TotalKgPuntera} Datos={DatosPuntera}/>
                </Grid>
            </Grid>
        </>
    )
}
export default DashboardSubProd;