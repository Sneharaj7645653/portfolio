/* ============================================================================
   realism.jsx — high-performance realism routines for the 3D scenes.
   Pure three.js + R3F (no new deps). Everything here is drop-in:
     • deterministic value-noise + fbm (coherent wind, gusts, fog)
     • GPU-friendly instanced particle systems (petals, leaves, foam)
     • Points systems with a procedural soft sprite (mist, pollen)
     • JS Gerstner water (vertex displacement + per-frame normals)
     • point-light falloff + flicker math (lantern)
     • parameter blocks for petal SSS, DOF, SSAO, and a foliage-wind
       vertex-shader injector (opt-in) + a water ShaderMaterial (opt-in)
   ============================================================================ */

import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ----------------------------------------------------------------------------
   1. NOISE / MATH   — coherent, deterministic, allocation-free in the hot loop
   ---------------------------------------------------------------------------- */

export const fract = (x) => x - Math.floor(x)
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, t) => a + (b - a) * t
// smootherstep (C2 continuous) — nicer than smoothstep for wind ramps
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10)

export function hash21(x, y) {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123)
}

// 2D value noise in [0,1]
export function noise2(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const u = smoother(xf), v = smoother(yf)
  const n00 = hash21(xi, yi), n10 = hash21(xi + 1, yi)
  const n01 = hash21(xi, yi + 1), n11 = hash21(xi + 1, yi + 1)
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v)
}

// fractal brownian motion — layered octaves for gusts / fog / haze
export function fbm2(x, y, octaves = 4) {
  let sum = 0, amp = 0.5, freq = 1
  for (let i = 0; i < octaves; i++) { sum += amp * noise2(x * freq, y * freq); freq *= 2; amp *= 0.5 }
  return sum
}

/* Wind field → sway angle (radians) for a stem/leaf at world (px,pz).
   base sine gives the carrier oscillation, fbm gust adds slow coherent surges.
     θ(p,t) = amp · [ sin(ω·t + k·(px+pz)) + gust·(2·fbm(0.1p + 0.05t) − 1) ] */
export function windSway(px, pz, t, { amp = 0.08, omega = 1.1, k = 0.35, gust = 0.5 } = {}) {
  const carrier = Math.sin(omega * t + k * (px + pz))
  const surge = 2 * fbm2(px * 0.1 + t * 0.05, pz * 0.1) - 1
  return amp * (carrier + gust * surge)
}

/* ----------------------------------------------------------------------------
   2. LIGHTING MATH
   ---------------------------------------------------------------------------- */

/* three.js physical point-light distance attenuation (matches the renderer):
     window = clamp(1 − (d/range)^4, 0, 1)^2 ; att = window / max(d², 0.01)
   Use for hand-rolled glow / fake bounce, or to script a lantern's reach. */
export function radialFalloff(d, range) {
  const w = clamp(1 - Math.pow(d / range, 4), 0, 1)
  return (w * w) / Math.max(d * d, 0.01)
}

/* Lantern / candle flame flicker: a fast carrier + slow fbm wander so it never
   looks like a pure sine. Returns an intensity multiplier around `base`.
     I(t) = base + amp·[0.6·sin(f·t) + 0.4·(2·fbm(t·3) − 1)] */
export function flameFlicker(t, { base = 1.8, amp = 0.35, freq = 9 } = {}) {
  return base + amp * (0.6 * Math.sin(t * freq) + 0.4 * (2 * fbm2(t * 3, 7.3) - 1))
}

/* Petal / leaf subsurface-scattering look via MeshPhysicalMaterial.
   Thin translucent membrane: light transmits + a soft sheen rim.
   Spread these props onto <meshPhysicalMaterial {...PETAL_SSS} color={...} />. */
export const PETAL_SSS = {
  roughness: 0.45,
  transmission: 0.55,      // lets light pass through the petal
  thickness: 0.4,          // scattering distance
  ior: 1.33,
  sheen: 1.0,              // velvety rim
  sheenRoughness: 0.5,
  sheenColor: '#ffd9e6',
  attenuationColor: '#ff6b8f',
  attenuationDistance: 0.6,
  transparent: true,
  side: THREE.DoubleSide,
}

/* Depth-of-field (golden-hour bokeh) — feed into <DepthOfField> from
   @react-three/postprocessing (already installed). Focus the girl (~z of look). */
