/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react'
import { useThemeStore } from '@/store/theme'

interface Props {
  image: string
}

const canvasSize = window.innerHeight * 2
const dragInertia = 7
const zoomBy = 0.1

const RandomCTScan: React.FC<Props> = ({ image }) => {
  const { theme } = useThemeStore()
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const boundaryRef = useRef<HTMLCanvasElement>(null)

  const [{ clientX, clientY }, setClient] = useState({
    clientX: 0,
    clientY: 0
  })

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const preview = document.createElement('div')
    preview.style.display = 'none'
    e.dataTransfer.setDragImage(preview, 0, 0)
    setClient({ clientX: e.clientX, clientY: e.clientY })
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX && e.clientY) {
      const deltaX = (clientX - e.clientX) / dragInertia
      const deltaY = (clientY - e.clientY) / dragInertia
      containerRef.current?.scrollBy(deltaX, deltaY)
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      setScale(Math.max(scale - zoomBy, 0.4))
    } else {
      setScale(scale + zoomBy)
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        style={{
          border: '2px solid white',
          height: canvasSize,
          width: canvasSize,
          backgroundColor: theme === 'dark' ? '#191919' : '#DAD6D6',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onWheel={handleWheel}
        draggable
      >
        {boundaryRef && (
          <canvas
            ref={boundaryRef}
            width={canvasSize}
            height={canvasSize}
            style={{ position: 'absolute', zIndex: 100 }}
          />
        )}
        <div className="flex w-full h-full place-items-center justify-center -z-10">
          <img src={image} alt="CT Scan" className="w-full h-full object-cover" draggable={false} />
        </div>
      </div>
    </div>
  )
}

export default RandomCTScan
