import { TextField, Typography, Grid, Box, Button, ButtonGroup, Tooltip} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";


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
function RenglonFormSigno({ id, ensayo, tipo, unidadCalculo, setCalculo, calculo, signo,
    setSigno, unidadMedida, variable1, setVariable1, referencia,
    validar_std, esObligatorio, minRef, maxRef, setErrors, readOnly}) {

    const handleButtonClick = (value) => {
        setSigno(value === '+' ? 1 : -1);
    };

    useEffect(() => {
        if (variable1 !== null && signo !== null) {
            let cal = parseFloat(variable1) / 0.6 * signo;
            setCalculo(cal.toFixed(2));
        } else {
            setCalculo(null); // Reinicia el cálculo si no hay variable1 o signo
        }
        let hasError = false;

        // Verificar si la variable1 está dentro del rango permitido
        if (validar_std && variable1 !== null) {
            hasError = parseInt(variable1) < parseInt(minRef) || parseInt(variable1) > parseInt(maxRef);
        }

        // Verificar si el campo es obligatorio y si está vacío
        if (esObligatorio && variable1 !== null) {
            hasError = hasError || variable1?.trim() === "";
        }

        // Verificar si se ha seleccionado un signo (es obligatorio)
        if (signo === null && variable1 !== null) {
            hasError = true;
        }

        // Actualizar el estado de errores
        if (typeof setErrors === 'function') {
            setErrors(prevErrors => ({
                ...prevErrors,
                [id]: hasError
            }));
        }

    }, [variable1, signo]);

    return (
        <>
            <Box component="section" sx={{ p: 1 }}>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography sx={{ fontFamily: 'Poppins' }}>
                            <span style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold' }}>{ensayo}</span>{' '}
                            <span style={{ fontSize: 14 }}>{tipo}</span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonGroup variant="outlined" aria-label="Basic button group">
                            <Button
                                onClick={() => handleButtonClick('+')}
                                variant={signo === 1 ? 'contained' : 'outlined'}
                            >
                                +
                            </Button>
                            <Button
                                onClick={() => handleButtonClick('-')}
                                variant={signo === -1 ? 'contained' : 'outlined'}
                            >
                                -
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            id={id}
                            value={variable1}
                            size="small"
                            onChange={(event) => {
                                setVariable1(event.target.value);
                            }}
                            error={signo === null && variable1 !== null}
                            InputProps={{
                                readOnly: readOnly
                            }}
                        />
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" px={1}>
                        <Grid item xs={6}>
                            <LightTooltip title={minRef !== undefined && maxRef !== undefined ? (`Mín: ${minRef} ${unidadMedida} / Máx: ${maxRef} ${unidadMedida}`) : ""}>
                                <Typography sx={{ fontSize: 16 }}>Ref: {referencia !== undefined ? `${referencia} ${unidadMedida}` : ''} </Typography>
                            </LightTooltip>                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 16 }}>Cál: <span style={{ fontWeight: "bold" }}> {(calculo !== null) ? (`${calculo} [${unidadCalculo}]`) : ""}</span> </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default RenglonFormSigno;
