/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/theme'
import { RiLayoutRowFill } from 'react-icons/ri'
import { IoGridOutline } from 'react-icons/io5'
import { useStoredImages } from '@/store/stored_images'
import { AnimatePresence, motion } from 'framer-motion'
import { moment } from '@/utils/moment'

interface Props {
  sidebarWidth: number
}

const UploadImages: React.FC<Props> = ({ sidebarWidth }) => {
  const { theme } = useThemeStore()
  const [layout, setLayout] = useState('stacked')
  const [images, setUploadedImages] = useState({})
  const { setImages } = useStoredImages()
  const navigate = useNavigate()

  const [modalVisible, setModalVisible] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedImage, setSelectedImage] = useState(null)

  const remainingWidth = `calc(100vw - ${sidebarWidth}px)`

  const openCtScan = (images) => {
    const imageToData = []
    images.map((image) => {
      const imageName = image.split('-file-name-')[1]
      const byteString = atob(image.split(',')[1].split('-file-name-')[0])
      console.log(byteString)
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([ab], { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)
      //eslint-disable-next-line
      //@ts-ignore
      imageToData.push({
        imageName: imageName,
        size: blob.size,
        type: blob.type,
        lastModified: '',
        lastModifiedDate: '',
        path: url,
        imageData: blob,
        imageTimeframe: ''
      })
    })
    setImages!(imageToData)
    navigate('/system')
  }

  useEffect(() => {
    const images = localStorage.getItem('images')

    if (images) {
      setUploadedImages(JSON.parse(images))
    }
  }, [])

  const handleRightClick = (e, key) => {
    e.preventDefault()
    setSelectedImage(key)
    setModalPosition({ x: e.clientX, y: e.clientY })
    setModalVisible(true)
  }

  const handleDelete = () => {
    const updatedImages = { ...images }
    delete updatedImages[selectedImage!]
    setUploadedImages(updatedImages)
    localStorage.setItem('images', JSON.stringify(updatedImages))
    setModalVisible(false)
  }

  return (
    <div
      onClick={() => {
        if (modalVisible) {
          setModalVisible(false)
        }
      }}
      style={{ width: remainingWidth, transition: 'width 0.3s ease' }}
      className={`h-full ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
    >
      <div className="px-8 pt-10 w-full">
        <div className="flex justify-between items-center">
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} text-xl`}>Recent</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setLayout('stacked')}
              className={`rounded-full p-2 ${(layout === 'stacked' && 'bg-light_g text-dark') || ''}`}
            >
              <RiLayoutRowFill
                size={20}
                color={layout === 'stacked' ? '#191919' : theme === 'dark' ? '#EFEFEF' : '#191919'}
              />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`rounded-full p-2 ${(layout === 'grid' && 'bg-light_g text-dark') || ''}`}
            >
              <IoGridOutline
                size={20}
                color={layout === 'grid' ? '#191919' : theme === 'dark' ? '#EFEFEF' : '#191919'}
              />
            </button>
          </div>
        </div>
        <div
          className={`my-5 pb-4 flex gap-96 items-center border-b ${theme === 'dark' ? 'border-gray_l' : 'border-dark'}`}
        >
          <p className={`${theme === 'dark' ? 'text-zinc-500' : 'text-dark'} font-normal text-md`}>
            Files
          </p>
          <p className={`${theme === 'dark' ? 'text-zinc-500' : 'text-dark'} font-normal text-md`}>
            Recent
          </p>
        </div>
        <div
          className={`${layout === 'stacked' ? 'flex flex-col gap-4' : 'grid grid-cols-3 gap-8'} max-h-[540px] overflow-y-auto customScroll`}
        >
          {Object.keys(images).map((key) => (
            <button
              onClick={() => openCtScan(images[key])}
              onContextMenu={(e) => handleRightClick(e, key)}
              key={key}
              className={`${layout === 'stacked' ? 'flex gap-4 items-center border-b pb-4' : 'flex flex-col gap-2'}`}
            >
              <div
                className={`${layout === 'grid' ? 'flex flex-col' : 'flex gap-16'} items-center w-[480px] justify-between`}
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={images[key][0].split('-file-name')[0]}
                    alt={key}
                    className="w-20 h-20"
                  />
                  <div className="flex flex-col gap-2 items-start">
                    <h1
                      className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-left font-regular text-sm`}
                    >
                      {key}
                    </h1>
                    <p className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} text-xs`}>
                      {images[key].length}{' '}
                      {images[key].length > 1 ? 'ct scan images' : 'ct scan image'}
                    </p>
                  </div>
                </div>
                <p
                  className={`${theme === 'dark' ? 'text-white' : 'text-dark'} font-regular text-xs`}
                >
                  {moment(key)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {modalVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ top: modalPosition.y, left: modalPosition.x }}
            className={`fixed shadow-md rounded p-2 ${theme === 'dark' ? 'bg-gray_l' : 'bg-white'}`}
          >
            <button
              onClick={handleDelete}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-xs`}
            >
              Delete Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UploadImages
