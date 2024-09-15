/* eslint-disable react/no-unknown-property */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useCoordsStore } from '@/store/coords'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const LesionVisualizer = () => {
  const { theme } = useThemeStore()
  const { lesionData } = useCoordsStore()
  const [toggle, setToggle] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const hasLesionBoundaryPoints =
    lesionData && lesionData.Lesion_Boundary_Points && lesionData.Lesion_Boundary_Points.length > 0

  useEffect(() => {
    if (!canvasRef.current || !hasLesionBoundaryPoints) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })

    renderer.setSize(200, 200)
    renderer.setClearColor(0x000000, 1)

    const controls = new OrbitControls(camera, renderer.domElement)

    if (lesionData && lesionData.Lesion_Boundary_Points) {
      const points = lesionData.Lesion_Boundary_Points.map(
        (coord) => new THREE.Vector3(coord[0], -coord[1], 0)
      )

      const curve = new THREE.CatmullRomCurve3(points, true)
      const curvePoints = curve.getPoints(50)

      const shape = new THREE.Shape()
      shape.moveTo(curvePoints[0].x, curvePoints[0].y)
      curvePoints.forEach((point) => shape.lineTo(point.x, point.y))

      const extrudeSettings = {
        steps: 1,
        depth: 10,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
      }

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

      const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      const box = new THREE.Box3().setFromObject(mesh)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      camera.position.set(center.x, center.y, maxDim * 2)
      camera.lookAt(center)
      controls.target.set(center.x, center.y, center.z)
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 10, 10)
    scene.add(directionalLight)

    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      controls.dispose()
      renderer.dispose()
    }
  }, [hasLesionBoundaryPoints, lesionData])

  return (
    <div
      className={`${theme === 'dark' ? 'bg-dark' : 'bg-dirty'} rounded-lg flex flex-col gap-4 p-3`}
    >
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} p-4 rounded-lg flex flex-col`}
      >
        <div
          className={`pb-2 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
        >
          <div
            className={`${theme === 'dark' ? 'text-light_g ' : 'text-dark'} flex gap-3 items-center`}
          >
            <h1 className="text-sm font-semibold">Lesion 3D Visualizer</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: toggle ? 180 : 0 }}
            onClick={() => setToggle(!toggle)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: toggle ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-8"
          style={{ height: '300px' }}
        >
          {hasLesionBoundaryPoints ? (
            <canvas ref={canvasRef} style={{ width: '100%', height: '50%', borderRadius: 5 }} />
          ) : (
            <p
              className={`text-center text-[10px] ${theme == 'dark' ? 'text-light_g' : 'text-dark'}`}
            >
              No lesion boundary points available
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default LesionVisualizer
