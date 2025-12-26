'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, SphereGeometry, MeshPhysicalMaterial } from 'three'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'

// Simplex noise implementation for wobble effect
function noise(x: number, y: number, z: number): number {
  const p = new Array(512)
  const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
  ]

  for (let i = 0; i < 256; i++) {
    p[256 + i] = p[i] = permutation[i]
  }

  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255

  x -= Math.floor(x)
  y -= Math.floor(y)
  z -= Math.floor(z)

  const u = x * x * x * (x * (x * 6 - 15) + 10)
  const v = y * y * y * (y * (y * 6 - 15) + 10)
  const w = z * z * z * (z * (z * 6 - 15) + 10)

  const A = p[X] + Y
  const AA = p[A] + Z
  const AB = p[A + 1] + Z
  const B = p[X + 1] + Y
  const BA = p[B] + Z
  const BB = p[B + 1] + Z

  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return (
    grad(p[AA], x, y, z) * (1 - u) * (1 - v) * (1 - w) +
    grad(p[BA], x - 1, y, z) * u * (1 - v) * (1 - w) +
    grad(p[AB], x, y - 1, z) * (1 - u) * v * (1 - w) +
    grad(p[BB], x - 1, y - 1, z) * u * v * (1 - w) +
    grad(p[AA + 1], x, y, z - 1) * (1 - u) * (1 - v) * w +
    grad(p[BA + 1], x - 1, y, z - 1) * u * (1 - v) * w +
    grad(p[AB + 1], x, y - 1, z - 1) * (1 - u) * v * w +
    grad(p[BB + 1], x - 1, y - 1, z - 1) * u * v * w
  )
}

function BlobMesh() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const timeRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMouse({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return

    timeRef.current += delta * 0.5

    // Continuous color cycling - changes hue over time
    const colorTime = timeRef.current * 0.3 // Speed of color change
    const hue = (colorTime * 60) % 360 // Cycle through hue (0-360 degrees)
    const saturation = 0.6 + Math.sin(colorTime * 0.5) * 0.3 // Vary saturation (0.3-0.9)
    const lightness = 0.85 + Math.cos(colorTime * 0.7) * 0.1 // Vary lightness (0.75-0.95)

    // Convert HSL to RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      h /= 360
      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs(((h * 6) % 2) - 1))
      const m = l - c / 2
      let r = 0, g = 0, b = 0
      if (h < 1/6) { r = c; g = x; b = 0 }
      else if (h < 2/6) { r = x; g = c; b = 0 }
      else if (h < 3/6) { r = 0; g = c; b = x }
      else if (h < 4/6) { r = 0; g = x; b = c }
      else if (h < 5/6) { r = x; g = 0; b = c }
      else { r = c; g = 0; b = x }
      return `#${Math.round((r + m) * 255).toString(16).padStart(2, '0')}${Math.round((g + m) * 255).toString(16).padStart(2, '0')}${Math.round((b + m) * 255).toString(16).padStart(2, '0')}`
    }

    const dynamicColor = hslToRgb(hue, saturation, lightness)

    // Update material color continuously
    materialRef.current.color.set(dynamicColor)
    
    // Also update sheen color for more variation
    const sheenHue = (hue + 180) % 360 // Complementary color
    const sheenColor = hslToRgb(sheenHue, 0.8, 0.7)
    materialRef.current.sheenColor.set(sheenColor)
    
    // Vary iridescence intensity for more dynamic effect
    materialRef.current.iridescence = 1.2 + Math.sin(colorTime * 0.4) * 0.3

    const geometry = meshRef.current.geometry as SphereGeometry
    const positions = geometry.attributes.position

    // Apply noise-based wobble to vertices
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      const radius = Math.sqrt(x * x + y * y + z * z)
      const normalizedX = x / radius
      const normalizedY = y / radius
      const normalizedZ = z / radius

      const n = noise(
        normalizedX * 2 + timeRef.current,
        normalizedY * 2 + timeRef.current,
        normalizedZ * 2 + timeRef.current
      )

      const displacement = n * 0.45
      const newRadius = 3 + displacement

      positions.setX(i, normalizedX * newRadius)
      positions.setY(i, normalizedY * newRadius)
      positions.setZ(i, normalizedZ * newRadius)
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()

    // Rotate based on mouse position and time
    const rotationSpeedX = mouse.y * 0.3 + 0.1
    const rotationSpeedY = mouse.x * 0.3 + 0.1

    meshRef.current.rotation.x += rotationSpeedX * delta
    meshRef.current.rotation.y += rotationSpeedY * delta
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#f0f0ff"
        metalness={0.6}
        roughness={0.08}
        clearcoat={1.5}
        clearcoatRoughness={0.02}
        iridescence={1.2}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[50, 1000]}
        transmission={0.4}
        thickness={2.5}
        ior={1.6}
        envMapIntensity={2}
        sheen={0.8}
        sheenColor="#ff00ff"
        sheenRoughness={0.3}
      />
    </mesh>
  )
}

export default function BlobScene() {
  return (
    <>
      <Environment preset="city" environmentIntensity={2.5} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#ff6b9d" />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#00d4ff" />
      <pointLight position={[10, 0, -10]} intensity={1} color="#ffd700" />
      <BlobMesh />
    </>
  )
}

