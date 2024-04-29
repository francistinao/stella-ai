/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Navbar, Resizer } from '@/components/components'
import { Sidebar } from '@/pages/menu/menu'
import { UploadImages } from '@/pages/menu/menu'
import { motion } from 'framer-motion'

const Menu: React.FC = () => {
  const [width, setWidth] = useState(240)

  const minWidth = 240
  const maxWidth = 400

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startX = e.pageX
    const initialWidth = width

    const handleMouseMove = (event: MouseEvent) => {
      const newWidth = initialWidth + event.pageX - startX
      const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
      setWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex w-full h-screen">
        <motion.div
          initial={{ width: width }}
          animate={{ width: width }}
          transition={{ duration: 0.1 }}
        >
          <Sidebar handleMouseDown={handleMouseDown} />
        </motion.div>
        <Resizer handleMouseDown={handleMouseDown} />
        <div>
          <UploadImages sidebarWidth={width} />
        </div>
      </div>
    </div>
  )
}

export default Menu
