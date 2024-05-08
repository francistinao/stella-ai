/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Navbar } from '@/components/components'
import { useToolStore } from '@/store/tool'
import Resizer from '@/components/Resizer'
import { CTScanCanvas, Results, Slider, Tools } from '@/components/system'
import { motion } from 'framer-motion'
import Ruler from '@scena/react-ruler'

const System: React.FC = () => {
  const { setToolName, setToolActivity, is_active, is_draw, setIsDraw } = useToolStore()
  const [sliderWidth] = useState(290)
  const [toolsWidth, setToolsWidth] = useState(285)
  const [_, setIsResizingTools] = useState(false)
  const rulerRef = useRef<HTMLDivElement>(null)

  const minWidth = 290
  const maxWidth = 750

  const handleToolsMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsResizingTools(true)
      const startX = e.pageX
      const initialWidth = toolsWidth

      const handleMouseMove = (event: MouseEvent) => {
        const newWidth = initialWidth + event.pageX - startX
        const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
        setToolsWidth(clampedWidth)
      }

      const handleMouseUp = () => {
        setIsResizingTools(false)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mousemove', handleMouseMove)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [toolsWidth, minWidth, maxWidth]
  )

  useEffect(() => {
    const handleResize = (ev: UIEvent) => {
      if (rulerRef.current) {
        rulerRef?.current?.onresize!(ev)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Need to improve and this will be applied on the CT Scan Canvas component
  //Temporary!
  //if the tool_name is grab then set the cursor to grab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'H':
        case 'h':
          setToolName('Grab')
          document.body.style.cursor = 'grab'
          break
        case 'C':
        case 'c':
          setToolName('CT Scan')
          setToolActivity(!is_active)
          break
        case 'P':
        case 'p':
          setToolName('Pencil')
          setIsDraw(!is_draw)
          document.body.style.cursor = 'crosshair'
          break
        case 'Escape':
          setToolName('')
          setIsDraw(false)
          document.body.style.cursor = 'default'
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setToolName, setToolActivity, is_active])

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />

      {/* Main layout */}
      {/* grid grid-cols-12 */}
      <div className="pb-4 flex w-full h-screen">
        {/* CT Scan Sliders */}
        <motion.div style={{ width: sliderWidth }} transition={{ duration: 0.1 }}>
          <Slider />
        </motion.div>
        {/* Toolboxes and Image Config */}
        <motion.div style={{ width: toolsWidth }} transition={{ duration: 0.1 }}>
          <Tools observeWidth={toolsWidth} />
        </motion.div>
        <Resizer handleMouseDown={handleToolsMouseDown} />

        <div className="w-14" ref={rulerRef}>
          <Ruler type="vertical" direction="start" />
        </div>
        {/* CT Scan Canvas */}
        <CTScanCanvas />
        <div className="w-14" ref={rulerRef}>
          <Ruler type="vertical" direction="start" />
        </div>
        {/* Results Component */}
        <Results remainingWidth={toolsWidth} />
      </div>
    </div>
  )
}

export default System
