/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useGameStore } from '@/store/simulations'
import { formatTime } from '@/utils/formatTime'

const Timer: React.FC = () => {
  const [time, setTime] = useState(0)
  const { startBlitzMode, setBlitzModeRecord } = useGameStore()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (startBlitzMode) {
      interval = setInterval(() => {
        const newTime = time + 10
        setTime(newTime)
        setBlitzModeRecord(newTime)
      }, 10)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [startBlitzMode, time, setBlitzModeRecord])

  return <div className="text-3xl font-bold">{formatTime(time)}</div>
}

export default Timer
