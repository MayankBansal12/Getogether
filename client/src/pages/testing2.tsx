import React, { useEffect, useState } from 'react'
import useAlert from '../hooks/use-alert'

type Props = {}

const Testing2 = (props: Props) => {
  const [setAlert, closeAlert] = useAlert()

  const handle = () => {
    setAlert({
      open: true,
      title: 'Hello Sakshi',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde necessitatibus repellendus veniam recusandae aspernatur adipisci quo nihil distinctio minima asperiores!',
      primaryButton: 'Ok',
      secondaryButton: 'not Ok',
      primaryAction: () => {
        closeAlert
      },
      secondaryAction: () => {},
      noSecondaryButton: true,
    })
  }

  // const [first, setfirst] = useState(true)

  // useEffect(() => {
  //   if (first) {
  //     setAlert({ open: true })
  //   } else {
  //     closeAlert()
  //   }
  // }, [first])

  return (
    <div className="p-10">
      <button onClick={handle}>Show</button>
    </div>
  )
}

export default Testing2
