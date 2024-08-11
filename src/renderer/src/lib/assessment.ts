/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
interface ResizeProps {
  x: number | null
  y: number | null
}

export const resizeLesionPoints = (type: string, lesions: ResizeProps[]): ResizeProps[] => {
  // Check if type is valid and assign scaleFactor
  const scaleFactor = type === 'Ischemic Stroke' ? 3.1 : 2.4
  const newLesions = []
  // Loop through each lesion
  lesions.map((lesion) => {
    //eslint-disable-next-line
    //@ts-ignore
    newLesions.push([lesion[0] * scaleFactor, lesion[1] * scaleFactor])
  })

  return newLesions
}

/**
 *
 * @param predictionType: Prediction of the user
 * @param type: Prediction of the model
 * @param predictionLesions: Prediction of the user plots
 * @param lesions: Prediction of the model where it is resized
 */

//Needs to improve algorithm

export const assessPerformance = (
  predictionType: string,
  type: string,
  predictionLesions: ResizeProps[],
  userLesions: ResizeProps[]
) => {
  let score = 0

  // Score for type correctness
  const typeScore = predictionType === type ? 50 : 0

  // Distance Score Calculation
  let totalDistance = 0
  let numValidDistances = 0

  // Function to calculate Euclidean distance between two points
  const calculateDistance = (point1: { x: number; y: number }, point2: number[]) => {
    return Math.sqrt(Math.pow(point1[1] - point2[0], 2) + Math.pow(point1.y - point2[1], 2))
  }

  // For each user lesion point, find the closest prediction lesion point
  userLesions.forEach((userPoint) => {
    let minDistance = Infinity
    predictionLesions.forEach((predictionPoint) => {
      const distance = calculateDistance(userPoint, predictionPoint)
      if (distance < minDistance) {
        minDistance = distance
      }
    })

    if (minDistance !== Infinity) {
      totalDistance += minDistance
      numValidDistances++
    }
  })

  const distanceScore = numValidDistances > 0 ? totalDistance / numValidDistances : 0

  const distanceWeight = 50
  score = typeScore + (distanceWeight - distanceScore)

  if (score < 0) {
    score = 0
  }

  return { score_in_type: typeScore, score_in_plot: score }
}
