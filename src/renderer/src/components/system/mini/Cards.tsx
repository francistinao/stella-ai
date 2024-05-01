/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'
import { PiMagnifyingGlassPlusBold } from 'react-icons/pi'
import sampleCt from '@/data/sample_ct.png'

interface CardProps {
  sliceNumber: number
  width: number
  height: number
  file_name: string
}

const Cards: React.FC<CardProps> = ({ sliceNumber, width, height, file_name }) => {
  const { theme } = useThemeStore()
  return (
    <div
      className={`flex flex-col gap-2 rounded-[25px] p-4 ${theme === 'dark' ? 'bg-light_g' : 'bg-dark'}`}
    >
      <div
        className={`flex justify-between items-center ${theme === 'dark' ? 'bg-dark rounded-full' : ''} py-2 px-4`}
      >
        <h1 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-dark'} text-sm`}>
          Slice {sliceNumber}
        </h1>
        <button>
          <PiMagnifyingGlassPlusBold
            size={40}
            color={`${theme === 'dark' ? '#72FC5E' : '#191919'}`}
            className={`border rounded-full ${theme === 'dark' ? 'border-light_g' : 'border-dark'} p-2`}
          />
        </button>
      </div>
      {/* Temporary image */}
      <img src={sampleCt} alt={file_name} className="w-full h-auto" />
      <div className="flex justify-between items-center mt-4">
        <p className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-regular text-[10px]`}>
          W: {width} H: {height}
        </p>
        <p className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-regular text-[10px]`}>
          {file_name}
        </p>
      </div>
    </div>
  )
}

export default Cards
