import { FileType } from '@constants/enum'
import FileAttachmentType from '@models/fileAttachment'
import { uploadFileToCloudinary } from '@utils/cloudinary'
import deleteFile from '@utils/deleteFile'

const mediaService = {
  async handleUploadOneFileToCloudiary(file: Express.Multer.File): Promise<FileAttachmentType> {
    let type = FileType.All
    if (file.mimetype.startsWith('image')) type = FileType.Image
    else if (file.mimetype.startsWith('video')) type = FileType.Video
    const { id, url } = await uploadFileToCloudinary({
      filePath: file.path,
      isImage: type === FileType.Image ? true : false
    })
    await deleteFile(file.path)
    return { url, id, type }
  },
  async handleUploadMultipleFilesToCloudinary(files: Express.Multer.File[]): Promise<FileAttachmentType[]> {
    return Promise.all(files.map(file => this.handleUploadOneFileToCloudiary(file)))
  }
}

export default mediaService
