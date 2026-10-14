import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus } from '@react-three/drei'

export default function RotatingRing({ position = [0, 0, 0], color = '#22d3ee', speed = 1, scale = 1 }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.5
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.3
  })

  return (
    <Torus ref={ref} args={[1, 0.02, 16, 100]} position={position} scale={scale}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.7} />
    </Torus>
  )
}
