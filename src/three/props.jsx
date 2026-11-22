import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ============================================================
   TREES & FOLIAGE
   ============================================================ */

export function PineTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1, 6]} />
        <meshStandardMaterial color="#6b4a32" roughness={1} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.9, 1.4, 8]} />
        <meshStandardMaterial color="#5aa563" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.7, 1.2, 8]} />
        <meshStandardMaterial color="#6cbf72" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#7fce84" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

/* Rounded oak-style tree with a gentle sway */
export function OakTree({ position = [0, 0, 0], scale = 1, color = '#5aa563' }) {
  const canopy = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  useFrame((s) => {
    if (canopy.current) canopy.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.6 + seed) * 0.03
  })
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 1.8, 7]} />
        <meshStandardMaterial color="#7c5a3c" roughness={1} />
      </mesh>
      <group ref={canopy} position={[0, 2.2, 0]}>
        {[
          [0, 0, 0, 1.1], [-0.8, -0.2, 0.2, 0.8], [0.8, -0.1, -0.2, 0.85],
          [0.1, 0.7, 0.1, 0.75], [-0.3, 0.3, 0.7, 0.65],
        ].map((b, i) => (
          <mesh key={i} position={[b[0], b[1], b[2]]}>
            <icosahedronGeometry args={[b[3], 1]} />
            <meshStandardMaterial color={i % 2 ? color : '#6cbf72'} roughness={1} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function BlossomTree({ position = [0, 0, 0], scale = 1 }) {
  const canopy = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  useFrame((s) => {
    if (canopy.current) canopy.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.5 + seed) * 0.03
  })
  const blobs = [
    [0, 0.3, 0, 1.1], [-0.9, 0, 0.3, 0.8], [0.9, 0.1, -0.2, 0.9],
    [0, 0.8, 0.2, 0.7], [0.3, -0.1, 0.9, 0.7],
  ]
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 2, 7]} />
        <meshStandardMaterial color="#8a6a4a" roughness={1} />
      </mesh>
      <group ref={canopy} position={[0, 2.2, 0]}>
        {blobs.map((b, i) => (
          <mesh key={i} position={[b[0], b[1], b[2]]}>
            <icosahedronGeometry args={[b[3], 1]} />
            <meshStandardMaterial color={i % 2 ? '#f7c6de' : '#f6a8cb'} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Bush({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {[[-0.4, 0.2, 0, 0.5], [0.4, 0.2, 0, 0.55], [0, 0.35, 0.1, 0.5]].map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]}>
          <icosahedronGeometry args={[b[3], 1]} />
          <meshStandardMaterial color={i % 2 ? '#6cbf72' : '#5aa563'} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

export function Flower({ position = [0, 0, 0], color = '#f6a8cb', scale = 1 }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
        <meshStandardMaterial color="#5b9e6b" />
      </mesh>
      <group position={[0, 0.62, 0]}>
        {petals.map((a) => (
          <mesh key={a} position={[0.12 * Math.cos((a * Math.PI) / 180), 0, 0.12 * Math.sin((a * Math.PI) / 180)]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#fce1a8" emissive="#fce1a8" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  )
}

/* A dense patch of swaying grass blades */
export function GrassPatch({ position = [0, 0, 0], count = 14, radius = 1, night }) {
  const ref = useRef()
  const blades = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * radius * 2,
        z: (Math.random() - 0.5) * radius * 2,
        h: 0.3 + Math.random() * 0.4,
        s: Math.random() * 6,
      })),
    [count, radius],
  )
  useFrame((st) => {
    if (ref.current) ref.current.rotation.z = Math.sin(st.clock.elapsedTime * 1.2) * 0.05
  })
  return (
    <group ref={ref} position={position}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <coneGeometry args={[0.04, b.h, 4]} />
          <meshStandardMaterial color={night ? '#2f5a3a' : '#66b56d'} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

/* A leafy shrub with flowers growing out of it (replaces lone flowers) */
export function FloweringShrub({ position = [0, 0, 0], scale = 1, colors = ['#f6a8cb', '#ffe082', '#e0d4f7'], night }) {
  const blobs = [
    [-0.35, 0.28, 0, 0.42], [0.35, 0.3, 0.05, 0.46], [0, 0.42, 0.1, 0.44],
    [-0.1, 0.3, -0.3, 0.36], [0.2, 0.26, 0.3, 0.34],
  ]
  const blooms = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        x: Math.cos((i / 6) * Math.PI * 2) * 0.34,
        z: Math.sin((i / 6) * Math.PI * 2) * 0.3,
        y: 0.5 + (i % 3) * 0.08,
        c: colors[i % colors.length],
      })),
    [colors],
  )
  return (
    <group position={position} scale={scale}>
      {blobs.map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]}>
          <icosahedronGeometry args={[b[3], 1]} />
          <meshStandardMaterial color={night ? (i % 2 ? '#274d33' : '#1f3d2a') : i % 2 ? '#6cbf72' : '#57a95f'} roughness={1} flatShading />
        </mesh>
      ))}
      {blooms.map((f, i) => (
        <group key={i} position={[f.x, f.y, f.z]}>
          <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.015, 0.015, 0.24, 4]} /><meshStandardMaterial color="#4f8a5a" /></mesh>
          {[0, 72, 144, 216, 288].map((a) => (
            <mesh key={a} position={[0.07 * Math.cos((a * Math.PI) / 180), 0, 0.07 * Math.sin((a * Math.PI) / 180)]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color={f.c} roughness={0.7} />
            </mesh>
          ))}
          <mesh><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#fce1a8" emissive="#fce1a8" emissiveIntensity={0.25} /></mesh>
        </group>
      ))}
    </group>
  )
}

/* Cheap background tree for the distant treeline */
export function FarTree({ position = [0, 0, 0], scale = 1, kind = 0, night }) {
  const green = night ? '#12351f' : '#4f9a58'
  const green2 = night ? '#0f2a19' : '#3f8a49'
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.12, 0.16, 1.4, 5]} /><meshStandardMaterial color={night ? '#241a12' : '#6b4a32'} roughness={1} /></mesh>
      {kind === 0 ? (
        <>
          <mesh position={[0, 1.9, 0]}><coneGeometry args={[0.85, 1.6, 7]} /><meshStandardMaterial color={green} roughness={1} flatShading /></mesh>
          <mesh position={[0, 2.7, 0]}><coneGeometry args={[0.6, 1.2, 7]} /><meshStandardMaterial color={green2} roughness={1} flatShading /></mesh>
        </>
      ) : (
        <mesh position={[0, 2, 0]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={green} roughness={1} flatShading /></mesh>
      )}
    </group>
  )
}

/* ============================================================
   ANIMALS
   ============================================================ */

