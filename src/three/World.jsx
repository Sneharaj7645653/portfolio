import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Sparkles, Stars, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import {
  PineTree, OakTree, BlossomTree, Bush, FloweringShrub, GrassPatch, FarTree,
  Cat, Rabbit, Duck, Deer, Dog, Squirrel, Flock, Butterfly3D, Dragonfly, Rainbow,
  GirlBadminton, GirlReading, GirlSitGround, GirlStanding, Lantern, Bench, LampPost, Pond, Fence,
  Cloud3D, Bookshelf, Campfire, Fireplace, Sofa, IndoorPlant, FloorLamp, WindowSky,
  GirlLyingRead, FairyLights, Waterfall, Lavender, Lotus, Reed,
} from './props.jsx'
import { PetalFall, FallingLeaves, Mist, Pollen, Foam, RippleWater } from './realism.jsx'

/* Station world positions + camera framing. Index/order MUST match the HUD. */
export const STATIONS = [
  { id: 'home', cx: 0, cam: [0, 5.4, 19], look: [0, 2.4, 1] },
  { id: 'about', cx: 26, cam: [26, 3.4, 12], look: [26, 1.5, 2] },
  { id: 'tech', cx: 52, cam: [52, 3.5, 12.5], look: [52, 1.7, 1.5] },
  { id: 'product', cx: 78, cam: [78, 3.5, 12.5], look: [78, 1.5, 2.6] },
  { id: 'journey', cx: 104, cam: [104, 3.5, 12.5], look: [104, 1.7, 2.2] },
  { id: 'sanctuary', cx: 156, cam: [156, 3.2, 9.5], look: [156, 1.7, -1.2] },
  { id: 'contact', cx: 182, cam: [182, 3.3, 12], look: [182, 1.3, 2.4] },
]

const DAY = { bg: '#bfe3ff', fog: '#dbeeff', hemi: 1.05, dir: 1.3, dirColor: '#fff6e0' }
const NIGHT = { bg: '#0a0f22', fog: '#0f1636', hemi: 0.3, dir: 0.22, dirColor: '#8ea2ff' }