export const DOF_PARAMS = { focusDistance: 0.012, focalLength: 0.045, bokehScale: 3.2, height: 480 }

/* SSAO — contact-shadow layering / ambient occlusion. Feed <SSAO> params. */
export const SSAO_PARAMS = { samples: 16, radius: 0.12, intensity: 18, luminanceInfluence: 0.6, bias: 0.03 }

/* ----------------------------------------------------------------------------
   3. PROCEDURAL SOFT SPRITE  (shared by Points systems — no external asset)
   ---------------------------------------------------------------------------- */
let _softTex = null
export function softSprite() {
  if (_softTex) return _softTex
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.65)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  _softTex = new THREE.CanvasTexture(c)
  return _softTex
}

/* ----------------------------------------------------------------------------
   4. FLOATING PETALS  (instanced planes; flutter + drift + terminal fall)
      Physics per petal:
        vy → constant terminal velocity (air drag balances gravity)
        x,z drift = wind + A·sin(ω t + φ)         (side-to-side sashay)
        tumble    = rotation about all 3 axes, phase-offset per petal
   ---------------------------------------------------------------------------- */
export function PetalFall({
  count = 60, origin = [0, 6, 0], area = [10, 6, 6],
  colors = ['#f6a8cb', '#ffd0dc', '#e2445c'], wind = [0.35, 0.12],
  fall = [0.25, 0.55], size = 0.14,
}) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const palette = useMemo(() => colors.map((c) => new THREE.Color(c)), [colors])
  const P = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * area[0], y: Math.random() * area[1], z: (Math.random() - 0.5) * area[2],
    vy: fall[0] + Math.random() * (fall[1] - fall[0]),
    sw: 0.4 + Math.random() * 0.7, ph: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 2.4, rot: Math.random() * Math.PI, tilt: Math.random() * Math.PI,
  })), [count, area])

  useLayoutEffect(() => {
    if (!mesh.current) return
    P.forEach((_, i) => mesh.current.setColorAt(i, palette[i % palette.length]))
    mesh.current.instanceColor && (mesh.current.instanceColor.needsUpdate = true)
  }, [P, palette])

  useFrame((s, dt) => {
    dt = Math.min(dt, 0.05)
    const t = s.clock.elapsedTime
    for (let i = 0; i < P.length; i++) {
      const p = P[i]
      p.y -= p.vy * dt
      p.x += (Math.sin(t * p.sw + p.ph) * 0.4 + wind[0]) * dt
      p.z += (Math.cos(t * p.sw * 0.7 + p.ph) * 0.3 + wind[1]) * dt
      p.rot += p.spin * dt
      if (p.y < -0.2) { p.y = area[1]; p.x = (Math.random() - 0.5) * area[0]; p.z = (Math.random() - 0.5) * area[2] }
      dummy.position.set(origin[0] + p.x, origin[1] + p.y, origin[2] + p.z)
      dummy.rotation.set(p.tilt + Math.sin(t * 2 + p.ph) * 0.6, p.rot, Math.sin(t * 3 + p.ph) * 0.7)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[size, size * 1.3]} />
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.55} transparent opacity={0.96} />
    </instancedMesh>
  )
}

/* ----------------------------------------------------------------------------
   5. FALLING LEAVES  (instanced; richer autumn physics)
      vy relaxes to terminal:   vy += (vT − vy)·k·dt      (drag ∝ velocity)
      autorotation flutter:     x += A·sin(ω t+φ)         (leaf tips edge-on)
      wind resistance:          horizontal push scaled by (1 − |tilt·n|)
      tumble:                   pitch/roll/yaw phase-offset
   ---------------------------------------------------------------------------- */