export function Cat({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], color = '#c9a28a', roam = 0, sleeping = false }) {
  const root = useRef()
  const tail = useRef()
  const legF = useRef()
  const legB = useRef()
  const breath = useRef()
  const seed = useMemo(() => Math.random() * 8, [])
  const walking = roam > 0 && !sleeping
  useFrame((s) => {
    const t = s.clock.elapsedTime + seed
    if (sleeping) {
      if (breath.current) breath.current.scale.set(1, 1 + Math.sin(t * 1.6) * 0.04, 1)
      return
    }
    if (tail.current) tail.current.rotation.x = Math.sin(t * 2) * 0.35
    if (root.current && walking) {
      const dir = Math.cos(t * 0.18) >= 0 ? 1 : -1
      root.current.position.x = position[0] + Math.sin(t * 0.18) * roam
      root.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * 0.02
      root.current.rotation.y = rotation[1] + (dir > 0 ? Math.PI / 2 : -Math.PI / 2)
      const sw = Math.sin(t * 4) * 0.4
      if (legF.current) legF.current.rotation.x = sw
      if (legB.current) legB.current.rotation.x = -sw
    }
  })
  const eye = '#2a2438'
  if (sleeping) {
    return (
      <group position={position} scale={scale} rotation={rotation}>
        <group ref={breath}>
          {/* curled loaf body */}
          <mesh position={[0, 0.13, 0]} scale={[1.3, 0.72, 1.05]}><sphereGeometry args={[0.24, 16, 16]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
          {/* head resting */}
          <mesh position={[0.24, 0.11, 0.08]}><sphereGeometry args={[0.14, 14, 14]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0.2, 0.22, 0.14]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.05, 0.11, 4]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0.28, 0.22, 0.02]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.05, 0.11, 4]} /><meshStandardMaterial color={color} /></mesh>
          {/* curled tail wrapping around */}
          <mesh position={[-0.18, 0.09, -0.14]} rotation={[Math.PI / 2, 0, 0.4]}><torusGeometry args={[0.16, 0.035, 8, 20, Math.PI * 1.3]} /><meshStandardMaterial color={color} /></mesh>
        </group>
      </group>
    )
  }
  return (
    <group ref={root} position={position} scale={scale} rotation={rotation}>
      {/* body + chest */}
      <mesh position={[0, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.16, 0.24, 6, 12]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      {/* head */}
      <mesh position={[0.28, 0.36, 0]}><sphereGeometry args={[0.16, 14, 14]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      <mesh position={[0.2, 0.5, 0.09]} rotation={[0, 0, 0.35]}><coneGeometry args={[0.06, 0.14, 4]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.2, 0.5, -0.09]} rotation={[0, 0, 0.35]}><coneGeometry args={[0.06, 0.14, 4]} /><meshStandardMaterial color={color} /></mesh>
      {/* face */}
      <mesh position={[0.4, 0.38, 0.07]}><sphereGeometry args={[0.022, 8, 8]} /><meshStandardMaterial color={eye} /></mesh>
      <mesh position={[0.4, 0.38, -0.07]}><sphereGeometry args={[0.022, 8, 8]} /><meshStandardMaterial color={eye} /></mesh>
      <mesh position={[0.43, 0.33, 0]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#c65f92" /></mesh>
      {/* legs (front/back pairs, swing when walking) */}
      <group ref={legF} position={[0.16, 0.12, 0]}>
        <mesh position={[0, -0.06, 0.08]}><capsuleGeometry args={[0.035, 0.14, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, -0.06, -0.08]}><capsuleGeometry args={[0.035, 0.14, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      </group>
      <group ref={legB} position={[-0.16, 0.12, 0]}>
        <mesh position={[0, -0.06, 0.08]}><capsuleGeometry args={[0.035, 0.14, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, -0.06, -0.08]}><capsuleGeometry args={[0.035, 0.14, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      </group>
      {/* tail */}
      <group ref={tail} position={[-0.26, 0.28, 0]}>
        <mesh position={[-0.08, 0.12, 0]} rotation={[0, 0, 1]}><capsuleGeometry args={[0.035, 0.34, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      </group>
    </group>
  )
}

/* Rabbit with a natural hop: crouch → spring in an arc → land → brief pause */
export function Rabbit({ position = [0, 0, 0], scale = 1, color = '#e9e2da', range = 3 }) {
  const ref = useRef()
  const bodyRef = useRef()
  const earL = useRef()
  const earR = useRef()
  const seed = useMemo(() => Math.random() * 10, [])
  const cycle = 1.5 // seconds per hop (incl. pause)
  useFrame((s) => {
    const t = s.clock.elapsedTime + seed
    // smooth back-and-forth base travel; direction from its derivative
    const base = Math.sin(t * 0.22)
    const dir = Math.cos(t * 0.22) >= 0 ? 1 : -1
    // hop phase: active arc for 55% of the cycle, then rest
    const p = (t % cycle) / cycle
    const active = p < 0.55 ? p / 0.55 : -1
    const hop = active >= 0 ? Math.sin(active * Math.PI) : 0
    const lunge = active >= 0 ? Math.sin(active * Math.PI) * 0.18 : 0 // slight forward surge mid-hop
    if (ref.current) {
      ref.current.position.x = position[0] + base * range + dir * lunge
      ref.current.position.y = position[1] + hop * 0.42
      ref.current.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2
    }
    if (bodyRef.current) bodyRef.current.rotation.z = hop * 0.5 - (active < 0 ? 0.12 : 0) // stretch in air, crouch at rest
    const earFlop = -0.15 - hop * 0.5
    if (earL.current) earL.current.rotation.x = earFlop
    if (earR.current) earR.current.rotation.x = earFlop
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <group ref={bodyRef}>
        {/* body */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.1]}><capsuleGeometry args={[0.15, 0.22, 6, 12]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
        {/* haunch */}
        <mesh position={[-0.14, 0.16, 0]}><sphereGeometry args={[0.14, 12, 12]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
        {/* head */}
        <mesh position={[0.2, 0.36, 0]}><sphereGeometry args={[0.12, 14, 14]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
        {/* muzzle */}
        <mesh position={[0.31, 0.33, 0]}><sphereGeometry args={[0.07, 10, 10]} /><meshStandardMaterial color={color} /></mesh>
        {/* ears */}
        <mesh ref={earL} position={[0.19, 0.46, 0.05]}><capsuleGeometry args={[0.028, 0.22, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh ref={earR} position={[0.19, 0.46, -0.05]}><capsuleGeometry args={[0.028, 0.22, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        {/* eye + tail */}
        <mesh position={[0.26, 0.38, 0.08]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#2a2438" /></mesh>
        <mesh position={[-0.26, 0.2, 0]}><sphereGeometry args={[0.07, 10, 10]} /><meshStandardMaterial color="#fff" /></mesh>
        {/* front paws */}
        <mesh position={[0.14, 0.06, 0.06]}><capsuleGeometry args={[0.03, 0.08, 4, 6]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.14, 0.06, -0.06]}><capsuleGeometry args={[0.03, 0.08, 4, 6]} /><meshStandardMaterial color={color} /></mesh>
      </group>
    </group>
  )
}

/* Duck that paddles a slow loop — constrained to a pond */
export function Duck({ center = [0, 0], radius = 1.1, y = 0.08, speed = 0.35, color = '#f7f3ea' }) {
  const ref = useRef()
  const head = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + seed
    if (ref.current) {
      ref.current.position.x = center[0] + Math.cos(t) * radius
      ref.current.position.z = center[1] + Math.sin(t) * radius
      ref.current.position.y = y + Math.sin(t * 6) * 0.02
      ref.current.rotation.y = -t + Math.PI / 2
    }
    if (head.current) head.current.rotation.x = Math.sin(t * 3) * 0.12
  })
  return (
    <group ref={ref} position={[center[0] + radius, y, center[1]]}>
      {/* body */}
      <mesh rotation={[0, 0, -0.15]}><capsuleGeometry args={[0.14, 0.24, 6, 12]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
      {/* tail up */}
      <mesh position={[-0.2, 0.06, 0]} rotation={[0, 0, 0.7]}><coneGeometry args={[0.07, 0.16, 6]} /><meshStandardMaterial color={color} /></mesh>
      {/* neck + head */}
      <group ref={head} position={[0.18, 0.06, 0]}>
        <mesh position={[0.02, 0.12, 0]} rotation={[0, 0, -0.3]}><capsuleGeometry args={[0.05, 0.14, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.1, 0.24, 0]}><sphereGeometry args={[0.1, 14, 14]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.22, 0.22, 0]} rotation={[0, 0, -0.1]}><coneGeometry args={[0.045, 0.14, 8]} /><meshStandardMaterial color="#f0a83c" /></mesh>
        <mesh position={[0.12, 0.27, 0.06]}><sphereGeometry args={[0.018, 8, 8]} /><meshStandardMaterial color="#2a2438" /></mesh>
      </group>
    </group>
  )
}

/* Recognizable deer: body, 4 legs, neck, ears, antlers, tail, spots; walks & grazes */
export function Deer({ position = [0, 0, 0], scale = 1, roam = 0 }) {
  const root = useRef()
  const neck = useRef()
  const ear = useRef()
  const legF = useRef()
  const legB = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  const body = '#b5764c'
  const dark = '#8a5a38'
  useFrame((s) => {
    const t = s.clock.elapsedTime + seed
    const moving = roam > 0
    if (root.current && moving) {
      const dir = Math.cos(t * 0.12) >= 0 ? 1 : -1
      root.current.position.x = position[0] + Math.sin(t * 0.12) * roam
      root.current.position.y = position[1] + Math.abs(Math.sin(t * 2.4)) * 0.03
      root.current.rotation.y = dir > 0 ? 0 : Math.PI
      const sw = Math.sin(t * 2.4) * 0.3
      if (legF.current) legF.current.rotation.x = sw
      if (legB.current) legB.current.rotation.x = -sw
    }
    if (neck.current) neck.current.rotation.z = -0.5 + Math.sin(t * 0.5) * (moving ? 0.15 : 0.45)
    if (ear.current) ear.current.rotation.z = Math.sin(t * 4) * 0.2
  })
  const Leg = ({ z }) => (
    <group position={[0, 0, z]}>
      <mesh position={[0, -0.44, 0]}><cylinderGeometry args={[0.055, 0.05, 0.86, 6]} /><meshStandardMaterial color={body} /></mesh>
      <mesh position={[0, -0.84, 0]}><cylinderGeometry args={[0.05, 0.045, 0.1, 6]} /><meshStandardMaterial color="#3a2b1e" /></mesh>
    </group>
  )
  return (
    <group ref={root} position={position} scale={scale}>
      {/* torso */}
      <mesh position={[0, 0.92, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.22, 0.6, 6, 12]} /><meshStandardMaterial color={body} roughness={1} /></mesh>
      <mesh position={[-0.34, 0.95, 0]}><sphereGeometry args={[0.22, 12, 12]} /><meshStandardMaterial color={body} /></mesh>
      {/* legs (front/back pairs, swing when walking) */}
      <group ref={legF} position={[0.3, 0.86, 0]}><Leg z={0.16} /><Leg z={-0.16} /></group>
      <group ref={legB} position={[-0.3, 0.86, 0]}><Leg z={0.16} /><Leg z={-0.16} /></group>
      {/* neck + head (grazes) */}
      <group ref={neck} position={[0.36, 1.05, 0]}>
        <mesh position={[0.12, 0.16, 0]} rotation={[0, 0, -0.6]}><capsuleGeometry args={[0.09, 0.32, 6, 10]} /><meshStandardMaterial color={body} /></mesh>
        <group position={[0.28, 0.36, 0]}>
          <mesh><sphereGeometry args={[0.12, 14, 14]} /><meshStandardMaterial color={body} /></mesh>
          <mesh position={[0.13, -0.02, 0]} rotation={[0, 0, -0.2]}><capsuleGeometry args={[0.06, 0.12, 4, 8]} /><meshStandardMaterial color={dark} /></mesh>
          {/* ears */}
          <mesh ref={ear} position={[-0.02, 0.12, 0.1]} rotation={[0.3, 0, 0.4]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshStandardMaterial color={body} /></mesh>
          <mesh position={[-0.02, 0.12, -0.1]} rotation={[-0.3, 0, 0.4]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshStandardMaterial color={body} /></mesh>
          {/* antlers */}
          {[0.08, -0.08].map((z, i) => (
            <group key={i} position={[0.02, 0.16, z]}>
              <mesh rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.014, 0.018, 0.22, 5]} /><meshStandardMaterial color="#e6d2a8" /></mesh>
              <mesh position={[0.06, 0.14, 0]} rotation={[0, 0, 0.4]}><cylinderGeometry args={[0.01, 0.012, 0.12, 5]} /><meshStandardMaterial color="#e6d2a8" /></mesh>
              <mesh position={[-0.04, 0.16, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.01, 0.012, 0.1, 5]} /><meshStandardMaterial color="#e6d2a8" /></mesh>
            </group>
          ))}
          <mesh position={[0.08, 0.02, 0.07]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#2a2438" /></mesh>
        </group>
      </group>
      {/* white tail */}
      <mesh position={[-0.55, 0.98, 0]} rotation={[0, 0, 0.6]}><coneGeometry args={[0.06, 0.16, 6]} /><meshStandardMaterial color="#f3ece0" /></mesh>
      {/* spots */}
      {[[-0.1, 1.05, 0.16], [0.05, 1.0, 0.18], [-0.2, 1.02, 0.14]].map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#e6cba0" /></mesh>
      ))}
    </group>
  )
}

/* Dog with a wagging tail */
export function Dog({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], color = '#d9a066', roam = 0, sleeping = false }) {
  const root = useRef()
  const tail = useRef()
  const legF = useRef()
  const legB = useRef()
  const breath = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  useFrame((s) => {
    const t = s.clock.elapsedTime + seed
    if (sleeping) {
      if (breath.current) breath.current.scale.set(1, 1 + Math.sin(t * 1.5) * 0.05, 1)
      return
    }
    if (tail.current) tail.current.rotation.z = 0.6 + Math.sin(t * 8) * 0.5
    if (root.current && roam > 0) {
      const dir = Math.cos(t * 0.2) >= 0 ? 1 : -1
      root.current.position.x = position[0] + Math.sin(t * 0.2) * roam
      root.current.position.y = position[1] + Math.abs(Math.sin(t * 5)) * 0.03
      root.current.rotation.y = rotation[1] + (dir > 0 ? 0 : Math.PI)
      const sw = Math.sin(t * 5) * 0.5
      if (legF.current) legF.current.rotation.x = sw
      if (legB.current) legB.current.rotation.x = -sw
    }
  })
  const Leg = ({ z }) => (
    <group position={[0, 0, z]}><mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.05, 0.05, 0.3, 6]} /><meshStandardMaterial color={color} /></mesh></group>
  )
  if (sleeping) {
    return (
      <group position={position} scale={scale} rotation={rotation}>
        <group ref={breath}>
          {/* body lying on its side */}
          <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}><capsuleGeometry args={[0.17, 0.44, 6, 12]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
          {/* head resting on the ground */}
          <mesh position={[0.4, 0.12, 0.05]}><sphereGeometry args={[0.16, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0.34, 0.24, 0.14]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.05, 0.16, 4]} /><meshStandardMaterial color="#b5764c" /></mesh>
          {/* folded legs */}
          <mesh position={[0.16, 0.06, 0.18]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.045, 0.16, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[-0.14, 0.06, 0.18]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.045, 0.16, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
          {/* tail curled to body */}
          <mesh position={[-0.4, 0.1, 0]} rotation={[0, 0, 0.3]}><capsuleGeometry args={[0.03, 0.24, 4, 6]} /><meshStandardMaterial color={color} /></mesh>
        </group>
      </group>
    )
  }
  return (
    <group ref={root} position={position} scale={scale} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.16, 0.4, 4, 8]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
      <group ref={legF} position={[0.2, 0.3, 0]}><Leg z={0.12} /><Leg z={-0.12} /></group>
      <group ref={legB} position={[-0.2, 0.3, 0]}><Leg z={0.12} /><Leg z={-0.12} /></group>
      <mesh position={[0.34, 0.55, 0]}><sphereGeometry args={[0.16, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.28, 0.72, 0.1]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.05, 0.16, 4]} /><meshStandardMaterial color="#b5764c" /></mesh>
      <mesh position={[0.28, 0.72, -0.1]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.05, 0.16, 4]} /><meshStandardMaterial color="#b5764c" /></mesh>
      <mesh position={[0.46, 0.52, 0.05]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#2a2438" /></mesh>
      <mesh position={[0.46, 0.52, -0.05]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#2a2438" /></mesh>
      <mesh position={[0.49, 0.48, 0]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#3e2e2e" /></mesh>
      <group ref={tail} position={[-0.34, 0.5, 0]}>
        <mesh position={[-0.1, 0.05, 0]} rotation={[0, 0, 0.6]}><capsuleGeometry args={[0.03, 0.22, 4, 6]} /><meshStandardMaterial color={color} /></mesh>
      </group>
    </group>
  )
}

/* Recognizable squirrel: upright body, big bushy curled tail, ears, tiny paws; nibbles */
export function Squirrel({ position = [0, 0, 0], scale = 1 }) {
  const tail = useRef()
  const paws = useRef()
  const c = '#b5764c'
  const light = '#d9a066'
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (tail.current) tail.current.rotation.z = Math.sin(t * 2) * 0.12
    if (paws.current) paws.current.position.y = 0.3 + Math.abs(Math.sin(t * 6)) * 0.03 // nibbling
  })
  return (
    <group position={position} scale={scale}>
      {/* upright body */}
      <mesh position={[0, 0.24, 0]} rotation={[0.2, 0, 0]}><capsuleGeometry args={[0.11, 0.18, 6, 12]} /><meshStandardMaterial color={c} roughness={1} /></mesh>
      <mesh position={[0, 0.22, 0.06]}><sphereGeometry args={[0.09, 12, 12]} /><meshStandardMaterial color={light} /></mesh>
      {/* head */}
      <mesh position={[0.02, 0.44, 0.05]}><sphereGeometry args={[0.1, 14, 14]} /><meshStandardMaterial color={c} /></mesh>
      <mesh position={[0.08, 0.42, 0.1]}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color={light} /></mesh>
      {/* ears */}
      <mesh position={[-0.02, 0.55, 0.02]}><coneGeometry args={[0.035, 0.09, 6]} /><meshStandardMaterial color={c} /></mesh>
      <mesh position={[0.08, 0.55, 0.02]}><coneGeometry args={[0.035, 0.09, 6]} /><meshStandardMaterial color={c} /></mesh>
      {/* eye */}
      <mesh position={[0.06, 0.46, 0.13]}><sphereGeometry args={[0.018, 8, 8]} /><meshStandardMaterial color="#2a2438" /></mesh>
      {/* nibbling paws holding an acorn */}
      <group ref={paws} position={[0.1, 0.3, 0.12]}>
        <mesh><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color={light} /></mesh>
        <mesh position={[0.04, 0.02, 0]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#7c5a3c" /></mesh>
      </group>
      {/* big bushy curled tail */}
      <group ref={tail} position={[-0.1, 0.2, 0]}>
        <mesh position={[-0.06, 0.12, 0]}><capsuleGeometry args={[0.08, 0.12, 6, 10]} /><meshStandardMaterial color="#c98a5c" /></mesh>
        <mesh position={[-0.1, 0.32, 0]}><sphereGeometry args={[0.13, 12, 12]} /><meshStandardMaterial color="#d9a066" /></mesh>
        <mesh position={[0.0, 0.46, 0]}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color="#c98a5c" /></mesh>
      </group>
    </group>
  )
}

/* ============================================================
   BIRDS & BUTTERFLIES
   ============================================================ */

/* A bird facing +x: body, head, beak, fanned tail, and swept wings that flap */
function Bird({ offset = 0, color = '#4a3f5c' }) {
  const lw = useRef()
  const rw = useRef()
  useFrame((s) => {
    const f = Math.sin(s.clock.elapsedTime * 7 + offset) * 0.95
    if (rw.current) rw.current.rotation.x = f
    if (lw.current) lw.current.rotation.x = -f
  })
  const Wing = ({ side }) => (
    <group ref={side > 0 ? rw : lw}>
      <mesh position={[0, 0, side * 0.17]} rotation={[0, side * 0.25, 0]}><boxGeometry args={[0.2, 0.02, 0.3]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-0.04, 0, side * 0.35]} rotation={[0, side * 0.6, 0]}><boxGeometry args={[0.12, 0.016, 0.22]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  )
  return (
    <group>
      {/* body along x */}
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.05, 0.22, 6, 10]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      {/* head + beak */}
      <mesh position={[0.17, 0.03, 0]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.26, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.02, 0.08, 6]} /><meshStandardMaterial color="#f0a83c" /></mesh>
      {/* fanned tail */}
      <mesh position={[-0.19, 0.01, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.4, 1.9]}><coneGeometry args={[0.06, 0.18, 6]} /><meshStandardMaterial color={color} /></mesh>
      <Wing side={1} />
      <Wing side={-1} />
    </group>
  )
}

/* A flock that drifts across the sky and loops */
export function Flock({ position = [0, 8, -10], count = 6, range = 34, speed = 1.2, color }) {
  const ref = useRef()
  const seed = useMemo(() => Math.random() * range, [])
  const birds = useMemo(
    () => Array.from({ length: count }).map((_, i) => ({
      x: (i - count / 2) * 0.9,
      y: Math.abs(i - count / 2) * -0.35,
      z: (i % 2) * 0.6,
      off: i * 0.7,
      s: 0.8 + Math.random() * 0.5,
    })),
    [count],
  )
  useFrame((st) => {
    if (!ref.current) return
    const t = (st.clock.elapsedTime * speed + seed) % range
    ref.current.position.x = position[0] - range / 2 + t
    ref.current.position.y = position[1] + Math.sin(st.clock.elapsedTime * 0.6) * 0.6
  })
  return (
    <group ref={ref} position={position}>
      {birds.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]} scale={b.s}>
          <Bird offset={b.off} color={color} />
        </group>
      ))}
    </group>
  )
}

/* Realistic-ish butterfly: shaped fore/hind wings, spots, antennae, flutter */
export function Butterfly3D({ position = [0, 1.5, 0], color = '#c8a8ec', accent = '#6a4fa0', range = 2, scale = 1 }) {
  const grp = useRef()
  const lw = useRef()
  const rw = useRef()
  const seed = useMemo(() => Math.random() * 10, [])

  // one right-half wing silhouette (forewing + hindwing) built in the XY plane, hinge at x=0
  const wing = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.02)
    s.bezierCurveTo(0.06, 0.30, 0.34, 0.36, 0.36, 0.14) // forewing outer
    s.bezierCurveTo(0.37, 0.02, 0.24, 0.0, 0.18, -0.03)
    s.bezierCurveTo(0.36, -0.07, 0.34, -0.36, 0.15, -0.32) // hindwing
    s.bezierCurveTo(0.07, -0.30, 0.02, -0.14, 0, -0.02)
    s.lineTo(0, 0.02)
    return s
  }, [])
  const spot = useMemo(() => new THREE.CircleGeometry(0.05, 12), [])

  useFrame((s) => {
    const t = s.clock.elapsedTime * 0.85 + seed // slower, gentler drift
    if (grp.current) {
      grp.current.position.x = position[0] + Math.sin(t * 0.5) * range
      // much larger vertical wander (bobbing + slow climbs/dives)
      grp.current.position.y = position[1] + Math.sin(t * 0.9) * 1.1 + Math.sin(t * 0.32) * 0.8
      grp.current.position.z = position[2] + Math.cos(t * 0.4) * range * 0.6
      grp.current.rotation.y = Math.atan2(Math.cos(t * 0.5), -Math.sin(t * 0.4))
      grp.current.rotation.z = Math.sin(t * 0.9) * 0.25
    }
    const f = (Math.sin(t * 7) * 0.5 + 0.5) * 1.25
    if (lw.current) lw.current.rotation.y = 0.15 + f
    if (rw.current) rw.current.rotation.y = -0.15 - f
  })

  const Wing = ({ side }) => (
    <group ref={side < 0 ? lw : rw}>
      <mesh scale={[side, 1, 1]}>
        <shapeGeometry args={[wing]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* wing markings */}
      <mesh geometry={spot} position={[side * 0.24, 0.16, 0.001]}><meshStandardMaterial color={accent} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={spot} position={[side * 0.2, -0.2, 0.001]} scale={0.7}><meshStandardMaterial color={accent} side={THREE.DoubleSide} /></mesh>
    </group>
  )

  return (
    <group ref={grp} position={position} scale={scale}>
      <Wing side={1} />
      <Wing side={-1} />
      {/* body */}
      <mesh><capsuleGeometry args={[0.022, 0.2, 4, 8]} /><meshStandardMaterial color="#2e2440" /></mesh>
      <mesh position={[0, 0.13, 0]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#2e2440" /></mesh>
      {/* antennae */}
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * 0.03, 0.2, 0]} rotation={[0, 0, sx * -0.5]}><cylinderGeometry args={[0.004, 0.004, 0.12, 4]} /><meshStandardMaterial color="#2e2440" /></mesh>
      ))}
    </group>
  )
}

