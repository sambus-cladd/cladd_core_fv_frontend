import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const CardDashboardSubProd = ({ Titulo, TotalKg, Datos }) => {

    const [TotalPorc, setTotalPorc] = useState("");

    useEffect(() => {
        if (Datos && Datos.length > 0) {
            let sumaPorc = 0;

            Datos.forEach((datos) => {
                // Convertir el porcentaje a número
                if (datos.porcentajeTipoSubprod) {
                    const porcentaje = parseFloat(datos.porcentajeTipoSubprod) || 0;
                    sumaPorc += porcentaje;
                } else {
                    setTotalPorc(0.00)
                }
            });

            // console.log("Suma total de porcentajes: ", sumaPorc);
            setTotalPorc(isNaN(sumaPorc) ? 0.00 : sumaPorc);
        }
    }, [Datos]);

    return (
        <>
            <Box display="flex" justifyContent="center">
                <Card
                    style={{
                        width: "100%",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1), 1px 3px 10px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <CardContent>
                        <Typography fontSize={30} fontWeight={500} align="center" fontFamily={"Poppins"}>
                            {Titulo}
                        </Typography>
                        {Datos.map((datos, index) => (
                            <Card
                                key={index}
                                variant="outlined"
                                style={{
                                    margin: "10px 0",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1), 0px 3px 10px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    {/* Tipo de subproducto alineado a la izquierda */}
                                    <Box flex={1} alignItems={'flex-start'}>
                                        <Typography variant="body1" fontFamily={"Poppins"} fontSize={13} fontWeight={500}>
                                            {datos.tipo_subproducto}
                                        </Typography>
                                    </Box>

                                    {/* Datos alineados en la misma línea */}
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            variant="h5"
                                            align="right"
                                            color={"#629584"}
                                            fontSize={20}
                                            fontFamily={"Poppins"}
                                            fontWeight={500}
                                            marginRight={0.5}
                                        >
                                            {parseFloat(datos.totalKgTipoSubprod).toFixed(2)} kg
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            align="right"
                                            color="textSecondary"
                                            fontSize={14}
                                            fontFamily={"Poppins"}
                                        >
                                            ({parseFloat(datos.porcentajeTipoSubprod).toFixed(2)}%)
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                        {/* Total alineado a la derecha */}
                        <Box display="flex" justifyContent="flex-end" alignItems="center" marginRight={"17px"}>
                            <Typography fontSize={27} fontWeight={500} align="right" fontFamily={"Poppins"} marginRight={"3px"}>
                                Total: <span style={{ color: "#629584" }}>{isNaN(TotalKg) ? 0.00 : parseFloat(TotalKg).toFixed(0)} kg</span>
                            </Typography>
                            <Typography
                                variant="h5"
                                align="right"
                                color="textSecondary"
                                fontSize={15}
                                fontFamily={"Poppins"}
                            >
                                <span>({isNaN(TotalPorc) ? 0.00 : parseFloat(TotalPorc).toFixed(2)}%)</span>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
export default CardDashboardSubProd;