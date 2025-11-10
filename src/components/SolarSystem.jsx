import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function SolarSystem({ onPlanetClick, onReady }) {
  const mountRef = useRef(null)
  const requestRef = useRef(null)

  const planetData = useMemo(() => ([
    { id: 'mercury', name: 'Mercury', radius: 0.38, distance: 8, color: '#a6a6a6', speed: 0.04, rotation: 0.02 },
    { id: 'venus',   name: 'Venus',   radius: 0.95, distance: 11, color: '#d4b48c', speed: 0.015, rotation: -0.005 },
    { id: 'earth',   name: 'Earth',   radius: 1.0,  distance: 14, color: '#2e86de', speed: 0.01, rotation: 0.03 },
    { id: 'mars',    name: 'Mars',    radius: 0.53, distance: 17, color: '#c1440e', speed: 0.008, rotation: 0.028 },
    { id: 'jupiter', name: 'Jupiter', radius: 11.2, distance: 23, color: '#d2b48c', speed: 0.002, rotation: 0.07 },
    { id: 'saturn',  name: 'Saturn',  radius: 9.45, distance: 29, color: '#e5c97b', speed: 0.0018, rotation: 0.06, rings: true },
    { id: 'uranus',  name: 'Uranus',  radius: 4.0,  distance: 34, color: '#7fd1d8', speed: 0.001, rotation: 0.05 },
    { id: 'neptune', name: 'Neptune', radius: 3.9,  distance: 39, color: '#4169e1', speed: 0.0008, rotation: 0.045 },
  ]), [])

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.set(0, 18, 48)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    // Resize handling
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Starfield background
    const starsGeo = new THREE.BufferGeometry()
    const starCount = 4000
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 1000
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starsMat = new THREE.PointsMaterial({ color: 0x9bbcff, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.8 })
    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    // Sun with glow
    const sunGroup = new THREE.Group()
    const sunGeo = new THREE.SphereGeometry(5, 64, 64)
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc66 })
    const sun = new THREE.Mesh(sunGeo, sunMat)
    sunGroup.add(sun)

    const glowGeo = new THREE.SphereGeometry(6.8, 64, 64)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffe6a3, transparent: true, opacity: 0.25 })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    sunGroup.add(glow)

    scene.add(sunGroup)

    // Lighting
    const ambient = new THREE.AmbientLight(0x8899ff, 0.6)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 2.2)
    dir.position.set(0, 0, 0) // from sun
    dir.castShadow = false
    scene.add(dir)

    // Orbits + Planets
    const planetGroups = []

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x6aa7ff, transparent: true, opacity: 0.3 })

    planetData.forEach((p) => {
      const orbit = new THREE.EllipseCurve(0, 0, p.distance, p.distance)
      const points = orbit.getPoints(64)
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map(pt => new THREE.Vector3(pt.x, 0, pt.y)))
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMaterial)
      scene.add(orbitLine)

      const group = new THREE.Group()
      const geo = new THREE.SphereGeometry(p.radius, 48, 48)
      const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(p.color), roughness: 0.8, metalness: 0.1 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.castShadow = false
      mesh.receiveShadow = false
      mesh.userData = { id: p.id }
      group.add(mesh)

      if (p.rings) {
        const ringGeo = new THREE.RingGeometry(p.radius * 1.7, p.radius * 2.6, 64)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8d8a0, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2.4
        group.add(ring)
      }

      scene.add(group)
      planetGroups.push({ def: p, group, mesh })
    })

    // Raycaster for picking
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(planetGroups.map(p => p.mesh))
      if (intersects.length > 0 && onPlanetClick) {
        const id = intersects[0].object.userData.id
        onPlanetClick(id)
      }
    }
    renderer.domElement.addEventListener('click', onClick)

    // Simple orbit camera controls (custom minimal)
    let azimuth = 0.8
    let elevation = 0.35
    let radius = 58
    const target = new THREE.Vector3(0, 0, 0)

    const updateCamera = () => {
      const x = target.x + radius * Math.cos(elevation) * Math.cos(azimuth)
      const y = target.y + radius * Math.sin(elevation)
      const z = target.z + radius * Math.cos(elevation) * Math.sin(azimuth)
      camera.position.set(x, y, z)
      camera.lookAt(target)
    }

    let dragging = false
    let lastX = 0, lastY = 0
    const onPointerDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY }
    const onPointerUp = () => { dragging = false }
    const onPointerMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      azimuth -= dx * 0.005
      elevation = Math.max(-1.2, Math.min(1.2, elevation - dy * 0.004))
      lastX = e.clientX
      lastY = e.clientY
    }
    const onWheel = (e) => {
      radius = Math.max(20, Math.min(120, radius + e.deltaY * 0.02))
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('wheel', onWheel)

    // Animation loop
    const startTime = performance.now()
    const animate = () => {
      const t = (performance.now() - startTime) / 1000

      // rotate sun subtle
      sunGroup.rotation.y += 0.0015

      planetGroups.forEach(({ def, group, mesh }) => {
        const angle = t * def.speed * 2
        const x = Math.cos(angle) * def.distance
        const z = Math.sin(angle) * def.distance
        group.position.set(x, 0, z)
        mesh.rotation.y += def.rotation
      })

      updateCamera()
      renderer.render(scene, camera)
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)

    onReady && onReady()

    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('click', onClick)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('wheel', onWheel)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [planetData, onPlanetClick, onReady])

  return (
    <div ref={mountRef} className="w-full h-full" />
  )
}