/* Dragonfly: long iridescent body, big eyes, 4 fast-blurring wings; darts & hovers */
export function Dragonfly({ position = [0, 1.5, 0], range = 2, color = '#3fb6a8', scale = 1 }) {
  const grp = useRef()
  const wings = useRef()
  const seed = useMemo(() => Math.random() * 8, [])
  useFrame((s) => {
    const t = s.clock.elapsedTime + seed
    if (grp.current) {
      // slow glide with quick little darts overlaid
      grp.current.position.x = position[0] + Math.sin(t * 0.6) * range + Math.sin(t * 2.5) * 0.25
      grp.current.position.z = position[2] + Math.cos(t * 0.45) * range * 0.7
      grp.current.position.y = position[1] + Math.sin(t * 1.1) * 0.4
      grp.current.rotation.y = Math.atan2(Math.cos(t * 0.6), -Math.sin(t * 0.45))
    }
    if (wings.current) wings.current.rotation.z = Math.sin(t * 42) * 0.5 // blur
  })
  const Wing = ({ x, z, len }) => (
    <mesh position={[x, 0.02, z]} rotation={[0, 0, 0]}>
      <boxGeometry args={[len, 0.005, 0.06]} />
      <meshStandardMaterial color="#cfeffb" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
  return (
    <group ref={grp} position={position} scale={scale}>
      {/* body: thorax + long tapered abdomen */}
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.03, 0.1, 4, 8]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.3} /></mesh>
      <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.03, 0.38, 6]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.3} /></mesh>
      {/* head + eyes */}
      <mesh position={[0.12, 0, 0]}><sphereGeometry args={[0.045, 10, 10]} /><meshStandardMaterial color="#2e6f66" /></mesh>
      <mesh position={[0.14, 0.02, 0.03]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0.14, 0.02, -0.03]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      {/* 4 wings */}
      <group ref={wings}>
        <Wing x={0.04} z={0.16} len={0.3} />
        <Wing x={0.04} z={-0.16} len={0.3} />
        <Wing x={-0.06} z={0.15} len={0.26} />
        <Wing x={-0.06} z={-0.15} len={0.26} />
      </group>
    </group>
  )
}