export function FallingLeaves({
  count = 40, origin = [0, 7, 0], area = [14, 7, 8],
  colors = ['#e08a3c', '#d24d3e', '#e6b422', '#b5764c'], wind = [0.5, 0.1],
  terminal = [0.5, 0.9], size = 0.18,
}) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const palette = useMemo(() => colors.map((c) => new THREE.Color(c)), [colors])
  const L = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * area[0], y: Math.random() * area[1], z: (Math.random() - 0.5) * area[2],
    vy: 0.2 + Math.random() * 0.3, vT: terminal[0] + Math.random() * (terminal[1] - terminal[0]),
    k: 1.5 + Math.random() * 1.5, sw: 1.0 + Math.random() * 1.4, amp: 0.5 + Math.random() * 0.9,
    ph: Math.random() * 6.28, pitch: Math.random() * 6.28, roll: Math.random() * 6.28,
    tumble: 0.6 + Math.random() * 1.6,
  })), [count, area, terminal])

  useLayoutEffect(() => {
    if (!mesh.current) return
    L.forEach((_, i) => mesh.current.setColorAt(i, palette[i % palette.length]))
    mesh.current.instanceColor && (mesh.current.instanceColor.needsUpdate = true)
  }, [L, palette])

  useFrame((s, dt) => {
    dt = Math.min(dt, 0.05)
    const t = s.clock.elapsedTime
    for (let i = 0; i < L.length; i++) {
      const l = L[i]
      l.vy += (l.vT - l.vy) * l.k * dt          // relax to terminal velocity
      l.y -= l.vy * dt
      l.x += (Math.sin(t * l.sw + l.ph) * l.amp + wind[0]) * dt
      l.z += (Math.cos(t * l.sw * 0.8 + l.ph) * l.amp * 0.6 + wind[1]) * dt
      l.pitch += l.tumble * dt
      l.roll += l.tumble * 0.7 * dt
      if (l.y < -0.2) { l.y = area[1]; l.x = (Math.random() - 0.5) * area[0]; l.z = (Math.random() - 0.5) * area[2]; l.vy = 0.2 }
      dummy.position.set(origin[0] + l.x, origin[1] + l.y, origin[2] + l.z)
      dummy.rotation.set(l.pitch, l.ph + t * 0.3, l.roll)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[size, size * 0.75]} />
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.7} />
    </instancedMesh>
  )
}

/* ----------------------------------------------------------------------------
   6. POINTS SYSTEMS  (mist / pollen) — soft additive sprites
   ---------------------------------------------------------------------------- */
function usePointsField(count, init, step, { size, color, opacity, additive }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    return g
  }, [count])
  const S = useMemo(() => Array.from({ length: count }, init), [count])
  useFrame((s, dt) => {
    dt = Math.min(dt, 0.05)
    const t = s.clock.elapsedTime
    const arr = geo.attributes.position.array
    for (let i = 0; i < count; i++) { step(S[i], t, dt); arr[i * 3] = S[i].px; arr[i * 3 + 1] = S[i].py; arr[i * 3 + 2] = S[i].pz }
    geo.attributes.position.needsUpdate = true
  })
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial map={softSprite()} size={size} color={color} transparent opacity={opacity} depthWrite={false} sizeAttenuation blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </points>
  )
}

/* Waterfall spray/mist: particles rise from the splash zone, turbulate, fade out */
export function Mist({ count = 140, origin = [0, 0, 0], spread = 2.2, height = 2.6, rise = [0.5, 1.1], size = 0.5, color = '#ffffff' }) {
  return usePointsField(
    count,
    () => ({ x: (Math.random() - 0.5) * spread, z: (Math.random() - 0.5) * spread, y: Math.random() * height, vy: rise[0] + Math.random() * (rise[1] - rise[0]), ph: Math.random() * 6.28, px: 0, py: 0, pz: 0 }),
    (m, t, dt) => {
      m.y += m.vy * dt
      if (m.y > height) { m.y = 0; m.x = (Math.random() - 0.5) * spread; m.z = (Math.random() - 0.5) * spread }
      m.px = origin[0] + m.x + Math.sin(t * 0.8 + m.ph) * 0.18
      m.py = origin[1] + m.y
      m.pz = origin[2] + m.z + Math.cos(t * 0.6 + m.ph) * 0.12
    },
    { size, color, opacity: 0.5, additive: false },
  )
}

