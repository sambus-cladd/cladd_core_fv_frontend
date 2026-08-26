import React from 'react';
import { Card } from '@mui/material';

const CardAlpa = ({ children, ...props }) => {
  return (
    <Card
      sx={{
        minWidth: '100%',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(26, 72, 98, 0.08)',
        border: '1px solid rgba(26, 72, 98, 0.06)',
        paddingTop: 0,
        marginTop: '20px',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CardAlpa;
