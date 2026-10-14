import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'

export default function FloatingOrb({ position = [0, 0, 0], color = '#7c3aed', speed = 1, distort = 0.4, scale = 1 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </Sphere>
  )
}
