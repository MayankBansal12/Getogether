import { Router } from 'express'
import { v2 as cloudinary } from 'cloudinary'

import authMiddleware from '../middlewares/user-middleware'
import { AuthReqType } from '../types/req'

const router = Router()

interface ImageReqType {
  body: {
    image: string
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: 'image' as 'image' | 'video' | 'raw' | 'auto',
}

router.post(
  '/upload-image',
  authMiddleware,
  async (req: AuthReqType & ImageReqType, res) => {
    const imgPath = req.body.image

    try {
      cloudinary.uploader.upload(imgPath, opts, async (error, result) => {
        if (result && result.secure_url) {
          const imageDetails = {
            name: result.original_filename,
            link: result.secure_url,
          }

          // Implement uploading link to user's database
          //   const user = await User.findOne({ id: decoded.id })

          // USERS[decoded.id].images.push(imageDetails) ;
          // console.log(USERS[decoded.id].images) ;

          //   user.images.push(imageDetails)
          //   await user.save()

          return res.status(200).json({ imageUrl: result.secure_url })
        } else {
          console.log(error)
          console.log('==upload-image-cloudinary==\n', error)
          res.send(500).json({ error: 'unsuccessfull' })
        }
      })
    } catch (error) {
      console.log('==upload-image==\n', error)
      res.status(500).json({ error: 'Failed to upload image' })
    }
  },
)

export default router
