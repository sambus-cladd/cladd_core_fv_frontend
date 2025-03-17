import React, { useState, useEffect } from 'react'
import { DialogTitle, Dialog } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const MensajeDialog = ({ mensaje, tipo, duracion, isOpen, onClose }) => {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpenDialog(true);
      const timer = setTimeout(() => {
        setOpenDialog(false);
        if (onClose) {
          onClose();  // Notifica al padre que se cerró el diálogo
        }
      }, duracion || 3000); // Duración por defecto de 3 segundos

      return () => clearTimeout(timer); // Limpia el temporizador
    }
  }, [isOpen, duracion]);

  return (
    <>
      <Dialog
        open={openDialog && tipo === 'success'}
        PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' }}}
      >
        <DialogTitle
          sx={{
            alignSelf: 'center',
            paddingBottom: 3,
            backgroundColor: '#00AC60',
            color: 'white',
            fontFamily: 'Poppins',
            fontWeight: '600',
            borderRadius: '12px',
          }}
        >
          <TaskAltIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
          {mensaje}
        </DialogTitle>
      </Dialog>

      <Dialog
        open={openDialog && tipo === 'error'}
        PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' }}}
      >
        <DialogTitle
          sx={{
            alignSelf: 'center',
            paddingBottom: 3,
            backgroundColor: '#e00000',
            color: 'white',
            fontFamily: 'Poppins',
            fontWeight: '600',
            borderRadius: '12px',
          }}
        >
          <CancelIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
          {mensaje}
        </DialogTitle>
      </Dialog>
    </>
  );
};

export default MensajeDialog;
