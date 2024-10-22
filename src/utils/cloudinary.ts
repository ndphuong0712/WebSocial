import ENV from '@constants/env'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET
})

const uploadFileToCloudinary = async ({ filePath, isImage = true }: { filePath: string; isImage?: boolean }) => {
  const formatImage = isImage ? { format: 'jpg', quality: 'auto' } : {}
  const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, {
    folder: 'WebSocial',
    resource_type: 'auto',
    ...formatImage
  })
  return { url: secure_url, id: public_id }
}

const deleteCloudinaryFile = (id: string) => cloudinary.uploader.destroy(id)

export { uploadFileToCloudinary, deleteCloudinaryFile }
