import React, { useState } from 'react'
import convertBase64 from '../services/helper'

type Props = {}

interface ImageEvent {
  target: {
    image: HTMLInputElement
  }
}

const Test = (props: Props) => {
  const [ImgUrl, setImgUrl] = useState('')

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> & ImageEvent,
  ) => {
    e.preventDefault()
    try {
      const img = await convertBase64(e.target.image.files[0])
      const res = await fetch('http://localhost:5000/image/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ image: img }),
      })
      const data = await res.json()
      setImgUrl(data.imageUrl)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      <h1>Test</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="image" accept="image/*" id="image" />
        <button type="submit">Send</button>
      </form>

      <img src={ImgUrl} alt="Image" className="w-9 h-9" />
    </div>
  )
}

export default Test
