import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function Toast({ open, onClose, severity = 'info', children, autoHideDuration = 3000 }) {
  return (
    <Snackbar open={!!open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  );
}
