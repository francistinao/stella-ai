/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import { Navbar, TitleBar } from '@/components/components'
import SettingsBar from '@/components/system/SettingsBar'
import Ruler from '@scena/react-ruler'

import RandomCTScan from '@/components/gamification/RandomCTScan'
import SidePanel from '@/components/gamification/SidePanel'

import { allImages } from '@/data/ctscans'

const steps = [
  {
    instruction:
      'Identify the brain lesion and classify the type of stroke from this randomly selected CT Scan.',
    highlightArea: { top: 215, left: -130, width: 280, height: 280 }
  },
  {
    instruction: 'Analyze the CT Scan and mark your guess on the canvas.',
    highlightArea: { top: 85, left: -273, width: 880, height: 620 }
  },
  {
    instruction: 'Assess your performance and learn from the results.',
    highlightArea: { top: 90, left: 480, width: 270, height: 610 }
  }
]

interface Step {
  instruction: string
  highlightArea: { top: number; left: number; width: number; height: number }
}

interface Props {
  steps: Step[]
  currentStep: number
  setCurrentStep: (step: number) => void
  onClose: () => void
}

const StepModal: React.FC<Props> = ({ steps, currentStep, onClose, setCurrentStep }) => {
  const step = steps[currentStep]

  const modalPosition = {
    top: `${step.highlightArea.top}px`,
    left: `${step.highlightArea.left + step.highlightArea.width + 20}px`
  }

  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen flex items-start"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="absolute"
        style={{
          top: modalPosition.top,
          left: modalPosition.left,
          pointerEvents: 'auto'
        }}
      >
        <div className="relative bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
          <div className="mb-4">
            <h2 className="text-lg font-bold">Step {currentStep + 1}</h2>
            <p>{step.instruction}</p>
          </div>
          <div
            className="absolute border-2 border-light_g"
            style={{
              top: `${step.highlightArea.top}px`,
              left: `${step.highlightArea.left}px`,
              width: `${step.highlightArea.width}px`,
              height: `${step.highlightArea.height}px`,
              pointerEvents: 'none'
            }}
          />
          <div className="flex justify-between mt-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 bg-dark text-white rounded-lg"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-dark text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button onClick={onClose} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Simulator: React.FC = () => {
  const [random, setRandom] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const rulerRef = useRef<HTMLDivElement>(null)

  const getRandomCTScan = (): string => {
    const randomImage = allImages[Math.floor(Math.random() * allImages.length)]
    return randomImage
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    const randomImage = getRandomCTScan()
    setRandom(randomImage)

    openModal()
  }, [])

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <TitleBar />
      <SettingsBar />
      <div className="flex w-full h-screen pb-4">
        <div className="w-[600px] min-h-screen p-10 flex items-center justify-center">
          <img src={random!} className="object-contain" draggable={false} />
        </div>
        <div className="w-14" ref={rulerRef}>
          <Ruler type="vertical" direction="start" />
        </div>
        <RandomCTScan image={random as unknown as string} />
        <div className="w-14" ref={rulerRef}>
          <Ruler type="vertical" direction="start" />
        </div>
        <SidePanel />
      </div>

      {showModal && (
        <StepModal
          steps={steps}
          currentStep={currentStep}
          onClose={closeModal}
          setCurrentStep={setCurrentStep}
        />
      )}
    </div>
  )
}

export default Simulator