/* A very distant rainbow arc (day only) */
export function Rainbow({ position = [0, -6, -70], scale = 1 }) {
  const colors = ['#ff7a7a', '#ffb56b', '#ffe066', '#8fd77f', '#6bb5ff', '#7a7aff', '#c07aff']
  return (
    <group position={position} scale={scale}>
      {colors.map((c, i) => (
        <mesh key={i}>
          <torusGeometry args={[24 - i * 0.7, 0.36, 8, 80, Math.PI]} />
          <meshBasicMaterial color={c} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   PEOPLE — the girl (day: badminton, night: pointing at stars)
   ============================================================ */

function Ponytail({ color = '#3e2e5e' }) {
  const ref = useRef()
  useFrame((s) => {
    if (ref.current) ref.current.rotation.x = -0.3 + Math.sin(s.clock.elapsedTime * 2) * 0.15
  })
  return (
    <group ref={ref} position={[0, 1.62, -0.16]}>
      <mesh position={[0, -0.15, -0.05]} rotation={[0.4, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  )
}

function GirlBase({ dress = '#b98fd6' }) {
  return (
    <>
      {/* legs */}
      <mesh position={[-0.12, 0.35, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
      <mesh position={[0.12, 0.35, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
      {/* shoes */}
      <mesh position={[-0.12, 0.08, 0.05]}><boxGeometry args={[0.14, 0.1, 0.24]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      <mesh position={[0.12, 0.08, 0.05]}><boxGeometry args={[0.14, 0.1, 0.24]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      {/* skirt / dress */}
      <mesh position={[0, 0.95, 0]}><coneGeometry args={[0.36, 0.82, 14]} /><meshStandardMaterial color={dress} roughness={0.8} /></mesh>
      <mesh position={[0, 1.2, 0]}><capsuleGeometry args={[0.17, 0.2, 4, 10]} /><meshStandardMaterial color={dress} roughness={0.8} /></mesh>
      {/* head + hair */}
      <mesh position={[0, 1.56, 0]}><sphereGeometry args={[0.2, 20, 20]} /><meshStandardMaterial color="#f3c9a0" roughness={0.8} /></mesh>
      <mesh position={[0, 1.62, -0.02]}><sphereGeometry args={[0.22, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><meshStandardMaterial color="#3e2e5e" roughness={0.9} /></mesh>
      <Ponytail />
    </>
  )
}

/* A friendlier, more human head: face features, fringe, side strands, ponytail (faces +z) */
export function GirlHead({ scale = 1, skin = '#f3c9a0', hair = '#3e2e5e' }) {
  return (
    <group scale={scale}>
      <mesh><sphereGeometry args={[0.2, 24, 24]} /><meshStandardMaterial color={skin} roughness={0.8} /></mesh>
      {/* hair back cap + fringe */}
      <mesh position={[0, 0.06, -0.03]}><sphereGeometry args={[0.223, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
      <mesh position={[0, 0.14, 0.08]} rotation={[0.5, 0, 0]}><sphereGeometry args={[0.17, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
      <mesh position={[-0.17, -0.02, 0.02]} rotation={[0, 0, 0.2]}><capsuleGeometry args={[0.04, 0.22, 4, 8]} /><meshStandardMaterial color={hair} /></mesh>
      <mesh position={[0.17, -0.02, 0.02]} rotation={[0, 0, -0.2]}><capsuleGeometry args={[0.04, 0.22, 4, 8]} /><meshStandardMaterial color={hair} /></mesh>
      <mesh position={[0, 0.02, -0.2]} rotation={[0.5, 0, 0]}><capsuleGeometry args={[0.07, 0.34, 4, 8]} /><meshStandardMaterial color={hair} /></mesh>
      {/* eyes */}
      {[-0.07, 0.07].map((x) => (
        <group key={x} position={[x, 0.02, 0.18]}>
          <mesh><sphereGeometry args={[0.03, 10, 10]} /><meshStandardMaterial color="#2a2438" /></mesh>
          <mesh position={[0.012, 0.014, 0.02]}><sphereGeometry args={[0.01, 8, 8]} /><meshStandardMaterial color="#fff" /></mesh>
        </group>
      ))}
      {/* brows */}
      {[-0.07, 0.07].map((x) => (
        <mesh key={x} position={[x, 0.085, 0.185]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}><boxGeometry args={[0.055, 0.014, 0.012]} /><meshStandardMaterial color={hair} /></mesh>
      ))}
      {/* nose */}
      <mesh position={[0, -0.005, 0.2]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.016, 0.045, 6]} /><meshStandardMaterial color="#e6a785" /></mesh>
      {/* cheeks */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, -0.05, 0.165]} scale={[1, 0.7, 0.4]}><sphereGeometry args={[0.035, 10, 10]} /><meshStandardMaterial color="#f6a8cb" transparent opacity={0.7} /></mesh>
      ))}
      {/* smile */}
      <mesh position={[0, -0.07, 0.185]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.045, 0.009, 8, 16, Math.PI]} /><meshStandardMaterial color="#b5657f" /></mesh>
    </group>
  )
}

/* A proper badminton racket: grip, bent neck/throat, oval strung head */
function Racket() {
  const frame = '#5e4b8b'
  const strings = '#f3ecff'
  return (
    <group>
      {/* grip */}
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.032, 0.036, 0.26, 12]} /><meshStandardMaterial color="#3b2f4f" roughness={0.8} /></mesh>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.022, 0.026, 0.06, 10]} /><meshStandardMaterial color="#2a2438" /></mesh>
      {/* shaft */}
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.014, 0.02, 0.36, 8]} /><meshStandardMaterial color={frame} /></mesh>
      {/* bent neck / throat (slight kink then splits to the head) */}
      <group position={[0, 0.56, 0]} rotation={[0, 0, 0.12]}>
        <mesh position={[-0.045, 0.06, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.011, 0.011, 0.16, 6]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[0.045, 0.06, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.011, 0.011, 0.16, 6]} /><meshStandardMaterial color={frame} /></mesh>
      </group>
      {/* oval head (elongated along the shaft) */}
      <group position={[0, 0.86, 0]} scale={[0.9, 1.25, 1]}>
        <mesh><torusGeometry args={[0.17, 0.016, 10, 36]} /><meshStandardMaterial color={frame} metalness={0.2} roughness={0.5} /></mesh>
        {/* string bed */}
        {[-0.1, -0.05, 0, 0.05, 0.1].map((x) => (
          <mesh key={`v${x}`} position={[x, 0, 0]}><boxGeometry args={[0.004, 0.3, 0.004]} /><meshStandardMaterial color={strings} transparent opacity={0.8} /></mesh>
        ))}
        {[-0.1, -0.05, 0, 0.05, 0.1].map((y) => (
          <mesh key={`h${y}`} position={[0, y, 0]}><boxGeometry args={[0.3, 0.004, 0.004]} /><meshStandardMaterial color={strings} transparent opacity={0.8} /></mesh>
        ))}
      </group>
    </group>
  )
}

/* Day: playing badminton, shuffling a few steps */
export function GirlBadminton({ position = [0, 0, 0], scale = 1 }) {
  const root = useRef()
  const arm = useRef()
  const legL = useRef()
  const legR = useRef()
  const shuttle = useRef()
  const body = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const step = Math.sin(t * 0.7) // slow side-to-side footwork
    if (root.current) {
      root.current.position.x = position[0] + step * 0.9
      root.current.position.y = position[1] + Math.abs(Math.sin(t * 1.4)) * 0.06
      root.current.rotation.y = step * 0.25
    }
    if (body.current) body.current.rotation.z = -step * 0.08
    if (legL.current) legL.current.rotation.x = Math.sin(t * 1.4) * 0.35
    if (legR.current) legR.current.rotation.x = -Math.sin(t * 1.4) * 0.35
    if (arm.current) arm.current.rotation.z = -0.3 + Math.sin(t * 2.4) * 0.9
    if (shuttle.current) {
      shuttle.current.position.y = 2.15 + Math.abs(Math.sin(t * 2.4)) * 0.75
      shuttle.current.position.x = 0.75 + Math.sin(t * 2.4) * 0.4
      shuttle.current.rotation.z = Math.sin(t * 3) * 0.7
    }
  })
  return (
    <group ref={root} position={position} scale={scale}>
      <group ref={body}>
        {/* legs (hinged at hip for footwork) */}
        <group ref={legL} position={[-0.12, 0.6, 0]}>
          <mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
          <mesh position={[0, -0.52, 0.05]}><boxGeometry args={[0.14, 0.1, 0.24]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
        </group>
        <group ref={legR} position={[0.12, 0.6, 0]}>
          <mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
          <mesh position={[0, -0.52, 0.05]}><boxGeometry args={[0.14, 0.1, 0.24]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
        </group>
        {/* dress + torso */}
        <mesh position={[0, 0.95, 0]}><coneGeometry args={[0.36, 0.82, 14]} /><meshStandardMaterial color="#b98fd6" roughness={0.8} /></mesh>
        <mesh position={[0, 1.2, 0]}><capsuleGeometry args={[0.17, 0.2, 4, 10]} /><meshStandardMaterial color="#b98fd6" roughness={0.8} /></mesh>
        {/* head with face */}
        <group position={[0, 1.56, 0]}><GirlHead /></group>
        {/* left resting arm */}
        <mesh position={[-0.28, 1.15, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.05, 0.4, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
        {/* racket arm */}
        <group ref={arm} position={[0.14, 1.3, 0]}>
          <mesh position={[0.3, 0.12, 0]} rotation={[0, 0, -0.6]}><capsuleGeometry args={[0.05, 0.5, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
          <group position={[0.58, 0.36, 0]} rotation={[0, 0, -0.7]}>
            <Racket />
          </group>
        </group>
      </group>
      {/* shuttlecock */}
      <group ref={shuttle} position={[0.75, 2.15, 0]}>
        <mesh><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[0, 0.11, 0]}><coneGeometry args={[0.1, 0.2, 10, 1, true]} /><meshStandardMaterial color="#f3ecff" emissive="#e0d4f7" emissiveIntensity={0.3} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
  )
}

/* Night: pointing to the stars */
export function GirlStargazer({ position = [0, 0, 0], scale = 1 }) {
  const body = useRef()
  const spark = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (body.current) body.current.rotation.y = -0.2 + Math.sin(t * 0.6) * 0.05
    if (spark.current) {
      spark.current.scale.setScalar(0.8 + Math.sin(t * 4) * 0.3)
    }
  })
  return (
    <group position={position} scale={scale}>
      <group ref={body}>
        <GirlBase dress="#6a4fa0" />
        {/* left arm relaxed */}
        <mesh position={[-0.26, 1.12, 0.05]} rotation={[0.3, 0, 0.4]}><capsuleGeometry args={[0.05, 0.42, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
        {/* right arm raised, pointing up */}
        <group position={[0.16, 1.34, 0]}>
          <mesh position={[0.18, 0.45, -0.05]} rotation={[0, 0, -1.15]}><capsuleGeometry args={[0.05, 0.55, 4, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
          {/* pointing hand + sparkle */}
          <mesh position={[0.42, 0.82, -0.1]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#e8b48c" /></mesh>
          <mesh ref={spark} position={[0.5, 0.98, -0.12]}>
            <octahedronGeometry args={[0.09, 0]} />
            <meshStandardMaterial color="#ffe082" emissive="#ffe082" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* Seated girl reading a book (for the sanctuary nook) */
export function GirlReading({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], dress = '#c98fb0', showBook = true }) {
  const head = useRef()
  const book = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (head.current) head.current.rotation.x = (showBook ? 0.35 : 0.05) + Math.sin(t * 0.8) * 0.05
    if (book.current) book.current.rotation.z = Math.sin(t * 1.6) * 0.04
  })
  const skin = '#e8b48c'
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* thighs forward */}
      <mesh position={[-0.12, 0.55, 0.22]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.08, 0.34, 4, 8]} /><meshStandardMaterial color={dress} /></mesh>
      <mesh position={[0.12, 0.55, 0.22]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.08, 0.34, 4, 8]} /><meshStandardMaterial color={dress} /></mesh>
      {/* shins down */}
      <mesh position={[-0.12, 0.28, 0.42]}><capsuleGeometry args={[0.07, 0.34, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.12, 0.28, 0.42]}><capsuleGeometry args={[0.07, 0.34, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-0.12, 0.08, 0.5]}><boxGeometry args={[0.13, 0.1, 0.22]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      <mesh position={[0.12, 0.08, 0.5]}><boxGeometry args={[0.13, 0.1, 0.22]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      {/* torso */}
      <mesh position={[0, 0.85, 0.05]}><coneGeometry args={[0.32, 0.66, 14]} /><meshStandardMaterial color={dress} roughness={0.85} /></mesh>
      {/* arms — reaching to a book, or resting on knees */}
      <mesh position={[-0.24, showBook ? 0.92 : 0.78, showBook ? 0.3 : 0.34]} rotation={[showBook ? 1.2 : 1.5, 0, 0.3]}><capsuleGeometry args={[0.05, 0.4, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.24, showBook ? 0.92 : 0.78, showBook ? 0.3 : 0.34]} rotation={[showBook ? 1.2 : 1.5, 0, -0.3]}><capsuleGeometry args={[0.05, 0.4, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      {/* head with face */}
      <group ref={head} position={[0, 1.32, 0.05]}>
        <GirlHead scale={0.95} />
      </group>
      {/* the book */}
      {showBook && (
        <group ref={book} position={[0, 0.98, 0.5]} rotation={[-0.9, 0, 0]}>
          <mesh rotation={[0, 0, -0.12]} position={[-0.19, 0, 0]}><boxGeometry args={[0.38, 0.03, 0.5]} /><meshStandardMaterial color="#fdfcff" /></mesh>
          <mesh rotation={[0, 0, 0.12]} position={[0.19, 0, 0]}><boxGeometry args={[0.38, 0.03, 0.5]} /><meshStandardMaterial color="#f3ecff" /></mesh>
          <mesh position={[0, -0.02, 0]}><boxGeometry args={[0.1, 0.06, 0.52]} /><meshStandardMaterial color="#6a4fa0" /></mesh>
        </group>
      )}
    </group>
  )
}

/* Girl sitting cross-legged on the ground (for the campfire) */
export function GirlSitGround({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], dress = '#6a4fa0' }) {
  const torso = useRef()
  const head = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (torso.current) torso.current.rotation.z = Math.sin(t * 0.8) * 0.03
    if (head.current) head.current.rotation.x = Math.sin(t * 0.6) * 0.06
  })
  const skin = '#e8b48c'
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* crossed shins resting on the ground */}
      <mesh position={[0.03, 0.11, 0.14]} rotation={[0, 0.5, Math.PI / 2]}><capsuleGeometry args={[0.075, 0.32, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-0.03, 0.11, -0.02]} rotation={[0, -0.5, Math.PI / 2]}><capsuleGeometry args={[0.075, 0.32, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      {/* knees out to the sides */}
      <mesh position={[0.24, 0.15, 0.08]} rotation={[0.2, 0.6, Math.PI / 2]}><capsuleGeometry args={[0.085, 0.26, 4, 8]} /><meshStandardMaterial color={dress} /></mesh>
      <mesh position={[-0.24, 0.15, 0.08]} rotation={[-0.2, -0.6, Math.PI / 2]}><capsuleGeometry args={[0.085, 0.26, 4, 8]} /><meshStandardMaterial color={dress} /></mesh>
      {/* hips + torso */}
      <group ref={torso}>
        <mesh position={[0, 0.22, -0.04]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color={dress} /></mesh>
        <mesh position={[0, 0.5, -0.02]}><coneGeometry args={[0.25, 0.6, 14]} /><meshStandardMaterial color={dress} roughness={0.85} /></mesh>
        <mesh position={[0, 0.7, -0.02]}><capsuleGeometry args={[0.14, 0.14, 4, 10]} /><meshStandardMaterial color={dress} /></mesh>
        {/* arms resting on the knees */}
        <mesh position={[-0.22, 0.5, 0.12]} rotation={[1.0, 0, 0.5]}><capsuleGeometry args={[0.05, 0.36, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
        <mesh position={[0.22, 0.5, 0.12]} rotation={[1.0, 0, -0.5]}><capsuleGeometry args={[0.05, 0.36, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
        {/* head */}
        <group ref={head} position={[0, 0.94, 0]}><GirlHead /></group>
      </group>
    </group>
  )
}

/* Girl half-reclined on the sofa reading — head propped at the +x end,
   legs extended toward -x under a cozy blanket. Faces the camera (+z). */
export function GirlLyingRead({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], dress = '#7b5cb0' }) {
  const chest = useRef()
  const book = useRef()
  const head = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (chest.current) chest.current.scale.set(1, 1 + Math.sin(t * 1.4) * 0.03, 1)
    if (book.current) book.current.rotation.x = -0.5 + Math.sin(t * 1.2) * 0.04
    if (head.current) head.current.rotation.x = 0.22 + Math.sin(t * 0.7) * 0.04
  })
  const skin = '#e8b48c'
  const blanket = '#efe0cf'
  // Local coords: the resting underside of the body is at y=0, so the whole
  // figure sits ON the seat when the group is placed at seat height.
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* hips */}
      <mesh position={[-0.14, 0.16, 0]}><sphereGeometry args={[0.17, 16, 16]} /><meshStandardMaterial color={dress} roughness={0.9} /></mesh>
      {/* reclined torso rising from hips to shoulders */}
      <group ref={chest}>
        <mesh position={[0.15, 0.36, 0]} rotation={[0, 0, -1.0]}><capsuleGeometry args={[0.15, 0.42, 8, 14]} /><meshStandardMaterial color={dress} roughness={0.9} /></mesh>
      </group>
      {/* shoulders + neck */}
      <mesh position={[0.44, 0.56, 0]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={dress} roughness={0.9} /></mesh>
      <mesh position={[0.52, 0.66, 0.01]} rotation={[0, 0, -0.6]}><capsuleGeometry args={[0.05, 0.09, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      {/* small pillow beneath her head, resting toward the armrest */}
      <mesh position={[0.74, 0.48, -0.03]} rotation={[0, 0, -0.32]}><boxGeometry args={[0.32, 0.12, 0.34]} /><meshStandardMaterial color="#f3d9e6" roughness={1} /></mesh>
      {/* head, tilted down to read, facing the camera */}
      <group ref={head} position={[0.6, 0.8, 0.03]} rotation={[0.22, 0, -0.1]}><GirlHead scale={0.9} /></group>

      {/* legs lie flat along the seat toward -x, knee slightly raised */}
      <mesh position={[-0.42, 0.2, 0.02]} rotation={[0, 0, 1.5]}><capsuleGeometry args={[0.13, 0.42, 6, 10]} /><meshStandardMaterial color={dress} /></mesh>
      <mesh position={[-0.92, 0.16, 0.05]} rotation={[0, 0, 1.57]}><capsuleGeometry args={[0.1, 0.5, 6, 10]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-1.24, 0.11, 0.07]}><boxGeometry args={[0.19, 0.11, 0.16]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      {/* cozy knit blanket over the lap */}
      <mesh position={[-0.5, 0.27, 0.02]} rotation={[0, 0, 0.08]}><boxGeometry args={[0.9, 0.16, 0.62]} /><meshStandardMaterial color={blanket} roughness={1} /></mesh>

      {/* arms bringing hands to a small book */}
      <mesh position={[0.4, 0.5, 0.16]} rotation={[0.9, 0, -0.2]}><capsuleGeometry args={[0.05, 0.26, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.5, 0.52, 0.16]} rotation={[0.9, 0, 0.2]}><capsuleGeometry args={[0.05, 0.26, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      {/* small open book */}
      <group ref={book} position={[0.46, 0.56, 0.3]} rotation={[-0.5, 0, 0]}>
        <mesh rotation={[0, 0, -0.14]} position={[-0.1, 0, 0]}><boxGeometry args={[0.2, 0.02, 0.24]} /><meshStandardMaterial color="#fdfcff" /></mesh>
        <mesh rotation={[0, 0, 0.14]} position={[0.1, 0, 0]}><boxGeometry args={[0.2, 0.02, 0.24]} /><meshStandardMaterial color="#f3ecff" /></mesh>
        <mesh position={[0, -0.015, 0]}><boxGeometry args={[0.05, 0.035, 0.26]} /><meshStandardMaterial color="#d96a9a" /></mesh>
      </group>
    </group>
  )
}

/* String / fairy lights draped in a gentle sag; twinkle warmly at night */
export function FairyLights({ width = 6, y = 3.5, z = -2.85, count = 18, drop = 0.5, night = false }) {
  const ref = useRef()
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime
    ref.current.children.forEach((c, i) => {
      const base = night ? 1.8 : 0.15
      c.material.emissiveIntensity = base + Math.sin(t * 3 + i) * (night ? 0.6 : 0.05)
    })
  })
  const bulbs = Array.from({ length: count }).map((_, i) => {
    const f = i / (count - 1)
    const x = (f - 0.5) * width
    const yy = y - drop * (1 - (2 * f - 1) * (2 * f - 1))
    return { x, y: yy }
  })
  const colors = ['#ffe082', '#ffd0e0', '#fff2c4', '#ffe6b0']
  return (
    <group ref={ref}>
      {bulbs.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, z]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={colors[i % colors.length]} emissive={colors[i % colors.length]} emissiveIntensity={night ? 1.8 : 0.15} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* Standing / idle girl (gentle sway + breathing) — for admiring a view */
export function GirlStanding({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], dress = '#b98fd6' }) {
  const root = useRef()
  const chest = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (root.current) root.current.rotation.y = rotation[1] + Math.sin(t * 0.8) * 0.06
    if (chest.current) chest.current.scale.set(1, 1 + Math.sin(t * 1.5) * 0.02, 1)
  })
  const skin = '#e8b48c'
  return (
    <group ref={root} position={position} scale={scale} rotation={rotation}>
      {/* legs + shoes */}
      <mesh position={[-0.1, 0.35, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.1, 0.35, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-0.1, 0.08, 0.05]}><boxGeometry args={[0.14, 0.1, 0.24]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      <mesh position={[0.1, 0.08, 0.05]}><boxGeometry args={[0.14, 0.1, 0.24]} /><meshStandardMaterial color="#5e4b8b" /></mesh>
      {/* dress + torso */}
      <group ref={chest}>
        <mesh position={[0, 0.95, 0]}><coneGeometry args={[0.34, 0.82, 14]} /><meshStandardMaterial color={dress} roughness={0.85} /></mesh>
        <mesh position={[0, 1.2, 0]}><capsuleGeometry args={[0.16, 0.18, 4, 10]} /><meshStandardMaterial color={dress} roughness={0.85} /></mesh>
      </group>
      {/* arms resting at the sides */}
      <mesh position={[-0.3, 1.12, 0.02]} rotation={[0.1, 0, 0.32]}><capsuleGeometry args={[0.05, 0.44, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.3, 1.12, 0.02]} rotation={[0.1, 0, -0.32]}><capsuleGeometry args={[0.05, 0.44, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      {/* head */}
      <group position={[0, 1.56, 0]}><GirlHead /></group>
    </group>
  )
}

/* Small lantern — glows warm at night (for cozy evening scenes) */
export function Lantern({ position = [0, 0, 0], scale = 1, night = false }) {
  const light = useRef()
  const glow = useRef()
  useFrame((s) => {
    const f = night ? 1.8 + Math.sin(s.clock.elapsedTime * 8) * 0.3 : 0
    if (light.current) light.current.intensity = f
    if (glow.current) glow.current.material.emissiveIntensity = night ? 2.5 : 0.15
  })
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.1, 0.12, 0.04, 10]} /><meshStandardMaterial color="#3a3550" metalness={0.4} /></mesh>
      {[[-0.07, -0.07], [0.07, -0.07], [-0.07, 0.07], [0.07, 0.07]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]}><cylinderGeometry args={[0.008, 0.008, 0.36, 4]} /><meshStandardMaterial color="#4a4560" metalness={0.5} /></mesh>
      ))}
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.11, 0.09, 0.05, 10]} /><meshStandardMaterial color="#3a3550" /></mesh>
      <mesh position={[0, 0.5, 0]}><coneGeometry args={[0.1, 0.1, 8]} /><meshStandardMaterial color="#3a3550" /></mesh>
      <mesh ref={glow} position={[0, 0.22, 0]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color="#ffcf7a" emissive="#ffb04a" emissiveIntensity={0.15} toneMapped={false} /></mesh>
      <pointLight ref={light} position={[0, 0.24, 0]} color="#ffb060" distance={4} intensity={0} />
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.008, 6, 16, Math.PI]} /><meshStandardMaterial color="#4a4560" /></mesh>
    </group>
  )
}

/* ============================================================
   PARK PROPS
   ============================================================ */

export function Bench({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const wood = '#9c6b43'
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[1.4, 0.08, 0.45]} /><meshStandardMaterial color={wood} roughness={1} /></mesh>
      <mesh position={[0, 0.62, -0.18]} rotation={[0.3, 0, 0]}><boxGeometry args={[1.4, 0.35, 0.06]} /><meshStandardMaterial color={wood} roughness={1} /></mesh>
      {[-0.6, 0.6].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.17, 0.15]}><boxGeometry args={[0.08, 0.35, 0.08]} /><meshStandardMaterial color="#5a3d29" /></mesh>
          <mesh position={[x, 0.17, -0.15]}><boxGeometry args={[0.08, 0.35, 0.08]} /><meshStandardMaterial color="#5a3d29" /></mesh>
        </group>
      ))}
    </group>
  )
}

