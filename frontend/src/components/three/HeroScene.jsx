import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import FloatingOrb from './FloatingOrb'
import ParticleField from './ParticleField'
import RotatingRing from './RotatingRing'

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[0, 10, -10]} intensity={0.8} color="#3b82f6" />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <ParticleField count={600} />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <FloatingOrb position={[-3, 1, -2]} color="#7c3aed" speed={0.8} distort={0.5} scale={1.2} />
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
        <FloatingOrb position={[3, -1, -3]} color="#22d3ee" speed={1.2} distort={0.3} scale={0.8} />
      </Float>

      <Float speed={1} rotationIntensity={1} floatIntensity={0.8}>
        <FloatingOrb position={[0, 2, -4]} color="#3b82f6" speed={0.6} distort={0.6} scale={0.6} />
      </Float>

      <RotatingRing position={[-2, -2, -1]} color="#a855f7" speed={0.8} scale={2} />
      <RotatingRing position={[3, 2, -2]} color="#22d3ee" speed={1.2} scale={1.5} />
      <RotatingRing position={[0, 0, -5]} color="#3b82f6" speed={0.5} scale={3} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  )
}
