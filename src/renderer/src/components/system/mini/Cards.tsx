/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useThemeStore } from '@/store/theme'
import { VscOpenPreview } from 'react-icons/vsc'
import { byteConverter } from '@/utils/byteConverter'
import { useStoredImages } from '@/store/stored_images'
import { Tooltip } from '@mui/material'
import { useResultStore } from '@/store/result'
import { useToolStore } from '@/store/tool'
import truncateFileName from '@/utils/truncateFileName'

interface CardProps {
  sliceNumber: number | null
  size: number
  file_name?: string
  imageData: BinaryData
}

const Cards: React.FC<CardProps> = ({ sliceNumber, size, file_name, imageData }) => {
  const { setSelectedImage, selectedImage } = useStoredImages()
  const { startPoint, endPoint, setStartPoint, setEndPoint } = useToolStore()

  const { newResult, setResultToDisplay, resultToDisplay } = useResultStore()
  const [image, setImage] = React.useState('')

  const handleSelectImageToView = (sliceNumber: number) => {
    if (startPoint && endPoint) {
      setStartPoint(null)
      setEndPoint(null)
    }

    console.log(resultToDisplay)

    setResultToDisplay(newResult.find((result) => result.slice_index === sliceNumber))

    setSelectedImage!({
      image_id: sliceNumber,
      imageName: file_name,
      imageData,
      size,
      type: 'image/jpeg',
      lastModified: Date.now(),
      lastModifiedDate: new Date(),
      imageTimeframe: '2021-09-01',
      name: ''
    })
  }

  useEffect(() => {
    const createImageURL = async () => {
      try {
        const imageDataArrayBuffer = await imageData
        const blob = new Blob([imageDataArrayBuffer], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        setImage(url)
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
  }, [imageData])

  const { theme } = useThemeStore()
  return (
    <div
      className={`border-2 flex flex-col gap-2 rounded-[10px] p-4 ${theme === 'dark' ? 'bg-gray_l border-zinc-700' : 'bg-white border-zinc-300 shadow-lg'} ${selectedImage?.imageName === file_name && 'brightness-150 duration-100'} ${sliceNumber === 1 && !selectedImage && 'animate-pulse duration-75'}`}
    >
      <div
        className={`flex justify-between items-center ${theme === 'dark' ? 'bg-dark' : 'bg-dirty'} rounded-lg py-2 px-2`}
      >
        <h1 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-dark'} text-sm`}>
          Slice {sliceNumber}
        </h1>
        <Tooltip title="Inspect CT Scan" placement="right">
          <button onClick={() => handleSelectImageToView(sliceNumber as number)}>
            <VscOpenPreview
              size={40}
              color={`${theme === 'dark' ? '#191919' : '#72FC5E'}`}
              className={`rounded-full ${theme === 'dark' ? 'bg-light_g' : 'bg-dark'} p-2`}
            />
          </button>
        </Tooltip>
      </div>
      {image && <img src={image} alt={file_name} className="w-full h-auto" />}
      <div className="flex justify-between items-center mt-4">
        <p
          className={`${theme === 'dark' ? 'text-gray-400' : 'text-dark '} font-regular text-[10px]`}
        >
          Size: {byteConverter(size)}
        </p>
        <p
          className={`${theme === 'dark' ? 'text-gray-400' : 'text-dark '} font-regular text-[10px]`}
        >
          {truncateFileName!(file_name as string)}
        </p>
      </div>
    </div>
  )
}

export default Cards
