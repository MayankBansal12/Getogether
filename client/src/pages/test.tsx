import React, { useState } from 'react'
import ImageHelper from '../services/image'
import ImageUploader from '../components/image-uploader'

type Props = {}

interface ImageEvent {
  target: {
    image: HTMLInputElement
  }
}

const Test = (props: Props) => {
  const [ImgUrl, setImgUrl] = useState('')
  const BACKEND_URL = import.meta.env.VITE_SERVER || 'http://localhost:5000'

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> & ImageEvent,
  ) => {
    e.preventDefault()
    try {
      // Ayse convert karna hoga
      const img = await ImageHelper.ConvertBase64(e.target.image.files[0])
      const res = await fetch(`${BACKEND_URL}/image/upload-image`, {
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
      {/* encType likhna important hai */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <ImageUploader />
        <button type="submit">Send</button>
      </form>

      <img src={ImgUrl} alt="Image" className="w-9 h-9" />
    </div>
  )
}

export default Test
