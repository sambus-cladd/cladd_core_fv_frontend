import {  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

export default function MensajeDialogConfirm({ open, mensaje, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 600 }} >
        Validacion de Lote
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ fontFamily: "Poppins" }}>
          {mensaje}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button variant="outlined" color="error" onClick={onCancel} sx={{ fontFamily: "Poppins" }} >
          Cancelar
        </Button>

        <Button variant="contained" color="primary" onClick={onConfirm} sx={{ fontFamily: "Poppins" }} >
          Continuar igual
        </Button>
      </DialogActions>
    </Dialog>
  );
}