/* Lights + sky + fog (lerped on theme change) and the camera fly-to. */
function Stage({ night, station }) {
  const { scene, camera } = useThree()
  const hemi = useRef()
  const dir = useRef()
  const orb = useRef()
  const look = useRef(new THREE.Vector3(0, 2.4, 1))
  const bgC = useRef(new THREE.Color(DAY.bg))
  const fogC = useRef(new THREE.Color(DAY.fog))

  useEffect(() => {
    scene.background = bgC.current
    scene.fog = new THREE.Fog(fogC.current, 24, 115)
  }, [scene])

  useFrame(() => {
    const T = night ? NIGHT : DAY
    bgC.current.lerp(new THREE.Color(T.bg), 0.05)
    fogC.current.lerp(new THREE.Color(T.fog), 0.05)
    scene.fog.color.copy(fogC.current)
    if (hemi.current) hemi.current.intensity += (T.hemi - hemi.current.intensity) * 0.05
    if (dir.current) {
      dir.current.intensity += (T.dir - dir.current.intensity) * 0.05
      dir.current.color.lerp(new THREE.Color(T.dirColor), 0.05)
    }
    if (orb.current) {
      const c = new THREE.Color(night ? '#ffe6a0' : '#fff3c4')
      orb.current.material.color.lerp(c, 0.05)
      orb.current.material.emissive.lerp(c, 0.05)
    }
    const s = STATIONS[station] || STATIONS[0]
    const px = camera.userData.px ?? 0
    const py = camera.userData.py ?? 0
    camera.position.x += (s.cam[0] + px * 2.4 - camera.position.x) * 0.045
    camera.position.y += (s.cam[1] + py * 1.2 - camera.position.y) * 0.045
    camera.position.z += (s.cam[2] - camera.position.z) * 0.045
    look.current.lerp(new THREE.Vector3(s.look[0], s.look[1], s.look[2]), 0.05)
    camera.lookAt(look.current)
    if (orb.current) orb.current.position.x += (s.cx - 7 - orb.current.position.x) * 0.05
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffffff', '#b3d98f', DAY.hemi]} />
      <directionalLight ref={dir} position={[12, 16, 8]} intensity={DAY.dir} color={DAY.dirColor} />
      <ambientLight intensity={0.28} />
      <mesh ref={orb} position={[-7, 13, -30]} scale={night ? 1.6 : 1.3}>
        <sphereGeometry args={[1.6, 28, 28]} />
        <meshStandardMaterial color="#fff3c4" emissive="#fff3c4" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {night && <Stars radius={150} depth={70} count={2800} factor={4.5} saturation={0} fade speed={0.5} />}
    </>
  )
}

function Parallax() {
  const { camera } = useThree()
  useFrame((s) => {
    camera.userData.px = s.pointer.x
    camera.userData.py = s.pointer.y
  })
  return null
}

/* Natural shooting star: bright head + tapered fading light-trail, arcs then fades */
function ShootingStar({ startX = -10, startY = 15, z = -24, angle = -0.5, len = 3.4, period = 9, delay = 0, speed = 26 }) {
  const grp = useRef()
  const head = useRef()
  const tail = useRef()
  const vx = Math.cos(angle)
  const vy = Math.sin(angle)
  useFrame((s) => {
    const local = (s.clock.elapsedTime + delay) % period
    const flight = 1.4
    const on = local < flight
    if (!grp.current) return
    grp.current.visible = on
    if (!on) return
    const p = local / flight
    grp.current.position.set(startX + vx * speed * p, startY + vy * speed * p, z)
    grp.current.rotation.z = Math.atan2(vy, vx)
    const o = Math.sin(p * Math.PI) // fade in and out
    if (head.current) head.current.material.opacity = o
    if (tail.current) tail.current.material.opacity = o * 0.7
  })
  return (
    <group ref={grp} visible={false}>
      {/* trail: cone tapering to a point behind the head */}
      <mesh ref={tail} position={[-len / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.05, len, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#eaf2ff" emissiveIntensity={2.5} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={head}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3.5} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* Distant treeline (replaces the hemispherical hills) */
function Treeline({ night }) {
  const trees = useMemo(() => {
    const arr = []
    for (let row = 0; row < 2; row++) {
      const z = -30 - row * 7
      for (let i = 0; i < 30; i++) {
        const x = -20 + i * 8 + (row ? 4 : 0)
        arr.push({ x, z, s: 1.1 + ((i * 7 + row * 3) % 5) * 0.22, kind: (i + row) % 2 })
      }
    }
    return arr
  }, [])
  return (
    <group>
      {trees.map((t, i) => (
        <FarTree key={i} position={[t.x, -0.3, t.z]} scale={t.s} kind={t.kind} night={night} />
      ))}
    </group>
  )
}

function Ground({ night }) {
  const cRef = useRef()
  useFrame(() => {
    if (cRef.current) cRef.current.material.color.lerp(new THREE.Color(night ? '#12321f' : '#8ed58a'), 0.05)
  })
  return (
    <group>
      <mesh ref={cRef} rotation={[-Math.PI / 2, 0, 0]} position={[91, 0, 0]}>
        <planeGeometry args={[460, 220, 1, 1]} />
        <meshStandardMaterial color="#8ed58a" roughness={1} />
      </mesh>
      <Treeline night={night} />
    </group>
  )
}

/* ---------------- HOME: dense, well-spread park ---------------- */

function HomeScene({ night }) {
  return (
    <group>
      {/* ---- shared park, spread wide around the edges ---- */}
      {/* trees */}
      <OakTree position={[-9, 0, -3]} scale={1.7} />
      <PineTree position={[-12.5, 0, 0.5]} scale={1.5} />
      <BlossomTree position={[9.5, 0, -4]} scale={1.6} />
      <OakTree position={[12.5, 0, -1]} scale={1.4} color="#6cbf72" />
      <PineTree position={[7.5, 0, -7.5]} scale={1.7} />
      <BlossomTree position={[-6, 0, -8]} scale={1.3} />

      {/* pond with a paddling duck (far left) */}
      <Pond position={[-7.8, 0.02, 3.6]} radius={2.3} night={night} />
      <Duck center={[-7.8, 3.6]} radius={1.3} />
      <Duck center={[-7.8, 3.6]} radius={0.7} speed={-0.28} color="#efe7d6" />

      {/* park furniture */}
      <Bench position={[-4.4, 0, 4.8]} rotation={[0, -1.1, 0]} />
      <Fence position={[3.4, 0, 5]} count={7} spacing={0.75} />
      <LampPost position={[-12, 0, 3]} night={night} />
      <LampPost position={[12, 0, 3]} night={night} />

      {/* animals — kept well clear of the pond, now roaming */}
      <Deer position={[-9.2, 0, -1.4]} scale={1.2} roam={2.4} />
      <Squirrel position={[-8.2, 0, -2.4]} scale={1.3} />
      <Rabbit position={[6.5, 0, 3.1]} range={2.2} />
      <Rabbit position={[8.5, 0, 4.6]} range={1.6} color="#d8cabb" />
      <Dog position={[3.6, 0, 3.6]} roam={1.8} />
      {/* cat sitting properly on the bench seat */}
      <Cat position={[-4.4, 0.43, 4.8]} scale={0.7} rotation={[0, -1.1, 0]} />
      {/* cat prowling the right lawn */}
      <Cat position={[6.2, 0, 2.6]} scale={0.82} color="#3e3436" roam={1.4} />

      {/* flowers grow from shrubs, ringed around the meadow (not the centre) */}
      {[
        [-11, 4.2], [-3.5, 5.6], [3, 5.8], [10.5, 4.6], [-6.5, 2], [6.5, 5], [0, 6.2],
        [-9, 5.4], [9, 3.4], [-1.5, 4.6], [4.5, 2.6], [-4.5, 6],
      ].map((p, i) => (
        <FloweringShrub key={i} position={[p[0], 0, p[1]]} scale={0.95 + (i % 3) * 0.18} night={night} />
      ))}

      {/* grass tufts spread wide */}
      {[[-8.5, 4.8], [-2, 5.8], [2.5, 5.2], [8.5, 5.2], [-5, 2.4], [5, 3], [11, 4]].map((g, i) => (
        <GrassPatch key={i} position={[g[0], 0, g[1]]} count={12} radius={0.9} night={night} />
      ))}

      {/* clouds — high and wide */}
      <Float speed={1.4} floatIntensity={1} rotationIntensity={0}><Cloud3D position={[-8, 8.5, -14]} scale={1.4} range={2} /></Float>
      <Float speed={1.1} floatIntensity={1} rotationIntensity={0}><Cloud3D position={[4, 9.5, -16]} scale={1.1} range={2.4} /></Float>
      <Float speed={1.6} floatIntensity={1} rotationIntensity={0}><Cloud3D position={[12, 7.5, -12]} scale={0.95} /></Float>
      <Float speed={1.2} floatIntensity={1} rotationIntensity={0}><Cloud3D position={[-13, 10, -18]} scale={1.2} range={2.6} /></Float>
      <Float speed={1.3} floatIntensity={1} rotationIntensity={0}><Cloud3D position={[0, 11, -20]} scale={1.1} /></Float>

      {/* ---- central figure(s): day badminton, night campfire ---- */}
      {!night ? (
        <GirlBadminton position={[0, 0, 2.2]} scale={1.15} />
      ) : (
        <group>
          {/* rug + campfire */}
          <mesh position={[0, 0.03, 3]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2, 32]} />
            <meshStandardMaterial color="#3a2740" roughness={1} />
          </mesh>
          <Campfire position={[0, 0, 3]} intensity={1} />
          {/* girl sitting cross-legged on the ground by the fire */}
          <GirlSitGround position={[-1.4, 0, 3.5]} rotation={[0, 0.9, 0]} scale={1.05} />
          {/* a dog beside her, tail wagging */}
          <Dog position={[1.4, 0, 3.5]} rotation={[0, -1.4, 0]} />
          <Cat position={[0.2, 0, 4.4]} scale={0.7} color="#c9a28a" />
        </group>
      )}

      {/* ---- sky life: day birds+butterflies, night fireflies+shooting stars ---- */}
      {!night ? (
        <>
          {/* very distant rainbow */}
          <Rainbow position={[0, -5, -72]} scale={1} />
          <Flock position={[0, 9.5, -13]} count={7} range={44} speed={1.4} color="#4a3f5c" />
          <Flock position={[0, 11.5, -19]} count={5} range={48} speed={1} color="#5a4f6a" />
          {[
            [-7, 2.6, 4], [5, 3, 3], [0, 3.4, 5.5], [9, 2.6, 4], [-10, 2.8, 2.5], [-2, 3.2, 6],
          ].map((b, i) => (
            <Butterfly3D key={i} position={b} color={['#c8a8ec', '#f6a8cb', '#94e2d5', '#ffb0d0'][i % 4]} accent={['#6a4fa0', '#c65f92', '#2f9e8f'][i % 3]} range={5 + (i % 3)} scale={1.1} />
          ))}
          {/* dragonflies skimming the pond */}
          <Dragonfly position={[-7, 1.3, 3.6]} range={2} color="#3fb6a8" />
          <Dragonfly position={[-8.6, 1.6, 3]} range={1.6} color="#4f8fe0" scale={0.9} />
        </>
      ) : (
        <>
          <Sparkles count={110} scale={[30, 7, 10]} position={[0, 2.4, 3]} size={7} speed={0.4} color="#94e2d5" />
          <Sparkles count={50} scale={[26, 5, 8]} position={[0, 1.6, 3]} size={9} speed={0.25} color="#ffe082" />
          <ShootingStar startX={-12} startY={14} z={-24} angle={-0.42} delay={0} />
          <ShootingStar startX={-6} startY={16} z={-27} angle={-0.55} delay={4.2} len={4} />
          <ShootingStar startX={2} startY={15} z={-22} angle={-0.35} delay={7} len={3} />
        </>
      )}
    </group>
  )
}

/* ---------------- Themed nature scenes for the content stations ---------------- */

function NightGlow({ color = '#94e2d5' }) {
  return <Sparkles count={34} scale={[16, 4, 6]} position={[0, 2, 3]} size={6} speed={0.35} color={color} />
}

/* ABOUT — a rose garden. Day: she stands among the roses. Night: she sits with a lantern. */
function RoseScene({ cx, night }) {
  const roseCols = ['#e2445c', '#f47c9a', '#ffd0dc']
  return (
    <group position={[cx, 0, 0]}>
      <OakTree position={[-6, 0, -4.5]} scale={1.7} />
      <BlossomTree position={[6, 0, -4]} scale={1.6} />
      {/* rose arch, centre-back */}
      <group position={[0.6, 0, -1.4]}>
        <mesh position={[-1.5, 1.2, 0]}><boxGeometry args={[0.14, 2.4, 0.14]} /><meshStandardMaterial color="#efe3d0" /></mesh>
        <mesh position={[1.5, 1.2, 0]}><boxGeometry args={[0.14, 2.4, 0.14]} /><meshStandardMaterial color="#efe3d0" /></mesh>
        <mesh position={[0, 2.4, 0]}><torusGeometry args={[1.5, 0.08, 8, 30, Math.PI]} /><meshStandardMaterial color="#efe3d0" /></mesh>
        {Array.from({ length: 11 }).map((_, i) => {
          const a = Math.PI * (i / 10)
          return <mesh key={i} position={[Math.cos(a) * 1.5, 2.4 + Math.sin(a) * 1.5, 0]}><sphereGeometry args={[0.15, 10, 10]} /><meshStandardMaterial color={roseCols[i % 3]} roughness={0.7} /></mesh>
        })}
        <FloweringShrub position={[-1.6, 0, 0.35]} scale={1.15} colors={roseCols} night={night} />
        <FloweringShrub position={[1.6, 0, 0.35]} scale={1.15} colors={roseCols} night={night} />
      </group>
      {[[-3.6, 2.6], [3.6, 2.8], [2.2, 3.9]].map((b, i) => <FloweringShrub key={i} position={[b[0], 0, b[1]]} scale={1.05} colors={roseCols} night={night} />)}
      {/* the girl */}
      {night ? (
        <>
          <GirlSitGround position={[-1.9, 0, 3]} rotation={[0, 0.35, 0]} scale={1.05} />
          <Lantern position={[-0.9, 0, 3.2]} night />
        </>
      ) : (
        <GirlStanding position={[-1.9, 0, 3]} rotation={[0, 0.3, 0]} scale={1.08} dress="#c86a86" />
      )}
      <GrassPatch position={[-3.6, 0, 4.3]} count={9} radius={0.9} night={night} />
      <GrassPatch position={[2.6, 0, 4.4]} count={9} radius={0.9} night={night} />
      <Float speed={1.2} floatIntensity={1}><Cloud3D position={[-2, 8, -12]} scale={1.1} /></Float>
      {/* drifting rose petals (instanced flutter physics) */}
      <PetalFall origin={[0, 6, 2.5]} area={[11, 6, 6]} colors={roseCols} wind={[0.3, 0.12]} count={55} />
      {!night ? <Butterfly3D position={[0, 2.4, 4.5]} color="#f6a8cb" range={4} /> : <NightGlow color="#f6a8cb" />}
    </group>
  )
}

/* TECH — a waterfall. Day: she stands admiring it. Night: she sits by it with a lantern. */
function WaterfallScene({ cx, night }) {
  return (
    <group position={[cx, 0, 0]}>
      <Waterfall position={[0.6, 0, -2]} night={night} />
      <PineTree position={[-5, 0, -3]} scale={1.7} />
      <PineTree position={[5.5, 0, -3.5]} scale={1.5} />
      <mesh position={[-1.8, 0.25, 1.6]}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color={night ? '#3a4048' : '#8a8f97'} flatShading roughness={1} /></mesh>
      <Bush position={[3.4, 0, 2.2]} scale={1.2} />
      {night ? (
        <>
          <GirlSitGround position={[-2, 0, 2.8]} rotation={[0, 0.4, 0]} scale={1.05} />
          <Lantern position={[-1, 0, 3]} night />
        </>
      ) : (
        <GirlStanding position={[-2, 0, 2.8]} rotation={[0, 0.4, 0]} scale={1.08} dress="#6fa8d0" />
      )}
      <GrassPatch position={[-4, 0, 3.4]} count={9} radius={0.9} night={night} />
      <GrassPatch position={[4.5, 0, 3.8]} count={9} radius={0.9} night={night} />
      <Float speed={1.2} floatIntensity={1}><Cloud3D position={[3, 8.5, -12]} scale={1} /></Float>
      {/* rising spray + churning foam at the splash zone */}
      <Mist origin={[0.6, 0.1, -0.3]} spread={2} height={2.6} count={140} />
      <Foam origin={[0.6, 0.14, -0.3]} radius={1.7} count={24} />
      {night && <NightGlow />}
    </group>
  )
}

/* PRODUCT — a lavender field. Day: she stands among it. Night: she sits with a lantern. */
function LavenderScene({ cx, night }) {
  const rows = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) rows.push([0.2 + c * 1.05, 2.2 + r * 0.8])
  return (
    <group position={[cx, 0, 0]}>
      <OakTree position={[-5.5, 0, -4]} scale={1.7} color="#6cbf72" />
      <BlossomTree position={[5.8, 0, -4]} scale={1.4} />
      {rows.map((p, i) => <Lavender key={i} position={[p[0], 0, p[1]]} scale={0.95 + (i % 3) * 0.1} />)}
      {night ? (
        <>
          <GirlSitGround position={[-2.4, 0, 3]} rotation={[0, 0.5, 0]} scale={1.05} />
          <Lantern position={[-1.4, 0, 3.2]} night />
        </>
      ) : (
        <GirlStanding position={[-2.4, 0, 3]} rotation={[0, 0.5, 0]} scale={1.08} dress="#8a6fc4" />
      )}
      <Float speed={1.2} floatIntensity={1}><Cloud3D position={[-2, 8, -12]} scale={1} /></Float>
      <Float speed={1} floatIntensity={1}><Cloud3D position={[4, 9, -14]} scale={0.85} /></Float>
      {/* golden-hour pollen catching the light */}
      <Pollen origin={[1, 1.2, 3.5]} area={[9, 2.4, 4.5]} count={80} color={night ? '#b58ce0' : '#ffe9a8'} />
      {!night ? (
        <>
          <Butterfly3D position={[2, 2.8, 5]} color="#ffe082" range={4} />
          <Dragonfly position={[1, 1.7, 4]} range={2.2} color="#b58ce0" />
        </>
      ) : <NightGlow color="#b58ce0" />}
    </group>
  )
}

/* JOURNEY — an autumn grove. Day: she stands on the path. Night: she sits with a lantern. */
function AutumnScene({ cx, night }) {
  const autumn = ['#e08a3c', '#d24d3e', '#e6b422']
  return (
    <group position={[cx, 0, 0]}>
      <OakTree position={[-5.5, 0, -4]} scale={1.8} color={autumn[0]} />
      <OakTree position={[5.5, 0, -4]} scale={1.6} color={autumn[1]} />
      <OakTree position={[1, 0, -6]} scale={2} color={autumn[2]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2.6]}><planeGeometry args={[1.8, 6]} /><meshStandardMaterial color={night ? '#3a2b1e' : '#b98a5c'} roughness={1} /></mesh>
      {[[-2.6, 3.4], [2.6, 3], [2, 4.6]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.22, p[1]]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.3, 12, 12]} /><meshStandardMaterial color="#e8791e" roughness={0.85} /></mesh>
      ))}
      {night ? (
        <>
          <GirlSitGround position={[-0.2, 0, 3]} rotation={[0, 0.1, 0]} scale={1.05} />
          <Lantern position={[0.9, 0, 3.2]} night />
        </>
      ) : (
        <GirlStanding position={[-0.2, 0, 3]} rotation={[0, 0.05, 0]} scale={1.08} dress="#d98a4a" />
      )}
      <Squirrel position={[2.4, 0, 3.8]} scale={1.2} />
      <GrassPatch position={[-4, 0, 4]} count={8} radius={0.9} night={night} />
      <Float speed={1.2} floatIntensity={1}><Cloud3D position={[-3, 8.5, -12]} scale={1} /></Float>
      {/* falling leaves with gravity + drag + tumble */}
      <FallingLeaves origin={[0, 7, 1]} area={[14, 7, 8]} count={40} colors={night ? ['#8a5a38', '#b5764c', '#7c5a3c'] : ['#e08a3c', '#d24d3e', '#e6b422', '#b5764c']} />
      {night && <NightGlow color="#ffe082" />}
    </group>
  )
}

