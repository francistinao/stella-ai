/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useThemeStore } from '@/store/theme'
import { useToolStore } from '@/store/tool'
import { useResultStore } from '@/store/result'
import { useImageConfigStore } from '@/store/tool'
import { HiMiniCubeTransparent } from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { useStoredImages } from '@/store/stored_images'
import { byteConverter } from '@/utils/byteConverter'
import { tempBoundPts } from '@/data/tempBoundPts'
import { useVisible } from '@/store/visible'
import { toast, Toaster } from 'sonner'
import { useCaptureStore } from '@/store/result'
import { useCoordsStore } from '@/store/coords'

const canvasSize = window.innerHeight * 2
const dragInertia = 7
const zoomBy = 0.1

const CTScanCanvas: React.FC = () => {
  const { newResult, setNewResult, resultToDisplay, setResultToDisplay } = useResultStore()
  const { setLesionData } = useCoordsStore()
  const {
    boundaryColor,
    tool_name,
    is_active,
    is_draw,
    setIsDraw,
    boundarySize,
    is_ruler,
    startPoint,
    endPoint,
    setStartPoint,
    setEndPoint
  } = useToolStore()
  const { visible } = useVisible()
  const { images, selectedImage, setIsLoading, setSelectedImage } = useStoredImages()
  const [image, setImage] = useState('')
  const [scale, setScale] = useState(1)
  const [isHover, setIsHover] = useState(false)
  const { theme } = useThemeStore()
  const { contrastLevel, highlightsAmount, sepia, is_invert } = useImageConfigStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boundaryRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)
  const { setIsCapture, isCapture, setCapturedContent } = useCaptureStore()
  const [overflow, setOverflow] = useState<string>('scroll')
  const [{ clientX, clientY }, setClient] = useState({
    clientX: 0,
    clientY: 0
  })

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
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

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
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    const context = canvas.getContext('2d')
    if (context) {
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const handleMouseUp = () => {
    setDrawing(false)
  }

  //RULER ====================================================================

  const drawLineWithTwoVertices = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const pointRadius = 10
      const lineColor = '#72FC5E'
      const textOffset = 75

      if (!startPoint && !endPoint) {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      }

      if (!startPoint) {
        // Plot the first point
        setStartPoint({ x, y })
        ctx.beginPath()
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI)
        ctx.fillStyle = lineColor
        ctx.fill()
      } else if (!endPoint) {
        // Plot the second point
        setEndPoint({ x, y })
        ctx.beginPath()
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI)
        ctx.fillStyle = lineColor
        ctx.fill()

        // Draw the line connecting the two points
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(x, y)
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 5
        ctx.stroke()

        // Calculate the distance in millimeters
        const distanceInMillimeters = calculateDistance(startPoint, { x, y })

        // Calculate the midpoint of the line
        const midX = (startPoint.x + x) / 2
        const midY = (startPoint.y + y) / 2

        // Calculate the angle of the line
        const angle = Math.atan2(y - startPoint.y, x - startPoint.x)

        // Calculate the text position offset 20 pixels perpendicular to the line
        const textX = midX + textOffset * Math.sin(angle)
        const textY = midY - textOffset * Math.cos(angle)

        ctx.save()
        ctx.font = '30px Sans-Serif'
        ctx.fillStyle = '#72FC5E'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${distanceInMillimeters.toFixed(2)} mm`, textX, textY)
        ctx.restore()
      } else {
        // Reset the points and clear the canvas for new points
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
        setStartPoint({ x, y })
        setEndPoint(null)

        // Plot the new first point
        ctx.beginPath()
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
    [startPoint, endPoint]
  )

  const handleCanvasClick = useCallback(
    (e: MouseEvent) => {
      if (!canvasRef.current || !is_ruler) {
        return
      }

      const rect = canvasRef.current.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left) / scale
        const y = (e.clientY - rect.top) / scale
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) drawLineWithTwoVertices(ctx, x, y)
      }
    },
    [is_ruler, tool_name, drawLineWithTwoVertices]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('click', handleCanvasClick)
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick)
      }
    }
  }, [handleCanvasClick])

  const calculateDistance = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) => {
    const distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
    const pixelsPerMillimeter = 3.779528
    return distance / pixelsPerMillimeter
  }

  // Reset function to clear canvas and reset state
  const resetRulerState = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setStartPoint(null)
    setEndPoint(null)
  }, [])

  // Handle tool change to reset the ruler state
  useEffect(() => {
    if (tool_name !== 'Ruler') {
      resetRulerState()
    }
  }, [tool_name, resetRulerState])

  // ========================================================================

  // THE MAIN FUNCTION FOR THE CORE FEATURE
  const handleSegmentate = async () => {
    try {
      setIsLoading!(true)

      /**
       * 

      if (!selectedImage) {
        toast.error('No CT Scan Slice selected!')
        throw new Error('No image selected')
        return
      }
       */

      //const imageDataArrayBuffer = await selectedImage.imageData

      /**if (!imageDataArrayBuffer) {
        throw new Error('Failed to get image data')
      }*/

      const formData = new FormData()

      //imageData.append('file', new Blob([imageDataArrayBuffer]))
      images!.forEach((image) => {
        const imageDataArrayBuffer = image.imageData
        if (imageDataArrayBuffer) {
          // Convert ArrayBuffer to Blob
          const blob = new Blob([imageDataArrayBuffer], { type: 'image/png' })
          formData.append('files', blob, `slice_${image.image_id}.png`)
        }
      })

      // "http://127.0.0.1:8000" -> old api (rcnn)
      // "http://127.0.0.1:8000/detect" -> new api (u-net)
      const response = await fetch('http://127.0.0.1:8000/v2/detect', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Error processing the image')
      }
      //for mask RCNN
      //setResult(JSON.parse(data))
      // setResult(JSON.parse(formatJson(data)))
      //for unet ========================================================
      // Parse each slice result and format the data according to the updated store structure
      const parsedData = data?.stroke_detected?.map((slice) => ({
        slice_index: slice.slice_index,
        stroke_type: slice.findings.stroke_type,
        classification: {
          confidence: slice.findings.classification.confidence,
          density_value: slice.findings.classification.density_value,
          houndsfield_unit: slice.findings.classification.houndsfield_unit,
          type: {
            category: slice.findings.classification.type.category,
            type: slice.findings.classification.type.type
          }
        },
        lesion_boundary_points: {
          Area: slice.findings.lesion_boundary_points.Area,
          Mean: slice.findings.lesion_boundary_points.Mean,
          Lesion_Boundary_Points: JSON.parse(
            slice.findings.lesion_boundary_points.Lesion_Boundary_Points
          )
        }
      }))

      // Update the newResult state with the parsed data
      setNewResult!(parsedData)
    } catch (error) {
      console.error('Error segmentating image:', error)
    } finally {
      setIsLoading!(false)
    }
  }

  //DRAW POLYGON FOR U-NET
  const drawPolygon = useCallback(() => {
    const canvas = boundaryRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Add this null check
    if (!resultToDisplay || !resultToDisplay.lesion_boundary_points) return

    setLesionData({
      Mean: resultToDisplay.lesion_boundary_points.Mean,
      Area: resultToDisplay.lesion_boundary_points.Area,
      Lesion_Boundary_Points: resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points
    })

    if (resultToDisplay.lesion_boundary_points?.Lesion_Boundary_Points?.length > 0) {
      const scaleFactor = 6.6

      // Draw lines between boundary points
      ctx.strokeStyle = boundaryColor?.color as string
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(
        resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[0][0] * scaleFactor,
        resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[0][1] * scaleFactor
      )
      for (
        let i = 1;
        i < resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points.length;
        i++
      ) {
        ctx.lineTo(
          resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[i][0] * scaleFactor,
          resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[i][1] * scaleFactor
        )
      }
      ctx.closePath()
      ctx.stroke()

      // Draw boundary points
      ctx.fillStyle = boundaryColor?.color as string
      for (const [x, y] of resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points) {
        ctx.beginPath()
        ctx.arc(x * scaleFactor, y * scaleFactor, boundarySize!, 0, Math.PI * 2)
        ctx.fill()
      }

      // Fill polygon area
      //temporary comment this code
      /**
       * 
      ctx.fillStyle = boundaryColor?.rgb_val as string
      ctx.beginPath()
      ctx.moveTo(
        resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[0][0] * scaleFactor,
        resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[0][1] * scaleFactor
      )
      for (
        let i = 1;
        i < resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points.length;
        i++
      ) {
        ctx.lineTo(
          resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[i][0] * scaleFactor,
          resultToDisplay.lesion_boundary_points.Lesion_Boundary_Points[i][1] * scaleFactor
        )
      }
      ctx.closePath()
      ctx.fill()
       * 
       */
    }
  }, [resultToDisplay, boundaryColor, boundarySize, canvasSize, setLesionData])

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
        const imageDataArrayBuffer = await selectedImage?.imageData
        if (imageDataArrayBuffer) {
          const blob = new Blob([imageDataArrayBuffer], { type: 'image/jpeg' })
          const url = URL.createObjectURL(blob)
          setImage(url)
        }
      } catch (error) {
        console.error('Error loading image data:', error)
      }
    }

    createImageURL()

    return () => {
      if (image) {
        URL.revokeObjectURL(image)
      }
    }
  }, [selectedImage?.imageData])

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

  useEffect(() => {
    drawPolygon()
  }, [tempBoundPts, boundarySize, boundaryColor, resultToDisplay])

  useEffect(() => {
    drawPolygon()
  }, [resultToDisplay, drawPolygon])

  useEffect(() => {
    if (isCapture && captureRef.current) {
      setCapturedContent(captureRef.current)
      setIsCapture(false)
      toast.success('Detections successfully added to Report.')
    }
  }, [isCapture, setCapturedContent])

  const resultIds = new Set(newResult.map((result) => result.slice_index))
  const filteredImages = images?.filter((image) => resultIds.has(image.image_id as number))
  const imageMap = new Map(images?.map((image) => [image.image_id, image]))

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const debounce = (fn, delay) => {
    return (...args) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      debounceTimeoutRef.current = setTimeout(() => fn(...args), delay)
    }
  }
  const debouncedUpdate = debounce((currentSliceIndex) => {
    const newSelectedImage = imageMap.get(currentSliceIndex)
    if (newSelectedImage) {
      setResultToDisplay(newResult.find((result) => result.slice_index === currentSliceIndex))
      setSelectedImage!({
        image_id: newSelectedImage.image_id,
        imageName: newSelectedImage.imageName,
        imageData: newSelectedImage.imageData,
        size: newSelectedImage.size,
        type: 'image/jpeg',
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
        imageTimeframe: '2021-09-01',
        name: newSelectedImage.name
      })
    }
  }, 10)

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeoutRef.current)
    }
  }, [])

  const toggleObserveImages = (e) => {
    if (!selectedImage || !filteredImages) return

    let currentSliceIndex = selectedImage.image_id
    const imagesLength = filteredImages.length

    const isScrollingUp = e.deltaY < 0

    if (isScrollingUp) {
      currentSliceIndex! += 1
      if (currentSliceIndex! >= imagesLength) {
        currentSliceIndex = 0
      }
    } else {
      currentSliceIndex! -= 1
      if (currentSliceIndex! < 0) {
        currentSliceIndex = imagesLength - 1
      }
    }

    debouncedUpdate(currentSliceIndex)
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow
      }}
      className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
    >
      {/**Container */}
      <div className="flex flex-col w-full">
        <>
          <Toaster position="bottom-right" />
          <div
            ref={captureRef}
            style={{
              border: '2px solid white',
              height: canvasSize,
              width: canvasSize,
              backgroundColor: theme === 'dark' ? '#191919' : '#DAD6D6',
              backgroundSize: `20px 20px`,
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              transform: `scale(${scale}, ${scale}) translate(${translateX}px, ${translateY}px)`,
              transformOrigin: 'center'
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
              if (e.shiftKey) toggleObserveImages(e)

              if (!e.shiftKey) {
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
              }
            }}
          >
            {/* Change this later with the actual boundery point */}
            <div className={`${!visible && 'hidden'}`}>
              {boundaryRef && (
                <canvas
                  ref={boundaryRef}
                  width={canvasSize}
                  height={canvasSize}
                  style={{ position: 'absolute', zIndex: 100 }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                />
              )}
            </div>
            {/* Ruler */}
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              style={{ position: 'absolute', zIndex: 100 }}
            />

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
                  <h1
                    className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-bold text-[150px] text-center`}
                  >
                    {newResult?.length !== 0
                      ? 'Inspect CT Scan Slice'
                      : 'Click Segmentate to Detect Stroke'}
                  </h1>
                </div>
              )}
            </div>
          </div>
        </>
        {/* Description and segmentate button */}
        <div className="fixed bottom-0 m-10 z-30 ">
          <div className="flex flex-col gap-3 text-sm text-white">
            <div className="flex flex-col gap-1">
              <h1>Slice No. {selectedImage?.image_id}</h1>
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
        </div>
        {/* Must capture here */}
      </div>
      {/* Until here */}
    </div>
  )
}

export default CTScanCanvas