export function LampPost({ position = [0, 0, 0], night }) {
  const light = useRef()
  useFrame((s) => {
    if (light.current) light.current.intensity = night ? 1.4 + Math.sin(s.clock.elapsedTime * 5) * 0.1 : 0
  })
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]}><cylinderGeometry args={[0.05, 0.07, 2.2, 8]} /><meshStandardMaterial color="#3a3550" metalness={0.4} roughness={0.6} /></mesh>
      <mesh position={[0, 2.25, 0]}><sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial color={night ? '#ffe082' : '#fff7d6'} emissive="#ffe082" emissiveIntensity={night ? 2.4 : 0.2} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 2.25, 0]} color="#ffe0a0" distance={7} intensity={0} />
    </group>
  )
}

export function Pond({ position = [0, 0.02, 0], radius = 2.4, night }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 40]} />
      <meshStandardMaterial color={night ? '#16324a' : '#7ec8e3'} metalness={0.6} roughness={0.15} transparent opacity={0.9} />
    </mesh>
  )
}

export function Fence({ position = [0, 0, 0], count = 6, spacing = 0.7, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[i * spacing, 0.35, 0]}><boxGeometry args={[0.08, 0.7, 0.08]} /><meshStandardMaterial color="#e9e2d0" roughness={1} /></mesh>
      ))}
      <mesh position={[((count - 1) * spacing) / 2, 0.5, 0]}><boxGeometry args={[(count - 1) * spacing, 0.06, 0.05]} /><meshStandardMaterial color="#e9e2d0" /></mesh>
      <mesh position={[((count - 1) * spacing) / 2, 0.25, 0]}><boxGeometry args={[(count - 1) * spacing, 0.06, 0.05]} /><meshStandardMaterial color="#e9e2d0" /></mesh>
    </group>
  )
}

