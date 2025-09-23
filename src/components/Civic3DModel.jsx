"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
// import { Text3D, Center } from "@react-three/drei"  // Temporarily commented out
import { motion } from "framer-motion"

const RotatingBuilding = () => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      {/* Building Base */}
      <boxGeometry args={[2, 3, 2]} />
      <meshStandardMaterial color="#3b82f6" />

      {/* Building Details */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.8]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      {/* Windows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0.8, 0.5 + i * 0.4, 1.01]}>
          <boxGeometry args={[0.3, 0.3, 0.02]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </mesh>
  )
}

const FloatingIcons = () => {
  // Temporarily simplified for debugging
  return (
    <group>
      {/* Single test icon */}
      <mesh position={[3, 2, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  )
}

const Civic3DModel = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, 10, 5]} intensity={0.5} />

          <RotatingBuilding />
          <FloatingIcons />

          {/* Temporarily commenting out Text3D component for debugging
          <Center>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.3}
              height={0.05}
              position={[0, -3, 0]}
              curveSegments={12}
            >
              CIVIC
              <meshStandardMaterial color="#1e40af" />
            </Text3D>
          </Center>
          */}

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Civic3DModel
