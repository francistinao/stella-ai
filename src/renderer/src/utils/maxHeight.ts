/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect } from 'react'

export const getMaxHeight = () => {
  const [maxHeight, setMaxHeight] = useState(calculateMaxHeight)

  useEffect(() => {
    function handleResize() {
      setMaxHeight(calculateMaxHeight())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function calculateMaxHeight() {
    const tenPercentOfViewportHeight = window.innerHeight * 0.24
    const result = window.innerHeight - tenPercentOfViewportHeight
    return `${result}px`
  }

  return maxHeight
}
