/* eslint-disable prettier/prettier */
const truncateFileName = (fileName: string, maxLength = 9): string => {
  const extensionIndex = fileName.lastIndexOf('.')
  if (extensionIndex === -1) return fileName

  const namePart = fileName.substring(0, extensionIndex)
  const extensionPart = fileName.substring(extensionIndex)

  if (namePart.length > maxLength) {
    return namePart.substring(0, maxLength) + '...' + extensionPart
  }

  return fileName
}

export default truncateFileName
