/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'
import { useNavigate } from 'react-router-dom'

const SettingsBar: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useThemeStore()

  const reset = () => {
    navigate('/')
  }
  return (
    <div
      className={`w-full flex gap-x-2 items-start justify-start border-b ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} text-[10px] p-2 rounded-lg`}
    >
      <button
        onClick={reset}
        className={`px-2 py-1 rounded-md ${theme === 'dark' ? 'text-dirty hover:bg-gray_l duration-200' : 'text-dark hover:bg-dirty duration-100'}`}
      >
        Create New
      </button>
      <button
        className={`px-2 py-1 rounded-md ${theme === 'dark' ? 'text-dirty hover:bg-gray_l duration-200' : 'text-dark hover:bg-dirty duration-100'}`}
      >
        Edit
      </button>
      <button
        className={`px-2 py-1 rounded-md ${theme === 'dark' ? 'text-dirty hover:bg-gray_l duration-200' : 'text-dark hover:bg-dirty duration-100'}`}
      >
        Help
      </button>
    </div>
  )
}

export default SettingsBar
