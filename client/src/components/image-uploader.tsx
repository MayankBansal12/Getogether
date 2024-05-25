import React, { useState } from 'react'
import ImageHelper from '../services/image'

interface Props {
  label?: string
  name?: string
}

/**
 * @param param0.name => string by default 'image', this is the name you will use to access e.target.image.files[0] while uploading
 * @param param0.lable => Label to be showed inside upload
 */
const ImageUploader = ({
  name = 'image',
  label = 'Upload a profile pic',
}: Props) => {
  const [state, setState] = useState<string | null>(null)
  return (
    <>
      {state ? (
        <label
          htmlFor="image"
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <img src={state} className="w-14 h-14" alt="demo" />
          <p className="font-bold text-primary-light text-sm">Change Image</p>
        </label>
      ) : (
        <label
          htmlFor="image"
          className="flex justify-center items-center border-4 border-slate-400 mb-2 p-4 border-dashed w-28 h-28 cursor-pointer"
        >
          {label}
        </label>
      )}
      <input
        type="file"
        name={name}
        accept="image/*"
        id="image"
        onChange={(e) => setState(ImageHelper.GetUrl(e))}
        className="hidden"
      />
    </>
  )
}

export default ImageUploader
