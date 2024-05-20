import * as React from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSnackbarStore } from '../global-store/store'

export default function SnackbarComp() {
  const { open, content, type, setOpen } = useSnackbarStore()

  // const handleClick = () => {
  //   setOpen(true)
  // }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen({ open: false, content, type })
  }

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {content}
        </Alert>
      </Snackbar>
    </div>
  )
}
