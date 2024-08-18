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
// import { urlBuffer } from '@/utils/urlBuffer'
import { byteConverter } from '@/utils/byteConverter'
import placeholder from '@/assets/vector.png'
import truncateFileName from '@/utils/truncateFileName'

/** 
   * TODO: The images must be in array since the user can upload multiple images
   * 
   * @param isUpload, setIsUpload
   * 
   * Once the user uploads the images, the images will be stored in the array, and convert it into an array objects
   * followed by these properties:
   * 
   *   imageName: string
       imageData: BinaryData
      imageTimeframe: string
      setImageName: (imageName: string) => void
      setImage: (imageData: BinaryData) => void
  *  
    After that, the images will be persisted in the local storage, and the user can view the images in the dashboard.
  * @returns UploadModal
  */

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
  const allowedFiles = ['dcm', 'dicom', 'jpg', 'jpeg', 'png']

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
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase()

      if (allowedFiles.includes(fileExtension as string)) {
        handleFileRead(droppedFile)
      } else {
        toast.error('Invalid file format. Please upload a DICOM file only.')
        console.error('Invalid file format. Please upload a DICOM file.')
      }
    })
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    selectedFiles.forEach((file: File) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

      if (allowedFiles.includes(fileExtension as string)) {
        handleFileRead(file)
      } else {
        toast.error('Invalid file format. Please upload a DICOM file only.')
        console.error('Invalid file format. Please upload a DICOM file.')
      }
    })
  }

  const handleFileRead = (file: File) => {
    setSelectedFiles((prevFiles) => [...prevFiles, file])

    //eslint-disable-next-line
    //@ts-ignore
    const filesArray: StoredImagesState[] = Array.from(selectedFiles).map((file: File) => ({
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

      const dateAndTime = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      const tempImages = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64Image = await toBase64File(file)
          //-file-name is the flag for splitting
          return (base64Image + '-file-name-' + file.name) as string
        })
      )

      const storedImagesJSON = localStorage.getItem('images')
      const storedImages = storedImagesJSON ? JSON.parse(storedImagesJSON) : {}

      storedImages[dateAndTime] = tempImages
      localStorage.setItem('images', JSON.stringify(storedImages))

      setTimeout(() => {
        navigate('/system')
      }, 5000)
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload the image. Please try again.')
    }
  }

  const removeSpecificFile = (name: string) => {
    const newFiles = selectedFiles.filter((file) => file.name !== name)
    setSelectedFiles(newFiles)
    //eslint-disable-next-line
    //@ts-ignore
    const filesArray: StoredImagesState[] = newFiles.map((file: File) => ({
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

  useEffect(() => {
    //eslint-disable-next-line
    //@ts-ignore
    const filesArray: StoredImagesState[] = selectedFiles.map((file: File) => ({
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
            className={`p-10 flex flex-col gap-4 absolute z-10 left-62 top-42 bg-blend-overlay shadow-2xl rounded-lg border ${theme === 'dark' ? 'bg-white text-dark border-dirty' : 'bg-dark text-white border-zinc-500'}`}
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
