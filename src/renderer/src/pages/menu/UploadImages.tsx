/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

interface Props {
  sidebarWidth: number
}

const UploadImages: React.FC<Props> = ({ sidebarWidth }) => {
  const { theme } = useThemeStore()

  const remainingWidth = `calc(100vw - ${sidebarWidth}px)` // Calculate the remaining width

  return (
    <div
      style={{ width: remainingWidth }}
      className={`h-full ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
    >
      <div className="grid place-items-center justify-center h-full w-full">
        <h1>Hello</h1>
      </div>
    </div>
  )
}

export default UploadImages