/* Golden-hour pollen: buoyant brownian motes, additive so they catch the light */
export function Pollen({ count = 90, origin = [0, 1.2, 3], area = [10, 2.4, 5], size = 0.18, color = '#ffe9a8' }) {
  return usePointsField(
    count,
    () => ({ x: (Math.random() - 0.5) * area[0], y: Math.random() * area[1], z: (Math.random() - 0.5) * area[2], sx: Math.random() * 6.28, sy: Math.random() * 6.28, sz: Math.random() * 6.28, px: 0, py: 0, pz: 0 }),
    (m, t, dt) => {
      // slow brownian drift + gentle upward buoyancy
      m.x += Math.sin(t * 0.5 + m.sx) * 0.12 * dt
      m.z += Math.cos(t * 0.4 + m.sz) * 0.12 * dt
      m.y += (0.05 + Math.sin(t * 0.6 + m.sy) * 0.06) * dt
      if (m.y > area[1]) m.y = 0
      m.px = origin[0] + m.x; m.py = origin[1] + m.y; m.pz = origin[2] + m.z
    },
    { size, color, opacity: 0.85, additive: true },
  )
}

/* ----------------------------------------------------------------------------
   7. FOAM  (splash-zone accumulation) — instanced puffs that bob & respawn
      density(r) falls off from the impact point; puffs jitter on a noise field
      and pulse-scale to fake churn.
   ---------------------------------------------------------------------------- */
export function Foam({ count = 26, origin = [0, 0.12, 0], radius = 1.4 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const F = useMemo(() => Array.from({ length: count }, () => {
    const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * radius   // uniform disc
    return { a, r, s: 0.12 + Math.random() * 0.18, ph: Math.random() * 6.28, life: Math.random() }
  }), [count, radius])
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < F.length; i++) {
      const f = F[i]
      f.life += dt * 0.6
      if (f.life > 1) { f.life = 0; f.a = Math.random() * 6.28; f.r = Math.sqrt(Math.random()) * radius }
      const churn = 0.6 + 0.4 * Math.sin(t * 4 + f.ph)
      dummy.position.set(origin[0] + Math.cos(f.a) * f.r, origin[1] + Math.sin(t * 6 + f.ph) * 0.03, origin[2] + Math.sin(f.a) * f.r)
      dummy.scale.setScalar(f.s * churn * (1 - Math.abs(f.life - 0.5)))   // grow then shrink
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={1} />
    </instancedMesh>
  )
}

/* ----------------------------------------------------------------------------
   8. RIPPLE WATER  (JS Gerstner-sum height field + per-frame normals)
      h(x,z,t) = Σ_i  A_i · sin( k_i·(dir_i·xz) + ω_i·t ) ,  k = 2π/λ
      Normals recomputed each frame → real specular glints from the sun/moon.
      Reflectivity via metalness/roughness (env-lit). Ripple source can be
      injected (e.g. the girl's reflection point) by adding a radial term.
   ---------------------------------------------------------------------------- */
export function RippleWater({
  size = 8, seg = 40, position = [0, 0.02, 0], night = false,
  waves = [
    { dir: [1, 0], amp: 0.05, len: 2.4, spd: 1.0 },
    { dir: [0.4, 1], amp: 0.035, len: 1.5, spd: 1.5 },
    { dir: [-0.7, 0.6], amp: 0.025, len: 0.9, spd: 2.1 },
  ],
}) {
  const geo = useMemo(() => new THREE.PlaneGeometry(size, size, seg, seg), [size, seg])
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo])
  const K = useMemo(() => waves.map((w) => ({ ...w, k: (2 * Math.PI) / w.len, n: Math.hypot(w.dir[0], w.dir[1]) || 1 })), [waves])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const pos = geo.attributes.position.array
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i], y = base[i + 1]
      let h = 0
      for (let w = 0; w < K.length; w++) {
        const wv = K[w]
        const d = (x * wv.dir[0] + y * wv.dir[1]) / wv.n
        h += wv.amp * Math.sin(d * wv.k + t * wv.spd)
      }
      pos[i + 2] = h
    }
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
  })
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <meshStandardMaterial
        color={night ? '#14304a' : '#5fb0d6'}
        metalness={0.55}
        roughness={night ? 0.12 : 0.18}
        transparent
        opacity={0.92}
        emissive={night ? '#0b1c2e' : '#1d5a7a'}
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

/* ----------------------------------------------------------------------------
   9. OPT-IN: FOLIAGE WIND VERTEX INJECTION  (onBeforeCompile)
      Bends geometry by height² so trunks stay put and canopies sway.
      Usage:  <meshStandardMaterial ref={m} .../>  then  makeWindy(m.current,{...})
      or pass onBeforeCompile inline. Keeps full StandardMaterial lighting.
   ---------------------------------------------------------------------------- */
