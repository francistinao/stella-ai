/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useThemeStore } from '@/store/theme'
import { PiMagnifyingGlassPlusBold } from 'react-icons/pi'
import { byteConverter } from '@/utils/byteConverter'
import { useStoredImages } from '@/store/stored_images'
import { Tooltip } from '@mui/material'

interface CardProps {
  sliceNumber: number
  size: number
  file_name?: string,
  imageData: BinaryData
}

const Cards: React.FC<CardProps> = ({ sliceNumber, size, file_name, imageData }) => {
  const { setSelectedImage, selectedImage } = useStoredImages()
  const [image, setImage] = React.useState('')

  const handleSelectImageToView = () => {
    setSelectedImage!({
      imageName: file_name, imageData, size, type: 'image/jpeg', lastModified: Date.now(), lastModifiedDate: new Date(), imageTimeframe: '2021-09-01',
      name: ''
    })
  }

  useEffect(() => {
    const createImageURL = async () => {
      try {
        const imageDataArrayBuffer = await imageData; 
        const blob = new Blob([imageDataArrayBuffer], { type: 'image/jpeg' }); 
        const url = URL.createObjectURL(blob);
        setImage(url);
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
  }, [imageData]);

  useEffect(() => {
    console.log(file_name, selectedImage?.imageName, file_name === selectedImage?.imageName, 'file_name')
  }, [image])
  const { theme } = useThemeStore()
  return (
    <div
      className={`flex flex-col gap-2 rounded-[25px] p-4 ${theme === 'dark' ? 'bg-light_g' : 'bg-dark'} ${selectedImage?.imageName === file_name && 'bg-[#b6e4b0] duration-150'}`}
    >
      <div
        className={`flex justify-between items-center ${theme === 'dark' ? 'bg-dark rounded-full' : ''} py-2 px-4`}
      >
        <h1 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-dark'} text-sm`}>
          Slice {sliceNumber}
        </h1>
        <Tooltip
          title="Select CT Scan Image"
          placement="right"
        >

        <button
          onClick={handleSelectImageToView}
        >
          <PiMagnifyingGlassPlusBold
            size={40}
            color={`${theme === 'dark' ? '#72FC5E' : '#191919'}`}
            className={`border rounded-full ${theme === 'dark' ? 'border-light_g' : 'border-dark'} p-2`}
          />
        </button>
        </Tooltip>
      </div>
      {image && <img src={image} alt={file_name} className="w-full h-auto" />}
      <div className="flex justify-between items-center mt-4">
        <p className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-regular text-[10px]`}>
         Size: {byteConverter(size)}
        </p>
        <p className={`${theme === 'dark' ? 'text-dark' : 'text-white'} font-regular text-[10px]`}>
          {file_name}
        </p>
      </div>
    </div>
  )
}

export default Cards
