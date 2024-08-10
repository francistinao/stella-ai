/* eslint-disable prettier/prettier */
import React, { useState, Dispatch } from 'react'
import { useThemeStore } from '@/store/theme'
import { IoMdAdd } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import { UploadModal } from '@/pages/menu/menu'
import { FaFileMedicalAlt, FaTimes } from 'react-icons/fa'
import { FaFileImage } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

interface Props {
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const CTScanOrMRIModal: React.FC<{
  ifUpload: boolean
  setIsUploadCTScan: Dispatch<React.SetStateAction<boolean>>
  setCheckIfUpload: Dispatch<React.SetStateAction<boolean>>
}> = ({ ifUpload, setIsUploadCTScan, setCheckIfUpload }) => {
  const { theme } = useThemeStore()

  return (
    <AnimatePresence>
      {ifUpload && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              duration: 0.4,
              type: 'spring',
              ease: 'easeInOut'
            }}
            className={`relative p-8 flex flex-col items-center gap-6 max-w-lg w-full rounded-lg shadow-lg border ${
              theme === 'dark'
                ? 'bg-dark text-white border-zinc-700'
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setCheckIfUpload(false)}
            >
              <FaTimes size={18} />
            </button>

            <h1 className="text-2xl font-bold">Upload CT Scan or MRI</h1>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 flex flex-col items-center justify-center gap-2 bg-green-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-600 transition"
                onClick={() => {
                  setIsUploadCTScan(true)
                  setCheckIfUpload(false)
                }}
              >
                <FaFileMedicalAlt size={28} />
                CT Scan
              </button>
              <button
                className="flex-1 flex flex-col items-center justify-center gap-2 bg-dark_g text-white py-3 px-6 rounded-md font-semibold"
                onClick={() => {
                  setCheckIfUpload(false)
                }}
              >
                <FaFileImage size={28} />
                MRI
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const Sidebar: React.FC<Props> = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [checkIfUpload, setCheckIfUpload] = useState(false)
  const [isUploadCTScan, setIsUploadCTScan] = useState(false)
  const { theme } = useThemeStore()

  return (
    <div className={`h-full w-full flex ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
      <UploadModal isUpload={isUploadCTScan} setIsUpload={setIsUploadCTScan} />
      <CTScanOrMRIModal
        ifUpload={checkIfUpload}
        setIsUploadCTScan={setIsUploadCTScan}
        setCheckIfUpload={setCheckIfUpload}
      />
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
            onClick={() => setCheckIfUpload(true)}
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

          <Link
            to="/simulator"
            className={`${theme === 'dark' ? 'text-white' : 'text-dark'} rounded-md py-2 text-center px-3 font-bold hover:${theme === 'dark' ? 'bg-gray_l' : 'bg-dirty'} duration-100`}
          >
            STELLAmulator{' '}
            <span className="relative bottom-4 text-dark bg-light_g rounded-md text-xs px-1 py-1">
              beta
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