/* CONTACT — a lotus pond with a dock. Day: she reads on the dock. Night: she sits with a lantern. */
function LotusScene({ cx, night }) {
  const pads = [[-2.4, 3], [-0.8, 3.8], [1.2, 3.2], [2.8, 4], [0.2, 4.6]]
  return (
    <group position={[cx, 0, 0]}>
      <BlossomTree position={[-5.5, 0, -4]} scale={1.5} />
      <PineTree position={[5.5, 0, -4]} scale={1.5} />
      {/* rippling water surface (Gerstner height field + live normals) */}
      <RippleWater size={8.4} seg={44} position={[0.4, 0.04, 4]} night={night} />
      {pads.map((p, i) => <Lotus key={i} position={[p[0] + 0.4, 0.08, p[1]]} scale={0.95 + (i % 3) * 0.15} bloom={i % 2 === 0} />)}
      {[[-3.4, 2.4], [3.8, 2.6], [-2.6, 6], [3.4, 6]].map((p, i) => <Reed key={i} position={[p[0] + 0.4, 0, p[1]]} night={night} />)}
      {/* dock jutting toward the water */}
      <group position={[-1.6, 0, 1.9]}>
        <mesh position={[0, 0.22, 0]}><boxGeometry args={[1.1, 0.08, 1.9]} /><meshStandardMaterial color="#8a6244" /></mesh>
        {[[-0.45, 0.75], [0.45, 0.75], [-0.45, -0.75], [0.45, -0.75]].map(([x, z], i) => <mesh key={i} position={[x, 0.08, z]}><cylinderGeometry args={[0.05, 0.05, 0.34, 6]} /><meshStandardMaterial color="#5a3d29" /></mesh>)}
      </group>
      {night ? (
        <>
          <GirlSitGround position={[-1.6, 0.26, 2]} rotation={[0, 0.2, 0]} scale={1.02} />
          <Lantern position={[-1.6, 0.26, 1.1]} night />
        </>
      ) : (
        <GirlReading position={[-1.6, 0.26, 2]} rotation={[0, 0.2, 0]} scale={1} />
      )}
      <Float speed={1.2} floatIntensity={1}><Cloud3D position={[3, 8.5, -12]} scale={1} /></Float>
      {!night ? <Dragonfly position={[1.5, 1.4, 3.6]} range={2.4} /> : <NightGlow />}
    </group>
  )
}

