import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import Autocomplete from '@mui/material/Autocomplete';
import { putRegistrarRechazo, getVerificarRollo, getMotivosRechazos } from '../API/APIFunctions';
import { validarLegajo } from '../Productividad/PCP/API/APIFunctions';
import { colors, typography } from '../../../styles/alpacladdFvDesignTokens';

const primaryBtnSx = {
    background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
    fontFamily: 'Poppins',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '10px',
    boxShadow: 'none',
    '&:hover': { background: '#1A4862' },
};

const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Poppins' },
    '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
};

const RechazosRegistro = () => {
    const [lote, setLote] = useState('');
    const [articuloTerminado, setArticuloTerminado] = useState('');
    const [metros, setMetros] = useState('');
    const [descripcion, setDescripcion] = useState(null);
    const [descripcionInput, setDescripcionInput] = useState("");
    const [tipoRechazo, setTipoRechazo] = useState('');
    const [rechazoPlanta, setRechazoPlanta] = useState('');
    const [rechazoCalidad, setRechazoCalidad] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('warning');
    const [rolloExiste, setRolloExiste] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [motivos, setMotivos] = useState([]);
    const [mostrarDialogOperario, setMostrarDialogOperario] = useState(false);
    const [legajo, setLegajo] = useState("");
    const [responsable, setResponsable] = useState(null);


    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const showSnackbar = (message, severity = 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const validarYConfirmar = () => {
        if (!lote.trim()) return showSnackbar('Ingrese Lote', 'warning');
        if (!articuloTerminado.trim()) return showSnackbar('Ingrese Artículo', 'warning');
        if (!metros.trim()) return showSnackbar('Ingrese Metros', 'warning');
        if (!tipoRechazo.trim()) return showSnackbar('Seleccione el tipo de rechazo', 'warning');

        if (tipoRechazo === 'produccion' && !rechazoPlanta)
            return showSnackbar('Seleccione el rechazo de planta', 'warning');

        if (tipoRechazo === 'calidad' && !rechazoCalidad)
            return showSnackbar('Seleccione el rechazo de calidad', 'warning');

        setOpenConfirm(true);
    };

    const registrarRechazo = async () => {
        if (!responsable) {
            setMostrarDialogOperario(true);
            return;
        }
        setOpenConfirm(false);

        const rechazoCod = tipoRechazo === "produccion"
            ? rechazoPlanta
            : rechazoCalidad;

        setLoading(true);

        const datosAEnviar = {
            lote: parseInt(`9${lote}`),
            articulo_terminado: articuloTerminado,
            metros: parseInt(metros),
            tipo_rechazo: tipoRechazo,
            rechazo_cod: rechazoCod,
            descripcion: descripcion?.descripcion || "",
            codigo_falla: descripcion?.codigo_falla || null,
            codigo_logic: descripcion?.codigo_logic || null,
            responsable: JSON.stringify(responsable),
        };

        console.log("Datos enviados al backend:", datosAEnviar);

        try {
            const response = await putRegistrarRechazo(datosAEnviar);

            if (!response?.success) {
                showSnackbar('No se pudo registrar el rechazo.', 'warning');
                setLoading(false);
                return;
            }

            showSnackbar('Rechazo registrado correctamente.', 'success');
            limpiarCampos();

        } catch (error) {
            console.error('❌ Error al registrar rechazo:', error);
            showSnackbar('Error al registrar el rechazo.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const limpiarCampos = () => {
        setLote('');
        setArticuloTerminado('');
        setMetros('');
        setDescripcion(null);
        setDescripcionInput("");
        setTipoRechazo('');
        setRechazoPlanta('');
        setRechazoCalidad('');
        setRolloExiste(null);
        setResponsable(null);
        setLegajo("");
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (tipoRechazo === "produccion") setRechazoCalidad("");
        else if (tipoRechazo === "calidad") setRechazoPlanta("");
    }, [tipoRechazo]);

    const handleEnter = (e) => {
        if (e.key === 'Enter') validarYConfirmar();
    };

    const verificarRollo = async (valor) => {
        setLote(valor);

        if (valor.trim() === "") {
            setRolloExiste(null);
            return;
        }

        const existe = await getVerificarRollo(valor);
        setRolloExiste(existe);
    };

    useEffect(() => {
        async function cargarMotivos() {
            const lista = await getMotivosRechazos();
            setMotivos(lista);
        }
        cargarMotivos();
    }, []);

    const confirmarResponsable = async () => {
        if (!legajo) {
            showSnackbar("Ingrese legajo", "warning");
            return;
        }

        try {
            const res = await validarLegajo(legajo);

            const operarioValido = Array.isArray(res)
                ? res[0]
                : res?.data ?? res;

            if (!operarioValido?.legajo) {
                showSnackbar("Legajo inválido", "error");
                return;
            }

            setResponsable({
                legajo: operarioValido.legajo,
                nombre: operarioValido.nombre,
            });

            registrarRechazo();
            setMostrarDialogOperario(false);
        } catch (error) {
            console.error(error);
            showSnackbar("Error validando legajo", "error");
        }
    };


    return (
        <HeaderYFooter titulo="RECHAZOS" routes={[]} color="alpacladd" showMainMenu={false}>
            <Box sx={{ display: 'flex', width: { xs: '100%', md: '55%' }, justifyContent: 'center', margin: '0 auto', position: 'relative', px: 1, py: 2 }}>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4500}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>{snackbarMessage}</Alert>
                </Snackbar>

                <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
                    <DialogTitle sx={{ background: 'linear-gradient(145deg, #2c4356, #1e2c3a)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }}>
                        Confirmar rechazo
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <Typography sx={{ fontFamily: 'Poppins', mt: 1 }}>
                            Registrar rechazo del rollo: <b>{`${lote}`}</b>
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins', color: colors.textMuted, mt: 1 }}>
                            ¿Deseás confirmar?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 2, pb: 2 }}>
                        <Button variant="outlined" onClick={() => setOpenConfirm(false)} sx={{ fontFamily: 'Poppins', textTransform: 'none', borderRadius: '10px' }}>Cancelar</Button>
                        <LoadingButton loading={loading} variant="contained" onClick={registrarRechazo} sx={primaryBtnSx}>
                            Registrar rechazo
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <CardAlpa sx={{ width: '100%', mt: 0 }}>
                    <Grid container spacing={2} padding={2.5}>
                        <Grid item xs={12}>
                            <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Registro de rechazos</Typography>
                            <Typography variant="body2" sx={{ fontFamily: typography.fontFamily, color: colors.textMuted }}>
                                Completá los datos del rollo y el motivo del rechazo.
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Box position="relative">
                                <TextField
                                    label="Lote"
                                    value={lote}
                                    onChange={(e) => verificarRollo(e.target.value)}
                                    inputRef={inputRef}
                                    fullWidth
                                    sx={fieldSx}
                                />
                                {rolloExiste !== null && (
                                    <Box
                                        sx={{
                                            position: 'absolute', right: 10, top: '50%',
                                            transform: 'translateY(-50%)', fontSize: '22px',
                                            color: rolloExiste ? 'green' : 'red', pointerEvents: 'none'
                                        }} >
                                        {rolloExiste ? "✔" : "✖"}
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField label="Articulo" value={articuloTerminado}
                                onChange={(e) => setArticuloTerminado(e.target.value.toUpperCase())}
                                onKeyDown={handleEnter} fullWidth sx={fieldSx} />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField label="Metros" value={metros}
                                onChange={(e) => setMetros(e.target.value)}
                                onKeyDown={handleEnter} fullWidth sx={fieldSx} />
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={4}>
                                    <TextField select label="Tipo de Rechazo" value={tipoRechazo}
                                        onChange={(e) => setTipoRechazo(e.target.value)} fullWidth sx={fieldSx}>
                                        <MenuItem value="produccion">Producción</MenuItem>
                                        <MenuItem value="calidad">Calidad - Laboratorio</MenuItem>
                                    </TextField>
                                </Grid>

                                {tipoRechazo === 'produccion' && (
                                    <Grid item xs={4}>
                                        <TextField select label="Rechazo Planta" value={rechazoPlanta}
                                            onChange={(e) => setRechazoPlanta(e.target.value)} fullWidth sx={fieldSx}>
                                            <MenuItem value="15">15</MenuItem>
                                            <MenuItem value="16">16</MenuItem>
                                            <MenuItem value="17">17</MenuItem>
                                        </TextField>
                                    </Grid>
                                )}

                                {tipoRechazo === 'calidad' && (
                                    <Grid item xs={4}>
                                        <TextField select label="Rechazo Calidad" value={rechazoCalidad}
                                            onChange={(e) => setRechazoCalidad(e.target.value)} fullWidth sx={fieldSx}>
                                            <MenuItem value="13">13</MenuItem>
                                            <MenuItem value="14">14</MenuItem>
                                        </TextField>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                freeSolo
                                options={motivos}
                                getOptionLabel={(option) => {
                                    if (!option) return "";
                                    if (typeof option === "string") return option;
                                    return `${option.codigo_falla || ""} - ${option.descripcion || ""}`;
                                }}
                                value={descripcion || null}
                                inputValue={descripcionInput}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === "string") {
                                        setDescripcion({
                                            descripcion: newValue,
                                            codigo_falla: null,
                                            codigo_logic: null
                                        });
                                    } else if (newValue && newValue.descripcion) {
                                        setDescripcion(newValue);
                                    } else {
                                        setDescripcion(null);
                                    }
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setDescripcionInput(newInputValue);
                                    if (newInputValue === "") {
                                        setDescripcion(null);
                                        return;
                                    }
                                    setDescripcion({
                                        descripcion: newInputValue,
                                        codigo_falla: null,
                                        codigo_logic: null
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Motivo del rechazo"
                                        fullWidth
                                        sx={fieldSx}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" gap={2}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={limpiarCampos}
                                    sx={{ flex: 1, fontFamily: 'Poppins', textTransform: 'none', borderRadius: '10px' }}
                                >
                                    Limpiar
                                </Button>
                                <LoadingButton
                                    loading={loading}
                                    variant="contained"
                                    onClick={validarYConfirmar}
                                    sx={{ flex: 1, ...primaryBtnSx }}
                                    disabled={rolloExiste === false || rolloExiste === null}
                                >
                                    Registrar rechazo
                                </LoadingButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardAlpa>
            </Box>
            <Dialog open={mostrarDialogOperario} PaperProps={{ sx: { borderRadius: '12px' } }}>
                <DialogTitle sx={{ background: 'linear-gradient(145deg, #2c4356, #1e2c3a)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }}>
                    Responsable del rechazo
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Legajo operario"
                        fullWidth
                        value={legajo}
                        onChange={(e) => setLegajo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && confirmarResponsable()}
                        sx={{ ...fieldSx, mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 2, pb: 2 }}>
                    <Button variant="outlined" color="error" onClick={() => setMostrarDialogOperario(false)} sx={{ fontFamily: 'Poppins', textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={confirmarResponsable} sx={primaryBtnSx}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

        </HeaderYFooter>
    );
};

export default RechazosRegistro;