export function makeWindy(material, { amp = 0.12, freq = 1.4 } = {}) {
  if (!material || material.userData._windy) return material
  material.userData._windy = true
  const uniforms = { uTime: { value: 0 }, uAmp: { value: amp }, uFreq: { value: freq } }
  material.userData.windUniforms = uniforms
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime
    shader.uniforms.uAmp = uniforms.uAmp
    shader.uniforms.uFreq = uniforms.uFreq
    shader.vertexShader =
      'uniform float uTime; uniform float uAmp; uniform float uFreq;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float sway = sin(uTime*uFreq + position.x*0.6 + position.z*0.6);
         float infl = clamp(position.y*position.y*0.15, 0.0, 1.0);
         transformed.x += sway * uAmp * infl;
         transformed.z += cos(uTime*uFreq*0.8 + position.x*0.4) * uAmp * 0.5 * infl;`,
      )
  }
  material.needsUpdate = true
  return material
}
// call every frame:  material.userData.windUniforms.uTime.value = clock.elapsedTime

/* ----------------------------------------------------------------------------
   10. OPT-IN: WATER SHADERMATERIAL  (Gerstner in GLSL + fresnel + specular)
       For when JS RippleWater isn't enough. Wire as:
         const mat = useMemo(() => makeWaterMaterial(), [])
         useFrame((s)=> mat.uniforms.uTime.value = s.clock.elapsedTime)
         <mesh geometry={plane}><primitive object={mat} attach="material"/></mesh>
   ---------------------------------------------------------------------------- */
export const WATER_VERT = /* glsl */`
  uniform float uTime;
  varying vec3 vN; varying vec3 vView; varying float vH;
  // three Gerstner waves (steepness Q, amplitude A, wavelength L, dir D, speed S)
  vec3 gerstner(vec2 p, vec2 D, float A, float L, float S, float Q, inout vec3 nrm){
    float k = 6.28318/L; D = normalize(D);
    float f = k*dot(D,p) + uTime*S;
    float a = A;
    vec3 disp = vec3(Q*a*D.x*cos(f), a*sin(f), Q*a*D.y*cos(f));
    nrm += vec3(-D.x*k*a*cos(f), -Q*k*a*sin(f), -D.y*k*a*cos(f));
    return disp;
  }
  void main(){
    vec3 p = position; vec3 nrm = vec3(0.0,1.0,0.0);
    p += gerstner(position.xz, vec2(1.0,0.2), 0.05, 2.4, 1.0, 0.6, nrm);
    p += gerstner(position.xz, vec2(0.3,1.0), 0.035,1.5, 1.6, 0.5, nrm);
    p += gerstner(position.xz, vec2(-0.7,0.6),0.025,0.9, 2.1, 0.4, nrm);
    vH = p.y;
    vec4 world = modelMatrix * vec4(p,1.0);
    vN = normalize(nrm); vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }`
export const WATER_FRAG = /* glsl */`
  precision highp float;
  uniform vec3 uShallow; uniform vec3 uDeep; uniform vec3 uSun; uniform vec3 uSunColor; uniform float uNight;
  varying vec3 vN; varying vec3 vView; varying float vH;
  void main(){
    float fres = pow(1.0 - max(dot(vN, vView), 0.0), 3.0);          // fresnel edge glow
    vec3 base = mix(uDeep, uShallow, clamp(vH*6.0+0.5,0.0,1.0));    // depth tint
    vec3 h = normalize(uSun + vView);                               // blinn-phong spec
    float spec = pow(max(dot(vN, h), 0.0), 120.0);
    vec3 col = mix(base, uSunColor, fres*0.6) + uSunColor*spec*(1.2+uNight*1.5);
    gl_FragColor = vec4(col, 0.92);
  }`
export function makeWaterMaterial({ night = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uShallow: { value: new THREE.Color(night ? '#1d4a63' : '#8fd0e8') },
      uDeep: { value: new THREE.Color(night ? '#0b1c2e' : '#2f7fa0') },
      uSun: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
      uSunColor: { value: new THREE.Color(night ? '#ffe6a0' : '#fff3c4') },
      uNight: { value: night ? 1 : 0 },
    },
    vertexShader: WATER_VERT,
    fragmentShader: WATER_FRAG,
  })
}
