/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Navbar } from '@/components/components'
import { useToolStore, useSliderStore } from '@/store/tool'
import Resizer from '@/components/Resizer'
import { CTScanCanvas, Results, Slider, Tools, NoStrokeSlider } from '@/components/system'
import { AnimatePresence, motion } from 'framer-motion'
import Ruler from '@scena/react-ruler'
import { AddFindingsModal } from '@/components/system/mini/index'
import SettingsBar from '@/components/system/SettingsBar'
import { useResultStore } from '@/store/result'

const System: React.FC = () => {
  const {
    setToolName,
    setToolActivity,
    is_active,
    is_draw,
    setIsDraw,
    is_ruler,
    setIsRuler,
    tool_name
  } = useToolStore()

  const [sliderWidth] = useState(290)
  const [toolsWidth, setToolsWidth] = useState(285)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsResizingTools] = useState(false)
  const [showCTScan, setShowCTScan] = useState(true) // State for CT Scan visibility
  const rulerRef = useRef<HTMLDivElement>(null)
  const { newResult } = useResultStore()
  const { toggleVisibilityFirst, toggleVisibilitySecond } = useSliderStore()

  const minWidth = 290
  const maxWidth = 1200

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
        rulerRef.current.onresize!(ev)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Handle tool changes and cursor updates
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        //explore ct scan
        case 'H':
        case 'h':
          if (tool_name !== '') setToolName('')
          if (is_draw) setIsDraw(false)
          if (is_ruler) setIsRuler(false)
          setToolName('Grab')
          document.body.style.cursor = 'grab'
          setShowCTScan(true)
          break
        // toggle ct scan visibility
        case 'C':
        case 'c':
          if (tool_name !== '') setToolName('')
          setToolName('CT Scan')
          if (is_draw) setIsDraw(false)
          if (is_ruler) setIsRuler(false)
          setToolActivity(!is_active)
          setShowCTScan(true)
          break
        // pencil
        case 'P':
        case 'p':
          if (tool_name !== '') setToolName('')
          setToolName('Pencil')
          if (is_ruler) setIsRuler(false)
          setIsDraw(!is_draw)
          document.body.style.cursor = 'default'
          break
        // reset tools
        case 'Escape':
          if (tool_name !== '') setToolName('')
          setIsDraw(false)
          setIsRuler(false)
          document.body.style.cursor = 'default'
          setShowCTScan(true)
          break
        // ruler
        case 'R':
        case 'r':
          if (tool_name !== '') setToolName('')
          setToolName('Ruler')
          if (is_draw) setIsDraw(false)
          setIsRuler(!is_ruler)
          setShowCTScan(true)
          document.body.style.cursor = 'crosshair'
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [tool_name, is_draw, is_ruler, is_active, setToolName, setToolActivity, setIsDraw, setIsRuler])

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <SettingsBar />
      <AddFindingsModal />
      <div className="pb-4 flex w-full h-screen">
        <AnimatePresence>
          {newResult && newResult.length !== 0 && toggleVisibilityFirst && (
            <motion.div
              initial={{ x: -1000, opacity: 0 }}
              animate={{
                x: toggleVisibilityFirst ? 0 : -1000,
                opacity: toggleVisibilityFirst ? 1 : 0
              }}
              exit={{ x: -1000, opacity: 0 }}
              transition={{
                duration: 0.3
              }}
              style={{ width: sliderWidth }}
            >
              <NoStrokeSlider />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {newResult && newResult.length !== 0 && toggleVisibilitySecond && (
            <motion.div
              initial={{ x: -1000, opacity: 0 }}
              animate={{
                x: toggleVisibilitySecond ? 0 : -1000,
                opacity: toggleVisibilitySecond ? 1 : 0
              }}
              exit={{ x: -1000, opacity: 0 }}
              transition={{
                duration: 0.3
              }}
              style={{ width: sliderWidth }}
            >
              <Slider />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: toolsWidth }} transition={{ duration: 0.2954 }}>
          <Tools observeWidth={toolsWidth} />
        </motion.div>
        <Resizer handleMouseDown={handleToolsMouseDown} />
        <div className="w-14" ref={rulerRef}>
          <Ruler type="vertical" direction="start" />
        </div>
        {showCTScan && <CTScanCanvas />} {/* Conditionally render CTScanCanvas */}
        <div className="w-14" ref={rulerRef}>
          <Ruler type="vertical" direction="start" />
        </div>
        <Results remainingWidth={toolsWidth} />
      </div>
    </div>
  )
}

export default System
