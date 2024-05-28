import React from 'react'
import Button from '../components/button'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar/navbar'
const Home = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/auth/login')
  }
  return (
    <>
      <Navbar />
      <div className="flex-row justify-center items-center px-4 md:px-20 py-20 w-full font-josefin">
        <p className="py-10 font-black font-title text-7xl text-center md:text-9xl">
          <span>YAY!! IT’S </span>
          <span className="bg-clip-text bg-gradient-to-b from-primary-light to-accent-light font-bold text-transparent">
            PARTY TIME
          </span>{' '}
          <span className="text-4xl md:text-7xl">🤩</span>
        </p>
        <p className="w-full font-medium text-2xl text-center">
          <span>
            Throwing a huge party but worried about how to organize it?
          </span>
          <br />
          <span>Then we got you covered :)</span>
          <br />
          <Button onClick={handleClick} children={'Login'} />
        </p>
      </div>
    </>
  )
}

export default Home
