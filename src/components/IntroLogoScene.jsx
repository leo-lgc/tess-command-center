import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'

function CoreShape({ palette }) {
  const outerRef = useRef(null)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.2
      outerRef.current.rotation.y += delta * 0.28
      outerRef.current.scale.setScalar(1 + Math.sin(t * 0.85) * 0.015)
    }
  })

  return (
    <Float speed={0.95} rotationIntensity={0.38} floatIntensity={0.2}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshStandardMaterial
          color={palette.polyColor}
          emissive={palette.polyEmissive}
          emissiveIntensity={palette.polyEmissiveIntensity}
          roughness={0.24}
          metalness={0.58}
          wireframe
        />
      </mesh>
    </Float>
  )
}

export default function IntroLogoScene({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const palette = isLight
    ? {
        background: '#f1f6f3',
        fog: '#f1f6f3',
        pointA: '#2ca26f',
        pointB: '#7bc9a6',
        sparkle: '#3bba84',
        polyColor: '#24ad77',
        polyEmissive: '#118357',
        polyEmissiveIntensity: 0.28,
      }
    : {
        background: '#06090d',
        fog: '#06090d',
        pointA: '#8af6cc',
        pointB: '#33b887',
        sparkle: '#83f7c9',
        polyColor: '#6ef2c4',
        polyEmissive: '#16a574',
        polyEmissiveIntensity: 0.4,
      }

  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 48 }} gl={{ alpha: true }}>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, 5, 11.5]} />
      <ambientLight intensity={isLight ? 0.5 : 0.35} />
      <pointLight position={[2.8, 2.3, 2.5]} intensity={isLight ? 1.9 : 2.2} color={palette.pointA} />
      <pointLight position={[-2.2, -2, 1.8]} intensity={isLight ? 0.7 : 0.85} color={palette.pointB} />

      <Stars radius={18} depth={40} count={420} factor={1.4} saturation={0} fade speed={0.24} />
      <Sparkles
        count={45}
        scale={6.8}
        size={1.25}
        speed={0.22}
        noise={0.16}
        opacity={isLight ? 0.34 : 0.48}
        color={palette.sparkle}
      />
      <CoreShape palette={palette} />
    </Canvas>
  )
}
