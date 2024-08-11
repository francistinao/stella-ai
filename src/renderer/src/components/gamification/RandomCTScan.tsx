/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/theme'
import { useCoordStore } from '@/store/simulations'

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
  const { coord, setCoord } = useCoordStore()

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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = boundaryRef.current?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left) / scale
      const y = (e.clientY - rect.top) / scale
      const newPoints = [...coord, { x, y }]
      setCoord(newPoints)
      drawPolygon(newPoints)
    }
  }

  const drawPolygon = (points: { x: number; y: number }[]) => {
    const ctx = boundaryRef.current?.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      points.forEach((point) => ctx.lineTo(point.x, point.y))
      ctx.closePath()

      ctx.lineWidth = 5
      ctx.strokeStyle = 'red'
      ctx.stroke()

      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
      ctx.fill()

      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
      })
    }
  }

  useEffect(() => {
    return () => {
      setCoord([])
    }
  }, [])

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
            onClick={handleCanvasClick}
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
