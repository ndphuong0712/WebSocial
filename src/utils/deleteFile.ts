import fs from 'fs'

const deleteFile = (filePath: string | string[]) => {
  if (Array.isArray(filePath)) {
    return Promise.all(filePath.map(path => funcDeleteFile(path)))
  }
  return funcDeleteFile(filePath)
}

const funcDeleteFile = (path: string) => {
  if (fs.existsSync(path)) {
    return fs.promises.unlink(path)
  }
}

export default deleteFile