/* Floating soft cloud */
export function Cloud3D({ position = [0, 0, 0], scale = 1, speed = 0.15, range = 1.5 }) {
  const ref = useRef()
  const seed = useMemo(() => Math.random() * 10, [])
  useFrame((s) => {
    if (ref.current) ref.current.position.x = position[0] + Math.sin(s.clock.elapsedTime * speed + seed) * range
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      {[[0, 0, 0, 0.9], [0.8, 0.1, 0, 0.7], [-0.8, 0.05, 0, 0.65], [0.3, 0.3, 0.2, 0.6], [-0.4, 0.28, 0.1, 0.5]].map((c, i) => (
        <mesh key={i} position={[c[0], c[1], c[2]]}>
          <sphereGeometry args={[c[3], 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export function OpenBook({ position = [0, 0, 0], scale = 1, rotation = [-0.5, 0, 0] }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[0, 0, -0.12]} position={[-0.31, 0, 0]}><boxGeometry args={[0.6, 0.04, 0.8]} /><meshStandardMaterial color="#fdfcff" /></mesh>
      <mesh rotation={[0, 0, 0.12]} position={[0.31, 0, 0]}><boxGeometry args={[0.6, 0.04, 0.8]} /><meshStandardMaterial color="#f3ecff" /></mesh>
      <mesh position={[0, -0.03, 0]}><boxGeometry args={[0.16, 0.09, 0.82]} /><meshStandardMaterial color="#6a4fa0" /></mesh>
    </group>
  )
}

/* Bookshelf packed with colorful books, stacks and trinkets */
export function Bookshelf({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const frame = '#8a6244'
  const shelfY = [0.55, 1.2, 1.85, 2.5]
  const colors = ['#f6a8cb', '#7aa7e0', '#7fc48a', '#ffe082', '#e0d4f7', '#ff9e64', '#94e2d5', '#e77fa3', '#b58ce0', '#efb0c9', '#8fd3c8', '#f4b183']
  const shelves = useMemo(
    () =>
      shelfY.map((y, si) => {
        const books = []
        let x = -0.82
        let idx = 0
        while (x < 0.7) {
          const w = 0.09 + Math.random() * 0.05
          const h = 0.42 + Math.random() * 0.22
          const tilt = Math.random() < 0.16 ? (Math.random() - 0.5) * 0.5 : 0
          books.push({ x: x + w / 2, w, h, tilt, c: colors[(idx + si) % colors.length] })
          x += w + 0.012
          idx++
        }
        // a horizontal stack to fill the remaining gap
        const stack = Array.from({ length: 3 }).map((_, k) => ({ y: k * 0.055, c: colors[(k + si * 2) % colors.length] }))
        return { y, books, stack }
      }),
    [],
  )
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* open box carcass: back panel + sides + top/bottom (nothing in front of the books) */}
      <mesh position={[0, 1.55, -0.22]}><boxGeometry args={[2, 3.1, 0.06]} /><meshStandardMaterial color="#7a5238" roughness={1} /></mesh>
      <mesh position={[-0.97, 1.55, 0]}><boxGeometry args={[0.08, 3.1, 0.5]} /><meshStandardMaterial color={frame} roughness={1} /></mesh>
      <mesh position={[0.97, 1.55, 0]}><boxGeometry args={[0.08, 3.1, 0.5]} /><meshStandardMaterial color={frame} roughness={1} /></mesh>
      <mesh position={[0, 3.06, 0]}><boxGeometry args={[2.02, 0.1, 0.5]} /><meshStandardMaterial color={frame} roughness={1} /></mesh>
      <mesh position={[0, 0.05, 0]}><boxGeometry args={[2.02, 0.1, 0.5]} /><meshStandardMaterial color={frame} roughness={1} /></mesh>
      {/* shelves + books (well in front of the back panel) */}
      {shelves.map((sh, si) => (
        <group key={si}>
          <mesh position={[0, sh.y - 0.13, 0]}><boxGeometry args={[1.86, 0.05, 0.46] } /><meshStandardMaterial color={frame} /></mesh>
          {sh.books.map((b, i) => (
            <mesh key={i} position={[b.x, sh.y + b.h / 2 - 0.11, 0.06]} rotation={[0, 0, b.tilt]}>
              <boxGeometry args={[b.w, b.h, 0.3]} />
              <meshStandardMaterial color={b.c} roughness={0.55} />
            </mesh>
          ))}
          {/* horizontal stack on the right */}
          {sh.stack.map((s, k) => (
            <mesh key={`s${k}`} position={[0.76, sh.y - 0.07 + s.y, 0.06]}>
              <boxGeometry args={[0.34, 0.055, 0.28]} />
              <meshStandardMaterial color={s.c} roughness={0.55} />
            </mesh>
          ))}
        </group>
      ))}
      {/* trinkets on top */}
      <mesh position={[-0.5, 3.21, 0.05]}><cylinderGeometry args={[0.11, 0.09, 0.18, 10]} /><meshStandardMaterial color="#c97b5c" /></mesh>
      <mesh position={[-0.5, 3.39, 0.05]}><icosahedronGeometry args={[0.16, 1]} /><meshStandardMaterial color="#6cbf72" flatShading /></mesh>
      <mesh position={[0.4, 3.26, 0.05]}><boxGeometry args={[0.24, 0.3, 0.04]} /><meshStandardMaterial color="#f3ecff" /></mesh>
      <mesh position={[0.05, 3.23, 0.05]}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color="#ffe082" emissive="#ffe082" emissiveIntensity={0.3} /></mesh>
    </group>
  )
}

/* Cozy reading chair */
export function ReadingChair({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], color = '#c98fb0' }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.9, 0.3, 0.9]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      <mesh position={[0, 0.85, -0.4]}><boxGeometry args={[0.9, 0.9, 0.2]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      <mesh position={[-0.45, 0.65, 0]}><boxGeometry args={[0.18, 0.5, 0.9]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      <mesh position={[0.45, 0.65, 0]}><boxGeometry args={[0.18, 0.5, 0.9]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
    </group>
  )
}

/* ============================================================
   THEMED NATURE-SCENE PROPS
   ============================================================ */

/* Waterfall: rock cliff, a falling sheet with animated flow streaks, a pool + foam */
export function Waterfall({ position = [0, 0, 0], night }) {
  const flow = useRef()
  useFrame((s) => {
    if (!flow.current) return
    flow.current.children.forEach((c, i) => {
      c.position.y = 3.0 - ((s.clock.elapsedTime * 2 + i * 0.42) % 2.7)
    })
  })
  const rock = night ? '#3a4048' : '#71767e'
  const rock2 = night ? '#2c3138' : '#5f646c'
  return (
    <group position={position}>
      {/* cliff */}
      <mesh position={[0, 2, -0.7]}><boxGeometry args={[3.4, 4.2, 1.2]} /><meshStandardMaterial color={rock} roughness={1} flatShading /></mesh>
      <mesh position={[-2, 1.5, -0.1]}><dodecahedronGeometry args={[1.1, 0]} /><meshStandardMaterial color={rock2} roughness={1} flatShading /></mesh>
      <mesh position={[2.1, 1.7, -0.1]}><dodecahedronGeometry args={[1.2, 0]} /><meshStandardMaterial color={rock2} roughness={1} flatShading /></mesh>
      {/* water sheet */}
      <mesh position={[0, 2, 0.05]}><planeGeometry args={[2.2, 3.9]} /><meshStandardMaterial color="#cfeefb" transparent opacity={0.7} emissive="#bfe6f5" emissiveIntensity={0.12} /></mesh>
      {/* flow streaks */}
      <group ref={flow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-0.95 + i * 0.27, 1, 0.09]}><boxGeometry args={[0.1, 1.2, 0.02]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.55} /></mesh>
        ))}
      </group>
      {/* pool + foam */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1.7]}><circleGeometry args={[2.7, 40]} /><meshStandardMaterial color={night ? '#16324a' : '#7ec8e3'} metalness={0.5} roughness={0.2} transparent opacity={0.9} /></mesh>
      {[[-0.4, 0.7], [0.35, 0.85], [0, 0.5], [0.2, 1.1]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.14, p[1]]}><sphereGeometry args={[0.2, 10, 10]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>
      ))}
    </group>
  )
}

