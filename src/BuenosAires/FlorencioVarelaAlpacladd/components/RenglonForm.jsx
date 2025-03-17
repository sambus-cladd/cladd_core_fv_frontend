import { TextField, Typography, Grid, Box, Tooltip, } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import { useEffect, useMemo } from "react";

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

function RenglonForm({ id, ensayo, referencia, variable1, setVariable1, variable2,
    setVariable2, tipoCalculo, unidadCalculo, calculo, unidadMedida, setCalculo,
    setErrors, validar_std, tipo, factorPeso, minRef, maxRef, esObligatorio, readOnly = false }) {

    const promedio = useMemo(() => {
        if (!isNaN(variable1) && !isNaN(variable2)) {
            return ((parseFloat(variable1) + parseFloat(variable2)) / 2).toFixed(2);
        }
        return null;
    }, [variable1, variable2]);

    const promedioConFactorPeso = useMemo(() => {
        if (!isNaN(variable1) && !isNaN(variable2)) {
            let resultado = ((parseFloat(variable1) + parseFloat(variable2)) / 2) * parseFloat(factorPeso);
            return resultado.toFixed(2);
        }
        return null;
    }, [variable1, variable2, factorPeso]);

    const estabilidad = useMemo(() => {
        if (!isNaN(variable1) && !isNaN(variable2)) {
            let promedio = ((parseFloat(variable1) + parseFloat(variable2)) / 2);
            let calculo = ((parseFloat(promedio) / 25) - 1) * 100;
            return (calculo.toFixed(2));
        }
        return null;
    }, [variable1, variable2]);

    useEffect(() => {
        switch (tipoCalculo) {
            case 'Promedio':
                setCalculo(promedio);
                break;
            case 'PromedioConFactorPeso':
                setCalculo(promedioConFactorPeso);
                break;
            case 'Estabilidad':
                setCalculo(estabilidad);
                break;
            default:
                break;
        }
        let hasError = false;

        if (validar_std) {
            hasError = parseInt(variable1) < parseInt(minRef) || parseInt(variable1) > parseInt(maxRef) ||
                parseInt(variable2) < parseInt(minRef) || parseInt(variable2) > parseInt(maxRef);
        }

        // Verificar si el campo es obligatorio y si está vacío
        if (esObligatorio) {
            hasError = hasError || variable1 === '' || variable2 === '';
        }

        if (typeof setErrors === 'function') {
            setErrors(prevErrors => ({
                ...prevErrors,
                [id]: hasError
            }));
        }
    }, [variable1, variable2]);


    return (
        <>
            <Box component="section" sx={{ px: 0.5, py: 0 }}>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography sx={{ fontFamily: 'Poppins' }}>
                            <span style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold' }}>{ensayo}</span>{' '}
                            <span style={{ fontSize: 14 }}>{tipo}</span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant="outlined" id={id} size="small" value={variable1} type="number"
                            onChange={(e) => { setVariable1(e.target.value) }}
                            error={parseInt(variable1) < parseInt(minRef) || parseInt(variable1) > parseInt(maxRef)}
                            inputProps={{
                                readOnly: readOnly,
                              }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant="outlined" id={`${id}-2`} size="small" value={variable2} type="number"
                            onChange={(e) => setVariable2(e.target.value)}
                            error={parseInt(variable2) < parseInt(minRef) || parseInt(variable2) > parseInt(maxRef)}
                            inputProps={{
                                readOnly: readOnly, 
                              }}
                        />
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" px={1}>
                        <Grid item xs={6}>
                            <LightTooltip title={minRef !== undefined && maxRef !== undefined ? (`Mín: ${minRef} ${unidadMedida} / Máx: ${maxRef} ${unidadMedida}`) : ""}>
                                <Typography sx={{ fontSize: 16 }}>Ref: {referencia !== undefined ? `${referencia} ${unidadMedida}` : ''} </Typography>
                            </LightTooltip>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 16 }}>Cál: <span style={{ fontWeight: "bold" }}>{!isNaN(calculo) && calculo !== null ? (`${calculo} ${unidadCalculo}`) : ""} </span></Typography>
                        </Grid>
                    </Grid>
                </Grid >
            </Box>
        </>
    )
};

export default RenglonForm;