import React, { useEffect } from 'react'

const useOnline = () => {
  const [online, setOnline] = React.useState(navigator.onLine)
  const handleOnline = () => setOnline(navigator.onLine)
  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOnline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOnline)
    }
  })

  return online
}

export default useOnline
