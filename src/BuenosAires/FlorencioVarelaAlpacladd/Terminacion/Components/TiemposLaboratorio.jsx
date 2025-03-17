import React, { useState } from 'react'
import { TextField, Button, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import DataGridTable from '../../../../components/DataGrid/DataGridTable';
import dayjs from 'dayjs'
import CardAlpa from '../../../../components/Plantilla/CardAlpa';
import MensajeDialog from '../../../../components/Plantilla/MensajeDialog';
import {getReporteTiempoXRutina, getReporteTiempoXFechas} from '../../API/APIFunctions';

const TiemposLaboratorio = () => {
    const [rows, setRows] = useState([]);
    const [rutina, setRutina] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(dayjs());
    const [fechaFin, setFechaFin] = useState(dayjs());
    const [mensaje, setMensaje] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [tipo, setTipo] = useState(null);
    const columns = [
        { field: 'rutina', headerName: 'rutina', flex: 1 },
        { field: 'estado', headerName: 'Etapa', flex: 1 },
        { field: 'inicio_etapa', headerName: 'Inicio', flex: 1 },
        { field: 'fin_etapa', headerName: 'Fin', flex: 1 },
        { field: 'duracion_horas_minutos', headerName: 'Duracion', flex: 1 }
    ];
    async function handleBuscarXRutina() {
        if (!rutina || rutina === '') {
            setMensaje('Debe ingresar una rutina');
            setTipo('error');
            setIsOpen(true);
            return;
        }

        try {
            const respuesta = await getReporteTiempoXRutina(rutina);
            setRows(respuesta.data[0] || []);
        } catch (error) {
            console.error('Error al buscar por rutina:', error);
        }
    }
    async function handleBuscarXFechas() {
        try {
            let body = {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            }
            let respuesta = await getReporteTiempoXFechas( body);
            console.log(respuesta.data);
            setRows(respuesta.data[0] || []);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <CardAlpa>
                <Grid container direction={"row"} justifyContent={"center"} alignItems={"space-around"} padding={1}>
                    <Grid item xs={4}>
                        <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} >
                            <Grid item xs={6}>
                                <TextField label='Rutina' value={rutina} onChange={(e) => setRutina(e.target.value)} type='number' />
                            </Grid>
                            <Grid item xs={6} paddingTop={1}>
                                <Button variant='contained' color='primary' onClick={handleBuscarXRutina} >Buscar por rutina</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container direction={"row"} justifyContent={"right"} alignItems={"space-around"}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <Grid item xs={2}>
                                    <DatePicker label="Inicio"
                                        value={fechaInicio}
                                        onChange={(newValue) => setFechaInicio(newValue)}
                                        disableFuture
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <DatePicker label="Fin"
                                        value={fechaFin}
                                        onChange={(newValue) => setFechaFin(newValue)}
                                        disableFuture
                                    />
                                </Grid>
                            </LocalizationProvider>
                            <Grid item xs={4} paddingTop={1}>
                                <Button variant='contained' color='primary' onClick={handleBuscarXFechas}>Buscar por rango de fechas</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </CardAlpa>
            <hr />
            <DataGridTable columns={columns} rows={rows} pageSize={5} />
            <MensajeDialog
            mensaje={mensaje}
            duracion={1000}
            tipo={tipo}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}

            />
        </>
    )
}

export default TiemposLaboratorio