/* A single lavender plant (mound + purple spikes) */
export function Lavender({ position = [0, 0, 0], scale = 1 }) {
  const ref = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  useFrame((s) => { if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.1 + seed) * 0.06 })
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}><icosahedronGeometry args={[0.18, 1]} /><meshStandardMaterial color="#5f9e63" flatShading roughness={1} /></mesh>
      <group ref={ref} position={[0, 0.2, 0]}>
        {[-0.13, -0.04, 0.05, 0.13, 0].map((x, i) => (
          <mesh key={i} position={[x, 0.32, (i % 2 ? 0.05 : -0.05)]} rotation={[0, 0, x * 0.7]}>
            <coneGeometry args={[0.035, 0.5, 6]} />
            <meshStandardMaterial color={i % 2 ? '#8a6fc4' : '#b58ce0'} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* A lotus/water-lily: flat pad + layered pink petals */
export function Lotus({ position = [0, 0, 0], scale = 1, pad = true, bloom = true }) {
  return (
    <group position={position} scale={scale}>
      {pad && (
        <mesh rotation={[-Math.PI / 2, 0.0, 0]} position={[0, 0.04, 0]}>
          <circleGeometry args={[0.42, 24, 0.4, Math.PI * 1.85]} />
          <meshStandardMaterial color="#4f9a58" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      {bloom && (
        <group position={[0, 0.08, 0]}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <mesh key={a} position={[0.09 * Math.cos((a * Math.PI) / 180), 0.05, 0.09 * Math.sin((a * Math.PI) / 180)]} rotation={[0.7, (a * Math.PI) / 180, 0]}>
              <coneGeometry args={[0.06, 0.22, 5]} />
              <meshStandardMaterial color="#f6a8cb" roughness={0.7} />
            </mesh>
          ))}
          {[30, 150, 270].map((a) => (
            <mesh key={a} position={[0.05 * Math.cos((a * Math.PI) / 180), 0.12, 0.05 * Math.sin((a * Math.PI) / 180)]} rotation={[0.4, (a * Math.PI) / 180, 0]}>
              <coneGeometry args={[0.045, 0.18, 5]} />
              <meshStandardMaterial color="#f7c6de" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color="#ffe082" emissive="#fce1a8" emissiveIntensity={0.3} /></mesh>
        </group>
      )}
    </group>
  )
}

/* Tall reed / cattail */
export function Reed({ position = [0, 0, 0], scale = 1, night }) {
  return (
    <group position={position} scale={scale}>
      {[-0.06, 0.02, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]} rotation={[0, 0, x]}><cylinderGeometry args={[0.015, 0.02, 1, 5]} /><meshStandardMaterial color={night ? '#2f5a3a' : '#5f9e63'} /></mesh>
      ))}
      <mesh position={[0.02, 1.02, 0]}><capsuleGeometry args={[0.05, 0.16, 4, 8]} /><meshStandardMaterial color="#7c5a3c" /></mesh>
    </group>
  )
}

/* ============================================================
   INTERIOR / COZY ROOM PROPS
   ============================================================ */

/* Fireplace built into a wall — fire burns only when `lit` */
export function Fireplace({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, lit = false }) {
  const flame = useRef()
  const light = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const f = 0.9 + Math.sin(t * 12) * 0.09 + Math.sin(t * 7) * 0.05
    if (flame.current) {
      flame.current.visible = lit
      flame.current.scale.set(2 - f, f, 1)
    }
    if (light.current) light.current.intensity = lit ? 2.4 + Math.sin(t * 10) * 0.5 : 0
  })
  const brick = '#8a5a4a'
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* surround */}
      <mesh position={[0, 1.1, 0]}><boxGeometry args={[2.3, 2.2, 0.5]} /><meshStandardMaterial color={brick} roughness={1} /></mesh>
      {/* dark firebox */}
      <mesh position={[0, 0.85, 0.18]}><boxGeometry args={[1.4, 1.35, 0.3]} /><meshStandardMaterial color="#1e1414" /></mesh>
      {/* mantel + hearth */}
      <mesh position={[0, 2.32, 0.16]}><boxGeometry args={[2.7, 0.22, 0.72]} /><meshStandardMaterial color="#6b4a32" /></mesh>
      <mesh position={[0, 0.1, 0.34]}><boxGeometry args={[2.5, 0.2, 0.85]} /><meshStandardMaterial color="#7a6a6a" roughness={1} /></mesh>
      {/* logs */}
      <mesh position={[-0.15, 0.35, 0.22]} rotation={[0, 0.3, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.8, 6]} /><meshStandardMaterial color="#6b4a32" /></mesh>
      <mesh position={[0.15, 0.35, 0.22]} rotation={[0, -0.3, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.8, 6]} /><meshStandardMaterial color="#5a3d29" /></mesh>
      {/* flames (only visible when lit) */}
      <group ref={flame} position={[0, 0.55, 0.22]} visible={lit}>
        <mesh><coneGeometry args={[0.26, 0.75, 8]} /><meshStandardMaterial color="#ff9e64" emissive="#ff9e64" emissiveIntensity={2.6} toneMapped={false} /></mesh>
        <mesh position={[0, -0.06, 0]}><coneGeometry args={[0.14, 0.5, 8]} /><meshStandardMaterial color="#ffe082" emissive="#ffe082" emissiveIntensity={3.2} toneMapped={false} /></mesh>
      </group>
      <pointLight ref={light} position={[0, 0.9, 0.7]} color="#ff9e64" distance={9} intensity={0} />
    </group>
  )
}

/* Cozy sofa with rolled (rounded) arms and backrest. Seat top ≈ 0.56 */
export function Sofa({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = '#c98fb0' }) {
  const cushion = '#dcaecb'
  const pillow = '#7aa7e0'
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* base */}
      <mesh position={[0, 0.28, 0]}><boxGeometry args={[2.4, 0.34, 1.05]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
      {/* seat cushions + rounded front bolster */}
      <mesh position={[-0.5, 0.52, 0.04]}><boxGeometry args={[0.94, 0.18, 0.86]} /><meshStandardMaterial color={cushion} roughness={0.95} /></mesh>
      <mesh position={[0.5, 0.52, 0.04]}><boxGeometry args={[0.94, 0.18, 0.86]} /><meshStandardMaterial color={cushion} roughness={0.95} /></mesh>
      <mesh position={[0, 0.5, 0.48]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 2.0, 16]} /><meshStandardMaterial color={cushion} roughness={0.95} /></mesh>
      {/* backrest + rounded top roll */}
      <mesh position={[0, 0.78, -0.42]}><boxGeometry args={[2.02, 0.62, 0.26]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
      <mesh position={[0, 1.06, -0.42]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.14, 0.14, 2.02, 20]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
      {/* rolled arms (body + rounded top roll along z) */}
      {[-1.12, 1.12].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.44, 0]}><boxGeometry args={[0.26, 0.5, 1.05]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
          <mesh position={[x, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 1.05, 20]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
        </group>
      ))}
      {/* legs */}
      {[[-1, 0.45], [1, 0.45], [-1, -0.45], [1, -0.45]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]}><cylinderGeometry args={[0.05, 0.05, 0.12, 8]} /><meshStandardMaterial color="#3a2b1e" /></mesh>
      ))}
      {/* throw pillow */}
      <mesh position={[-0.78, 0.66, -0.24]} rotation={[0, 0, 0.4]}><boxGeometry args={[0.4, 0.4, 0.14]} /><meshStandardMaterial color={pillow} roughness={0.95} /></mesh>
    </group>
  )
}

/* One flat, pointed snake-plant leaf with a variegated edge */
function SnakeLeaf({ angle = 0, tilt = 0, h = 1.1 }) {
  return (
    <group rotation={[tilt, angle, 0]}>
      <mesh position={[0, h / 2, 0]}><boxGeometry args={[0.13, h, 0.03]} /><meshStandardMaterial color="#3f8a52" roughness={0.85} /></mesh>
      {/* lighter centre stripe */}
      <mesh position={[0, h / 2, 0.017]}><boxGeometry args={[0.06, h * 0.92, 0.01]} /><meshStandardMaterial color="#6fbf72" roughness={0.85} /></mesh>
      {/* yellow edges */}
      <mesh position={[0.058, h / 2, 0.016]}><boxGeometry args={[0.014, h * 0.94, 0.008]} /><meshStandardMaterial color="#e6d27a" /></mesh>
      <mesh position={[-0.058, h / 2, 0.016]}><boxGeometry args={[0.014, h * 0.94, 0.008]} /><meshStandardMaterial color="#e6d27a" /></mesh>
      {/* pointed tip */}
      <mesh position={[0, h, 0]}><coneGeometry args={[0.065, 0.16, 4]} /><meshStandardMaterial color="#3f8a52" /></mesh>
    </group>
  )
}

