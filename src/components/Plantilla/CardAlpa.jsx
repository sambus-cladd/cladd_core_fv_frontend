import React from 'react';
import { Card } from '@mui/material';

const CardAlpa = ({ children, ...props }) => {
  return (
    <Card
      sx={{
        minWidth: '100%',
        borderRadius: '10px',
        boxShadow: '1px 1px 2px 3px rgba(0, 0, 0, 0.4)',
        paddingTop: 0,
        marginTop: '20px',
        ...props.sx, // Permite la sobreescritura del estilo
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CardAlpa;
