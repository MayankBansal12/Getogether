import React from 'react'

type Props = {}

const Test = (props: Props) => {
  console.log('rendered')
  const online = navigator.onLine

  if (!online) return <div>Offline</div>

  return <div>Online</div>
}

export default Test
