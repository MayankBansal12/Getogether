import { useEffect, useState } from 'react'
import { SnackbarStoreDataType, useSnackbarStore } from '../global-store/store'

const useSnackbar = () => {
  const setOpenSnackbar = useSnackbarStore((state) => state.setOpen)
  return setOpenSnackbar
}

export default useSnackbar
