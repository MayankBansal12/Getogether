import { v2 as cloudinary } from 'cloudinary'
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

const UploadImg = async (image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, async (error, result) => {
      if (result && result.secure_url) {
        resolve(result.secure_url)
      } else {
        console.log('==upload-image-cloudinary==\n', error)
        //   Always resolve kar de raha
        resolve(
          'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
        )
        //   reject('');
      }
    })
  })
}

export default UploadImg
