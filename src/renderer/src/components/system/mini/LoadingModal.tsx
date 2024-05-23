/* eslint-disable prettier/prettier */
/* 
  This is the loading modal while uploading the images in the system
*/

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useLoadingImage } from '@/store/stored_images'

const LoadingModal: React.FC = () => {
  const { isImageUploadLoading, setIsImageUploadLoading } = useLoadingImage()
  const [progress, setProgress] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    if (isImageUploadLoading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 15
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isImageUploadLoading])

  useEffect(() => {
    controls.start({ width: `${progress}%`, transition: { duration: 0.8, ease: 'easeInOut' } })

    if (progress === 100) {
      setIsImageUploadLoading(false)
    }
  }, [progress, controls])

  return (
    <motion.div
      className="loading-progress"
      initial={{ width: '0%' }}
      animate={controls}
      style={{
        background: 'linear-gradient(to right, #326E29, #72FC5E)',
        height: '10px',
        borderRadius: '4px'
      }}
    />
  )
}

export default LoadingModal
