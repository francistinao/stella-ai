/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'
import vector from '@/assets/vector.png'

/**
 * TODO: The steps must be dynamic based on the tasks thats been done by the user
 *
 * 1. Load the CT Scan Slices
 * 2. Select a Slice to segmentate
 * 3. Segmentate the selected slice
 * 4. View results and provide findings
 */

const Steps: React.FC = () => {
  const { theme } = useThemeStore()
  return (
    <div className={`${theme === 'dark' ? '' : ''} flex rounded-full`}>
      <img src={vector} alt="CT Scan Vector" className="w-1/3 rounded-l-lg" />
      <div
        className={`p-2 flex flex-col gap-1 w-2/3 ${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-r-lg`}
      >
        <div className="flex gap-1 items-center justify-center">
          {/*  Temporary */}
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`${theme === 'dark' ? 'bg-light_g text-dark' : 'bg-dark text-white'} ${step === 4 && 'bg-transparent border-2 border-light_g text-light_g text-center'} rounded-full text-xs font-semibold py-1 px-[10px]`}
            >
              <h1>{step}</h1>
            </div>
          ))}
        </div>
        <p
          className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-[7px] mt-1 text-center`}
        >
          Step 4: Provide CT Scan screening result based on the automated segmentation and
          classification
        </p>
      </div>
    </div>
  )
}

export default Steps
