import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Card,
  Grid,
} from '@mui/material/';

import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import WavesIcon from '@mui/icons-material/Waves';
import GestureIcon from '@mui/icons-material/Gesture';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import StraightenIcon from '@mui/icons-material/Straighten';
import NumbersIcon from '@mui/icons-material/Numbers';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';

import { GetTABLAARTICULOS, GetTABLADETALLES } from '../API/APIFunctions.js';

const DetallesArticulos = () => {

    const [DetallesArticulos, setDetallesArticulos] = useState([])
    const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
    const [Articulos, setArticulos] = useState([]);
    const [InputArticulo, setInputArticulo] = useState('');
  
    /* --- INICIO TABLA ARTICULOS --- */
    useEffect(() => {
      const ObtenerArticulos = async () => {
        try {
          const response = await GetTABLAARTICULOS()
          console.log("response: ", response);
          setArticulos(response.Dato)
        } catch (error) {
          console.error("Error al obtener los Articulos", error);
        }
      }
      ObtenerArticulos();
    }, []);
    /* --- FIN TABLA ARTICULOS --- */
  
    // Maneja el cambio en la selección del proyecto
    const handleArticuloSelect = (newValue) => {
        setArticuloSeleccionado(newValue ? newValue.articulo : InputArticulo);
    };
    
    const handleInputChange = (event, newinputArticulo) => {
        setInputArticulo(newinputArticulo);
        setArticuloSeleccionado(newinputArticulo);
    };
  
  
    /* --- INICIO DETALLES X ARTICULO --- */
    async function handleBotonBuscar() {
      try {
        const response = await GetTABLADETALLES(articuloSeleccionado);
        console.log("Detalles por Articulo: ",response.Dato);
        setDetallesArticulos(response.Dato[0])
      } catch (error) {
        console.error("error con: ", error);
      }
  
    };
    /* --- FIN DETALLES X ARTICULO --- */

    /* --- INICIO ESTILO ICONOS --- */
    const IconStyle = {
        fontSize: {
            xs: 12, 
            sm: 14, 
            md: 18, 
            lg: 20, 
            xl: 16
        },
        paddingRight: 0.5,
        paddingTop: 0.3
    }
    /* --- FIN ESTILO ICONOS --- */

    const formatNumber = (num) => {
        return parseFloat(num).toString();
    };
  
    return (
  
      <Grid container width={'100%'} sx={{ boxSizing: 'content-box', }}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container width={'100%'} sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
            <Grid item xs={4} md={4} lg={4} mt={1} mb={1}>
              <Typography fontSize={{ xs: 15, sm: 18, md: 18, lg: 18, xl: 18 }} fontWeight={'700'} fontFamily={'Poppins'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
                Seleccione Articulo :
              </Typography>
            </Grid>
            <Grid item xs={4} md={4} lg={4} mt={1} mb={1}>
                <Autocomplete
                    options={Articulos}
                    getOptionLabel={(option) => option.articulo}
                    id="selected-Articulo"
                    disableCloseOnSelect
                    onChange={(event, newValue) => handleArticuloSelect(newValue)}
                    inputValue={InputArticulo}
                    onInputChange={handleInputChange}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        variant="standard"
                        onKeyUp={(event) => {
                            if (event.key === "Enter") {
                            handleBotonBuscar();
                            }
                        }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={4} md={4} lg={4} mt={1} mb={1} sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <Button variant="contained" onClick={() => { handleBotonBuscar(); }}>
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
            <Grid container  sx={{  display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', paddingTop: 2 }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Card sx={{ maxWidth: '99%', margin: '0 auto', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                        <Grid container columns={12} sx={{ width: "100%" }}  >
                            {/* TITULO */}
                            <Grid item xs={12} sm={12} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: '#115393', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}  >
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Typography fontSize={{ xs: 15, sm: 12, md: 19, lg: 29, xl: 19 }} pl={1} fontFamily={'Poppins'} fontWeight={'800'} color={'white'}>
                                        {DetallesArticulos.articulo}
                                    </Typography>
                                </Box>
                            </Grid>
                            {/* DETALLES DEL ARTICULO */}
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Urdimbre */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", alignContent: "center", marginTop: 2 }}>
                                        <WavesIcon  sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 7.5, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Urdimbre: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent:"flex-start",alignItems: "center", alignContent: "center", marginTop: 2, paddingLeft: 1 }}>
                                        <Typography fontSize={{ xs: 7, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.urdimbre}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Hilos */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", alignContent: "center", marginTop: 2 }}>
                                        <GestureIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Hilos: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", alignContent: "center", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }}  fontFamily={'Poppins'} fontWeight={'500'} >
                                            {formatNumber(DetallesArticulos.hilos)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>      
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Dibujo */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <DesignServicesIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Dibujo: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.dibujo}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Peine */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <StraightenIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Peine: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.peine}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* linea */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <AbcIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Linea: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.linea}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Ex */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <CodeIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Ex: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.ex}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Nombre */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <AbcIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Nombre: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.nombre}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Trama*/}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <WavesIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Trama: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.trama}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Pas x cm */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <PinIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Pas x Cm: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {formatNumber(DetallesArticulos.pas_x_cm)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Gr/ml */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <PinIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Gr/ml: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {formatNumber(DetallesArticulos.gr_ml)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Gr/m2 */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <PinIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Gr/m2: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {formatNumber(DetallesArticulos.gr_m2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Ancho Peine*/}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <PinIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Ancho Peine: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {formatNumber(DetallesArticulos.ancho_peine)} cm
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Ancho Descanso */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <PinIcon sx={IconStyle} />
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Ancho Descanso: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {formatNumber(DetallesArticulos.ancho_descanso)} cm
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Hilo x Orillo */}
                                    <Grid item xs={5} sm={5} md={5} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <LinearScaleIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Hilo x Orillo: </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} fontWeight={'500'} >
                                            {DetallesArticulos.hilo_x_orillo}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Articulo FV */}
                                    <Grid item xs={12} sm={12} md={12} pl={0.5} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <NumbersIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Articulo FV: </Typography>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} paddingLeft={"2px"}>
                                            {DetallesArticulos.articulo_fv}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} mb={1} >
                                <Grid container >
                                    {/* Observacion */}
                                    <Grid item xs={12} sm={12} md={12} pl={1} sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                                        <DescriptionIcon sx={IconStyle}/>
                                        <Typography fontSize={{ xs: 9, sm: 12, md: 14, lg: 16, xl: 15 }} fontWeight={'650'} fontFamily={'Poppins'}> Observaciones: </Typography>
                                        <Typography fontSize={{ xs: 8, sm: 11, md: 13, lg: 15, xl: 15 }} fontFamily={'Poppins'} paddingLeft={"2px"}>
                                            {DetallesArticulos.observaciones}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
      </Grid>
    );
  };
  export default DetallesArticulos;