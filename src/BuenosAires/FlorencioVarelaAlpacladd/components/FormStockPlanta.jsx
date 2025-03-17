import React, { useState } from 'react'
import CardAlpa from '../../../components/Plantilla/CardAlpa'
import Grid from '@mui/material/Grid'
import { Typography, TextField, Button } from '@mui/material'
import dayjs from 'dayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MensajeDialog from '../../../components/Plantilla/MensajeDialog'
import { putInventarioPlanta } from '../API/APIFunctions'
const FormStockPlanta = () => {
    const [M108, setM108] = useState(null);
    const [M120, setM120] = useState(null);
    const [M124, setM124] = useState(null);
    const [M123, setM123] = useState(null);
    const [M130, setM130] = useState(null);
    const [M146, setM146] = useState(null);
    const [M149, setM149] = useState(null);
    const [M150, setM150] = useState(null);
    const [M10, setM10] = useState(null);
    const [M160, setM160] = useState(null);
    const [OkTrenFallas, setOkTrenFallas] = useState(null);
    const [OkFraccionar, setOkFraccionar] = useState(null);
    const [LabTrenFallas, setLabTrenFallas] = useState(null);
    const [LabFraccionar, setLabFraccionar] = useState(null);
    const [IngresoFV, setIngresoFV] = useState(null);
    const [fecha, setFecha] = useState(dayjs());
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState(null);
    const [duracion, setDuracion] = useState(3000);
    const [isOpen, setIsOpen] = useState(false);
    async function handleGuardar() {
        try {
            let body = {
                M108: M108,
                M120: M120,
                M124: M124,
                M123: M123,
                M130: M130,
                M146: M146,
                M149: M149,
                M150: M150,
                M10: M10,
                M160: M160,
                OkTrenFallas: OkTrenFallas,
                OkFraccionar: OkFraccionar,
                LabTrenFallas: LabTrenFallas,
                LabFraccionar: LabFraccionar,
                IngresoFV: IngresoFV,
                Fecha: fecha
            };

            let respuesta = await putInventarioPlanta(body);    
            if (respuesta.data.affectedRows && respuesta.data.affectedRows > 0) {
                setMensaje('¡Registro Guardado Exitosamente!');
                setTipo('success');
                setIsOpen(true);
            }
            else if (respuesta.data.serverStatus === 34) {
                setMensaje('Conexión con el servidor exitosa.');
                setTipo('success');
                setIsOpen(true);
            }
            else if (respuesta.data.info) {
                setMensaje(respuesta.data.info);
                setTipo('success');
                setIsOpen(true);
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setMensaje('¡Error al guardar los datos!');
                    setTipo('error');
                    setIsOpen(true);
                }
            } else if (error.request) {
                setMensaje('Sin respuesta del servidor');
                setTipo('error');
                setIsOpen(true);
            } else {
                setMensaje('Error', error.message);
                setTipo('error');
                setIsOpen(true);
            }
        }
    }


    return (
        <>
            <CardAlpa>
                {/* PRODUCCION */}
                <Grid container direction="row" justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={2}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 'bold' }}>
                            PRODUCCION
                        </Typography>
                    </Grid>
                    <Grid item xs={10} >
                        <Grid container direction="row" columns={10} rowSpacing={1} sx={{ py: 1 }}>
                            <Grid item xs={2}>
                                <TextField label="108" variant="outlined" value={M108} onChange={(e) => setM108(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="120" variant="outlined" value={M120} onChange={(e) => setM120(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="124" variant="outlined" value={M124} onChange={(e) => setM124(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="123" variant="outlined" value={M123} onChange={(e) => setM123(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="130" variant="outlined" value={M130} onChange={(e) => setM130(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="146" variant="outlined" value={M146} onChange={(e) => setM146(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="149" variant="outlined" value={M149} onChange={(e) => setM149(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="150" variant="outlined" value={M150} onChange={(e) => setM150(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="10" variant="outlined" value={M10} onChange={(e) => setM10(e.target.value)} type="number" size="small" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="160" variant="outlined" value={M160} onChange={(e) => setM160(e.target.value)} type="number" size="small" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardAlpa>
            {/* CALIDAD */}
            <CardAlpa>
                <Grid container direction="row" justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={2}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 'bold' }}>
                            CALIDAD
                        </Typography>
                    </Grid>
                    <Grid item xs={10} >
                        <Grid container direction="row" rowSpacing={1} sx={{ py: 1 }}>
                            <Grid item xs={6}>
                                <Typography sx={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 'bold' }}>
                                    OK
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 'bold' }}>
                                    Laboratorio
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant='outlined' label="Tren de fallas" value={OkTrenFallas} onChange={(e) => setOkTrenFallas(e.target.value)} type="number" size='small' />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant='outlined' label="Fraccionar" value={OkFraccionar} onChange={(e) => setOkFraccionar(e.target.value)} type="number" size='small' />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant='outlined' label="Tren de fallas" value={LabTrenFallas} onChange={(e) => setLabTrenFallas(e.target.value)} type="number" size='small' />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant='outlined' label="Fraccionar" value={LabFraccionar} onChange={(e) => setLabFraccionar(e.target.value)} type="number" size='small' />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardAlpa>
            {/* INGRESO FV */}
            <CardAlpa>
                <Grid container direction="row" justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={2}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 'bold' }}>
                            INGRESO FV
                        </Typography>
                    </Grid>
                    <Grid item xs={10} >
                        <Grid container direction="row" rowSpacing={1} sx={{ py: 1 }} justifyContent={"center"} alignItems={"center"}>
                            <Grid item xs={4}>
                                <TextField variant='outlined' label="ingreso FV" value={IngresoFV} onChange={(e) => setIngresoFV(e.target.value)} type="number" size='small' />
                            </Grid>
                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                                    <DatePicker
                                        value={fecha}
                                        onChange={(newValue) => setFecha(newValue)}
                                        slots={{
                                            textField: (params) => (
                                                <TextField {...params} size="small" sx={{ width: 200 }} />  // Personalización del TextField
                                            ),
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant='contained' onClick={handleGuardar}> registrar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardAlpa>
            <MensajeDialog
                mensaje={mensaje}
                tipo={tipo}
                duracion={duracion}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}

export default FormStockPlanta