/* ---------------- SANCTUARY: a cozy closed reading room ---------------- */

function SanctuaryScene({ night }) {
  const cx = 156
  const wall = '#e9dcc8'
  const frame = '#6b4a32'
  return (
    <group position={[cx, 0, 0]}>
      {/* warm interior fill light */}
      <pointLight position={[0, 3.2, 1]} color={night ? '#ffd7a0' : '#fff2df'} distance={18} intensity={night ? 0.55 : 1.15} />

      {/* floor + ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><planeGeometry args={[10, 6]} /><meshStandardMaterial color="#b98a5c" roughness={1} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}><planeGeometry args={[10, 6]} /><meshStandardMaterial color="#efe3d0" roughness={1} /></mesh>

      {/* back wall (built around a central window opening) */}
      <mesh position={[0, 0.65, -3]}><boxGeometry args={[10, 1.3, 0.2]} /><meshStandardMaterial color={wall} roughness={1} /></mesh>
      <mesh position={[0, 3.5, -3]}><boxGeometry args={[10, 1.0, 0.2]} /><meshStandardMaterial color={wall} roughness={1} /></mesh>
      <mesh position={[-3.3, 2.15, -3]}><boxGeometry args={[3.4, 1.7, 0.2]} /><meshStandardMaterial color={wall} roughness={1} /></mesh>
      <mesh position={[3.3, 2.15, -3]}><boxGeometry args={[3.4, 1.7, 0.2]} /><meshStandardMaterial color={wall} roughness={1} /></mesh>
      {/* side walls */}
      <mesh position={[-5, 2, 0]}><boxGeometry args={[0.2, 4, 6]} /><meshStandardMaterial color="#e2d4bd" roughness={1} /></mesh>
      <mesh position={[5, 2, 0]}><boxGeometry args={[0.2, 4, 6]} /><meshStandardMaterial color="#e2d4bd" roughness={1} /></mesh>

      {/* the window view (day/night, rain at night) */}
      <group position={[0, 2.15, -2.98]}><WindowSky night={night} width={3.2} height={1.7} /></group>
      {/* window frame + mullions */}
      <group position={[0, 2.15, -2.88]}>
        <mesh position={[0, 0.9, 0]}><boxGeometry args={[3.4, 0.12, 0.12]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[0, -0.9, 0]}><boxGeometry args={[3.4, 0.12, 0.12]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[-1.65, 0, 0]}><boxGeometry args={[0.12, 1.9, 0.12]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[1.65, 0, 0]}><boxGeometry args={[0.12, 1.9, 0.12]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh><boxGeometry args={[3.3, 0.06, 0.08]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh><boxGeometry args={[0.06, 1.8, 0.08]} /><meshStandardMaterial color={frame} /></mesh>
      </group>
      <mesh position={[0, 1.22, -2.8]}><boxGeometry args={[3.7, 0.12, 0.32]} /><meshStandardMaterial color="#d8c7a8" /></mesh>

      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.4]}><circleGeometry args={[2.3, 40]} /><meshStandardMaterial color={night ? '#5a3f52' : '#d8b8cf'} roughness={1} /></mesh>

      {/* fireplace (lit only at night), with a picture above */}
      <Fireplace position={[-3.3, 0, -2.7]} lit={night} />
      <mesh position={[-3.3, 3.1, -2.9]}><boxGeometry args={[0.9, 0.65, 0.06]} /><meshStandardMaterial color="#f3ecff" /></mesh>

      {/* bookshelf against the right wall */}
      <Bookshelf position={[4.55, 0, -0.4]} rotation={[0, -Math.PI / 2, 0]} scale={1} />

      {/* soft light raking in from the window/sun side (angled) */}
      <pointLight position={[-1.4, 3, -2.2]} color={night ? '#aab8ff' : '#ffe9c0'} distance={11} intensity={night ? 0.35 : 0.75} />

      {/* sofa + girl reading (day: sits upright, night: lies down along x) */}
      <Sofa position={[0, 0, -0.95]} rotation={[0, 0, 0]} />
      {night ? (
        <GirlLyingRead position={[0.3, 0.58, -0.55]} scale={0.9} />
      ) : (
        <GirlReading position={[0, 0.02, -0.55]} rotation={[0, 0, 0]} scale={1} />
      )}

      {/* coffee table with a book + candle (candle glows at night) */}
      <group position={[0, 0, 0.6]}>
        <mesh position={[0, 0.34, 0]}><boxGeometry args={[1.1, 0.08, 0.6]} /><meshStandardMaterial color="#6b4a32" /></mesh>
        {[[-0.5, -0.24], [0.5, -0.24], [-0.5, 0.24], [0.5, 0.24]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.17, z]}><cylinderGeometry args={[0.04, 0.04, 0.34, 6]} /><meshStandardMaterial color="#5a3d29" /></mesh>
        ))}
        <mesh position={[-0.25, 0.41, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.26, 0.06, 0.34]} /><meshStandardMaterial color="#f6a8cb" /></mesh>
        {/* candle */}
        <mesh position={[0.3, 0.43, 0.05]}><cylinderGeometry args={[0.05, 0.05, 0.14, 10]} /><meshStandardMaterial color="#fff0e0" /></mesh>
        <mesh position={[0.3, 0.52, 0.05]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#ffb04a" emissive="#ffb04a" emissiveIntensity={night ? 2.5 : 0} toneMapped={false} /></mesh>
        {night && <pointLight position={[0.3, 0.6, 0.05]} color="#ffb060" distance={3} intensity={0.8} />}
      </group>

      {/* floor lamp (warm glow at night) */}
      <FloorLamp position={[-2.5, 0, 0.5]} night={night} />

      {/* fairy string lights above the window */}
      <FairyLights width={4.4} y={3.4} z={-2.86} count={17} drop={0.45} night={night} />

      {/* gallery wall of framed art on the left wall */}
      {[[2.7, -0.9, '#f6c9de', 0.7, 0.9], [2.25, 0.1, '#cdb8ec', 0.8, 0.6], [2.75, 0.95, '#bfe0d0', 0.55, 0.7]].map((a, i) => (
        <group key={i} position={[-4.88, a[0], a[1]]} rotation={[0, Math.PI / 2, 0]}>
          <mesh><boxGeometry args={[a[3] + 0.08, a[4] + 0.08, 0.04]} /><meshStandardMaterial color="#efe7d8" /></mesh>
          <mesh position={[0, 0, 0.03]}><boxGeometry args={[a[3], a[4], 0.02]} /><meshStandardMaterial color={a[2]} /></mesh>
        </group>
      ))}

      {/* round mirror on the back wall (solid ring frame; no coplanar shimmer) */}
      <group position={[3.3, 2.2, -2.86]}>
        <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.46, 40]} /><meshStandardMaterial color={night ? '#2a3350' : '#cfe6f5'} metalness={0.5} roughness={0.2} /></mesh>
        <mesh><torusGeometry args={[0.48, 0.05, 14, 44]} /><meshStandardMaterial color="#c9a86a" metalness={0.3} roughness={0.5} /></mesh>
      </group>

      {/* pampas grass in a slim vase (corner) */}
      <group position={[-4.3, 0, -1.6]}>
        <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.1, 0.13, 0.7, 10]} /><meshStandardMaterial color="#e9dcc8" roughness={0.9} /></mesh>
        {[-0.3, -0.1, 0.1, 0.3, 0].map((a, i) => (
          <mesh key={i} position={[a * 0.25, 1.15, 0]} rotation={[0, 0, a]}><capsuleGeometry args={[0.05, 0.7, 4, 8]} /><meshStandardMaterial color="#e7d3a8" roughness={1} /></mesh>
        ))}
      </group>

      {/* indoor plants for coziness — snake plants + a bush + a hanging trailing plant */}
      <IndoorPlant position={[4.2, 0, 1.9]} scale={1.2} kind={1} />
      <IndoorPlant position={[-4.3, 0, 2]} scale={1.1} kind={1} />
      <IndoorPlant position={[3.3, 0, -2.4]} scale={0.9} kind={0} potColor="#e8a0b8" />
      <IndoorPlant position={[-2.6, 0, 2.2]} scale={0.8} kind={0} potColor="#9ec7e8" />
      <IndoorPlant position={[1.2, 1.34, -2.72]} scale={0.4} kind={0} />
      {/* hanging plant from the ceiling */}
      <group position={[3.7, 3.98, 1]}>
        <mesh position={[0, -0.45, 0]}><cylinderGeometry args={[0.006, 0.006, 0.9, 4]} /><meshStandardMaterial color="#6a5a4a" /></mesh>
        <IndoorPlant position={[0, -0.95, 0]} scale={0.7} kind={2} potColor="#d8b08a" />
      </group>

      {/* pets: day roam, night asleep by the fire */}
      {night ? (
        <>
          <Cat position={[-2.9, 0.02, -1.4]} scale={0.85} rotation={[0, 0.6, 0]} sleeping />
          <Dog position={[-1.9, 0, -1.0]} scale={0.9} rotation={[0, -0.3, 0]} sleeping />
        </>
      ) : (
        <>
          <Cat position={[1.7, 0, 1.4]} scale={0.85} roam={1.4} />
          <Dog position={[-1.4, 0, 1.7]} scale={0.9} roam={1.5} />
        </>
      )}
    </group>
  )
}

