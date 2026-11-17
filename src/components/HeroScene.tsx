import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// The home page backdrop: a network of connected nodes with little packets of
// data travelling along the links. It is my picture of what I actually do all
// day: systems, pipelines and things talking to each other.
// Everything is generated in code, so there are no model files to download.

const NODE_COUNT = 110
const PULSE_COUNT = 26

// Small helpers I use for the scroll choreography.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** A soft round dot, so my points are glowing circles instead of hard squares. */
function makeDotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.9)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

/** Builds the graph once: where the nodes sit and which ones are linked. */
function buildNetwork() {
  // Spread the nodes evenly over a sphere, then nudge each one in or out a bit
  // so the shape looks organic instead of like a perfect ball.
  const nodes: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    const radius = 0.78 + Math.random() * 0.34
    nodes.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius))
  }

  // Link every node to its three nearest neighbours, skipping duplicates.
  const edges: [number, number][] = []
  const seen = new Set<string>()
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter((n) => n.j !== i)
      .sort((m, n) => m.d - n.d)
      .slice(0, 3)
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!seen.has(key)) {
        seen.add(key)
        edges.push([i, j])
      }
    }
  })

  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes)

  // A handful of nodes are highlighted in orange, like the busy services.
  const hubs = nodes.filter((_, i) => i % 9 === 0)
  const hubGeo = new THREE.BufferGeometry().setFromPoints(hubs)

  const linePoints: THREE.Vector3[] = []
  edges.forEach(([a, b]) => linePoints.push(nodes[a], nodes[b]))
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)

  // The packets: each one rides one link, then hops to a new random link.
  const pulseGeo = new THREE.BufferGeometry()
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3))
  const pulses = Array.from({ length: PULSE_COUNT }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.35 + Math.random() * 0.7,
  }))

  // Background dust far behind the network, for depth.
  const dust = new Float32Array(360 * 3)
  for (let i = 0; i < 360; i++) {
    const r = 2.4 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    dust[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    dust[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    dust[i * 3 + 2] = r * Math.cos(phi) - 1.5
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3))

  return { nodes, edges, nodeGeo, hubGeo, lineGeo, pulseGeo, pulses, dustGeo }
}

function Network({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const spinner = useRef<THREE.Group>(null!)
  const core = useRef<THREE.Mesh>(null!)
  const dustRef = useRef<THREE.Points>(null!)
  const { viewport, gl } = useThree()

  const net = useMemo(buildNetwork, [])
  const dot = useMemo(makeDotTexture, [])

  // Pointer position in -1..1. I listen on the window because the canvas sits
  // behind the page content and never receives pointer events itself.
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime
    const narrow = viewport.width < viewport.height // phone-shaped screens
    const base = Math.min(viewport.width, viewport.height) * 0.42

    // How many screens I have scrolled.
    const p = window.scrollY / window.innerHeight
    const slide = smooth(0.05, 1, p)
    let targetX = 0
    let targetY = 0
    let opacity = 1
    if (narrow) {
      // On phones there is no room beside the text, so it drifts up and fades.
      targetY = slide * viewport.height * 0.2
      opacity = 1 - smooth(0.35, 0.95, p)
    } else {
      // On wide screens it slides right to make room for my statement.
      targetX = slide * viewport.width * 0.27
      opacity = 1 - smooth(1.2, 1.8, p)
    }
    const scale = base * (1 - 0.3 * slide)
    gl.domElement.style.opacity = String(opacity)

    // Ease towards the targets so the motion has some weight.
    const k = 1 - Math.exp(-delta * 5)
    const g = group.current
    g.position.x += (targetX + pointer.current.x * 0.12 - g.position.x) * k
    g.position.y += (targetY - pointer.current.y * 0.08 - g.position.y) * k
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * k)
    g.rotation.x += (pointer.current.y * 0.3 - g.rotation.x) * k
    g.rotation.z += (-pointer.current.x * 0.12 - g.rotation.z) * k

    // Slow constant spin, plus extra spin as I scroll.
    spinner.current.rotation.y = t * 0.12 + window.scrollY * 0.0025
    core.current.rotation.y = -t * 0.2
    core.current.rotation.x = t * 0.1
    dustRef.current.rotation.y = t * 0.015 + window.scrollY * 0.0004

    // Move every packet along its link.
    if (!reducedMotion) {
      const pos = net.pulseGeo.attributes.position as THREE.BufferAttribute
      net.pulses.forEach((pulse, i) => {
        pulse.t += delta * pulse.speed
        if (pulse.t >= 1) {
          pulse.t = 0
          pulse.edge = Math.floor(Math.random() * net.edges.length)
        }
        const [a, b] = net.edges[pulse.edge]
        const A = net.nodes[a]
        const B = net.nodes[b]
        pos.setXYZ(
          i,
          A.x + (B.x - A.x) * pulse.t,
          A.y + (B.y - A.y) * pulse.t,
          A.z + (B.z - A.z) * pulse.t,
        )
      })
      pos.needsUpdate = true
    }
  })

  // Shared settings for all my glowing dots.
  const glow = { map: dot, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const

  return (
    <>
      <group ref={group} scale={0.001}>
        <group ref={spinner}>
          {/* The links */}
          <lineSegments geometry={net.lineGeo}>
            <lineBasicMaterial color="#f2efe8" transparent opacity={0.32} />
          </lineSegments>
          {/* The nodes */}
          <points geometry={net.nodeGeo}>
            <pointsMaterial color="#f2efe8" size={0.07} sizeAttenuation {...glow} />
          </points>
          {/* The orange hub nodes */}
          <points geometry={net.hubGeo}>
            <pointsMaterial color="#ff5a1f" size={0.2} sizeAttenuation {...glow} />
          </points>
          {/* The data packets */}
          <points geometry={net.pulseGeo}>
            <pointsMaterial color="#ff7a3d" size={0.11} sizeAttenuation {...glow} />
          </points>
        </group>

        {/* A wireframe core turning the other way inside the network. */}
        <mesh ref={core} scale={0.42}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ff5a1f" wireframe transparent opacity={0.5} />
        </mesh>
      </group>

      <points ref={dustRef} geometry={net.dustGeo}>
        <pointsMaterial color="#f2efe8" size={0.018} sizeAttenuation transparent opacity={0.5} />
      </points>
    </>
  )
}

export default function HeroScene() {
  // If someone asks their system for less motion, I render a still network.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Once the hero is far above the screen the canvas is invisible anyway, so I
  // stop rendering it. That keeps scrolling the rest of the page light.
  const [active, setActive] = useState(true)
  useEffect(() => {
    const onScroll = () => setActive(window.scrollY < window.innerHeight * 2)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Canvas
      className="hero-canvas"
      // The canvas is decoration only. Without this it swallows hover and clicks
      // meant for the content underneath it.
      style={{ pointerEvents: 'none' }}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 35 }}
      // Capping the pixel ratio keeps phones and retina laptops from overheating.
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Network reducedMotion={reducedMotion} />
    </Canvas>
  )
}
