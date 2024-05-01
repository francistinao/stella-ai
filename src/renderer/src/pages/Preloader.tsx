/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import logo from '@/assets/logo.png'

const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Loading Resources...')
  const controls = useAnimation()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 7
        if (newProgress >= 100) {
          clearInterval(interval)
          setLoadingText('Welcome to STELLA.ai')
        } else if (newProgress >= 24) {
          setLoadingText('Clearing Caches')
        } else if (newProgress >= 67) {
          setLoadingText('Unpacking Data and Files')
        } else if (newProgress >= 89) {
          setLoadingText('Almost There')
        }
        return newProgress
      })
    }, 500)

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    controls.start({ width: `${progress}%`, transition: { duration: 1, ease: 'easeInOut' } })
  }, [progress, controls])

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="flex flex-col justify-center gap-4 w-full">
        {progress >= 100 && (
          <motion.img
            src={logo}
            alt="STELLA.ai"
            className="w-20 h-20 mx-auto"
            animate={{ scale: [1.1, 1] }}
            transition={{ duration: 0.5, yoyo: Infinity }}
          />
        )}
        <motion.div
          className="text-md text-center text-light_g"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          {loadingText}
        </motion.div>
        <motion.div
          className="loading-progress"
          initial={{ width: '0%' }}
          animate={controls}
          style={{
            background: 'linear-gradient(to right, #326E29, #72FC5E)',
            height: '10px',
            width: '100%',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  )
}

export default Preloader
