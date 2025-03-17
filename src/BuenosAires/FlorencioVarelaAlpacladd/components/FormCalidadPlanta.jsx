import React, { useState } from 'react'
import CardAlpa from '../../../components/Plantilla/CardAlpa'
import Grid from '@mui/material/Grid'
import { Typography, TextField, Button } from '@mui/material'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
const FormCalidadPlanta = () => {
    const [fecha, setFecha] = useState(dayjs());
    async function handleGuardar() {

    }
    return (
        <>
            <Grid container direction="row" columnSpacing={1} sx={{ px: 1 }} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={10}>
                    <CardAlpa>
                        <Grid container direction="row" justifyContent={"center"} rowSpacing={2} sx={{ py: 1, px: 1 }}>
                            <Grid item xs={12}>
                                <Typography sx={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 'bold' }}>
                                    Motivos de 2° calidad en Tintoreria [%]
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="row" columns={10} columnSpacing={1}>
                                    <Grid item xs={2}>
                                        <TextField label="Arruga" variant="outlined" type="number" size='small'  />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField label="Color fuera de cartilla" variant="outlined" type="number" size='small' />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField label="Manchas oscuras/claras" variant="outlined" type="number" size='small' />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField label="Degradé de Orillo" variant="outlined" type="number" size='small' />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField label="Parada de máquina" variant="outlined" type="number" size='small' />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid >
                    </CardAlpa >
                </Grid>
                <Grid item xs={8}>
                    <CardAlpa>
                        <Grid container direction="row" justifyContent={"center"} rowSpacing={2} sx={{ py: 1, px: 1 }}>
                            <Grid item xs={12}>
                                <Typography sx={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 'bold' }}>
                                    Porcentaje de tela de 2° calidad
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="row" columnSpacing={1}>
                                    <Grid item xs={3}>
                                        <TextField label="Total" variant="outlined" type="number" size='small' />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField label="Tintoreria FV" variant="outlined" type="number" size='small' />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                                            <DatePicker
                                                value={fecha}
                                                onChange={(newValue) => setFecha(newValue)}
                                                slots={{
                                                    textField: (params) => (
                                                        <TextField {...params} size="small" />  // Personalización del TextField
                                                    ),
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button variant='contained' onClick={handleGuardar}> registrar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardAlpa>
                </Grid>
            </Grid>
        </>
    )
}

export default FormCalidadPlanta