/* Potted indoor plant. kind 0 = leafy bush, 1 = snake plant, 2 = trailing/hanging */
export function IndoorPlant({ position = [0, 0, 0], scale = 1, kind = 0, potColor = '#c97b5c' }) {
  const sway = useRef()
  const seed = useMemo(() => Math.random() * 6, [])
  useFrame((s) => {
    if (sway.current) sway.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.8 + seed) * 0.03
  })
  return (
    <group position={position} scale={scale}>
      {/* pot */}
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.22, 0.16, 0.4, 12]} /><meshStandardMaterial color={potColor} roughness={0.9} /></mesh>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.24, 0.22, 0.06, 12]} /><meshStandardMaterial color="#a85f43" /></mesh>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.19, 0.19, 0.05, 12]} /><meshStandardMaterial color="#5a3d2a" /></mesh>
      <group ref={sway} position={[0, 0.42, 0]}>
        {kind === 0 && (
          [[0, 0.5, 0, 0.34], [-0.2, 0.4, 0.1, 0.26], [0.2, 0.42, -0.1, 0.28], [0, 0.72, 0.05, 0.24]].map((b, i) => (
            <mesh key={i} position={[b[0], b[1], b[2]]}><icosahedronGeometry args={[b[3], 1]} /><meshStandardMaterial color={i % 2 ? '#5aa563' : '#6cbf72'} flatShading roughness={1} /></mesh>
          ))
        )}
        {kind === 1 && (
          [
            { angle: 0, tilt: 0.02, h: 1.25 },
            { angle: 0.9, tilt: 0.12, h: 1.05 },
            { angle: 1.9, tilt: 0.14, h: 1.15 },
            { angle: 2.7, tilt: 0.1, h: 0.95 },
            { angle: 3.6, tilt: 0.16, h: 1.1 },
            { angle: 4.6, tilt: 0.12, h: 0.85 },
            { angle: 5.4, tilt: 0.1, h: 1.0 },
          ].map((l, i) => <SnakeLeaf key={i} {...l} />)
        )}
        {kind === 2 && (
          <>
            {/* crown */}
            <mesh position={[0, 0.12, 0]}><icosahedronGeometry args={[0.24, 1]} /><meshStandardMaterial color="#5fb567" flatShading roughness={1} /></mesh>
            {/* trailing vines */}
            {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => {
              const r = 0.18
              const x = Math.cos(a) * r
              const z = Math.sin(a) * r
              const len = 0.5 + (i % 3) * 0.3
              return (
                <group key={i} position={[x, 0.1, z]} rotation={[0, 0, x * 0.4]}>
                  <mesh position={[0, -len / 2, 0]}><cylinderGeometry args={[0.012, 0.012, len, 5]} /><meshStandardMaterial color="#4f9a58" /></mesh>
                  {[0.25, 0.55, 0.85].map((f, k) => (
                    <mesh key={k} position={[0.03, -len * f, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#6cbf72" flatShading /></mesh>
                  ))}
                </group>
              )
            })}
          </>
        )}
      </group>
    </group>
  )
}

/* Floor lamp — glows warm at night */
export function FloorLamp({ position = [0, 0, 0], night = false }) {
  const light = useRef()
  useFrame(() => {
    if (light.current) light.current.intensity += ((night ? 1.5 : 0) - light.current.intensity) * 0.1
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.2, 0.22, 0.08, 12]} /><meshStandardMaterial color="#3a3550" metalness={0.4} /></mesh>
      <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.03, 0.03, 1.8, 8]} /><meshStandardMaterial color="#4a4560" metalness={0.5} /></mesh>
      <mesh position={[0, 1.9, 0]}><coneGeometry args={[0.32, 0.4, 16, 1, true]} /><meshStandardMaterial color={night ? '#ffe6b0' : '#efe6d6'} emissive="#ffe6a0" emissiveIntensity={night ? 1.6 : 0.1} side={THREE.DoubleSide} toneMapped={false} /></mesh>
      <pointLight ref={light} position={[0, 1.85, 0]} color="#ffdf9e" distance={6} intensity={0} />
    </group>
  )
}

/* Rain streaks (used behind the window at night) */
function Rain({ width = 3.2, height = 1.8, count = 46 }) {
  const ref = useRef()
  const drops = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * width,
        len: 0.14 + Math.random() * 0.22,
        spd: 2.4 + Math.random() * 2.6,
        y0: Math.random() * height,
      })),
    [count, width, height],
  )
  useFrame((s) => {
    if (!ref.current) return
    ref.current.children.forEach((c, i) => {
      const d = drops[i]
      const y = ((d.y0 - s.clock.elapsedTime * d.spd) % height + height) % height
      c.position.y = y - height / 2
    })
  })
  return (
    <group ref={ref}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.x, 0, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.012, d.len, 0.012]} />
          <meshBasicMaterial color="#cfe6ff" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

/* The view seen through the window — layered sky, angled sun/moon, distant
   hills + tree for depth, drifting clouds (day) or stars + slanted rain (night) */
export function WindowSky({ night = false, width = 3.2, height = 1.7 }) {
  const stars = useMemo(
    () => Array.from({ length: 26 }).map(() => ({ x: (Math.random() - 0.5) * width, y: Math.random() * height * 0.4 + 0.05, r: 0.008 + Math.random() * 0.014 })),
    [width, height],
  )
  const skyTop = night ? '#0b1226' : '#7fc0f2'
  const skyHorizon = night ? '#1b2748' : '#d3ecff'
  const hillA = night ? '#0b1a2b' : '#5f8490'
  const hB = night ? '#12233a' : '#78a0aa'
  const groundStrip = night ? '#0a1420' : '#5a8a5e'
  const treeSil = night ? '#0a1727' : '#4c6f52'
  const bottom = -height / 2
  return (
    <group>
      {/* sky + horizon band */}
      <mesh position={[0, 0, -0.03]}><planeGeometry args={[width, height]} /><meshBasicMaterial color={skyTop} /></mesh>
      <mesh position={[0, bottom + height * 0.2, -0.025]}><planeGeometry args={[width, height * 0.4]} /><meshBasicMaterial color={skyHorizon} /></mesh>

      {night ? (
        <>
          {stars.map((s, i) => (
            <mesh key={i} position={[s.x, s.y, -0.02]}><circleGeometry args={[s.r, 8]} /><meshBasicMaterial color="#fff" /></mesh>
          ))}
          {/* full round moon (matches the outside moon) with halo + craters */}
          <mesh position={[0.78, 0.46, -0.021]}><circleGeometry args={[0.38, 30]} /><meshBasicMaterial color="#fff6d0" transparent opacity={0.2} /></mesh>
          <mesh position={[0.78, 0.46, -0.019]}><circleGeometry args={[0.22, 30]} /><meshBasicMaterial color="#ffeeb4" /></mesh>
          <mesh position={[0.71, 0.52, -0.018]}><circleGeometry args={[0.038, 12]} /><meshBasicMaterial color="#e7d18a" /></mesh>
          <mesh position={[0.85, 0.41, -0.018]}><circleGeometry args={[0.03, 12]} /><meshBasicMaterial color="#e7d18a" /></mesh>
          <mesh position={[0.77, 0.39, -0.018]}><circleGeometry args={[0.022, 12]} /><meshBasicMaterial color="#e7d18a" /></mesh>
        </>
      ) : (
        <>
          {/* sun high on the left (light rakes in from that side) with a soft halo */}
          <mesh position={[-0.82, 0.5, -0.021]}><circleGeometry args={[0.44, 28]} /><meshBasicMaterial color="#fff3c4" transparent opacity={0.32} /></mesh>
          <mesh position={[-0.82, 0.5, -0.019]}><circleGeometry args={[0.24, 28]} /><meshBasicMaterial color="#fff7db" /></mesh>
          {[[0.4, 0.2, 0.3], [0.72, 0.28, 0.22], [0.1, 0.26, 0.2], [-0.2, 0.05, 0.16]].map((c, i) => (
            <mesh key={i} position={[c[0], c[1], -0.018]}><circleGeometry args={[c[2], 20]} /><meshBasicMaterial color="#ffffff" /></mesh>
          ))}
        </>
      )}

      {/* distant hills for depth (distinct z so their overlap doesn't shimmer) */}
      <mesh position={[-0.6, bottom + 0.16, -0.015]} scale={[2.4, 1, 1]}><circleGeometry args={[0.4, 24]} /><meshBasicMaterial color={hillA} /></mesh>
      <mesh position={[0.8, bottom + 0.12, -0.012]} scale={[2.6, 0.9, 1]}><circleGeometry args={[0.4, 24]} /><meshBasicMaterial color={hB} /></mesh>
      {/* a lone tree on the hill */}
      <group position={[-1.05, bottom + 0.12, -0.01]} scale={0.55}>
        <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.06, 0.44, 0.02]} /><meshBasicMaterial color={treeSil} /></mesh>
        <mesh position={[0, 0.52, 0]}><circleGeometry args={[0.22, 16]} /><meshBasicMaterial color={treeSil} /></mesh>
      </group>
      {/* ground strip hides the horizon edge */}
      <mesh position={[0, bottom + 0.05, -0.009]}><planeGeometry args={[width, 0.24]} /><meshBasicMaterial color={groundStrip} /></mesh>

      {night && <Rain width={width - 0.2} height={height - 0.1} />}
    </group>
  )
}

/* Campfire (glows at night) */
export function Campfire({ position = [0, 0, 0], intensity = 1 }) {
  const flame = useRef()
  const light = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const f = 0.9 + Math.sin(t * 12) * 0.08 + Math.sin(t * 7) * 0.05
    if (flame.current) { flame.current.scale.y = f; flame.current.scale.x = 2 - f }
    if (light.current) light.current.intensity = (2.5 + Math.sin(t * 10) * 0.6) * intensity
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} rotation={[0, 0.4, 0.06]}><cylinderGeometry args={[0.06, 0.06, 0.7, 6]} /><meshStandardMaterial color="#6b4a32" /></mesh>
      <mesh position={[0, 0.08, 0]} rotation={[0, -0.5, -0.06]}><cylinderGeometry args={[0.06, 0.06, 0.7, 6]} /><meshStandardMaterial color="#5a3d29" /></mesh>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <mesh key={a} position={[0.35 * Math.cos((a * Math.PI) / 180), 0.05, 0.35 * Math.sin((a * Math.PI) / 180)]}>
          <dodecahedronGeometry args={[0.1, 0]} /><meshStandardMaterial color="#9aa0a6" roughness={1} flatShading />
        </mesh>
      ))}
      <mesh ref={flame} position={[0, 0.4, 0]}><coneGeometry args={[0.18, 0.6, 8]} /><meshStandardMaterial color="#ff9e64" emissive="#ff9e64" emissiveIntensity={2.4 * intensity} toneMapped={false} /></mesh>
      <mesh position={[0, 0.32, 0]}><coneGeometry args={[0.1, 0.36, 8]} /><meshStandardMaterial color="#ffe082" emissive="#ffe082" emissiveIntensity={3 * intensity} toneMapped={false} /></mesh>
      <pointLight ref={light} position={[0, 0.6, 0]} color="#ff9e64" distance={9} intensity={2.5 * intensity} />
    </group>
  )
}
