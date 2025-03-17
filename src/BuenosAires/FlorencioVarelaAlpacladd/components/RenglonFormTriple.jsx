import { TextField, Typography, Grid, Box, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }}
        slotProps={{
            popper: {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, -14],
                        },
                    },
                ],
            },
        }}
    />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
        border: "1px solid black"
    },
}));

function RenglonFormTriple({
    id, ensayo, referencia, tipo, unidadCalculo, unidadMedida,
    calculo, variable1, variable2, variable3,
    setVariable1, setVariable2, setVariable3, setCalculo,
    setErrors, validar_std, minRef, maxRef, esObligatorio, readOnly
}) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Solo proceder con el cálculo si las tres variables tienen un valor válido
        if (variable1 && variable2 && variable3) {
            const var1 = parseFloat(variable1) || 0;
            const var2 = parseFloat(variable2) || 0;
            const var3 = parseFloat(variable3) || 0;

            // Calcular el promedio de las tres variables
            const promedio = (var1 + var2 + var3) / 3;

            // Calcular el resultado final
            const calc = ((promedio / 25) - 1) * 100;
            setCalculo(calc.toFixed(2));

            // Verificar si el cálculo está fuera del rango permitido
            const fueraDeRango = calc < parseFloat(minRef) || calc > parseFloat(maxRef);

            // Actualizar el estado de error en función del cálculo
            setHasError(fueraDeRango);

            // Validar y establecer errores generales si es necesario
            let errorGeneral = fueraDeRango;

            if (esObligatorio) {
                errorGeneral = errorGeneral || variable1.trim() === "" || variable2.trim() === "" || variable3.trim() === "";
            }

            if (typeof setErrors === 'function') {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [id]: errorGeneral,
                }));
            }
        } else {
            // Si alguna variable es null o vacía, reiniciar el cálculo y los errores
            setCalculo(null);
            setHasError(false);
        }

    }, [variable1, variable2, variable3, minRef, maxRef, setCalculo, setErrors, id, esObligatorio]);

    return (
        <Box component="section" sx={{ p: 1 }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography sx={{ fontFamily: 'Poppins' }}>
                        <span style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold' }}>{ensayo}</span>{' '}
                        <span style={{ fontSize: 14 }}>{tipo}</span>
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        size="small"
                        value={variable1}
                        onChange={(e) => setVariable1(e.target.value)}
                        error={hasError}
                        id={id}
                        InputProps={{
                            readOnly: readOnly,
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        size="small"
                        value={variable2}
                        onChange={(e) => setVariable2(e.target.value)}
                        error={hasError}
                        id={`${id}-2`}
                        InputProps={{
                            readOnly: readOnly,
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        size="small"
                        value={variable3}
                        onChange={(e) => setVariable3(e.target.value)}
                        error={hasError}
                        id={`${id}-3`}
                        InputProps={{
                            readOnly: readOnly,
                        }}
                    />
                </Grid>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" px={1}>
                    <Grid item xs={6}>
                        {minRef !== undefined && maxRef !== undefined && (
                            <LightTooltip title={`Mín: ${minRef} ${unidadMedida} / Máx: ${maxRef} ${unidadMedida}`}>
                                <Typography sx={{ fontSize: 16 }}>Ref: {referencia !== undefined ? `${referencia} ${unidadMedida}` : ''}</Typography>
                            </LightTooltip>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 16 }}>
                            Cál: <span style={{ fontWeight: "bold" }}>{calculo !== null && !isNaN(calculo) ? `${calculo} [${unidadCalculo}]` : ''}</span>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RenglonFormTriple;
