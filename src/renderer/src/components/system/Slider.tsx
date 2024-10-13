/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'
import { SlCalender } from 'react-icons/sl'
import { useStoredImages } from '@/store/stored_images'
import { getMaxHeight } from '@/utils/maxHeight'
import { useResultStore } from '@/store/result'

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
  const { newResult } = useResultStore()

  const resultIds = new Set(newResult.map((result) => result.slice_index))
  const filteredImages = images?.filter((image) => resultIds.has(image.image_id as number))

  console.log(resultIds)
  return (
    <div
      className={`w-72 h-full flex flex-col items-center gap-2 px-5 pt-1 pb-10 border-r ${theme === 'dark' ? 'bg-sys_com border-zinc-700' : 'bg-dirty border-zinc-500'}`}
    >
      <div className="flex gap-4 items-center">
        <h1
          className={`${theme === 'dark' ? 'bg-dark text-dirty' : 'bg-white text-dark'} rounded-full font-semibold text-[9.5px] px-2 py-1`}
        >
          CT Scan
        </h1>

        <h1
          className={`flex gap-4 items-center ${theme === 'dark' ? 'bg-dark text-dirty' : 'bg-white text-dark'} rounded-full font-semibold text-[9.5px] px-2 py-1`}
        >
          <SlCalender size={10} />
          {dateToday}
        </h1>
      </div>
      <div
        className={`mt-2 flex justify-center gap-4 items-center font-semibold py-2 rounded-md w-full text-center text-sm border-2 ${theme === 'dark' ? 'bg-light_g text-dark border-green-700' : 'bg-white border-zinc-300 text-black'}`}
      >
        Slices with Stroke: {Math.max(newResult?.length ?? 1, 0)} /
        {Math.max(images?.length ?? 1, 0)}
      </div>
      <div
        style={{ maxHeight: maxHeight }}
        className={`mt-8 flex flex-col gap-6 overflow-y-auto w-full p-2 customScroll`}
      >
        {filteredImages?.map((image, idx) => (
          <Cards
            key={idx}
            sliceNumber={image.image_id}
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
