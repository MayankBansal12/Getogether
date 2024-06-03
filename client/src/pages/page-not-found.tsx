import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/button';

type Props = {}

const PageNotFound = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center gap-4 py-10 w-full h-screen font-josefin">
      <div className="font-title text-3xl md:text-5xl">
        Get
        <span className="text-primary-light">ogether.</span>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 p-4 rounded-lg">
        404 #NOT FOUND! Oh dear! Looks like you are lost!
      </div>
      <div className="flex justify-center gap-2 items-center my-4 w-full">
        <Button
          onClick={() => {
            navigate('/')
          }}
          children={'Back To Home Page'}
        />
        <Button
          onClick={() => {
            navigate('/allEvents')
          }}
          children={'Go to All Events'}
        />
      </div>
    </div>
  )
}

export default PageNotFound
