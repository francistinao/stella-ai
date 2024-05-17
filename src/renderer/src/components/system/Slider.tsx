/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useThemeStore } from '@/store/theme'
import { SlCalender } from 'react-icons/sl'
import { IoMdAdd } from 'react-icons/io'
import { useStoredImages} from '@/store/stored_images'
import { getMaxHeight } from '@/utils/maxHeight'

// Slider components
import { Cards } from '@/components/system/mini/index'

const Slider: React.FC = () => {
  const { images } = useStoredImages()
  const { theme } = useThemeStore()
  const maxHeight = getMaxHeight()
  const dateToday = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  useEffect(() => {
    console.log(images)
  }, [images])

  return (
    <div
      className={`w-72 h-full flex flex-col items-center gap-2 px-5 py-1 border-r ${theme === 'dark' ? 'bg-sys_com border-zinc-700' : 'bg-dirty border-zinc-500'}`}
    >
      <div className="flex gap-4 items-center">
        <h1
          className={`${theme === 'dark' ? 'bg-dark text-dirty' : 'bg-white text-dark'} rounded-full font-semibold text-[10px] px-2 py-1`}
        >
          CT Scan Images
        </h1>

        <h1
          className={`flex gap-4 items-center ${theme === 'dark' ? 'bg-dark text-dirty' : 'bg-white text-dark'} rounded-full font-semibold text-[10px] px-2 py-1`}
        >
          <SlCalender size={10} />
          {dateToday}
        </h1>
      </div>
      <button
        
        className={`mt-2 flex justify-center gap-4 items-center bg-light_g text-dark font-semibold py-2 rounded-full w-full text-center text-sm`}
      >
        <IoMdAdd size={15} />
        Add Slice
      </button>
      <div
        style={{ maxHeight: maxHeight }}
        className={`mt-8 flex flex-col gap-6 overflow-y-auto w-full p-2 customScroll`}
      >
        {images?.map((image, idx) => (
          <Cards
            key={idx}
            sliceNumber={idx + 1}
            size={image.size}
            file_name={image.imageName}
            imageData={image.imageData}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider
