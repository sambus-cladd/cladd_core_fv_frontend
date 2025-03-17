import { TextField, Typography, Grid, Box } from "@mui/material"; 
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';

function RenglonFormPasadas({
    id, ensayo, minRef, maxRef, referencia, variable1, setVariable1, 
    variable2, setVariable2, recuentoTrama1, recuentoTrama2, 
    estabilidadUrdidoCalculo, recuentoTramaCalculo, tipoCalculo, 
    unidadCalculo, calculo, setCalculo, tipo, unidadReferencia 
}) {

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
            }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.white,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[1],
            fontSize: 14,
            border: '1px solid black',
        },
    }));

    useEffect(() => {
        const isValidNumber = (value) => !isNaN(value) && value !== null && value !== '';

        if (isValidNumber(recuentoTrama1) && isValidNumber(recuentoTrama2) && isValidNumber(estabilidadUrdidoCalculo)) {
            let pasadas1 = (parseFloat(recuentoTrama1) * ((-1 * parseFloat(estabilidadUrdidoCalculo) / 100) + 1)) / 0.254;
            let pasadas2 = (parseFloat(recuentoTrama2) * ((-1 * parseFloat(estabilidadUrdidoCalculo) / 100) + 1)) / 0.254;
            let pasadasCalculo = (parseFloat(recuentoTramaCalculo) * ((-1 * parseFloat(estabilidadUrdidoCalculo) / 100) + 1)) / 0.254;

            setVariable1(pasadas1.toFixed(2));
            setVariable2(pasadas2.toFixed(2));
            setCalculo(pasadasCalculo.toFixed(2));
        } else {
            // Set to empty string or null if invalid
            setVariable1('');
            setVariable2('');
            setCalculo('');
        }
    }, [recuentoTrama1, recuentoTrama2, estabilidadUrdidoCalculo, recuentoTramaCalculo]);

    return (
        <Box component="section" sx={{ px: 0.5, py: 0 }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography sx={{ fontFamily: 'Poppins' }}>
                        <span style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold' }}>{ensayo}</span>{' '}
                        <span style={{ fontSize: 14 }}>{tipo}</span>
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <TextField 
                        variant="outlined" 
                        id={id} 
                        size="small" 
                        value={variable1}
                        onChange={(e) => setVariable1(e.target.value)}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        variant="outlined" 
                        id={`${id}-2`} 
                        size="small" 
                        value={variable2}
                        onChange={(e) => setVariable2(e.target.value)}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" px={1}>
                    <Grid item xs={6}>
                        <LightTooltip title={(minRef !== undefined && maxRef !== undefined)? `Mín: ${minRef} ${unidadReferencia} / Máx: ${maxRef} ${unidadReferencia}` : ""}>
                            <Typography sx={{ fontSize: 16 }}>Ref: {referencia !== null ? referencia : ''}</Typography>
                        </LightTooltip>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 16 }}>
                            Cál: <span style={{ fontWeight: "bold" }}> {calculo !== null && calculo !== '' ? `${calculo} ${unidadCalculo}` : ""}</span>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RenglonFormPasadas;
