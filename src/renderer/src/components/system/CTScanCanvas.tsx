/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/theme'
import { useToolStore } from '@/store/tool'
import { useImageConfigStore } from '@/store/tool'
import { HiMiniCubeTransparent } from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { useStoredImages } from '@/store/stored_images'
import { byteConverter } from '@/utils/byteConverter'


const canvasSize = window.innerHeight * 2
const dragInertia = 7
const zoomBy = 0.1

const CTScanCanvas: React.FC = () => {
  const { tool_name, is_active, is_draw, setIsDraw } = useToolStore()
  const { selectedImage, setIsLoading } = useStoredImages()
  const [image, setImage] = useState('')
  const [scale, setScale] = useState(1)
  const [isHover, setIsHover] = useState(false)
  const { theme } = useThemeStore()
  const { contrastLevel, highlightsAmount, sepia, is_invert } = useImageConfigStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)

  const [{ clientX, clientY }, setClient] = useState({
    clientX: 0,
    clientY: 0
  })

  const [overflow, setOverflow] = useState<string>('scroll')

  const imageStyle = {
    filter: `contrast(${contrastLevel}) brightness(${highlightsAmount}) sepia(${sepia}) invert(${is_invert})`
  }

  const [{ translateX, translateY }] = useState({
    translateX: 0,
    translateY: 0
  })

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const context = canvas.getContext('2d')
    if (context) {
      context.beginPath()
      context.moveTo(x, y)
      setDrawing(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const context = canvas.getContext('2d')
    if (context) {
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const handleMouseUp = () => {
    setDrawing(false)
  }


  const handleSegmentate = async () => {
    try {
      setIsLoading!(true)
    } catch (error) {
      console.error('Error segmentating image:', error)
    }
  }

  useEffect(() => {
    const { innerHeight, innerWidth } = window

    if (tool_name === 'Grab') {
      const scrollDown = (canvasSize - innerHeight) / 2
      const scrollLeft = (canvasSize - innerWidth) / 2

      containerRef?.current?.scroll(scrollLeft, scrollDown)
    } else if (tool_name === 'Pencil') {
      document.body.style.cursor = 'crosshair'
      setIsDraw(true)
    }
  }, [tool_name])

  useEffect(() => {
    const createImageURL = async () => {
      try {
        const imageDataArrayBuffer = await selectedImage?.imageData; 
        if (imageDataArrayBuffer) {
          const blob = new Blob([imageDataArrayBuffer], { type: 'image/jpeg' }); 
          const url = URL.createObjectURL(blob);
          setImage(url);
        } 
      } catch (error) {
        console.error('Error loading image data:', error);
      }
    };
  
    createImageURL();
  
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [selectedImage?.imageData]);

  useEffect(() => {
    if (is_draw || tool_name === 'Pencil') {
      const canvas = canvasRef.current
      if (canvas) {
        const context = canvas.getContext('2d')
        if (context) {
          context.strokeStyle = '#72FC5E'
          context.lineWidth = 10
          context.lineCap = 'round'
          context.lineJoin = 'round'
        }
      }
    }
  }, [is_draw])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow
      }}
    >
      {/* Description and segmentate button */}
      <div className="fixed z-50 flex justify-between items-start w-[480px] bottom-6 right-[400px]">
        <div className="flex flex-col gap-1 text-sm text-white">
          <h1>Description: Brain CT Scan</h1>
          <h1>Image: 1/1</h1>
          <h1>Size {byteConverter(selectedImage?.size ?? 0)}</h1>
        </div>
        <button
          // main button for segmentate
          onClick={handleSegmentate}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="bg-light_g rounded-full py-1 text-center font-semibold flex gap-3 items-center text-dark px-8 text-sm shadow-black"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isHover ? 360 : 0 }}
            transition={{ duration: 1, ease: 'linear' }}
          >
            <HiMiniCubeTransparent size={20} />
          </motion.div>
          <h1>Segmentate</h1>
        </button>
      </div>
      <div
        style={{
          border: '2px solid white',
          height: canvasSize,
          width: canvasSize,
          backgroundColor: theme === 'dark' ? '#191919' : '#DAD6D6',
          backgroundSize: `20px 20px`,
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          transform: `scale(${scale}, ${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: '0 0'
        }}
        onDragStart={(e) => {
          const preview = document.createElement('div')
          preview.style.display = 'none'
          e.dataTransfer.setDragImage(preview, 0, 0)

          setClient({ clientX: e.clientX, clientY: e.clientY })
        }}
        //Need to cache the last position of the mouse once the Grab tool is not active
        //to prevent the canvas from jumping to the last position of the mouse
        onDrag={(e) => {
          if (e.clientX && e.clientY && tool_name === 'Grab') {
            const deltaX = (clientX - e.clientX) / dragInertia
            const deltaY = (clientY - e.clientY) / dragInertia

            containerRef?.current?.scrollBy(deltaX, deltaY)
          }
        }}
        draggable
        onWheel={(e) => {
          if (e.deltaY > 0) {
            if (scale === 1) {
              setOverflow('hidden')
            }
            if (scale > -1) {
              setScale(Math.max(scale - zoomBy, 0.4))
            }
          } else {
            setScale(scale + zoomBy)
          }
        }}
      >
        {is_draw && (
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            style={{ position: 'absolute', zIndex: 100 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        )}
        <div
          className={`flex flex-col w-full h-full place-items-center justify-center -z-10 ${!is_active && 'hidden'}`}
        >
         {image ? (
           <img
           src={image}
           alt="CT Scan"
           className="w-full h-full"
           draggable={false}
           style={imageStyle}
         />
         ) : (
          <div className="">
            <h1 className={`${theme === 'dark' ? "text-light_g": "text-dark"} font-bold text-[150px] text-center`}>Select CT Scan Image</h1>
          </div>
         )}
        </div>
      </div>
    </div>
  )
}

export default CTScanCanvas
