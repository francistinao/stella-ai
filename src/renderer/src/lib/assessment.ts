/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
interface ResizeProps {
  x: number | null
  y: number | null
}

export const resizeLesionPoints = (
  type: string,
  lesions: number[][],
  canvasSize: number
): ResizeProps[] => {
  // must check type is valid and assign scaleFactor
  const scaleFactor = type === 'Ischemic Stroke' ? 3.1 : 2.4

  // size of image is static based on the image passed on the backend for matching the coordinates' plots
  const originalSize = 512

  const canvasRatio = canvasSize / originalSize

  // scaling factor and offsets from scaleCoordinates
  const additionalScaleFactor = 0.3
  const offsetX = 5
  const offsetY = 50

  const newLesions = lesions.map((lesion) => ({
    x: lesion[0] * scaleFactor * canvasRatio * additionalScaleFactor + offsetX,
    y: lesion[1] * scaleFactor * canvasRatio * additionalScaleFactor + offsetY
  }))

  return newLesions
}

/**
 *
 * @param predictionType: Prediction of the user
 * @param type: Prediction of the model
 * @param predictionLesions: Prediction of the user plots
 * @param lesions: Prediction of the model where it is resized
 */

export const assessPerformance = (
  predictionType: string,
  type: string,
  predictionLesions: { x: number; y: number }[],
  userLesions: number[][],
  canvasSize: number
) => {
  console.log('Assessing performance with:', {
    predictionType,
    type,
    predictionLesions,
    userLesions,
    canvasSize
  })

  if (!Array.isArray(predictionLesions) || !Array.isArray(userLesions)) {
    console.error('Invalid input: predictionLesions or userLesions is not an array')
    return { score_in_type: 0, score_in_plot: 0, total_score: 0 }
  }

  // Score for type correctness (50 points)
  const typeScore = predictionType === type ? 50 : 0

  // Distance Score Calculation (50 points)
  const maxDistance = canvasSize * 0.1
  let totalScore = 0
  const matchedPredictions = new Set()

  userLesions.forEach((userPoint) => {
    let minDistance = Infinity
    let closestPrediction: number | null = null

    predictionLesions.forEach((predictionPoint, index) => {
      if (!matchedPredictions.has(index)) {
        const distance = calculateDistance({ x: userPoint[0], y: userPoint[1] }, predictionPoint)
        if (distance < minDistance) {
          minDistance = distance
          closestPrediction = index
        }
      }
    })

    if (closestPrediction !== null) {
      matchedPredictions.add(closestPrediction)
      const pointScore = Math.max(0, 50 * (1 - minDistance / maxDistance))
      totalScore += pointScore
    }
  })

  const distanceScore = userLesions.length > 0 ? totalScore / userLesions.length : 0

  const finalScore = typeScore + distanceScore

  return {
    score_in_type: typeScore,
    score_in_plot: Math.round(distanceScore),
    total_score: Math.round(finalScore)
  }
}

const calculateDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}
