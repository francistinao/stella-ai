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
import { createNoise3D } from 'simplex-noise'
import { Text } from 'troika-three-text'
import { ControlPanelProps } from '@/types/global'
import { FC } from 'react'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import texture from '@/assets/brain-texture.jpg'
import { calculateLesionArea, getSeverity, generateNoiseTexture } from '@/utils/lesionUtils'

const LesionVisualizer = () => {
  const { theme } = useThemeStore()
  const { lesionData } = useCoordsStore()
  const [toggle, setToggle] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [opacity, setOpacity] = useState(0.9)
  const [wireframe, setWireframe] = useState(false)
  const [showCrossSection, setShowCrossSection] = useState(true)
  const [crossSectionHeight, setCrossSectionHeight] = useState(0)

  const hasLesionBoundaryPoints =
    lesionData && lesionData.Lesion_Boundary_Points && lesionData.Lesion_Boundary_Points.length > 0

  useEffect(() => {
    if (!canvasRef.current || !hasLesionBoundaryPoints) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
    renderer.setSize(200, 200)
    renderer.setClearColor(0x000000, 0)

    const textureLoader = new THREE.TextureLoader()
    const brainTexture = textureLoader.load(texture)
    const backgroundMaterial = new THREE.MeshBasicMaterial({
      map: brainTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.05
    })
    const backgroundSphere = new THREE.SphereGeometry(100, 32, 32)
    const backgroundMesh = new THREE.Mesh(backgroundSphere, backgroundMaterial)
    scene.add(backgroundMesh)

    const controls = new OrbitControls(camera, renderer.domElement)

    if (lesionData && lesionData.Lesion_Boundary_Points) {
      const points = lesionData.Lesion_Boundary_Points.map(
        (coord) => new THREE.Vector3(coord[0], -coord[1], 0)
      )

      // Find the bounding box of the points
      const box = new THREE.Box3().setFromPoints(points)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      const curve = new THREE.CatmullRomCurve3(points, true)
      const curvePoints = curve.getPoints(50)

      const shape = new THREE.Shape()
      shape.moveTo(curvePoints[0].x - center.x, curvePoints[0].y - center.y)
      curvePoints.forEach((point) => shape.lineTo(point.x - center.x, point.y - center.y))

      const { width, height } = renderer.getSize(new THREE.Vector2())

      const area = calculateLesionArea(shape)
      const areaInMm = area.toFixed(2)
      const severity = getSeverity(area)

      const infoText = new Text()
      infoText.text = `Area: ${areaInMm} mm²\n${severity}`
      infoText.fontSize = 10
      infoText.color = theme === 'dark' ? 0xffffff : 0x000000
      infoText.anchorX = 'right'
      infoText.anchorY = 'bottom'
      infoText.position.set(width / 2 - 10, -height / 2 + 50, 0)
      scene.add(infoText)

      const extrudeSettings = {
        steps: 20,
        depth: Math.min(size.x, size.y) * 0.5,
        bevelEnabled: true,
        bevelThickness: size.x * 0.05,
        bevelSize: size.x * 0.05,
        bevelSegments: 5,
        curveSegments: 50
      }

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

      const noise3D = createNoise3D()
      const positions = geometry.attributes.position
      const normals = geometry.attributes.normal

      for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3()
        vertex.fromBufferAttribute(positions, i)
        const normal = new THREE.Vector3()
        normal.fromBufferAttribute(normals, i)

        const distortion = noise3D(vertex.x * 0.5, vertex.y * 0.5, vertex.z * 0.5) * 0.5
        const frontBackFactor = Math.abs(normal.z) > 0.9 ? 3 : 1
        vertex.add(normal.multiplyScalar(distortion * frontBackFactor))

        positions.setXYZ(i, vertex.x, vertex.y, vertex.z)
      }

      geometry.computeVertexNormals()

      const displacementMap = new THREE.TextureLoader().load(
        'data:image/png;base64,' + generateNoiseTexture()
      )
      displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping
      displacementMap.repeat.set(5, 5)

      const material = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.7,
        metalness: 0.2,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        displacementMap: displacementMap,
        displacementScale: 0.5,
        displacementBias: -0.25,
        wireframe: wireframe
      })

      material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `
            #include <dithering_fragment>
            gl_FragColor.rgb += vec3(0.1, 0.0, 0.0) * (1.0 - gl_FragColor.a);
            `
        )
      }

      const crossSectionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), crossSectionHeight)
      const crossSectionHelper = new THREE.PlaneHelper(crossSectionPlane, 200, 0x72fc5e)
      scene.add(crossSectionHelper)
      crossSectionHelper.visible = showCrossSection

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(center.x, center.y, 0)
      scene.add(mesh)

      const cameraDistance = Math.max(size.x, size.y) * 2
      camera.position.set(0, 0, cameraDistance)
      controls.target.set(center.x, center.y, 0)
      controls.update()

      camera.near = cameraDistance / 100
      camera.far = cameraDistance * 100
      camera.updateProjectionMatrix()

      geometry.center()
      geometry.computeBoundingSphere()

      const boundingSphere = geometry.boundingSphere
      if (boundingSphere) {
        const cameraDistance = boundingSphere.radius * 3
        camera.position.set(0, 0, cameraDistance)
        controls.target.set(0, 0, 0)
        controls.update()

        camera.near = cameraDistance / 100
        camera.far = cameraDistance * 100
        camera.updateProjectionMatrix()
      }

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
      scene.add(hemiLight)

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
      dirLight.position.set(5, 10, 7.5)
      scene.add(dirLight)

      // eslint-disable-next-line no-inner-declarations
      function animate() {
        requestAnimationFrame(animate)
        const time = Date.now() * 0.001
        mesh.rotation.x = Math.sin(time * 0.5) * 0.25
        mesh.rotation.y = Math.cos(time * 0.3) * 0.25
        controls.update()

        material.opacity = opacity
        material.wireframe = wireframe
        crossSectionHelper.visible = showCrossSection
        crossSectionPlane.constant = crossSectionHeight
        backgroundMesh.rotation.y += 0.0005

        renderer.render(scene, camera)
      }

      animate()
    }

    return () => {
      controls.dispose()
      renderer.dispose()
    }
  }, [
    hasLesionBoundaryPoints,
    lesionData,
    opacity,
    wireframe,
    showCrossSection,
    crossSectionHeight
  ])

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
          className="overflow-hidden pt-2"
          style={{ height: '300px' }}
        >
          {hasLesionBoundaryPoints ? (
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '50%', borderRadius: 5 }}
              className={`border ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-400'}`}
            />
          ) : (
            <p
              className={`text-center text-[10px] ${theme == 'dark' ? 'text-light_g' : 'text-dark'}`}
            >
              No lesion boundary points available
            </p>
          )}
          {hasLesionBoundaryPoints && (
            <ControlPanel
              opacity={opacity}
              setOpacity={setOpacity}
              wireframe={wireframe}
              setWireframe={setWireframe}
              showCrossSection={showCrossSection}
              setShowCrossSection={setShowCrossSection}
              crossSectionHeight={crossSectionHeight}
              setCrossSectionHeight={setCrossSectionHeight}
              theme={theme}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

const ControlPanel: FC<ControlPanelProps> = ({
  opacity,
  setOpacity,
  wireframe,
  setWireframe,
  showCrossSection,
  setShowCrossSection,
  crossSectionHeight,
  setCrossSectionHeight,
  theme
}) => {
  const PrettoSlider = styled(Slider)({
    color: theme === 'dark' ? '#72FC5E' : '#191919',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none'
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit'
      },
      '&::before': {
        display: 'none'
      }
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: theme === 'dark' ? '#72FC5E' : '#191919',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&::before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
      },
      '& > *': {
        transform: 'rotate(45deg)'
      }
    }
  })
  return (
    <div
      className={`${theme === 'dark' ? 'bg-sys_com text-white' : 'bg-dirty text-dark'} pb-2 rounded-lg mt-4`}
    >
      <div className="mb-2">
        <label className="block text-[10px] mb-1">Opacity: {opacity.toFixed(2)}</label>
        <PrettoSlider
          value={opacity}
          onChange={(_, value) => setOpacity(value as number)}
          valueLabelDisplay="auto"
          min={0}
          max={1}
          step={0.01}
        />
      </div>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
            className="mr-2"
          />
          <span className="text-[10px] font-medium">Wireframe</span>
        </label>
      </div>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showCrossSection}
            onChange={(e) => setShowCrossSection(e.target.checked)}
            className="mr-2"
          />
          <span className="text-[10px] font-medium">Show Cross Section</span>
        </label>
      </div>
      <div>
        <label className="block text-[10px] mb-1">
          Cross Section Height: {crossSectionHeight.toFixed(2)}
        </label>
        <PrettoSlider
          value={crossSectionHeight}
          onChange={(_, value) => setCrossSectionHeight(value as number)}
          valueLabelDisplay="auto"
          min={-5}
          max={5}
          step={0.1}
        />
      </div>
    </div>
  )
}

export default LesionVisualizer
