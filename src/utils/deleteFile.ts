import fs from 'fs/promises'

const deleteFile = (filePath: string | string[]) => {
  if (Array.isArray(filePath)) {
    return Promise.all(filePath.map(path => fs.unlink(path)))
  }
  return fs.unlink(filePath)
}

export default deleteFile
