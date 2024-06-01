import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  text?: string
  children: JSX.Element
}

export default function FormModal({
  open,
  setOpen,
  title,
  text,
  children,
}: Props) {
  //   const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle className="font-josefin">{title}</DialogTitle>
        <DialogContent>
          {text && <DialogContentText mb={'4'}>{text}</DialogContentText>}
          {children}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  )
}
