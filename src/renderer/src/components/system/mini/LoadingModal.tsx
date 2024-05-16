/* 
  This is the loading modal while uploading the images in the system
*/

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useLoadingImage } from '@/store/stored_images'

const LoadingModal: React.FC = () => {
  const { isLoading, setIsLoading } = useLoadingImage()
  const [progress, setProgress] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 7
        return newProgress > 100 ? 100 : newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    controls.start({ width: `${progress}%`, transition: { duration: 1, ease: 'easeInOut' } })
    if (progress === 100) {
      setIsLoading(false)
    }
  }, [progress, controls, setIsLoading])

  return (
    <>
      {isLoading && (
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
      )}
    </>
  )
}

export default LoadingModal
