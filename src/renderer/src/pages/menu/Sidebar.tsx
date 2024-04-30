/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useThemeStore } from '@/store/theme'
import { IoMdAdd } from 'react-icons/io'
import { motion } from 'framer-motion'
import { UploadModal } from '@/pages/menu/menu'

interface Props {
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Sidebar: React.FC<Props> = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isUpload, setIsUpload] = useState(false)
  const { theme } = useThemeStore()

  return (
    <div className={`h-full w-full flex ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
      <UploadModal isUpload={isUpload} setIsUpload={setIsUpload} />
      <div className="pt-9 w-full">
        <div className="flex flex-col gap-4">
          <div className={`${theme === 'dark' ? 'bg-gray_l' : 'bg-dirty'} rounder-l-md`}>
            <h1
              className={`pl-8 pr-4 font-semibold py-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            >
              Home
            </h1>
          </div>
          <div className="px-4">
            <button
              onClick={() => setIsUpload(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full border rounded-full py-3 text-center flex items-center gap-4 text-xs justify-center ${theme === 'dark' ? 'border-white text-white' : 'border-dark text-dark'}`}
            >
              <motion.div
                animate={{
                  rotate: isHovered ? 90 : 0,
                  transition: { duration: 0.3 }
                }}
              >
                <IoMdAdd size={20} />
              </motion.div>
              Upload DICOM Images
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
