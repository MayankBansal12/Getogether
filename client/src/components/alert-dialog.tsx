import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useAlertStore } from '../global-store/store'

export default function AlertDialog() {
  const {
    open,
    primaryAction,
    secondaryAction,
    primaryButton,
    noSecondaryButton,
    secondaryButton,
    text,
    title,
  } = useAlertStore((state) => state)

  return (
    <React.Fragment>
      <Dialog
        open={open}
        //onClose={secondaryAction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!noSecondaryButton && (
            <Button onClick={secondaryAction}>{secondaryButton}</Button>
          )}
          <Button onClick={primaryAction} autoFocus>
            {primaryButton}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
