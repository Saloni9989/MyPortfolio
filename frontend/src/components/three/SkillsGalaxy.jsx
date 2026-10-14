import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Html, Sphere, MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei'
import { SKILLS } from '../../utils/constants'

function SkillNode({ skill, index, total, radius = 4 }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const angle = (index / total) * Math.PI * 2
  const yOffset = Math.sin((index / total) * Math.PI * 4) * 1.5
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.position.y = yOffset + Math.sin(t * 0.5 + index) * 0.2
    if (hovered) {
      meshRef.current.scale.setScalar(1.4)
    } else {
      meshRef.current.scale.setScalar(1)
    }
  })

  return (
    <group position={[x, yOffset, z]}>
      <Sphere
        ref={meshRef}
        args={[0.35, 32, 32]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered ? 1 : 0.3}
          distort={hovered ? 0.5 : 0.2}
          speed={2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {hovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            border: `1px solid ${skill.color}`,
            borderRadius: '12px',
            padding: '10px 14px',
            minWidth: '160px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 20px ${skill.color}50`,
          }}>
            <div style={{ color: skill.color, fontWeight: 'bold', fontSize: '14px' }}>{skill.name}</div>
            <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '3px' }}>{skill.proficiency}% proficiency</div>
            <div style={{ height: '4px', background: '#1e293b', borderRadius: '2px', marginTop: '6px' }}>
              <div style={{ height: '100%', width: `${skill.proficiency}%`, background: skill.color, borderRadius: '2px' }} />
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function CenterOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.5
    ref.current.rotation.x = state.clock.elapsedTime * 0.3
  })

  return (
    <Sphere ref={ref} args={[0.8, 64, 64]}>
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#a855f7"
        emissiveIntensity={0.6}
        distort={0.4}
        speed={3}
        metalness={1}
        roughness={0}
      />
    </Sphere>
  )
}

function OrbitLine({ radius }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.1
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 8, 100]} />
      <meshStandardMaterial color="#7c3aed" transparent opacity={0.15} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#7c3aed" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#22d3ee" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />

      <Stars radius={50} depth={30} count={1000} factor={2} fade speed={0.3} />

      <CenterOrb />
      <OrbitLine radius={4} />

      {SKILLS.map((skill, i) => (
        <SkillNode key={skill.name} skill={skill} index={i} total={SKILLS.length} radius={4} />
      ))}

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} enablePan={false} />
    </>
  )
}

export default function SkillsGalaxy() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [0, 3, 10], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  )
}
