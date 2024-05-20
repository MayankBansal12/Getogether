import { create } from 'zustand'
import { UserType } from '../global-types/model'

type UserStoreType = {
  user: UserType | null
  setUser: (user: UserType) => void
}

interface AlertStoreDataType {
  title: string
  text: string
  noSecondaryButton: boolean
  primaryButton: string
  secondaryButton: string
  primaryAction: () => void
  secondaryAction: () => void
}
export interface AlertStoreType extends AlertStoreDataType {
  open: boolean
  setAlertStore: (alert: AlertStoreDataType) => void
  setOpen: (open: boolean) => void
}

export interface SnackbarStoreDataType {
  open: boolean
  content: string
  type: 'success' | 'error' | 'warning' | 'info'
}
export interface SnackbarStoreType extends SnackbarStoreDataType {
  setOpen: (open: SnackbarStoreDataType) => void
}

// User Data Store
const useUserStore = create<UserStoreType>()((set) => ({
  user: null,
  setUser: (state: UserType) => set({ user: state }),
}))

// Alert Store
const useAlertStore = create<AlertStoreType>((set) => ({
  open: false,
  title: '',
  text: '',
  noSecondaryButton: false,
  primaryButton: 'Confirm',
  secondaryButton: 'Cancel',
  primaryAction: () => {},
  secondaryAction: () => {},
  // A function that sets all the values except open
  setAlertStore: (alert: AlertStoreType) => set(alert),
  setOpen: (open: boolean) => set({ open }),
}))

// Snackbar Store
const useSnackbarStore = create<SnackbarStoreType>((set) => ({
  open: false,
  content: '',
  type: 'success',
  setOpen: (state: SnackbarStoreDataType) =>
    set({ open: state.open, content: state.content, type: state.type }),
}))

export { useUserStore, useAlertStore, useSnackbarStore }
