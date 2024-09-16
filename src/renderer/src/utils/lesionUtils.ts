/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

/* eslint-disable prettier/prettier */
export const calculateLesionArea = (shape: THREE.Shape): number => {
  return Math.abs(THREE.ShapeUtils.area(shape.getPoints()))
}

export const getSeverity = (area: number): string => {
  if (area < 50) return 'Mild'
  if (area < 100) return 'Moderate'
  return 'Severe'
}

export const generateNoiseTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const imageData = ctx.createImageData(256, 256)
  const noise3D = createNoise3D()

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const value = (noise3D(x / 32, y / 32, 0) + 1) * 0.5 * 255
      const index = (y * 256 + x) * 4
      imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = value
      imageData.data[index + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL().split(',')[1]
}
