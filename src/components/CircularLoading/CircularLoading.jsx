// @flow 
import React, { useState, useEffect } from 'react';
// import { CircularProgressbar,buildStyles,CircularProgressbarWithChildren   } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import RadialSeparators from "./RadialSeparators";
import { width } from '@mui/system';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

//import 'components/ProgressBar/styles.css'
import './styles.css'
// @mui material components

// Material Dashboard 2 React components

import PropTypes from "prop-types";


export const CircularLoadingYellow = ({ count, size }) => {
  const value = count;
  const BGColor = "rgba(0, 99, 78, 0.9)";
  const Estilo =
  {


    'Loading':
    {
      position: 'relative',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: '50%',
      textAlign: 'center',
      fontSize: '300%',
      lineHeight: '12rem',
      color: '#fff000',
      boxShadow: '0 0 20rem rgba(0,0,0,.5)',
    },


  };
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      margin: "1rem",
      width: "auto", //4rem
      height: "auto", //4rem
      //backgroundColor: 'red',
    }}
    >
      <div class="LoadingYellow" style={Estilo.Loading} >
        {count}%
      </div>
    </Box>
  );
};

export const CircularLoadingCyan = ({ count, size, fontSize }) => {
  const value = count;
  const BGColor = "rgba(0, 99, 78, 0.9)";

  const Estilo =
  {
    'Loading':
    {
      position: 'relative',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: '50%',
      textAlign: 'center',
      fontSize: '300%',
      lineHeight: '12rem',
      color: 'rgba(0, 255, 255, 0.9)',
      boxShadow: '0 0 20rem rgba(0,0,0,.5)',
    },


  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem",
        width: "auto", //4rem
        height: "auto", //4rem
        //backgroundColor: 'red',

      }}
      >
        <div class="LoadingCyan" style={Estilo.Loading} >
          <Typography m={1} p={1} justifyContent="center" align="center" alignItems="center" fontWeight="bold"
            sx={{
              fontSize: fontSize, color: "rgba(0, 255, 255, 0.9)",
              textShadow: "0.1px 0.1px 0.1px white, 0 0 1em white, 0 0 0.2em white"
            }}>

            {count}%
          </Typography>
        </div>
      </Box>
    </>
  )
}
export const CircularLoadingGreen = ({ count, size, fontSize }) => {

  const BGColor = "rgba(0, 99, 78, 0.9)";

  const Estilo =
  {
    'Loading':
    {
      position: 'relative',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: '50%',
      textAlign: 'center',
      fontSize: '300%',
      lineHeight: '12rem',
      color: 'rgba(47, 255, 0, 0.9)',
      boxShadow: '0 0 20rem rgba(0,0,0,.5)',


    },


  };
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      margin: "1rem",
      width: "auto", //4rem
      height: "auto", //4rem
      //backgroundColor: 'red',

    }}
    >
      <div class="LoadingGreen" style={Estilo.Loading} >
        <Typography m={1} p={1} justifyContent="center" align="center" alignItems="center" fontWeight="bold"
          sx={{
            fontSize: fontSize, color: "rgba(47, 255, 0, 0.9)",
            textShadow: "0.1px 0.1px 0.1px white, 0 0 1em white, 0 0 0.2em white"
          }}>

          {count}%
        </Typography>
      </div>
    </Box>

  );
};
export const CircularLoadingBlue = ({ count, size, fontSize }) => {



  const Estilo =
  {
    'Loading':
    {
      position: 'relative',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: '50%',
      textAlign: 'center',
      fontSize: '300%',
      lineHeight: '12rem',
      color: 'rgba(0, 0, 255, 0.9)',
      boxShadow: '0 0 20rem rgba(0,0,0,.5)',


    },


  };
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      margin: "0.5rem",
      marginBottom: "0.1rem",
      width: "auto", //4rem
      height: "auto", //4rem
      //backgroundColor: 'red',

    }}
    >
      <div class="LoadingBlue" style={Estilo.Loading} >
        <Typography m={1} p={1} justifyContent="center" align="center" alignItems="center" fontWeight="bold"
          sx={{
            fontSize: fontSize, color: "rgba(0, 0, 255, 0.9)",
            textShadow: "0.1px 0.1px 0.1px white, 0 0 1em white, 0 0 0.2em white"
          }}>

          {count}%
        </Typography>

      </div>
    </Box>

  );
};
export const CircularLoadingCyan2 = ({ count, size }) => {



  const Estilo =
  {
    'Loading':
    {
      position: 'relative',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: '50%',
      textAlign: 'center',
      fontSize: '300%',
      lineHeight: '12rem',
      color: 'rgba(15, 178, 242,0.9)',
      boxShadow: '0 0 20rem rgba(0,0,0,.5)',


    },


  };
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      margin: "1rem",
      width: "auto", //4rem
      height: "auto", //4rem
      //backgroundColor: 'red',

    }}
    >
      <div class="LoadingCyan2" style={Estilo.Loading} >
        <Typography m={1} p={1} justifyContent="center" align="center" alignItems="center" fontWeight="bold"
          sx={{
            fontSize: "100%", color: "white",
            textShadow: "1px 1px 2px black, 0 0 1em black, 0 0 0.2em black"
          }}>

          {count}%
        </Typography>

      </div>
    </Box>

  );
};

export const CircularLoading = ({ value, label, magnitudInf, colorGauge }) => {

  //NUEVO sin use styles
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
      <div style={{ position: 'relative' }}>
        <CircularProgress variant="determinate" value={100} size={90} thickness={2} style={{ color: colorGauge }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'center', width: "100%" }} columnSpacing={0} rowSpacing={0} columns={12}>
            <Grid xs={6} sm={6} md={6} lg={6} xl={6}   >
              <Typography fontFamily="Poppins"  fontWeight={ '700'} fontSize={{ xs: 17, sm: 17, md: 14, lg: 17, xl: 17 }}>
                {parseInt(value)}
              </Typography>
            </Grid>
            <Grid xs={6} sm={6} md={6} lg={6} xl={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography fontFamily="Poppins" fontSize={{ xs: 17, sm: 17, md: 14, lg: 17, xl: 17}} style={{ position: 'absolute', left: '120%', }}>
                {magnitudInf}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '700', textAlign: 'center' }}>
          {label}
        </Typography>
      </div>
    </div>
  );
}; 