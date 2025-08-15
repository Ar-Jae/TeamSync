import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDialog({ open, title = 'Confirm', message, onCancel, onConfirm }) {
  return (
    <Dialog
      open={!!open}
      onClose={onCancel}
      aria-labelledby="confirm-title"
      TransitionComponent={Transition}
    >
      <DialogTitle id="confirm-title">{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
