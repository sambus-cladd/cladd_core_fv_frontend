import React from 'react';
import _ from 'lodash';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

export const CircularLoading = ({ count, size, color, unidad }) => {
  const estilo = {
    Loading: {
      position: 'relative',
      display: 'flex',
      width: size,
      height: size,
      borderRadius: '50%',
      lineHeight: '12rem',
      color: color,
      boxShadow: '0 0 20rem rgba(0,0,0,.5)',
    },
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        className="Loading"
        style={estilo.Loading}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: size - (size * 0.5),
            color: color,
            textShadow: '0.1px 0.1px 0.1px white, 0 0 1em white, 0 0 0.2em white',
          }}
        >
          {count}
        </Typography>
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: size - (size * 0.7),
            color: color,
            textShadow: '0.1px 0.1px 0.1px white, 0 0 1em white, 0 0 0.2em white',
          }}
        >
          {unidad}
        </Typography>
      </Box>
    </Box>
  );
};

const CircularLoad = ({ Color, Size, Numero, Titulo,Unidad }) => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: Size,
            height: Size,
            borderRadius: '50%',
            boxShadow: '0 0 1rem rgba(255,255,255,.5)',
          }}
        >
          <div
            style={{
              borderRadius: '50%',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderTop: `0.15rem solid ${Color}`,
              borderRight: `0.15rem solid ${Color}`,
              borderBottom: '0.15rem solid transparent',
              borderLeft: '0.15rem solid transparent',
              animation: 'animateC 2s linear infinite',
            }}
          />
          <CircularLoading count={Numero} size={Size} color={Color} unidad ={Unidad} />
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography fontWeight="bold"  sx={{ fontSize: Size - (Size * 0.65), color: Color, textAlign: 'center' }} >
          {Titulo}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CircularLoad;