import { useEffect, useState, React, useRef } from 'react';
import { FormControl, InputLabel, Select, Card, Grid, MenuItem, Button, Typography, TextField } from '@mui/material/';
import Autocomplete from "@mui/material/Autocomplete";
import ReactDOM from 'react-dom';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Test from '../Test';
import { useAuth } from '../../../AuthContext';
import DataGridTable from '../../../components/DataGrid/DataGridTable';
import { getArticulosFV, getTarimasUsadas, getTodasRutinas, getUltimaRutinaLab, putRegistrarMuestra, getArticuloInicialFV } from '../API/APIFunctions';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import MensajeDialog from '../../../components/Plantilla/MensajeDialog';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import LoadingButton from '@mui/lab/LoadingButton';

const options = ['Crudo', 'Lavado Potencial', 'Quick Wash', 'Terminado', 'Reprueba', 'Stock (sin lab.)', 'Personalizado', 'Boill Off'];

function RegistrarMuestra() {
  const { auth } = useAuth();
  const Resultados = ["Calidad", "Jefatura Producción", "Jefatura Calidad", "Jefatura Investigación y Desarrollo", "Supervisores Terminación", "Supervisores Teñido", "Supervisores Calidad", "Supervisores Preparación"];
  const [mensaje, setMensaje] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tipo, setTipo] = useState('success');
  const [value, setValue] = useState(null);
  const firstTextFieldRef = useRef(null);
  const secondTextFieldRef = useRef(null);
  const thirdTextFieldRef = useRef(null);
  const [rollo, setRollo] = useState('');
  const [sublotValue, setSublotValue] = useState('');
  const nextTextFieldRefArticulo = useRef(null);
  const [ArticuloValue, setArticuloValue] = useState('');
  const nextTextFieldRefOrden = useRef(null);
  const [anidarRutina, setAnidarRutina] = useState("");
  const [ordenTrabajo, setOrdenTrabajo] = useState("");
  const [articuloTerminado, setArticuloTerminado] = useState("");
  const [tarima, setTarima] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [informeResultado, setInformeResultado] = useState("");
  const [anotaciones, setAnotaciones] = useState("");
  const [metrosTotal, setMetrosTotal] = useState("");
  const [numCampos, setNumCampos] = useState(1);
  const [muestra, setMuestra] = useState(Array(numCampos).fill(''));
  const [tarimasOcupadas, setTarimasOcupadas] = useState([]);
  const [renovarTarimas, setRenovarTarimas] = useState(false);
  const [articulosFinales, setArticulosFinales] = useState([]);
  const [rows, setRows] = useState([]);
  const [refrescarTabla, setRefrescarTabla] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: 'rutina', headerName: 'Rutina', width: 150 },
    { field: 'motivo', headerName: 'Motivo', width: 150 },
    { field: 'lote', headerName: 'Lote', width: 150 },
    { field: 'tarima', headerName: 'Tarima', width: 150 },
    { field: 'articulo_final', headerName: 'Artículo', width: 150 },
    { field: 'metros', headerName: 'Metros', width: 150, valueFormatter: (params) => `${params.value} m` },
    { field: 'corte', headerName: 'Muestra', width: 150, valueFormatter: (params) => `${params.value} m` },
    { field: 'operario', headerName: 'Registró', width: 150 },
    { field: 'fecha', headerName: 'Fecha', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleString() },
    {
      field: 'actions',
      headerName: 'Re Imprimir',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"

          onClick={() => handleReImprimir(params.row)}
        >
          <BookmarkAddIcon />
        </Button>
      ),
    },
  ]

  async function getRutinas() {
    try {
      let respuesta = await getTodasRutinas();
      setRows(respuesta.data);
    } catch (error) {
      setMensaje("Error al cargar las rutinas cargadas previamente");
      setTipo('error');
      setIsOpen(true);
    }
  }

  function limpiarForm() {
    setValue(null);
    setRollo('');
    setSublotValue('');
    setArticuloValue('');
    setAnidarRutina('');
    setOrdenTrabajo('');
    setArticuloTerminado('');
    setTarima('');
    setPrioridad('');
    setInformeResultado('');
    setAnotaciones('');
    setMetrosTotal('');
    setNumCampos(1);
    setMuestra(Array(1).fill(''));

  }
  const handleIncremento = () => {
    setNumCampos(numCampos + 1);
  };
  const handleDecremento = () => {
    if (numCampos > 0) {
      setNumCampos(numCampos - 1);
    }
  };

  async function getTarimasOcupadas() {
    try {
      let respuesta = await getTarimasUsadas();
      setTarimasOcupadas(respuesta.data);

    } catch (error) {
      setMensaje("Error al cargar las tarimas ocupadas");
      setTipo('error');
      setIsOpen(true);
    }
  }
  async function getUltimaRutina() {
    try {
      let respuesta = await getUltimaRutinaLab();
      let ultima_rutina;
      if (respuesta.data[0] === undefined) {
        ultima_rutina = 0;
      } else {
        ultima_rutina = respuesta.data[0].rutina;
      }
      return (ultima_rutina);
    } catch (error) {
      setMensaje("Error al cargar la última rutina");
      setTipo('error');
      setIsOpen(true);
    }
  }
  async function generarNuevaRutina() {
    try {
      let ultimaRutina = await getUltimaRutina();

      const fechaActual = new Date();
      const anioActual = fechaActual.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año
      const mesActual = ("0" + (fechaActual.getMonth() + 1)).slice(-2);  // Mes, con 2 dígitos

      let nuevoId;

      // Formatear el número de la última rutina como una cadena de 8 dígitos
      const ultimaRutinaStr = ultimaRutina.toString().padStart(8, '0'); // Asegurarse de que tenga 8 dígitos
      const ultimaRutinaAnio = ultimaRutinaStr.slice(0, 2);
      const ultimaRutinaMes = ultimaRutinaStr.slice(2, 4);
      const ultimaRutinaId = parseInt(ultimaRutinaStr.slice(4), 10); // Extraer el ID único y convertir a entero

      // Comprobar si el año y el mes coinciden con el año y mes actuales
      if (anioActual === ultimaRutinaAnio && mesActual === ultimaRutinaMes) {
        // Si coinciden, incrementar el ID
        nuevoId = ultimaRutinaId + 1;
      } else {
        // Si no coinciden, reiniciar el ID a 1
        nuevoId = 1;
      }

      // Formatear el nuevo ID como una cadena de 4 dígitos
      const nuevoIdStr = nuevoId.toString().padStart(4, '0'); // Asegurarse de que el ID tenga 4 dígitos
      const nuevaRutina = `${anioActual}${mesActual}${nuevoIdStr}`;

      return nuevaRutina;
    } catch (error) {
      setMensaje("Error al generar la nueva rutina");
      setTipo('error');
      setIsOpen(true);
      return null;
    }
  }
  async function getArticulosFinales() {
    try {
      let respuesta = await getArticulosFV();
      let articulos = respuesta.data.map((articulo) => articulo.PRODUCTO_ARTCOD);
      setArticulosFinales(articulos);

    } catch (error) {
      setMensaje("Error al cargar los artículos terminados");
      setTipo('error');
      setIsOpen(true);

    }
  }
  useEffect(() => {
    getRutinas();
    return () => {
    }
  }, [refrescarTabla])

  useEffect(() => {
    getTarimasOcupadas();
    return () => {
    }
  }, [renovarTarimas]);

  useEffect(() => {
    getArticulosFinales();
    return () => {
    }
  }, [])

  useEffect(() => {

    // INICIO - ENFOCA EL CAMPO MOTIVOS AL ACTUALIZAR PANTALLA
    if (firstTextFieldRef.current) {
      firstTextFieldRef.current.focus();
    }
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Mueve el enfoque al segundo campo de texto después de seleccionar una opción
    if (secondTextFieldRef.current) {
      secondTextFieldRef.current.focus();
    }
  };
  const handleFormChangeText = (event, index) => {
    setMuestra((prevMuestra) => {
      prevMuestra[index] = event.target.value;
      return [...prevMuestra];
    });
  };
  const handleKeyDown = (e) => {
    const { key } = e;
    const optionStartingWithKey = options.find((option) => option.toLowerCase().startsWith(key.toLowerCase()));
    if (optionStartingWithKey) {
      e.preventDefault(); // Previene que la letra se inserte en el segundo campo de texto
      setValue(optionStartingWithKey);
      // Mueve el enfoque al segundo campo de texto después de seleccionar una opción
      if (secondTextFieldRef.current) {
        secondTextFieldRef.current.focus();
      }
    }
  };
  const handleSecondFieldChange = (event) => {
    const inputValue = event.target.value;
    setRollo(inputValue);
    if (inputValue.length >= 8 && thirdTextFieldRef.current) {
      thirdTextFieldRef.current.focus();
    }
  };
  const handleSublotChange = (event) => {
    let inputValue = event.target.value;
    // Limita la longitud del valor a 6 caracteres
    if (inputValue.length > 6) {
      inputValue = inputValue.slice(0, 6);
    }
    setSublotValue(inputValue);
  };
  const handleKeyPressSublote = (event) => {
    if (event.key === 'Enter') {
      // Pasa al siguiente campo cuando se presiona Enter
      nextTextFieldRefArticulo.current.focus();
    }
  };
  async function handleReImprimir(row) {
    let muestra = [];
    muestra.push(row?.corte);
    const data = {
      rutina: row?.rutina,
      Rollo: row?.lote,
      informeResultado: row?.sector_a_informar,
      anotaciones: row?.anotaciones,
      anidarRutina: row?.anidar_rutina,
      subLote: row?.sub_lote,
      ordenTrabajo: row?.orden_trabajo,
      articuloTerminado: row?.articulo_final,
      tarima: row?.tarima,
      motivo: row?.motivo,
      metrosTotal: row?.metros,
      muestra: muestra,
      QrcodeImageUrl: `http://192.168.40.95:4006/codigoqrrevisado/${row?.lote}`,
    }
    await reImprimir(data)
  }
  async function reImprimir(data) {
    try {
      const newWindow = window.open('', '_blank');
      const rootElement = newWindow.document.createElement('div');
      newWindow.document.body.appendChild(rootElement);
      const reactRoot = ReactDOM.createRoot(rootElement);

      // Renderizar el componente <Test/> en la nueva ventana
      reactRoot.render(
        <Test
          rutina={data.rutina}
          Rollo={data.Rollo}
          informeResultado={data.informeResultado}
          anotaciones={data.anotaciones}
          anidarRutina={data.anidarRutina}
          subLote={data.subLote}
          ordenTrabajo={data.ordenTrabajo}
          articuloTerminado={data.articuloTerminado}
          tarima={data.tarima}
          motivo={data.motivo}
          metrosTotal={data.metrosTotal}
          muestra={data.muestra}
          QrcodeImageUrl={data.QrcodeImageUrl}
          reImpresion={true}
        />
      );
    } catch (error) {
      setMensaje("Error al re-imprimir la etiqueta");
      setTipo('error');
      setIsOpen(true);
    }
  }
  // FIN - CALCULAR CAMPOS Y PASAR DE MANERA AUTOMATICA
  async function handleImprimir(rutina, qr) {
    // Crear una nueva ventana
    const newWindow = window.open('', '_blank');
    const rootElement = newWindow.document.createElement('div');
    newWindow.document.body.appendChild(rootElement);
    const reactRoot = ReactDOM.createRoot(rootElement);

    // Renderizar el componente <Test/> en la nueva ventana
    reactRoot.render(
      <Test
        rutina={rutina}
        Rollo={rollo}
        informeResultado={informeResultado}
        anotaciones={anotaciones}
        anidarRutina={anidarRutina}
        subLote={sublotValue}
        ordenTrabajo={ordenTrabajo}
        articuloTerminado={articuloTerminado}
        tarima={tarima}
        motivo={value}
        metrosTotal={metrosTotal}
        muestra={muestra}
        QrcodeImageUrl={qr}
      />
    );
    limpiarForm();
  }
  function validar() {
    const regex = /^[A-Za-z0-9]{2}\d{4,6}$/;

    if (value === null || value === '') {
      setMensaje('Seleccione un motivo');
      setTipo('error');
      setIsOpen(true);
      return false;
    }
    if (rollo === '' || rollo === null || !regex.test(rollo) || parseInt(rollo) === 0) {
      setMensaje('Ingrese un numero de rollo');
      setTipo('error');
      setIsOpen(true);
      return false;
    }
    if (articuloTerminado === '') {
      setMensaje('Seleccione un artículo terminado');
      setTipo('error');
      setIsOpen(true);
      return false;
    }
    if (tarima === '' && value === 'Terminado') {
      setMensaje('Ingrese un número de tarima');
      setTipo('error');
      setIsOpen(true);
      return false;
    }
    if (tarimasOcupadas.includes(parseInt(tarima))) {
      alert(`La tarima ${tarima} ya está ocupada, ¿Desea compartirla?`);
    }
    if (metrosTotal === '') {
      setMensaje('Ingrese los metros totales del lote');
      setTipo('error');
      setIsOpen(true);
      return false;
    }
    if (muestra.length === 0 || muestra[0] === '') {
      setMensaje('Ingrese al menos una muestra');
      setTipo('error');
      setIsOpen(true);
      return false;
    }
    return true;
  }
  const handleClick = async () => {
    setLoading(true);
    if (!validar()) {
      setLoading(false);
      return;
    }
    else {
      try {
        let nuevaRutinaBase = await generarNuevaRutina();
        let codigoRollo = encodeURIComponent(rollo.slice(-5));
        const qr = 'http://192.168.40.95:4006/codigoqrrevisado/' + codigoRollo;

        for (let x = 0; x < muestra.length; x++) {
          //incremento el codigo de rutina
          let rutinaConsecutiva = nuevaRutinaBase.slice(0, 4) + (parseInt(nuevaRutinaBase.slice(4)) + x).toString().padStart(4, '0');
          // 65 es el código ASCII de 'A'
          let letra = String.fromCharCode(65 + x);

          let body = {
            motivo: value.toUpperCase(),
            lote: rollo,
            anidar_rutina: anidarRutina,
            sub_lote: sublotValue,
            orden_trabajo: ordenTrabajo,
            articulo_crudo: ArticuloValue,
            articulo_terminado: articuloTerminado,
            prioridad: prioridad,
            informe_resultado: informeResultado,
            metros_total: metrosTotal,
            rutina: rutinaConsecutiva,
            muestra: muestra[x],
            tarima: tarima,
            operario: auth?.usuario,
            letra: letra
          };

          try {
            let respuesta = await putRegistrarMuestra(body);
            if (respuesta.status >= 200 && respuesta.status < 300) {
              renovarTarimas ? setRenovarTarimas(false) : setRenovarTarimas(true);
              setMensaje("Muestra registrada correctamente");
              setTipo('success');
              setIsOpen(true);
            } else {
              setMensaje("Error al registrar la rutina");
              setTipo('error');
              setIsOpen(true);
              setLoading(false);
            }
          } catch (error) {
            setMensaje("Error al registrar la rutina");
            setTipo('error');
            setIsOpen(true);
            setLoading(false);
          }

          if (x === 0) {
            handleImprimir(rutinaConsecutiva, qr);
          }
        }
        refrescarTabla ? setRefrescarTabla(false) : setRefrescarTabla(true);
        setLoading(false);
      }
      catch (error) {
        setMensaje("Error al registrar la rutina");
        setTipo('error');
        setIsOpen(true);
        setLoading(false);
      }

    }
  };

  async function handleSelectArticulo(event, newValue) {
    setArticuloTerminado(newValue);
    if (newValue) {
      try {
        let response = await getArticuloInicialFV(newValue);
        let respuesta = response?.data[0]?.PRODUCTO_CRUDO;
        setArticuloValue(respuesta);
      } catch (error) {
        setMensaje("Error al cargar el artículo crudo");
        setTipo('error');
        setIsOpen(true);
      }
    }
  };

  function handleTarimaChange(event) {
    const newValue = event.target.value;
    if (newValue === '' || /^\d*$/.test(newValue)) {
      setTarima(newValue);
    }
  }

  return (
    <>
      <HeaderYFooter titulo={"MUESTRA LABORATORIO"}>
        <Grid container columns={12} sx={{ width: "95%" }}  >
          {/* INICIO REGISTRO DE MUESTRA I*/}
          <Grid item xs={6} sm={6} md={6} mb={6} pl={3} >

            {/* INICIO CARGA DE MUESTRA */}
            <Card sx={{ minWidth: '90%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0, margin: "30px 30px" }}>

              {/* PRIMERA FILA - TITULO*/}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>
                <Typography fontFamily={'Poppins'} fontWeight={'bold'} fontSize={20} color={'#0D3F5E'}>REGISTRO INGRESOS LABORATORIO - CALIDAD</Typography>
              </Grid>

              {/* AGREGADO - MOTIVO */}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>
                <Autocomplete
                  fullWidth
                  value={value}
                  onChange={handleChange}
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Motivo"
                      variant="outlined"
                      inputRef={firstTextFieldRef}
                      onKeyDown={handleKeyDown} // Maneja el evento keydown en el primer campo de texto
                    />
                  )}
                />
                <Typography style={{ fontStyle: 'italic', fontSize: '13px' }}>Presiona una tecla para seleccionar:</Typography>
                {options.map((option, index) => (
                  <Typography style={{ fontStyle: 'italic', fontSize: '13px', fontWeight: 'bold' }} key={index}>{option[0]}</Typography>
                ))}
              </Grid>

              {/* SEGUNDA FILA - LOTE - PIEZA*/}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>

                {/* LOTE/Nº ROLLO */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <TextField
                    fullWidth
                    inputRef={secondTextFieldRef}
                    label="Lote/Nº Rollo"
                    variant="outlined"
                    value={rollo}
                    onChange={handleSecondFieldChange}
                    InputProps={{
                      endAdornment: (
                        <PinIcon position="end">
                        </PinIcon>
                      ),
                    }}
                  />
                </Grid>

                {/* ANIDAR RUTINA */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Anidar Rutina"
                    value={anidarRutina}
                    variant="outlined"
                    onChange={(e) => setAnidarRutina(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <AbcIcon position="end">
                        </AbcIcon>
                      ),
                    }} />
                </Grid>

              </Grid>

              {/* TERCER FILA - SUBLOTE - ORDEN TRABAJO */}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>

                {/* SUBLOTE */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Sublote"
                    variant="outlined"
                    inputRef={thirdTextFieldRef}
                    value={sublotValue}
                    onChange={handleSublotChange}
                    onKeyPress={handleKeyPressSublote}
                    InputProps={{
                      endAdornment: (
                        <AbcIcon position="end">
                        </AbcIcon>
                      ),
                    }} />
                </Grid>

                {/* ORDE DE TRABAJO */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Orden de trabajo"
                    variant="outlined"
                    value={ordenTrabajo}
                    inputRef={nextTextFieldRefOrden}
                    onChange={(e) => setOrdenTrabajo(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <AbcIcon position="end">
                        </AbcIcon>
                      ),
                    }} />
                </Grid>

              </Grid>

              {/* CUARTA FILA - ARTÍCULO - CODARTÍCULO*/}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>
                {/* ARTÍCULO TERMINADO*/}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <Autocomplete
                    fullWidth
                    id="articulo-terminado"
                    options={articulosFinales}
                    value={articuloTerminado}
                    onChange={handleSelectArticulo}
                    isOptionEqualToValue={(option, value) => option === value || value === ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Artículo Terminado" variant="outlined" />
                    )}
                  />
                </Grid>
                {/* ARTÍCULO CRUDO*/}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Artículo Crudo"
                    variant="outlined"
                    value={ArticuloValue}
                    readOnly
                    InputProps={{
                      endAdornment: (
                        <PinIcon position="end">
                        </PinIcon>
                      ),
                    }} />
                </Grid>
              </Grid>


              {/* QUINTA FILA  - TARIMA - PRIORIDAD*/}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>

                {/* TARIMA */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    value={tarima}
                    label="Tarima"
                    variant="outlined"
                    onChange={handleTarimaChange}
                    InputProps={{
                      endAdornment: (
                        <PinIcon position="end">
                        </PinIcon>
                      ),
                    }} />
                </Grid>

                {/* PRIORIDAD */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="prioridad">Prioridad</InputLabel>
                    <Select
                      labelId="prioridad"
                      id="prioridad"
                      value={prioridad}
                      onChange={(e) => setPrioridad(e.target.value)}
                      label="Prioridad"
                    >
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Urgente">Urgente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
            {/* FIN CARGA DE MUESTRA  */}

          </Grid>
          {/* FIN REGISTRO DE MUESTRA I*/}

          {/* *************************************************************** */}

          {/* INICIO REGISTRO DE MUESTRA II */}
          <Grid item xs={6} sm={6} md={6} mb={6} pl={3}>

            {/* INICIO CARGA DE MUESTRA */}
            <Card sx={{ minWidth: '90%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0, margin: "30px 30px" }}>

              {/* PRIMERA FILA  - RESULTADO - ANOTACIONES*/}
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>

                {/* ANOTACIONES */}
                <Grid item xs={12} sm={12} md={12} padding={0.2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Anotaciones"
                    variant="outlined"
                    value={anotaciones}
                    onChange={(e) => setAnotaciones(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <AbcIcon position="end">
                        </AbcIcon>
                      ),
                    }} />
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>
                <Grid item xs={6} padding={0.5}>
                  <TextField
                    fullWidth
                    value={metrosTotal}
                    onChange={(e) => setMetrosTotal(e.target.value)}
                    label="Metros Total del Lote"
                    type='number'
                    variant="outlined"
                    inputProps={{
                      inputMode: 'numeric', // Esto permite que solo se ingresen números en dispositivos móviles
                      pattern: '[0-9]*', // Esto evita que se muestren las sugerencias de texto predictivo en algunos navegadores
                    }}
                    InputProps={{
                      endAdornment: (
                        <PinIcon position="end">
                        </PinIcon>
                      ),
                    }}
                  />
                </Grid>

                {/* RESULTADOS */}
                <Grid item xs={6} sm={6} md={6} padding={0.2}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-demo"
                    options={Resultados}
                    onChange={(e, v) => setInformeResultado(v)}
                    defaultValue={Resultados[0]}
                    renderInput={(params) => <TextField {...params} label="Informar Resultado:" />}
                  />
                </Grid>
              </Grid>
              {/* AGREGAR MUESTRAS */}
              <Grid container spacing={2} >

                <Grid item xs={6} sm={6} md={6} padding={0}>

                  <Typography fontFamily="Poppins" marginLeft={1} color={"#1976D2"}>Agregar Muestra</Typography>

                  <Button
                    aria-label="increase"
                    onClick={handleIncremento}>
                    <AddIcon></AddIcon>
                  </Button>

                  <Button
                    aria-label="decrease"
                    onClick={handleDecremento}>
                    <RemoveIcon></RemoveIcon>
                  </Button>

                </Grid>

                {/* Iterar sobre el estado numCampos para renderizar los campos de texto */}
                {[...Array(numCampos)].map((_, index) => (
                  <Grid key={index} item xs={6} sm={6} md={6} padding={1}>
                    <TextField
                      fullWidth
                      sx={{ color: "#1976D2" }}
                      type='number'
                      id={`outlined-basic-${index}`}
                      placeholder={`Muestra N°${index + 1}`}
                      fontFamily="Poppins"
                      value={muestra[index] || ''} // Use the state value or an empty string if undefined
                      variant="outlined"
                      onChange={(event) => handleFormChangeText(event, index)}
                      InputProps={{
                        endAdornment: (
                          <PinIcon position="end">
                          </PinIcon>
                        ),
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* MENSAJE Y BOTON */}
              <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" padding={1}>
                <Grid item xs={4} sm={4} md={4} padding={0.5}>
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    onClick={handleClick}
                    loading={loading}
                    loadingIndicator="Registrando...">
                      Guardar e imprimir
                  </LoadingButton>
                </Grid>
              </Grid>

            </Card>
            {/* FIN CARGA DE MUESTRA  */}

          </Grid>
          {/* FIN REGISTRO DE MUESTRA II */}

          <Grid item xs={12} sm={12} md={12} mb={12} pl={3}>
            <DataGridTable rows={rows} columns={columns} />
          </Grid>
          <br />

        </Grid>
        <MensajeDialog isOpen={isOpen} mensaje={mensaje} tipo={tipo} duracion={3000} onClose={() => setIsOpen(false)} />
      </HeaderYFooter>
    </>
  );

}
export default RegistrarMuestra;