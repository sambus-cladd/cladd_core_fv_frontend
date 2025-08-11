import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    TextField,
    Autocomplete,
    Button,
    Typography,
    Tabs,
    Tab,
    Dialog,
    DialogTitle
} from '@mui/material';
import AlpaLogo from '../../../../assets/Images/alpaLogo.png';
import { Navbar } from '../../../../components';
import { getStockQuimicos, putCargaStockQuimico } from "../../API/APIFunctions";

function FormStockQuimicos() {
    const [activeTab, setActiveTab] = useState(0);
    const [idQuimico, setIdQuimico] = useState("");
    const [codigo, setCodigo] = useState("");
    const [quimico, setQuimico] = useState("");
    const [quimicosList, setQuimicosList] = useState([]);
    const [cantidadStock, setCantidadStock] = useState("");
    // const [nuevoQuimico, setNuevoQuimico] = useState("");
    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        const ObtenerQuimicos = async () => {
            try {
                const response = await getStockQuimicos();
                console.log("response quimicos", response);

                setQuimicosList(response[0]);
                // console.log("response", response);

            } catch (error) {
                console.error("Error al obtener químicos: ", error);
            }
        };
        ObtenerQuimicos();
    }, []);

    const vaciarForm = () => {
        setIdQuimico("");
        setCodigo("");
        setQuimico("");
        setCantidadStock("");
        // setNuevoQuimico("");
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        vaciarForm();
    };

    const handleButtonRegistro = async (datos) => {
        try {
            let quimicos = {
                IdQuimico: datos.IdQuimico,
                Codigo: datos.Codigo,
                Quimico: datos.Quimico,
                Cantidad: datos.Cantidad
            };

            let respuesta = await putCargaStockQuimico(quimicos);

            console.log("Respuesta de la API:", respuesta); // 🛠 Verificar estructura

            // Validamos si la respuesta es un objeto y tiene `data`
            if (respuesta?.data) {
                // Si la API devuelve un array, revisamos si tiene índice 1
                const affectedRows = Array.isArray(respuesta.data)
                    ? respuesta.data[1]?.affectedRows
                    : respuesta.data.affectedRows; // Si es objeto, lo accedemos directamente

                if (affectedRows === 1) {
                    toggleOpenDialogWithDelay();
                    vaciarForm();
                } else {
                    toggleOpenErrorWithDelay();
                }
            } else {
                console.error("Error: La API no devolvió una respuesta válida.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
        }
    };

    const containerStyle = {
        height: '100vh', // Ocupa toda la altura de la pantalla
        display: 'flex',
        flexDirection: 'column',
    };

    const contentStyle = {
        flexGrow: 1, // Permite que el contenido crezca y se adapte
        overflow: 'auto', // Habilita el scroll si es necesario
    };

    const footerStyle = {
        backgroundColor: '#1A4862',
        padding: '5px',
        textAlign: 'center',
        color: 'white',
        fontSize: '15px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    };

    async function toggleOpenErrorWithDelay() {
        setopenError(true); // Establecer openError en true
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 1 segundo
        setopenError(false); // Establecer openError en false después de esperar 1 segundo
    }

    async function toggleOpenDialogWithDelay() {
        setopenDialog(true); // Establecer openError en true  
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 1 segundo
        setopenDialog(false); // Establecer openError en false después de esperar 1 segundo
    }

    return (
        <>
            <div style={containerStyle}>
                {/* Header */}
                <div>
                    <Navbar Titulo="STOCK DE QUIMICOS" color={"alpacladd"} plantaLogo={AlpaLogo} />
                </div>

                {/* Contenido principal */}
                <div style={contentStyle}>
                    <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                        <Grid item xs={12} sm={10} md={8}>
                            <Card
                                sx={{
                                    minWidth: '100%',
                                    borderRadius: "10px",
                                    boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)",
                                    padding: 2,
                                    marginTop: 3,
                                }}
                            >
                                {/* Tabs */}
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    sx={{ marginBottom: 2 }}
                                >
                                    <Tab label="Cargar Stock" />
                                    <Tab label="Nuevo Químico" disabled />
                                </Tabs>

                                {activeTab === 0 && (
                                    <>
                                        <Typography fontSize={25} fontFamily="Poppins" fontWeight={400} mb={2}>
                                            Actualizar Stock Químicos
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {/* Químico */}
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    options={quimicosList}
                                                    getOptionLabel={(option) => option.quimico}
                                                    value={quimicosList.find((maq) => maq.quimico === quimico) || null}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) {
                                                            setQuimico(newValue.quimico);
                                                            setIdQuimico(newValue.id); // Guarda el id del químico seleccionado
                                                            setCodigo(newValue.codigo);
                                                        } else {
                                                            setQuimico("");
                                                            setIdQuimico(null);
                                                            setCodigo("");
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Químico" variant="outlined" fullWidth required />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Cantidad */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Cantidad"
                                                    variant="outlined"
                                                    value={cantidadStock}
                                                    type="number"
                                                    onChange={(e) => setCantidadStock(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Botón */}
                                        <Grid container justifyContent="flex-end" mt={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    let aux = {
                                                        IdQuimico: idQuimico,
                                                        Codigo: codigo,
                                                        Quimico: quimico,
                                                        Cantidad: cantidadStock
                                                    }
                                                    handleButtonRegistro(aux);
                                                }}
                                            >
                                                Agregar Stock
                                            </Button>
                                        </Grid>
                                    </>
                                )}

                                {activeTab === 1 && (
                                    <>
                                        <Typography fontSize={25} fontFamily="Poppins" fontWeight={400} mb={2}>
                                            Registrar Nuevo Químico
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {/* Código */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Código"
                                                    variant="outlined"
                                                    value={codigo}
                                                    onChange={(e) => setCodigo(e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            {/* Nombre del Químico */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Nombre del Químico"
                                                    variant="outlined"
                                                    value={quimico}
                                                    onChange={(e) => setQuimico(e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            {/* Cantidad */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Cantidad"
                                                    type="number"
                                                    variant="outlined"
                                                    value={cantidadStock}
                                                    onChange={(e) => setCantidadStock(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Botón */}
                                        <Grid container justifyContent="flex-end" mt={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    let aux = {
                                                        IdQuimico: idQuimico,
                                                        Codigo: codigo,
                                                        Quimico: quimico,
                                                        Cantidad: cantidadStock
                                                    }
                                                    handleButtonRegistro(aux);
                                                }}
                                            >
                                                Registrar Químico
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </div>

                {/* Dialogs */}
                <Dialog open={openDialog}>
                    <DialogTitle sx={{ backgroundColor: '#00AC60', color: 'white' }}>
                        ¡Datos enviados con éxito!
                    </DialogTitle>
                </Dialog>

                <Dialog open={openError}>
                    <DialogTitle sx={{ backgroundColor: '#e00000', color: 'white' }}>
                        No se pudo realizar la carga
                    </DialogTitle>
                </Dialog>

                {/* Footer */}
                <footer style={footerStyle}>
                    CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
                </footer>
            </div >
        </>
    );
}

export default FormStockQuimicos;
