import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// My signature 3D piece: a basketball drawn entirely in a shader (no textures or
// model files to download), with thin orbit rings and a dust field around it.
// It is used in two ways:
//   mode="home"   - a full-screen fixed backdrop that reacts to scrolling
//   mode="inline" - a normal block that just spins and follows the pointer

type Mode = 'home' | 'inline'

const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Position on the unit sphere, which is what I draw the seams against.
    vPos = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uSeam;
  uniform vec3 uRim;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  // Cheap hash so the leather gets a pebbled grain without a texture.
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 p = vPos;

    // The seams of a basketball: two great circles plus one loop on each side.
    float d = min(abs(p.y), abs(p.x));
    float loops = abs(abs(p.x) - (0.48 + 0.36 * p.y * p.y));
    d = min(d, loops);
    float seam = 1.0 - smoothstep(0.016, 0.030, d);

    // Pebble grain.
    float grain = hash(floor(p * 80.0));

    // Simple lighting done by hand: one key light, a soft fill, a rim glow.
    vec3 n = normalize(vNormal);
    vec3 key = normalize(vec3(0.55, 0.75, 0.65));
    float diff = max(dot(n, key), 0.0);
    float fill = max(dot(n, normalize(vec3(-0.7, -0.2, 0.4))), 0.0) * 0.18;
    float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.6);
    vec3 h = normalize(key + vView);
    float spec = pow(max(dot(n, h), 0.0), 36.0) * 0.28;

    vec3 col = uBase * (0.14 + diff + fill) * (0.88 + 0.22 * grain);
    col = mix(col, uSeam, seam);
    col += uRim * fres * 0.85;
    col += spec * (1.0 - seam);

    gl_FragColor = vec4(col, 1.0);
  }
`

// Small helpers I use for the scroll choreography.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function Ball({ mode, reducedMotion }: { mode: Mode; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const ball = useRef<THREE.Mesh>(null!)
  const rings = useRef<THREE.Group>(null!)
  const dust = useRef<THREE.Points>(null!)
  const { viewport, gl } = useThree()

  // Pointer position in -1..1. I listen on the window because on the home page
  // the canvas sits behind the content and never receives pointer events itself.
  const pointer = useRef({ x: 0, y: 0 })
  useMemo(() => {
    if (typeof window === 'undefined') return
    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      },
      { passive: true },
    )
  }, [])

  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color('#ff5a1f') },
      uSeam: { value: new THREE.Color('#0b0b0c') },
      uRim: { value: new THREE.Color('#ffb38a') },
    }),
    [],
  )

  // Dust: random points in a shell around the ball.
  const dustPositions = useMemo(() => {
    const count = 420
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 1.5
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime
    const narrow = viewport.width < viewport.height // phone-shaped screens

    // The ball is sized off the smaller side of the screen so it always fits.
    const base = Math.min(viewport.width, viewport.height) * (mode === 'home' ? 0.27 : 0.34)

    let targetX = 0
    let targetY = 0
    let scale = base
    let spin = t * 0.25
    let opacity = 1

    if (mode === 'home') {
      // How many screens I have scrolled.
      const p = window.scrollY / window.innerHeight
      const slide = smooth(0.05, 1, p)
      if (narrow) {
        // On phones there is no room beside the text, so the ball drifts up and fades.
        targetY = slide * viewport.height * 0.2
        opacity = 1 - smooth(0.35, 0.95, p)
      } else {
        // On wide screens it slides to the right to make room for the statement.
        targetX = slide * viewport.width * 0.27
        opacity = 1 - smooth(1.45, 2.1, p)
      }
      scale = base * (1 - 0.18 * slide)
      spin += window.scrollY * 0.0035
      gl.domElement.style.opacity = String(opacity)
    }

    // Ease everything towards its target so the motion feels weighty.
    const k = 1 - Math.exp(-delta * 5)
    const g = group.current
    g.position.x += (targetX + pointer.current.x * 0.12 - g.position.x) * k
    g.position.y += (targetY - pointer.current.y * 0.08 - g.position.y) * k
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * k)
    g.rotation.x += (pointer.current.y * 0.25 - g.rotation.x) * k
    g.rotation.z += (-pointer.current.x * 0.12 - g.rotation.z) * k

    ball.current.rotation.y = spin
    ball.current.rotation.x = 0.35
    rings.current.rotation.z = t * 0.08
    rings.current.rotation.y = t * 0.05
    dust.current.rotation.y = t * 0.015 + (mode === 'home' ? window.scrollY * 0.0004 : 0)
  })

  return (
    <>
      <group ref={group} scale={0.001}>
        <mesh ref={ball} rotation={[0.35, 0.6, 0]}>
          <sphereGeometry args={[1, 96, 96]} />
          <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        </mesh>

        {/* Two hairline rings, tilted against each other, like orbit paths. */}
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
            <torusGeometry args={[1.55, 0.004, 8, 180]} />
            <meshBasicMaterial color="#f2efe8" transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[Math.PI / 1.7, -0.5, 0.4]}>
            <torusGeometry args={[1.85, 0.003, 8, 180]} />
            <meshBasicMaterial color="#ff5a1f" transparent opacity={0.55} />
          </mesh>
        </group>
      </group>

      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#f2efe8" size={0.018} sizeAttenuation transparent opacity={0.55} />
      </points>
    </>
  )
}

export default function BallScene({ mode }: { mode: Mode }) {
  // If someone asks their system for less motion, I render a still ball.
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <Canvas
      className={mode === 'home' ? 'ball-canvas ball-canvas--home' : 'ball-canvas'}
      camera={{ position: [0, 0, 8], fov: 35 }}
      // Capping the pixel ratio keeps phones and retina laptops from overheating.
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Ball mode={mode} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
