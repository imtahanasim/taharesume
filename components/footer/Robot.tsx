'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Environment, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export default function Robot() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center relative z-20 pointer-events-none">
      {/* Canvas needs pointer-events-auto to track mouse */}
      <div className="w-full h-full pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
          {/* Lighting for Gloss */}
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {/* Floating Animation Wrapper */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <RobotModel />
          </Float>

          {/* Ground Shadow */}
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </Canvas>
      </div>
    </div>
  )
}

function RobotModel() {
  const headRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (headRef.current) {
      // Smooth Mouse Tracking
      const x = state.pointer.x * 0.5 // Limit rotation range
      const y = state.pointer.y * 0.4

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, x, 0.1)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -y, 0.1)
    }
  })

  return (
    <group position={[0, 0.5, 0]}>
      {/* --- ANIMATED HEAD --- */}
      <group ref={headRef}>
        {/* Cool Cyan/Blue Helmet */}
        <RoundedBox args={[1.6, 1.1, 0.9]} radius={0.3} smoothness={8}>
          <meshPhysicalMaterial
            color="#00D4FF" // Cool Cyan/Blue
            roughness={0.15}
            metalness={0.9}
            clearcoat={1.2} // Extra shiny polish
            clearcoatRoughness={0.05}
            emissive="#001122"
            emissiveIntensity={0.2}
          />
        </RoundedBox>

        {/* Black Face Plate */}
        <RoundedBox args={[1.3, 0.75, 0.1]} radius={0.15} position={[0, 0, 0.46]}>
          <meshStandardMaterial color="#050505" roughness={0.1} />
        </RoundedBox>

        {/* Glowing Cyan Eyes */}
        <mesh position={[-0.3, 0.05, 0.52]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshBasicMaterial color="#00D4FF" />
        </mesh>
        <mesh position={[0.3, 0.05, 0.52]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshBasicMaterial color="#00D4FF" />
        </mesh>

        {/* Antenna Detail */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.06]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      </group>

      {/* --- STATIC BODY --- */}
      <group position={[0, -0.9, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <RoundedBox args={[0.8, 0.4, 0.5]} radius={0.1} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#111" />
        </RoundedBox>
      </group>
    </group>
  )
}
