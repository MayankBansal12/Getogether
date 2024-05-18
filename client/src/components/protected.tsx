import React, { useEffect, useState } from 'react'
import Loader from './loader'
import User from '../services/user'
import { useLocation, useNavigate } from 'react-router-dom'
import useAlert from '../hooks/use-alert'

type Props = {
  children: JSX.Element
}

const Protected = ({ children }: Props) => {
  const [Loading, setLoading] = useState(true)
  const [setAlert, closeAlert] = useAlert()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const checkLogin = async () => {
    try {
      const loggedIn = await User.IsLoggedIn()
      if (!loggedIn) {
        setAlert({
          open: true,
          title: 'Login Required',
          text: 'You need to login to access this page',
          primaryButton: 'Login',
          primaryAction: () => {
            navigate(`/auth/login?redirect=${pathname}`)
            closeAlert()
          },
          noSecondaryButton: true,
        })
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  if (Loading) return <Loader />

  return <>{children}</>
}

export default Protected
