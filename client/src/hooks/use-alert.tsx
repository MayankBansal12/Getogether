import { useEffect, useState } from 'react'
import { useAlertStore } from '../global-store/store'

interface AlertStoreDataType {
  open: boolean
  title?: string
  text?: string
  noSecondaryButton?: boolean
  primaryButton?: string
  secondaryButton?: string
  primaryAction?: () => void
  secondaryAction?: () => void
}

const defaultAlert = {
  open: false,
  title: '',
  text: '',
  noSecondaryButton: false,
  primaryButton: 'Confirm',
  secondaryButton: 'Cancel',
  primaryAction: () => {},
  secondaryAction: () => {},
}

const useAlert = () => {
  const [Alert, setAlert] = useState<AlertStoreDataType>(defaultAlert)
  const setAlertStore = useAlertStore((state) => state.setAlertStore)
  const setOpen = useAlertStore((state) => state.setOpen)

  useEffect(() => {
    if (!Alert.open) return
    setOpen(Alert.open)
    setAlertStore({
      title: Alert?.title || defaultAlert.title,
      text: Alert?.text || defaultAlert.text,
      noSecondaryButton:
        Alert?.noSecondaryButton || defaultAlert.noSecondaryButton,
      primaryButton: Alert?.primaryButton || defaultAlert.primaryButton,
      secondaryButton: Alert?.secondaryButton || defaultAlert.secondaryButton,
      primaryAction: Alert?.primaryAction || defaultAlert.primaryAction,
      secondaryAction: Alert?.secondaryAction || defaultAlert.secondaryAction,
    })
  }, [Alert])

  const closeAlert = () => {
    setAlert(defaultAlert)
    setOpen(false)
  }

  return [setAlert, closeAlert] as const
}

export default useAlert
