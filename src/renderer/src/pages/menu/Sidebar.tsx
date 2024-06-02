/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useThemeStore } from '@/store/theme'
import { IoMdAdd } from 'react-icons/io'
import { motion } from 'framer-motion'
import { UploadModal } from '@/pages/menu/menu'
import { Tooltip } from '@mui/material'

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
            Upload CT Scan Images
          </button>
          <Tooltip title="Coming Soon!" placement="right">
            <button
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'} rounded-md py-2 text-center px-3 font-bold hover:${theme === 'dark' ? 'bg-gray_l' : 'bg-dirty'} duration-100`}
            >
              STELLAmulator{' '}
              <span className="relative bottom-4 text-dark bg-light_g rounded-md text-xs px-1 py-1">
                beta
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
