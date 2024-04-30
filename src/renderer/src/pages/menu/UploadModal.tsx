/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, Dispatch } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'
import { FaRegImage } from 'react-icons/fa6'
import { toast, Toaster } from 'sonner'

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
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [isDragOver, setDragOver] = useState<boolean>(false)
  const [dataOfFile, setDataOfFile] = useState<File | null>(null)
  const fileInput = React.createRef<HTMLInputElement>()
  const allowedFiles = ['dcm']

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

    droppedFiles.forEach((droppedFile) => {
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase()

      if (allowedFiles.includes(fileExtension as string)) {
        handleFileRead(droppedFile)
      } else {
        throw new Error('Invalid file format. Please upload a DICOM file only.')
        // toast.error(
        //   'Invalid file format. Please upload a DICOM file only.'
        // )
        // console.error('Invalid file format. Please upload a DICOM file.')
      }
    })
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()

      if (allowedFiles.includes(fileExtension as string)) {
        handleFileRead(selectedFile)
      } else {
        toast.error('Invalid file format. Please upload a DICOM file only.')
        console.error('Invalid file format. Please upload a DICOM file.')
      }
    }
  }

  const handleFileRead = (file: File) => {
    setDataOfFile(file)
    setSelectedFileName(file.name)
  }

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
              <h1 className="text-2xl font-bold text-dark_g">Upload DICOM Files</h1>
              <button>
                <IoMdClose size={24} onClick={closeModal} />
              </button>
            </div>
            <p className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-regular`}>
              Upload raw CT Scan Images with <span className="font-bold italic">DICOM</span> format
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
                      {selectedFileName ? (
                        <span className="font-bold text-xl">{selectedFileName}</span>
                      ) : (
                        <span className="font-bold text-xl">Drag and drop images</span>
                      )}
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
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UploadModal
