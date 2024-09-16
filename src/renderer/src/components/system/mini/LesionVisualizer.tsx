/* eslint-disable react/no-unknown-property */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef, useCallback } from 'react'
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
import { useToolStore } from '@/store/tool'
import { Vector3 } from 'three'

const LesionVisualizer = () => {
  const { theme } = useThemeStore()
  const { lesionData } = useCoordsStore()
  const { boundaryColor } = useToolStore()
  const [toggle, setToggle] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [opacity, setOpacity] = useState(0.9)
  const [wireframe, setWireframe] = useState(false)
  const [showCrossSection, setShowCrossSection] = useState(true)
  const [crossSectionHeight, setCrossSectionHeight] = useState(0)
  const [meshMaterial, setMeshMaterial] = useState<THREE.MeshStandardMaterial | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const crossSectionHelperRef = useRef<THREE.PlaneHelper | null>(null)
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [showAxes, setShowAxes] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 0, 50))
  const moveSpeed = 4
  const animationFrameRef = useRef<number>()

  const hasLesionBoundaryPoints =
    lesionData && lesionData.Lesion_Boundary_Points && lesionData.Lesion_Boundary_Points.length > 0

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!cameraRef.current || !controlsRef.current) return

      const direction = new THREE.Vector3()
      cameraRef.current.getWorldDirection(direction)
      direction.normalize()
      const right = new THREE.Vector3()
      right.crossVectors(direction, cameraRef.current.up).normalize()

      let moveVector = new THREE.Vector3()

      switch (event.key) {
        case 'ArrowUp':
          moveVector = direction.multiplyScalar(moveSpeed)
          break
        case 'ArrowDown':
          moveVector = direction.multiplyScalar(-moveSpeed)
          break
        case 'ArrowLeft':
          moveVector = right.multiplyScalar(-moveSpeed)
          break
        case 'ArrowRight':
          moveVector = right.multiplyScalar(moveSpeed)
          break
      }

      cameraRef.current.position.add(moveVector)
      controlsRef.current.target.add(moveVector)
      controlsRef.current.update()

      setCameraPosition(cameraRef.current.position.clone())
    },
    [moveSpeed]
  )

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return

    cameraRef.current.position.copy(cameraPosition)
    controlsRef.current.target.copy(cameraPosition).add(new THREE.Vector3(0, 0, -1))
    controlsRef.current.update()
  }, [cameraPosition])

  useEffect(() => {
    if (!canvasRef.current || !hasLesionBoundaryPoints) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.copy(cameraPosition)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
    renderer.setSize(200, 200)
    renderer.setClearColor(0x000000, 0)

    const textureLoader = new THREE.TextureLoader()
    const brainTexture = textureLoader.load(texture)
    const backgroundMaterial = new THREE.MeshBasicMaterial({
      map: brainTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
    })
    const backgroundSphere = new THREE.SphereGeometry(100, 32, 32)
    const backgroundMesh = new THREE.Mesh(backgroundSphere, backgroundMaterial)
    scene.add(backgroundMesh)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    controls.enablePan = true

    if (lesionData && lesionData.Lesion_Boundary_Points) {
      const points = lesionData.Lesion_Boundary_Points.map(
        (coord) => new THREE.Vector3(coord[0], -coord[1], 0)
      )

      const curve = new THREE.CatmullRomCurve3(points, true)
      const curvePoints = curve.getPoints(50)

      const shape = new THREE.Shape()
      shape.moveTo(curvePoints[0].x, curvePoints[0].y)
      curvePoints.forEach((point) => shape.lineTo(point.x, point.y))

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
      infoText.position.set(width / 4 - 10, -height / 1.8 + 20, 0)
      scene.add(infoText)

      const extrudeSettings = {
        steps: 20,
        depth: 10,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1,
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
        color: parseInt(boundaryColor?.color?.slice(1) ?? '8b0000', 16),
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

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      setMeshMaterial(material)
      meshRef.current = mesh

      geometry.center()
      geometry.computeBoundingSphere()

      if (geometry.boundingSphere) {
        const center = geometry.boundingSphere.center
        mesh.position.set(-center.x, -center.y, -center.z)
      }

      const crossSectionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), crossSectionHeight)
      const crossSectionHelper = new THREE.PlaneHelper(crossSectionPlane, 200, 0x72fc5e)
      scene.add(crossSectionHelper)
      crossSectionHelperRef.current = crossSectionHelper

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

      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer
      controlsRef.current = controls

      renderer.render(scene, camera)
    }

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      controls.dispose()
      renderer.dispose()
    }
  }, [
    hasLesionBoundaryPoints,
    lesionData,
    crossSectionHeight,
    opacity,
    wireframe,
    showCrossSection,
    rotationSpeed,
    boundaryColor,
    theme
  ])

  useEffect(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !meshRef.current ||
      !controlsRef?.current
    )
      return

    const animate = () => {
      requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      if (meshRef.current) {
        meshRef.current.rotation.x = Math.sin(time * rotationSpeed) * 0.25
        meshRef.current.rotation.y = Math.cos(time * rotationSpeed * 0.6) * 0.25

        const material = meshRef.current.material as THREE.MeshStandardMaterial
        material.opacity = opacity
        material.wireframe = wireframe
      }

      controlsRef?.current?.update()

      if (crossSectionHelperRef.current) {
        crossSectionHelperRef.current.visible = showCrossSection
        crossSectionHelperRef.current.plane.constant = crossSectionHeight
      }

      const backgroundMesh = sceneRef?.current?.getObjectByName('backgroundMesh') as THREE.Mesh
      if (backgroundMesh) {
        backgroundMesh.rotation.y += 0.0005
      }

      if (sceneRef.current && cameraRef.current) {
        rendererRef?.current?.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()
  }, [opacity, wireframe, showCrossSection, crossSectionHeight, rotationSpeed])

  useEffect(() => {
    if (meshMaterial && boundaryColor?.color) {
      meshMaterial.color.setHex(parseInt(boundaryColor.color.slice(1), 16))
    }
  }, [boundaryColor, meshMaterial])

  useEffect(() => {
    if (crossSectionHelperRef.current) {
      crossSectionHelperRef.current.visible = showCrossSection
    }
  }, [showCrossSection])

  useEffect(() => {
    if (!sceneRef.current || !meshRef.current) return

    sceneRef.current.children = sceneRef.current.children.filter(
      (child) => !(child.name === 'measurement' || child.name === 'axis')
    )

    if (showMeasurements) {
      const box = new THREE.Box3().setFromObject(meshRef.current)
      const size = box.getSize(new Vector3())

      const addDimensionLine = (start, end, label) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        const line = new THREE.Line(lineGeometry, lineMaterial)
        line.name = 'measurement'
        sceneRef.current?.add(line)

        const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5)
        const dimensionLabel = new Text()
        dimensionLabel.text = `${label}: ${size[label]?.toFixed(2) || 'N/A'} mm`
        dimensionLabel.fontSize = 5
        dimensionLabel.position.copy(midPoint)
        dimensionLabel.name = 'measurement'
        sceneRef.current?.add(dimensionLabel)
      }

      addDimensionLine(
        new Vector3(box.min.x, box.min.y, box.min.z),
        new Vector3(box.max.x, box.min.y, box.min.z),
        'x'
      )
      addDimensionLine(
        new Vector3(box.min.x, box.min.y, box.min.z),
        new Vector3(box.min.x, box.max.y, box.min.z),
        'y'
      )
      addDimensionLine(
        new Vector3(box.min.x, box.min.y, box.min.z),
        new Vector3(box.min.x, box.min.y, box.max.z),
        'z'
      )
    }

    if (showAxes) {
      const axesHelper = new THREE.AxesHelper(50)
      axesHelper.name = 'axis'
      sceneRef.current.add(axesHelper)
    }
  }, [showMeasurements, showAxes])

  useEffect(() => {
    if (crossSectionHelperRef.current) {
      crossSectionHelperRef.current.visible = showCrossSection
    }
  }, [showCrossSection])

  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.copy(cameraPosition)
      controlsRef.current.update()
    }
  }, [cameraPosition])

  return (
    <div
      className={`${theme === 'dark' ? 'bg-dark' : 'bg-dirty'} rounded-lg flex flex-col gap-4 p-3 overflow-y-auto`}
      tabIndex={0}
      onFocus={() => {
        window.addEventListener('keydown', handleKeyDown)
      }}
      onBlur={() => {
        window.removeEventListener('keydown', handleKeyDown)
      }}
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
              showMeasurements={showMeasurements}
              setShowMeasurements={setShowMeasurements}
              showAxes={showAxes}
              setShowAxes={setShowAxes}
              rotationSpeed={rotationSpeed}
              setRotationSpeed={setRotationSpeed}
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
  showMeasurements,
  setShowMeasurements,
  showAxes,
  setShowAxes,
  rotationSpeed,
  setRotationSpeed,
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
      className={`${theme === 'dark' ? 'bg-sys_com text-white' : 'bg-dirty text-dark'} px-4 pb-2 rounded-lg mt-4`}
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
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showMeasurements}
            onChange={(e) => setShowMeasurements(e.target.checked)}
            className="mr-2"
          />
          <span className="text-[10px] font-medium">Show Measurements</span>
        </label>
      </div>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showAxes}
            onChange={(e) => setShowAxes(e.target.checked)}
            className="mr-2"
          />
          <span className="text-[10px] font-medium">Show Axes</span>
        </label>
      </div>
      <div>
        <label className="block text-[10px] mb-1">Rotation Speed: {rotationSpeed.toFixed(2)}</label>
        <PrettoSlider
          value={rotationSpeed}
          onChange={(_, value) => setRotationSpeed(value as number)}
          valueLabelDisplay="auto"
          min={0}
          max={2}
          step={0.1}
        />
      </div>
    </div>
  )
}

export default LesionVisualizer