/* ---------------- world-wide ambient particles ---------------- */

function Ambience({ night }) {
  return night ? (
    <>
      <Sparkles count={240} scale={[460, 22, 46]} position={[91, 8, 2]} size={5} speed={0.3} color="#94e2d5" opacity={0.9} />
      <Sparkles count={120} scale={[460, 16, 34]} position={[91, 5, 5]} size={8} speed={0.2} color="#ffe082" opacity={0.7} />
    </>
  ) : (
    <>
      <Sparkles count={150} scale={[460, 18, 46]} position={[91, 7, 2]} size={6} speed={0.25} color="#f7c6de" opacity={0.7} />
      <Sparkles count={80} scale={[460, 12, 34]} position={[91, 5, 5]} size={5} speed={0.3} color="#ffffff" opacity={0.65} />
    </>
  )
}

export default function World({ theme, station }) {
  const night = theme === 'night'
  return (
    <div className="fixed inset-0 -z-0">
      <Canvas dpr={[1, 1.8]} camera={{ position: STATIONS[0].cam, fov: 48, near: 0.1, far: 400 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Parallax />
        <Stage night={night} station={station} />
        <Ground night={night} />

        <HomeScene night={night} />
        <RoseScene cx={26} night={night} />
        <WaterfallScene cx={52} night={night} />
        <LavenderScene cx={78} night={night} />
        <AutumnScene cx={104} night={night} />
        <SanctuaryScene night={night} />
        <LotusScene cx={182} night={night} />

        <Ambience night={night} />

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom intensity={night ? 1.35 : 0.32} luminanceThreshold={0.6} luminanceSmoothing={0.25} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={night ? 0.72 : 0.32} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
