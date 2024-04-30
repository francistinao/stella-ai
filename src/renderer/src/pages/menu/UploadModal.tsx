/* eslint-disable prettier/prettier */
import React, { useState, Dispatch } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'

interface UploadModalProps {
  isUpload: boolean
  setIsUpload: Dispatch<React.SetStateAction<boolean>>
}

const UploadModal: React.FC<UploadModalProps> = ({ isUpload, setIsUpload }) => {
  const { theme } = useThemeStore()
  const closeModal = () => {
    setIsUpload(false)
  }

  return (
    <AnimatePresence>
      {isUpload && (
        <div
          // onClick={handleCloseModal}
          // ref={createModal}
          className={`font-main fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UploadModal
