import React, { useState, useEffect } from "react";
import {
    Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemText, Typography, Card, CardContent,
    Checkbox, FormControlLabel, CircularProgress, Grid
} from "@mui/material";
import { getOrdenesGanttPorNumero } from "../../../API/APIFunctions";
import { getStockRollosXOrden2 } from "../../../API/APIFunctions";
import { PutRegistroGantReprocesoFV } from "../API/APIFunctions";
import { putEnviarRollosAProduccion } from "../../../API/APIFunctions";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { GetTABLAMAQUINAS } from "../API/APIFunctions";
import { validarLegajo } from "../API/APIFunctions";

const FormularioReprocesos = () => {
    const [numeroOrden, setNumeroOrden] = useState("");
    const [ordenes, setOrdenes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [articuloForm, setArticuloForm] = useState("");
    const [rollos, setRollos] = useState([]);
    const [rollosSeleccionados, setRollosSeleccionados] = useState([]);
    const [loadingRollos, setLoadingRollos] = useState(false);
    const [inicio, setInicio] = useState(null);
    const [fin, setFin] = useState(null);
    const [maquina, setMaquina] = useState("");
    const [procesoMaquina, setProcesoMaquina] = useState("");
    const [proceso, setProceso] = useState("");
    const [horasTotal, setHorasTotal] = useState("");
    const [metros, setMetros] = useState("");
    const [maquinasProc, setMaquinasProc] = useState([]);
    const [mostrarDialogOperario, setMostrarDialogOperario] = useState(false);
    const [legajo, setLegajo] = useState("");
    const [operarioReproceso, setOperarioReproceso] = useState(null);



    const [mensaje, setMensaje] = useState("");
    const [popup, setPopup] = useState(false);
    const [error, setError] = useState(false);
    const [erroresForm, setErroresForm] = useState({});

    const buscarOrden = async () => {
        if (!numeroOrden) return;

        const rta = await getOrdenesGanttPorNumero(numeroOrden);

        if (rta?.success && rta.data.length > 0) {
            setOrdenes(rta.data);
            setOpenDialog(true);
        } else {
            alert("No se encontraron órdenes con ese número.");
        }
    };

    const handleSeleccionarOrden = async (orden) => {
        setOperarioReproceso(null);

        const ordenConR = {
            ...orden,
            orden: `${orden.orden}R`,
        };

        // Autocompletado de formulario
        setMaquina(orden.maquina || "");
        setProcesoMaquina(orden.maquina_proceso || "");
        setProceso(orden.proceso || "");
        setMetros(orden.metros_real || orden.metros || "");
        setHorasTotal(orden.horas_total_real || orden.horas_total || "");

        setOrdenSeleccionada(ordenConR);
        setArticuloForm(ordenConR.articulo);
        setOpenDialog(false);

        // Cargar rollos
        setLoadingRollos(true);
        setRollos([]);
        setRollosSeleccionados([]);

        try {
            const rta = await getStockRollosXOrden2(orden.orden);
            console.log("Rollos obtenidos para la orden", orden.orden, rta);
            const unicos = rta.filter(
                (item, index, self) =>
                    index === self.findIndex((t) => t.rollo === item.rollo)
            );

            setRollos(unicos);
        } catch {
            setRollos([]);
        }
        setLoadingRollos(false);
    };

    const handleToggleRollo = (rolloId) => {
        const id = Number(rolloId);
        setRollosSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(r => r !== id)
                : [...prev, id]
        );
    };


    useEffect(() => {
        if (inicio && horasTotal) {
            const f = dayjs(inicio).add(Number(horasTotal), "hour");
            setFin(f);
        }
    }, [inicio, horasTotal]);

    const validar = () => {
        const temp = {};

        if (!inicio) temp.inicio = true;
        if (!maquina) temp.maquina = true;
        if (!proceso) temp.proceso = true;
        if (!metros) temp.metros = true;
        if (!horasTotal) temp.horasTotal = true;
        if (rollosSeleccionados.length === 0) temp.rollos = true;

        setErroresForm(temp);
        return Object.keys(temp).length === 0;
    };

    const registrarReproceso = async () => {

        if (!validar()) {
            setMensaje("Faltan datos obligatorios");
            setError(true);
            setTimeout(() => setError(false), 1500);
            return;
        }

        const body = {
            Orden: ordenSeleccionada.orden,
            Maquina: maquina,
            MaquinaProc: procesoMaquina,
            Proceso: proceso,
            Articulo: ordenSeleccionada.articulo,
            Color: ordenSeleccionada.color || "",
            Metros: metros,
            HorasT: horasTotal,
            InicioHora: inicio.format("YYYY-MM-DD HH:mm"),
            FinHora: fin.format("YYYY-MM-DD HH:mm"),
            Rollos: rollosSeleccionados,
            ResponsableLegajo: operarioReproceso?.legajo || "",
            ResponsableNombre: operarioReproceso?.nombre || "",
        };

        try {
            await PutRegistroGantReprocesoFV(body);

            for (const idRollo of rollosSeleccionados) {
                const infoRollo = rollos.find(r => Number(r.rollo) === Number(idRollo));

                await putEnviarRollosAProduccion({
                    orden: ordenSeleccionada.orden,
                    maquina,
                    proceso,
                    procesoMaquina,
                    color: ordenSeleccionada.color,
                    inicio: body.InicioHora,
                    fin: body.FinHora,
                    rollo: idRollo,
                    metros: infoRollo?.rollo_metros ?? 0
                });
            }


            setMensaje("Reproceso registrado correctamente");
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                limpiarFormulario();
                setOperarioReproceso(null);
            }, 1500);

        } catch {
            setMensaje("Error al registrar reproceso");
            setError(true);
            setTimeout(() => setError(false), 1500);
        }
    };

    useEffect(() => {
        if (rollosSeleccionados.length === 0) {
            setMetros(0);
            return;
        }

        const metrosTotal = rollos
            .filter(r => rollosSeleccionados.includes(r.rollo))
            .reduce((acc, curr) => acc + Number(curr.rollo_metros), 0);

        setMetros(metrosTotal);
    }, [rollosSeleccionados, rollos]);


    const limpiarFormulario = () => {
        setNumeroOrden("");
        setOrdenes([]);
        setOpenDialog(false);
        setOrdenSeleccionada(null);
        setArticuloForm("");
        setRollos([]);
        setRollosSeleccionados([]);
        setLoadingRollos(false);
        setInicio(null);
        setFin(null);
        setMaquina("");
        setProcesoMaquina("");
        setProceso("");
        setHorasTotal("");
        setMetros("");
        setMensaje("");
        setError(false);
        setPopup(false);
        setErroresForm({});
        setOperarioReproceso(null);

    };

    useEffect(() => {
        const cargarVelocidades = async () => {
            try {
                const response = await GetTABLAMAQUINAS();
                if (response && response.Dato && Array.isArray(response.Dato[0])) {
                    setMaquinasProc(response.Dato[0]);
                } else {
                    console.error("Formato inesperado en TABLAMAQUINAS:", response);
                }
            } catch (error) {
                console.error("Error cargando velocidades:", error);
            }
        };

        cargarVelocidades();
    }, []);
    const obtenerVelocidadMaquina = (procesoMaquinaNombre) => {
        const dato = maquinasProc.find(m => m.proceso === procesoMaquinaNombre);
        return dato ? Number(dato.velocidad) : 1;
    };
    useEffect(() => {
        if (rollosSeleccionados.length === 0) {
            setMetros(0);
            setHorasTotal(0);
            return;
        }

        const metrosTotal = rollos
            .filter(r => rollosSeleccionados.includes(r.rollo))
            .reduce((acc, curr) => acc + Number(curr.rollo_metros), 0);

        setMetros(metrosTotal);

        const velocidad = obtenerVelocidadMaquina(procesoMaquina);

        if (!velocidad || velocidad <= 0) {
            console.warn("Velocidad no encontrada para:", procesoMaquina);
            return;
        }
        const horas = metrosTotal / (velocidad * 60);
        setHorasTotal(Math.ceil(horas));

    }, [rollosSeleccionados, rollos, procesoMaquina, maquinasProc]);
    useEffect(() => {
        if (inicio && horasTotal) {
            const f = dayjs(inicio).add(Number(horasTotal), "hour");
            setFin(f);
        }
    }, [inicio, horasTotal]);

    const confirmarOperario = async () => {
        if (!legajo) {
            alert("Debe ingresar el legajo del operario.");
            return;
        }

        try {
            const resultado = await validarLegajo(legajo);

            const operarioValido = Array.isArray(resultado)
                ? resultado[0]
                : resultado?.data
                    ? resultado.data
                    : resultado;

            if (!operarioValido || !operarioValido.legajo) {
                alert("El legajo ingresado no es válido.");
                return;
            }
            const sector = operarioValido.sector?.toString().trim().toLowerCase();
            if (sector !== "supervisor") {
                alert("Solo un SUPERVISOR puede autorizar este reproceso.");
                return;
            }

            setOperarioReproceso({
                legajo: operarioValido.legajo,
                nombre: operarioValido.nombre,
                fecha: dayjs().format("YYYY-MM-DD")
            });

            localStorage.setItem("reproceso_legajo", operarioValido.legajo);
            localStorage.setItem("reproceso_nombre", operarioValido.nombre);

            setMostrarDialogOperario(false);
            setLegajo("");

            registrarReproceso();

        } catch (e) {
            console.error("Error validando operario:", e);
            alert("Ocurrió un error al validar el operario.");
        }
    };



    return (
        <Box sx={{ px: { xs: 1, md: 1.5 }, pb: 2 }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#1A4862', fontSize: '1rem', mb: 0.5 }}>
                Reprocesos
            </Typography>
            <Typography sx={{ fontFamily: 'Poppins', color: '#4a6177', fontSize: '0.85rem', mb: 2 }}>
                Buscá una orden para generar el reproceso
            </Typography>

            <Box
                display="flex"
                justifyContent="center"
                gap={1.5}
                mb={2}
                flexWrap="wrap"
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid rgba(26,72,98,0.06)',
                    boxShadow: '0 2px 8px rgba(26,72,98,0.08)',
                    p: 2,
                }}
            >
                <TextField
                    label="Número de orden"
                    size="small"
                    value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscarOrden()}
                    sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Poppins' } }}
                />
                <Button
                    variant="contained"
                    onClick={buscarOrden}
                    sx={{
                        background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '10px',
                        boxShadow: 'none',
                        '&:hover': { background: '#1A4862' },
                    }}
                >
                    Buscar
                </Button>
                <Button
                    variant="outlined"
                    onClick={limpiarFormulario}
                    sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '10px',
                        borderColor: 'rgba(26,72,98,0.35)',
                        color: '#1A4862',
                    }}
                >
                    Limpiar
                </Button>
            </Box>

            {/* Popup ordenes*/}
            <Dialog open={openDialog} PaperProps={{ sx: { borderRadius: '12px' } }}>
                <DialogTitle sx={{ background: 'linear-gradient(145deg, #2c4356, #1e2c3a)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }}>
                    Órdenes encontradas
                </DialogTitle>
                <DialogContent dividers>
                    <List>
                        {ordenes.map((o, i) => (
                            <ListItem button key={i} onClick={() => handleSeleccionarOrden(o)}>
                                <ListItemText
                                    primary={`Orden: ${o.orden} - Articulo: ${o.articulo}`}
                                    secondary={`Maquina: ${o.maquina} | Proceso: ${o.proceso}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {ordenSeleccionada && (
                <Box
                    sx={{
                        mt: 1,
                        p: 2,
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "1px solid rgba(26,72,98,0.06)",
                        boxShadow: "0 2px 8px rgba(26,72,98,0.08)"
                    }}
                >

                    <Grid container spacing={2}>
                        {/* Formulario de reprocesos */}
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(26,72,98,0.06)' }}>

                                <Typography variant="h6" mb={1} sx={{ fontWeight: 700, color: '#1A4862', fontFamily: 'Poppins' }}>
                                    ORDEN A REPROCESAR
                                </Typography>

                                <Grid container spacing={2}>

                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="Inicio"
                                                value={inicio}
                                                onChange={setInicio}
                                                sx={{ width: "100%" }}
                                                slotProps={{
                                                    textField: { error: erroresForm.inicio }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="Fin"
                                                disabled
                                                value={fin}
                                                sx={{ width: "100%" }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Orden"
                                            value={ordenSeleccionada.orden}
                                            onChange={e => setOrdenSeleccionada(e.target.value)}
                                            InputProps={{ readOnly: true }}
                                            error={erroresForm.maquina}
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Maquina"
                                            value={maquina}
                                            onChange={e => setMaquina(e.target.value)}
                                            InputProps={{ readOnly: true }}
                                            error={erroresForm.maquina}
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Proc. Maquina"
                                            value={procesoMaquina}
                                            onChange={e => setProcesoMaquina(e.target.value)}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Proceso"
                                            value={proceso}
                                            onChange={e => setProceso(e.target.value)}
                                            InputProps={{ readOnly: true }}
                                            error={erroresForm.proceso}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            label="Articulo"
                                            value={articuloForm}
                                            onChange={e => setArticuloForm(e.target.value)}
                                            InputProps={{ readOnly: true }}
                                            error={erroresForm.metros}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>

                                        <TextField
                                            fullWidth
                                            label="Metros"
                                            type="number"
                                            value={metros}
                                            InputProps={{ readOnly: true }}
                                            error={erroresForm.metros}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Horas Total"
                                            value={horasTotal}
                                            InputProps={{ readOnly: true }}
                                            focused
                                        />
                                    </Grid>

                                </Grid>

                                <Box textAlign="right" mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (!operarioReproceso) {
                                                setMostrarDialogOperario(true);
                                                return;
                                            }
                                            registrarReproceso();
                                        }}
                                        sx={{
                                            background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
                                            fontFamily: 'Poppins',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            boxShadow: 'none',
                                            fontSize: '15px',
                                            '&:hover': { background: '#1A4862' },
                                        }}
                                    >
                                        Registrar Reproceso
                                    </Button>

                                </Box>

                            </Card>
                        </Grid>

                        {/* Card de rollos */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 1.5, borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(26,72,98,0.06)' }}>
                                <Typography variant="h6" mb={1} sx={{ color: '#1A4862', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>
                                    ROLLOS DE ORDEN - <b>{ordenSeleccionada.orden}</b>
                                </Typography>
                                <CardContent sx={{ maxHeight: 230, overflowY: "auto" }}>
                                    {loadingRollos ? (
                                        <CircularProgress />
                                    ) : rollos.length > 0 ? (
                                        rollos.map((r, i) => (
                                            <Box key={i}
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{ borderBottom: "1px solid #ddd", py: 1 }}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={rollosSeleccionados.includes(r.rollo)}
                                                            onChange={() => handleToggleRollo(r.rollo)}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography><b>Rollo:</b> {r.rollo}</Typography>
                                                            <Typography><b>Metros:</b> {r.rollo_metros}</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography>No hay rollos.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </Box>
            )}


            {/* POPUPS */}
            <Dialog open={popup} PaperProps={{ sx: { backgroundColor: "#49a13dff", borderRadius: 3, padding: 0.5 } }}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#ffff", backgroundColor: "#49a13dff", borderRadius: 3 }}>{mensaje}</DialogTitle>
            </Dialog>

            <Dialog open={error} PaperProps={{ sx: { backgroundColor: "#ff0000ff", borderRadius: 3, padding: 0.5 } }}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#ffff", backgroundColor: "#ff0000ff", borderRadius: 3 }}>{mensaje}</DialogTitle>
            </Dialog>

            <Dialog open={mostrarDialogOperario} PaperProps={{ sx: { borderRadius: '12px' } }}>
                <DialogTitle sx={{ background: 'linear-gradient(145deg, #2c4356, #1e2c3a)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }}>Registrar Responsable</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 1 }}>
                        Ingrese el legajo del <b>Supervisor</b> a cargo.
                    </Typography>

                    <TextField
                        label="Legajo"
                        fullWidth
                        value={legajo}
                        onChange={(e) => setLegajo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && confirmarOperario()}
                    />
                </DialogContent>

                <DialogActions>
                    <Button color="error" onClick={() => setMostrarDialogOperario(false)}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={confirmarOperario}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default FormularioReprocesos;
