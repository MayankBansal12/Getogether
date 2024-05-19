import React from 'react'
import Button from '../components/button'

const Home = () => {
  const handleClick = () => {
    console.log('login')
  }
  return (
    <div className="container w-full flex-row py-20 px-4 md:px-20 justify-center items-center font-josefin">
      <p className="text-7xl md:text-9xl font-title font-black text-center py-10">
        <span>YAY!! IT’S </span>
        <span className="font-bold bg-gradient-to-b from-primary-light to-accent-light text-transparent bg-clip-text">
          PARTY TIME
        </span>{' '}
        <span className="text-4xl md:text-7xl">🤩</span>
      </p>
      <p className="text-2xl font-medium text-center w-full">
        <span>Throwing a huge party but worried about how to organize it?</span>
        <br />
        <span>Then we got you covered :)</span>
        <br />
        <Button onClick={handleClick} children={'Login'} />
      </p>
    </div>
  )
}

export default Home
