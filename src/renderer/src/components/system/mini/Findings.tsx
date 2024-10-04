/* eslint-disable prettier/prettier */
/* eslint-disable-next-line */
import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/theme'
import { MdKeyboardArrowDown } from 'react-icons/md'
import logo from '@/assets/logo.png'
import { motion } from 'framer-motion'
import { useStoredImages } from '@/store/stored_images'
import mascot from '@/assets/mascot.png'
import mascot_head from '@/assets/logo.png'
import { useResultStore, useCaptureStore } from '@/store/result'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const Findings: React.FC<{ width: number }> = ({ width }) => {
  const { newResult } = useResultStore()
  const { isLoading } = useStoredImages()
  const [isStrokeFindingsFindingsDrop, setIsStrokeFindingsDrop] = useState(true)
  const [isLesionBoundaryDrop, setIsLesionBoundaryDrop] = useState(false)
  const { theme } = useThemeStore()
  const { setIsCapture } = useCaptureStore()
  const [barThickness, setBarThickness] = useState(10)
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null)

  const calculateBarThickness = (width: number): number => {
    if (width == 600) {
      return 15
    } else if (width > 600 && width < 1200) {
      return 20
    } else {
      return 25
    }
  }

  useEffect(() => {
    const newBarThickness = calculateBarThickness(width)
    setBarThickness(newBarThickness)
  }, [width])

  useEffect(() => {
    const ctx = document.getElementById('houndsfieldHistogram') as HTMLCanvasElement
    const houndsfieldData = newResult?.classification?.houndsfield_unit || []

    const filteredData = houndsfieldData.filter((value) => value >= 0 && value <= 100)
    const mean =
      filteredData.length > 0
        ? filteredData.reduce((sum, value) => sum + value, 0) / filteredData.length
        : 0

    const histogramData = {
      labels: Array.from({ length: 50 }, (_, i) => `${i * 2}-${i * 2 + 2}`).filter((_, i) => {
        const count = filteredData.filter((value) => value >= i * 2 && value < (i + 1) * 2).length
        return count > 0
      }),
      datasets: [
        {
          label: 'Hounsfield Units',
          data: Array(50)
            .fill(0)
            .map(
              (_, i) => filteredData.filter((value) => value >= i * 2 && value < (i + 1) * 2).length
            )
            .filter((count) => count > 0),
          backgroundColor: '#72FC5E',
          barThickness: barThickness
        }
      ]
    }

    const histogramChart = new Chart(ctx, {
      type: 'bar',
      data: histogramData,
      options: {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        onClick: (event) => {
          const activePoints = histogramChart.getElementsAtEventForMode(
            event as unknown as Event,
            'nearest',
            { intersect: true },
            true
          )
          if (activePoints.length) {
            const index = activePoints[0].index
            setSelectedBarIndex(index)
          } else {
            setSelectedBarIndex(null)
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Frequency'
            }
          },
          x: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Hounsfield Units'
            },
            stacked: false
          }
        },
        plugins: {
          annotations: {
            line1: {
              type: 'line',
              yMin: 0,
              yMax: Math.max(...histogramData.datasets[0].data),
              xMin: mean < 2 ? 0 : Math.floor(mean / 2),
              xMax: mean < 2 ? 0 : Math.floor(mean / 2),
              borderColor: 'red',
              borderWidth: 2,
              label: {
                content: `Mean: ${mean.toFixed(2)}`,
                enabled: true,
                position: 'top',
                color: 'red'
              }
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    })

    if (selectedBarIndex !== null) {
      histogramChart.data.datasets[0].data = histogramData.datasets[0].data.map((value, index) =>
        index === selectedBarIndex ? value : 0
      )
    } else {
      histogramChart.data.datasets[0].data = histogramData.datasets[0].data
    }
    histogramChart.update()

    return () => {
      histogramChart.destroy()
    }
  }, [newResult, width, selectedBarIndex])

  return (
    <div
      className={`${theme === 'dark' ? 'bg-dark' : 'bg-[#797979]'} rounded-lg flex flex-col gap-4 p-3`}
    >
      <div
        className={`rounded-full w-full px-3 py-1 flex gap-2 items-center ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'}`}
      >
        <img src={logo} className="w-10" alt="STELLA.ai Logo" />
        <h1 className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-semibold text-xs`}>
          Screening Results
        </h1>
      </div>
      {/* Stroke findings */}
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} p-4 rounded-lg flex flex-col`}
      >
        <div
          className={`pb-2 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
        >
          <div
            className={`${theme === 'dark' ? 'text-light_g ' : 'text-dark'} flex gap-3 items-center`}
          >
            <h1 className="text-sm font-semibold">Stroke Findings</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isStrokeFindingsFindingsDrop ? 180 : 0 }}
            onClick={() => setIsStrokeFindingsDrop(!isStrokeFindingsFindingsDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isStrokeFindingsFindingsDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-2"
        >
          {!isLoading && !newResult?.stroke_type && (
            <div className="flex flex-col gap-4 justify-center place-items-center">
              <motion.img
                animate={{ y: [-10, 10, -10], transition: { duration: 1.5, repeat: Infinity } }}
                src={mascot}
                alt="STELLA.ai Mascot"
                className="w-64 h-auto"
              />
              <h1 className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-semibold`}>
                Start Segmentate
              </h1>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col gap-4 justify-center place-items-center">
              <motion.img
                animate={{
                  x: [0, 50, 0, -50, 0],
                  y: [0, 10, 20, 10, 0],
                  transition: { duration: 2.5, repeat: Infinity }
                }}
                src={mascot_head}
                alt="STELLA.ai Mascot"
                className="w-24 h-auto"
              />
              <h1 className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-semibold`}>
                Detecting Lesions...
              </h1>
            </div>
          )}

          {!isLoading ? (
            typeof newResult?.stroke_type === 'string' &&
            newResult.stroke_type !== '' &&
            (newResult.stroke_type === 'Ischemic Stroke' ||
              newResult.stroke_type === 'Hemorrhagic Stroke' ||
              newResult.stroke_type !== 'No relevant strokes detected') ? (
              <>
                <div
                  className={`w-full items-start grid grid-cols-2 gap-x-2 gap-y-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                >
                  <div className="col-span-1 flex flex-col">
                    <p className="text-[15px] font-bold text-light_g">{newResult?.stroke_type}</p>
                    <p className="text-[9px] font-semibold">
                      {newResult?.classification?.type?.type}
                    </p>
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <p className="text-[12px] text-light_g font-semibold">
                      Houndsfield Unit:{' '}
                      <span className="font-bold">
                        {newResult?.classification?.density_value?.toFixed(2)}
                      </span>
                    </p>
                    <p className="font-bold">
                      <h1
                        className={`text-[10px] ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                      >
                        Lesion Area in pixels
                      </h1>
                      <h1
                        className={`text-[12px] ${theme === 'dark' ? 'text-white' : 'text-dark'} font-semibold`}
                      >
                        {newResult?.lesion_boundary_points?.Area}
                      </h1>
                    </p>
                  </div>
                  <div className="cols-span-2 w-full flex items-start justify-between gap-12">
                    <p
                      className={`text-[12px] ${theme === 'dark' ? 'text-white' : 'text-dark'} font-semibold`}
                    >
                      Lesion Mean {newResult?.lesion_boundary_points?.Mean}
                    </p>
                    <p
                      className={`text-[12px] ${theme === 'dark' ? 'text-white' : 'text-dark'} font-semibold`}
                    >
                      Confidence: {newResult?.classification?.confidence?.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="w-full"></div>
                <button
                  onClick={() => {
                    setIsCapture(true)
                  }}
                  className={`font-semibold text-xs border-2 ${theme === 'dark' ? 'bg-gray_l text-white border-zinc-700' : 'bg-white border-zinc-300 text-black'} rounded-full text-center py-2 w-full mt-4`}
                >
                  Add detection to findings
                </button>
              </>
            ) : (
              <>
                <div
                  className={`flex items-center gap-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">{newResult?.stroke_type}</p>
                  </div>
                </div>
              </>
            )
          ) : (
            <></>
          )}
        </motion.div>
      </div>

      {/* End of stroke findings */}
      {/* Houndsfield Scale Unit Distribution */}
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} p-4 rounded-lg flex flex-col`}
      >
        <div
          className={`pb-2 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
        >
          <div
            className={`${theme === 'dark' ? 'text-light_g ' : 'text-dark'} flex gap-3 items-center`}
          >
            <h1 className="font-semibold text-xs">Houndsfield Scale Unit Distribution</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isLesionBoundaryDrop ? 180 : 0 }}
            onClick={() => setIsLesionBoundaryDrop(!isLesionBoundaryDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isLesionBoundaryDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden py-2 max-h-[300px] overflow-y-auto customScroll"
        >
          <div
            className={`w-full flex flex-col gap-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            <div className="chart-container">
              <canvas id="houndsfieldHistogram"></canvas>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Findings
