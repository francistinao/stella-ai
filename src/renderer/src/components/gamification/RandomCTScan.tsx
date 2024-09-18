/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/theme'
import { useCoordStore, useToggleResult } from '@/store/simulations'

interface Props {
  image: string
}

export const canvasSize = window.innerHeight * 2
const dragInertia = 7
const zoomBy = 0.1

const RandomCTScan: React.FC<Props> = ({ image }) => {
  const { theme } = useThemeStore()
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const boundaryRef = useRef<HTMLCanvasElement>(null)
  const { coord, setCoord, resultCoord } = useCoordStore()
  const { toggleResult } = useToggleResult()

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
      drawPolygon(newPoints, userColor)
    }
  }

  const drawPolygon = (points: { x: number; y: number }[], color: string) => {
    const ctx = boundaryRef.current?.getContext('2d')
    if (ctx && points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      points.forEach((point) => ctx.lineTo(point.x, point.y))
      ctx.closePath()

      ctx.lineWidth = 3
      ctx.strokeStyle = color
      ctx.stroke()

      ctx.fillStyle = `${color}50`
      ctx.fill()

      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
      })
    }
  }
  const userColor = 'red'
  const predictionColor = 'blue'

  useEffect(() => {
    const ctx = boundaryRef.current?.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      if (resultCoord.length > 0 && toggleResult) {
        drawPolygon(resultCoord, predictionColor)
      }
      if (coord.length > 0) {
        drawPolygon(coord, userColor)
      }
    }
  }, [resultCoord, toggleResult, coord])

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
