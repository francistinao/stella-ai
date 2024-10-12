/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useCallback, useEffect } from 'react'
import { Navbar, Resizer } from '@/components/components'
import { Sidebar } from '@/pages/menu/menu'
import { UploadImages } from '@/pages/menu/menu'
import { motion } from 'framer-motion'
import { Notice } from '@/components/gamification'
import { useNoticeStore } from '@/store/theme'

const Menu: React.FC = () => {
  const [width, setWidth] = useState(240)
  const { setShowNotice } = useNoticeStore()

  const minWidth = 240
  const maxWidth = 400

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
    },
    [width, minWidth, maxWidth]
  )

  useEffect(() => {
    const isShowAgain = sessionStorage.getItem('isShowAgain')

    document.body.style.cursor = 'default'

    if (!isShowAgain) {
      sessionStorage.setItem('isShowAgain', 'true')
    } else if (isShowAgain === 'true') {
      setTimeout(() => {
        setShowNotice(true)
        sessionStorage.setItem('isShowAgain', 'true')
      }, 800)
    } else {
      setShowNotice(false)
      sessionStorage.setItem('isShowAgain', 'false')
    }
  }, [])

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex w-full h-screen">
        <motion.div style={{ width: width }} transition={{ duration: 0.1 }}>
          <Sidebar handleMouseDown={handleMouseDown} />
        </motion.div>
        <Resizer handleMouseDown={handleMouseDown} />
        <div style={{ flex: 1 }}>
          <UploadImages sidebarWidth={width} />
        </div>
      </div>
      <Notice />
    </div>
  )
}

export default Menu
