/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useThemeStore } from '@/store/theme'
import { RiLayoutRowFill } from 'react-icons/ri'
import { IoGridOutline } from 'react-icons/io5'

interface Props {
  sidebarWidth: number
}

const UploadImages: React.FC<Props> = ({ sidebarWidth }) => {
  const { theme } = useThemeStore()
  const [layout, setLayout] = useState('stacked')

  const remainingWidth = `calc(100vw - ${sidebarWidth}px)` // Calculate the remaining width

  return (
    <div
      style={{ width: remainingWidth, transition: 'width 0.3s ease' }}
      className={`h-full ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
    >
      <div className="px-8 pt-10 w-full">
        <div className="flex justify-between items-center">
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} text-xl`}>Recent</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setLayout('stacked')}
              className={`rounded-full p-2 ${(layout === 'stacked' && 'bg-light_g text-dark') || ''}`}
            >
              <RiLayoutRowFill
                size={20}
                color={layout === 'stacked' ? '#191919' : theme === 'dark' ? '#EFEFEF' : '#191919'}
              />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`rounded-full p-2 ${(layout === 'grid' && 'bg-light_g text-dark') || ''}`}
            >
              <IoGridOutline
                size={20}
                color={layout === 'grid' ? '#191919' : theme === 'dark' ? '#EFEFEF' : '#191919'}
              />
            </button>
          </div>
        </div>
        <div
          className={`my-5 pb-4 flex gap-96 items-center border-b ${theme === 'dark' ? 'border-gray_l' : 'border-dark'}`}
        >
          <p className={`${theme === 'dark' ? 'text-zinc-500' : 'text-dark'} font-normal text-md`}>
            Files
          </p>
          <p className={`${theme === 'dark' ? 'text-zinc-500' : 'text-dark'} font-normal text-md`}>
            Recent
          </p>
        </div>
      </div>
    </div>
  )
}

export default UploadImages
