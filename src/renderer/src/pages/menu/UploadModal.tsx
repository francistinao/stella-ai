/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */

import React, { useState, Dispatch, DragEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'
import { FaRegImage } from 'react-icons/fa6'
import { toast, Toaster } from 'sonner'
import { HiCubeTransparent } from 'react-icons/hi2'
import { ChangeEvent } from 'react'
import { LoadingModal } from '@/components/system/mini'
import { useLoadingImage, useStoredImages } from '@/store/stored_images'
import { StoredImagesState } from '@/types/global'
import { byteConverter } from '@/utils/byteConverter'
import placeholder from '@/assets/vector.png'
import truncateFileName from '@/utils/truncateFileName'
import dicomParser from 'dicom-parser'

interface UploadModalProps {
  isUpload: boolean
  setIsUpload: Dispatch<React.SetStateAction<boolean>>
}

const UploadModal: React.FC<UploadModalProps> = ({ isUpload, setIsUpload }) => {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const { isImageUploadLoading, setIsImageUploadLoading } = useLoadingImage()
  const { setImages } = useStoredImages()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragOver, setDragOver] = useState<boolean>(false)
  const fileInput = React.createRef<HTMLInputElement>()

  const closeModal = () => {
    setIsUpload(false)
  }

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => {
    setDragOver(false)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)

    droppedFiles.forEach((droppedFile: any) => {
      //uncomment later
      //const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase()

      handleFileRead(droppedFile)

      /**
       * 
      if (allowedFiles.includes(fileExtension as string)) {
      } else {
        toast.error('Invalid file format. Please upload a DICOM file only.')
        console.error('Invalid file format. Please upload a DICOM file.')
      }
       */
    })
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    selectedFiles.forEach((file: File) => {
      //const fileExtension = file.name.split('.').pop()?.toLowerCase()

      handleFileRead(file)
      /**
       * 
       * 
      if (allowedFiles.includes(fileExtension as string)) {
      } else {
        toast.error('Invalid file format. Please upload a DICOM file only.')
        console.error('Invalid file format. Please upload a DICOM file.')
      }
       */
    })
  }

  const handleFileRead = (file: File) => {
    setSelectedFiles((prevFiles) => [...prevFiles, file])

    //eslint-disable-next-line
    //@ts-ignore
    const filesArray: StoredImagesState[] = Array.from(selectedFiles).map((file: File, idx) => ({
      image_id: idx,
      imageName: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModified,
      path: file.path,
      imageData: file.arrayBuffer(),
      imageTimeframe: ''
    }))

    //eslint-disable-next-line
    //@ts-ignore
    setImages!(filesArray)
  }

  function toBase64File(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleUploadImage = async () => {
    try {
      if (selectedFiles.length === 0) {
        toast.error('Please upload CT Scans images before uploading.')
        return
      }

      setIsImageUploadLoading(true)

      const processedImages = await Promise.all(
        selectedFiles.map(async (file, idx) => {
          const fileExtension = file.name.split('.').pop()?.toLowerCase()
          let imageData

          if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png') {
            try {
              const pngData = await convertDicom(file)
              imageData = pngData[0]
            } catch (error) {
              console.error('Error converting DICOM file:', error)
              return null
            }
          } else {
            imageData = await toBase64File(file)
          }

          return { image_id: idx, name: file.name, data: imageData }
        })
      )

      const validImages = processedImages.filter(
        (img): img is { image_id: number; name: string; data: string } => img !== null
      )

      const dateAndTime = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      const storedImagesJSON = localStorage.getItem('images')
      const storedImages = storedImagesJSON ? JSON.parse(storedImagesJSON) : {}

      storedImages[dateAndTime] = validImages.map((img) => ({
        image_id: img.image_id,
        name: img.name,
        data: img.data
      }))

      localStorage.setItem('images', JSON.stringify(storedImages))

      setTimeout(() => {
        navigate('/system')
      }, 5000)
    } catch (err) {
      console.error(err)
      setIsImageUploadLoading(false)
      toast.error('Failed to upload the image. Please try again.')
    }
  }

  const removeSpecificFile = (name: string) => {
    const newFiles = selectedFiles.filter((file) => file.name !== name)
    setSelectedFiles(newFiles)
    //eslint-disable-next-line
    //@ts-ignore
    const filesArray: StoredImagesState[] = newFiles.map((file: File, idx) => ({
      image_id: idx,
      imageName: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModified,
      path: file.path,
      imageData: file.arrayBuffer(),
      imageTimeframe: ''
    }))
    //eslint-disable-next-line
    //@ts-ignore
    setImages!(filesArray)
  }

  const convertDicom = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          const byteArray = new Uint8Array(e.target.result)

          try {
            const dataSet = dicomParser.parseDicom(byteArray)
            const transferSyntaxUID = dataSet.string('x00020010')
            const isCompressed = ![
              '1.2.840.10008.1.2',
              '1.2.840.10008.1.2.1',
              '1.2.840.10008.1.2.2'
            ].includes(transferSyntaxUID as string)

            // compressed DICOM P10 FILE
            if (isCompressed) {
              setSelectedFiles((prevFiles) =>
                prevFiles.filter(
                  (file) => file.name !== selectedFiles[selectedFiles.length - 1].name
                )
              )
              toast.error('Cannot handle compressed DICOM P10 File. Please decompress it first.')
              throw new Error('Cannot handle compress DICOM P10 file')
              return
            } else {
              //uncompressed DICOM image
              const pixelDataElement = dataSet.elements.x7fe00010
              if (!pixelDataElement) {
                throw new Error('Pixel data not found in the file.')
              }

              const rows = dataSet.uint16('x00280010')
              const cols = dataSet.uint16('x00280011')
              const pixelRepresentation = dataSet.uint16('x00280103') || 0

              if (typeof rows !== 'number' || typeof cols !== 'number') {
                throw new Error('Rows and columns must be defined.')
              }

              const pixelData = new Uint8Array(
                dataSet.byteArray.buffer,
                pixelDataElement.dataOffset,
                pixelDataElement.length
              )

              const windowCenter = dataSet.intString('x00281050')
              const windowWidth = dataSet.intString('x00281051')

              const canvasImageData = new Uint8Array(rows * cols * 4)

              for (let i = 0; i < rows * cols; i++) {
                let value
                if (pixelRepresentation === 0) {
                  value = pixelData[i * 2] | (pixelData[i * 2 + 1] << 8)
                } else {
                  value = pixelData[i * 2] | (pixelData[i * 2 + 1] << 8)
                }

                let pixelValueNormalized
                if (windowCenter !== undefined && windowWidth !== undefined) {
                  const wc =
                    typeof windowCenter === 'string' ? parseInt(windowCenter, 10) : windowCenter
                  const ww =
                    typeof windowWidth === 'string' ? parseInt(windowWidth, 10) : windowWidth

                  const min = wc - ww / 2
                  const max = wc + ww / 2
                  pixelValueNormalized = ((value - min) / (max - min)) * 255
                } else {
                  const minPixelValue = Math.min(...pixelData)
                  const maxPixelValue = Math.max(...pixelData)
                  pixelValueNormalized =
                    ((value - minPixelValue) / (maxPixelValue - minPixelValue)) * 255
                }

                pixelValueNormalized = Math.max(0, Math.min(255, pixelValueNormalized))

                const idx = i * 4
                canvasImageData[idx] = pixelValueNormalized
                canvasImageData[idx + 1] = pixelValueNormalized
                canvasImageData[idx + 2] = pixelValueNormalized
                canvasImageData[idx + 3] = 255
              }

              const canvas = document.createElement('canvas')
              canvas.width = cols
              canvas.height = rows
              const ctx = canvas.getContext('2d')
              if (ctx) {
                const imageData = ctx.createImageData(cols, rows)
                imageData.data.set(canvasImageData)
                ctx.putImageData(imageData, 0, 0)

                const base64Jpeg = canvas.toDataURL('image/jpeg', 1.0)
                resolve([base64Jpeg])
              } else {
                throw new Error('Could not create 2D context for JPEG encoding.')
              }
            }
          } catch (error) {
            console.error('DICOM conversion error:', error)
            reject(error)
          }
        } else {
          reject(new Error('Failed to read file as ArrayBuffer.'))
        }
      }

      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  /**
    

  const convertDicom = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          try {
            const byteArray = new Uint8Array(e.target.result)

            let jpegStartIndex = -1
            for (let i = 0; i < byteArray.length - 1; i++) {
              if (byteArray[i] === 0xff && byteArray[i + 1] === 0xd8) {
                jpegStartIndex = i
                break
              }
            }

            if (jpegStartIndex === -1) {
              throw new Error('JPEG start marker not found in file')
            }

            let jpegEndIndex = -1
            for (let i = jpegStartIndex; i < byteArray.length - 1; i++) {
              if (byteArray[i] === 0xff && byteArray[i + 1] === 0xd9) {
                jpegEndIndex = i + 2
                break
              }
            }

            if (jpegEndIndex === -1) {
              throw new Error('JPEG end marker not found in file')
            }

            const jpegData = byteArray.slice(jpegStartIndex, jpegEndIndex)
            const blob = new Blob([jpegData], { type: 'image/jpeg' })

            const url = URL.createObjectURL(blob)

            const img = new Image()
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d')
              if (!ctx) {
                throw new Error('Failed to get canvas context')
              }

              ctx.drawImage(img, 0, 0)

              const dataUrl = canvas.toDataURL('image/png')

              URL.revokeObjectURL(url)

              resolve([dataUrl])
            }
            img.onerror = () => {
              URL.revokeObjectURL(url)
              reject(new Error('Failed to load image data'))
            }
            img.src = url
          } catch (error) {
            console.error('DICOM processing error:', error)
            reject(error)
          }
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }
   */

  useEffect(() => {
    const processFiles = async () => {
      //eslint-disable-next-line
      //@ts-ignore
      const filesArray: (StoredImagesState | null)[] = await Promise.all(
        selectedFiles.map(async (file: File) => {
          const fileExtension = file.name.split('.').pop()?.toLowerCase()
          if (fileExtension === 'dcm' || fileExtension === 'dicom') {
            try {
              const base64Data = await convertDicom(file)
              const binaryString = atob(base64Data[0].split(',')[1])
              const len = binaryString.length
              const bytes = new Uint8Array(len)
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              return {
                name: file.name,
                imageName: file.name,
                size: file.size,
                type: 'image/png',
                lastModified: file.lastModified,
                lastModifiedDate: new Date(file.lastModified),
                path: file.path || '',
                imageData: bytes.buffer,
                imageTimeframe: ''
              }
            } catch (error) {
              console.error('Error converting DICOM file:', error)
              return null
            }
          } else {
            const arrayBuffer = await file.arrayBuffer()
            return {
              name: file.name,
              imageName: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              lastModifiedDate: new Date(file.lastModified),
              path: file.path || '',
              imageData: arrayBuffer,
              imageTimeframe: ''
            }
          }
        })
      )

      const validFiles = filesArray.filter(
        (file): file is StoredImagesState => file !== null && 'name' in file
      )
      setImages!(
        validFiles.map((file, idx) => ({
          ...file,
          image_id: idx,
          name: file.path?.split('/').pop() || ''
        }))
      )
    }

    processFiles()
  }, [selectedFiles, setImages])

  return (
    <AnimatePresence>
      {isUpload && (
        <div
          // onClick={handleCloseModal}
          // ref={createModal}
          className={`font-main fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
          <Toaster position="bottom-right" />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              ease: [0, 0.71, 0.2, 0]
            }}
            className={`p-10 flex flex-col gap-2 absolute z-10 left-62 top-42 bg-blend-overlay shadow-2xl rounded-lg border ${theme === 'dark' ? 'bg-white text-dark border-dirty' : 'bg-dark text-white border-zinc-500'}`}
          >
            <div className="flex justify-between gap-96 items-center">
              <h1 className="text-2xl font-bold text-dark_g">Upload CT Scan</h1>
              <button>
                <IoMdClose size={24} onClick={closeModal} />
              </button>
            </div>
            <p className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-regular`}>
              Upload raw CT Scan Images with{' '}
              <span className="font-bold italic">DICOM, JPG, or PNG</span> format
            </p>
            <span className="text-sm">DICOM must be in P10 format and must not be compressed.</span>
            <div className="my-5 grid grid-cols-8 gap-8 items-start">
              <div
                className={`col-span-4 relative text-center w-full ${isDragOver ? 'dragover' : ''}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <label
                  htmlFor="file"
                  className={`relative cursor-pointer p-10 flex flex-col items-center justify-center border-3 rounded-lg ${theme === 'dark' ? 'bg-zinc-300 border-zinc-600' : 'bg-gray_l'}`}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FaRegImage size={170} color={`${theme === 'dark' ? '#191919' : '#EFEFEF'}`} />
                  <input
                    type="file"
                    name="file"
                    ref={fileInput}
                    className="opacity-0 text-xs pointer-events-none"
                    id="file"
                    onChange={handleFileInputChange}
                    multiple
                  />
                  <div className="flex flex-col gap-1 justify-center">
                    <p className={`${theme === 'dark' ? 'text-dark_g' : 'text-white'} text-xs`}>
                      <span className="font-bold text-xl">Drag and drop images</span>
                    </p>
                    <div className="flex gap-2 items-center">
                      <div className="w-full h-[1px] bg-zinc-400" />
                      <p className={`${theme === 'dark' ? 'text-dark_g' : 'text-white'} text-xs`}>
                        or
                      </p>
                      <div className="w-full h-[1px] bg-zinc-400" />
                    </div>
                    <button
                      className={`px-5 py-2  rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light_g text-dark'}`}
                      onClick={() => fileInput.current?.click()}
                    >
                      Browse CT Scan Images
                    </button>
                  </div>
                </label>
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <h1
                  className={`${theme === 'dark' ? 'text-dark' : 'text-dirty'} font-bold text-2xl`}
                >
                  Selected Files
                </h1>
                {/* Map the files */}
                {/* 
                    TODO: The images must be in array since the user can upload multiple images

                    Change the temporary array to the array of objects later
                  */}
                <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2">
                  {selectedFiles?.map((image, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center gap-4 p-4 rounded-lg border ${theme === 'dark' ? 'bg-zinc-300 border-zinc-600' : 'bg-gray_l border-gray_d'}`}
                    >
                      <div className="flex gap-4 items-center">
                        {/* Need to solve thumbnail because it wont display */}
                        <img
                          src={placeholder}
                          alt={image.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex flex-col gap-1">
                          <p
                            className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-semibold`}
                          >
                            {truncateFileName(image!.name)}
                          </p>
                          <p
                            className={`${theme === 'dark' ? 'text-dark_g' : 'text-white'} text-xs`}
                          >
                            {byteConverter(image.size)}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeSpecificFile(image.name)}>
                        <IoMdClose size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                {isImageUploadLoading && (
                  <div className="flex justify-left w-full">
                    <LoadingModal />
                  </div>
                )}
                {/* Segmentate button */}
                <button
                  onClick={handleUploadImage}
                  className={`flex justify-center gap-4 items-center bg-light text-dark font-semibold py-2 rounded-full w-full text-center text-sm ${selectedFiles && 'relative top-5'}`}
                >
                  <HiCubeTransparent size={24} className="rotate-45" />
                  Segmentate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UploadModal
