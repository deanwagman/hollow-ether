import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { AdditiveBlending, Color, DoubleSide, Object3D } from 'three';
import type {
  InstancedMesh,
  Mesh,
  Points,
  ShaderMaterial,
} from 'three';
import { useReducedMotionPreference } from '../../../game/useReducedMotionPreference';
import './HollowAtmosphereWebGL.css';

export type HollowAtmosphereWebGLScene = 'void' | 'blackSignal';

export type HollowAtmosphereWebGLProps = {
  scene?: HollowAtmosphereWebGLScene;
  debugControls?: boolean;
  reducedMotion?: boolean;
  className?: string;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const BLACK_SIGNAL_PARTICLE_COUNT = 280;
const BLACK_SIGNAL_PARTICLE_BASE_SIZE = 18;
const BLACK_SIGNAL_PARTICLE_MIN_ALPHA = 0.18;
const BLACK_SIGNAL_PARTICLE_MAX_ALPHA = 0.68;
const BLACK_SIGNAL_FIELD_WIDTH = 14;
const BLACK_SIGNAL_FIELD_HEIGHT = 8;
const BLACK_SIGNAL_FIELD_DEPTH = 8;

const BLACK_SIGNAL_STREAK_COUNT = 28;

const BLACK_SIGNAL_TRACE_VERTICAL_COUNT = 12;
const BLACK_SIGNAL_TRACE_HORIZONTAL_COUNT = 18;
const BLACK_SIGNAL_TRACE_COUNT =
  BLACK_SIGNAL_TRACE_VERTICAL_COUNT + BLACK_SIGNAL_TRACE_HORIZONTAL_COUNT;

const BLACK_SIGNAL_TRACE_OPACITY = 0.006;

const BLACK_SIGNAL_TRACE_VERTICAL_MIN_HEIGHT = 0.7;
const BLACK_SIGNAL_TRACE_VERTICAL_MAX_HEIGHT = 3.2;
const BLACK_SIGNAL_TRACE_VERTICAL_WIDTH = 0.006;

const BLACK_SIGNAL_TRACE_HORIZONTAL_MIN_WIDTH = 0.28;
const BLACK_SIGNAL_TRACE_HORIZONTAL_MAX_WIDTH = 1.15;
const BLACK_SIGNAL_TRACE_HORIZONTAL_HEIGHT = 0.005;

const BLACK_SIGNAL_DASH_COUNT = 48;
const BLACK_SIGNAL_DASH_FIELD_WIDTH = 12.5;
const BLACK_SIGNAL_DASH_FIELD_HEIGHT = 6.2;
const BLACK_SIGNAL_DASH_FIELD_DEPTH = 6.5;
const BLACK_SIGNAL_DASH_MIN_WIDTH = 0.26;
const BLACK_SIGNAL_DASH_MAX_WIDTH = 1.35;
const BLACK_SIGNAL_DASH_MIN_HEIGHT = 0.008;
const BLACK_SIGNAL_DASH_MAX_HEIGHT = 0.022;
const BLACK_SIGNAL_DASH_OPACITY = 0.01;

const BLACK_SIGNAL_STREAK_OPACITY = 0.01;

const blackSignalParticleVertexShader = `
  attribute float aAlpha;
  attribute float aSize;
  attribute float aTwinkle;

  uniform float uTime;
  uniform float uBaseSize;
  uniform float uReduceMotion;

  varying float vAlpha;
  varying float vTwinkle;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float shimmer = 1.0;

    if (uReduceMotion < 0.5) {
      shimmer = 0.92 + 0.08 * sin(uTime * 0.45 + aTwinkle);
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    float depthScale = 1.0 / max(0.35, -viewPosition.z);
    gl_PointSize = uBaseSize * aSize * shimmer * depthScale;

    vAlpha = aAlpha;
    vTwinkle = shimmer;
  }
`;

const blackSignalParticleFragmentShader = `
  precision mediump float;

  uniform vec3 uColor;

  varying float vAlpha;
  varying float vTwinkle;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(coord);

    float core = smoothstep(0.22, 0.0, distanceFromCenter);
    float halo = smoothstep(0.5, 0.0, distanceFromCenter) * 0.34;

    float alpha = (core + halo) * vAlpha * vTwinkle;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(uColor, alpha);
  }
`;

type VoidCubeSceneProps = {
  debugControls: boolean;
  shouldReduceMotion: boolean;
};

function VoidCubeScene({
  debugControls,
  shouldReduceMotion,
}: VoidCubeSceneProps) {
  const cubeRef = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    if (shouldReduceMotion) return;
    if (!cubeRef.current) return;

    cubeRef.current.rotation.x += delta * 0.35;
    cubeRef.current.rotation.y += delta * 0.5;
  });

  return (
    <>
      <color attach="background" args={['#000000']} />

      <ambientLight intensity={0.32} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />

      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>

      {debugControls && (
        <OrbitControls enableDamping dampingFactor={0.08} makeDefault />
      )}
    </>
  );
}

type BlackSignalParticlesProps = {
  shouldReduceMotion: boolean;
};

function BlackSignalParticles({
  shouldReduceMotion,
}: BlackSignalParticlesProps) {
  const pointsRef = useRef<Points | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);

  const particleGeometry = useMemo(() => {
    const positions = new Float32Array(BLACK_SIGNAL_PARTICLE_COUNT * 3);
    const alphas = new Float32Array(BLACK_SIGNAL_PARTICLE_COUNT);
    const sizes = new Float32Array(BLACK_SIGNAL_PARTICLE_COUNT);
    const twinkles = new Float32Array(BLACK_SIGNAL_PARTICLE_COUNT);

    for (let index = 0; index < BLACK_SIGNAL_PARTICLE_COUNT; index += 1) {
      const i = index * 3;

      positions[i] =
        (seededRandom(index * 11.13) - 0.5) * BLACK_SIGNAL_FIELD_WIDTH;
      positions[i + 1] =
        (seededRandom(index * 17.71) - 0.5) * BLACK_SIGNAL_FIELD_HEIGHT;
      positions[i + 2] =
        -seededRandom(index * 23.41) * BLACK_SIGNAL_FIELD_DEPTH;

      const alphaSeed = seededRandom(index * 29.91);
      const sizeSeed = seededRandom(index * 37.31);

      alphas[index] =
        BLACK_SIGNAL_PARTICLE_MIN_ALPHA +
        alphaSeed *
          (BLACK_SIGNAL_PARTICLE_MAX_ALPHA - BLACK_SIGNAL_PARTICLE_MIN_ALPHA);

      sizes[index] = 0.55 + sizeSeed * 1.4;
      twinkles[index] = seededRandom(index * 43.77) * Math.PI * 2;
    }

    return {
      positions,
      alphas,
      sizes,
      twinkles,
    };
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uReduceMotion.value = shouldReduceMotion
        ? 1
        : 0;
    }

    if (shouldReduceMotion) return;
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.015;
    pointsRef.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleGeometry.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aAlpha"
          args={[particleGeometry.alphas, 1]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[particleGeometry.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aTwinkle"
          args={[particleGeometry.twinkles, 1]}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest
        blending={AdditiveBlending}
        vertexShader={blackSignalParticleVertexShader}
        fragmentShader={blackSignalParticleFragmentShader}
        uniforms={{
          uColor: { value: new Color('#8ef8f2') },
          uTime: { value: 0 },
          uBaseSize: { value: BLACK_SIGNAL_PARTICLE_BASE_SIZE },
          uReduceMotion: { value: shouldReduceMotion ? 1 : 0 },
        }}
      />
    </points>
  );
}

type BlackSignalTracePlanesProps = {
  shouldReduceMotion: boolean;
};

function BlackSignalTracePlanes({
  shouldReduceMotion,
}: BlackSignalTracePlanesProps) {
  const meshRef = useRef<InstancedMesh | null>(null);

  const traceData = useMemo(() => {
    const traces: Array<{
      x: number;
      y: number;
      z: number;
      width: number;
      height: number;
      rotationZ: number;
    }> = [];

    for (let index = 0; index < BLACK_SIGNAL_TRACE_VERTICAL_COUNT; index += 1) {
      const x = (seededRandom(index * 101.3) - 0.5) * 13.5;
      const y = (seededRandom(index * 109.7) - 0.5) * 6.8;
      const z = -1.5 - seededRandom(index * 113.9) * 5.5;
      const height =
        BLACK_SIGNAL_TRACE_VERTICAL_MIN_HEIGHT +
        seededRandom(index * 127.1) *
          (BLACK_SIGNAL_TRACE_VERTICAL_MAX_HEIGHT -
            BLACK_SIGNAL_TRACE_VERTICAL_MIN_HEIGHT);

      traces.push({
        x,
        y,
        z,
        width: BLACK_SIGNAL_TRACE_VERTICAL_WIDTH,
        height,
        rotationZ: (seededRandom(index * 131.5) - 0.5) * 0.035,
      });
    }

    for (
      let index = 0;
      index < BLACK_SIGNAL_TRACE_HORIZONTAL_COUNT;
      index += 1
    ) {
      const x = (seededRandom(index * 151.3) - 0.5) * 13.5;
      const y = (seededRandom(index * 157.7) - 0.5) * 6.6;
      const z = -1.2 - seededRandom(index * 163.9) * 5.8;
      const width =
        BLACK_SIGNAL_TRACE_HORIZONTAL_MIN_WIDTH +
        seededRandom(index * 167.1) *
          (BLACK_SIGNAL_TRACE_HORIZONTAL_MAX_WIDTH -
            BLACK_SIGNAL_TRACE_HORIZONTAL_MIN_WIDTH);

      traces.push({
        x,
        y,
        z,
        width,
        height: BLACK_SIGNAL_TRACE_HORIZONTAL_HEIGHT,
        rotationZ: (seededRandom(index * 171.9) - 0.5) * 0.035,
      });
    }

    return traces;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const object = new Object3D();

    traceData.forEach((trace, index) => {
      object.position.set(trace.x, trace.y, trace.z);
      object.rotation.set(0, 0, trace.rotationZ);
      object.scale.set(trace.width, trace.height, 1);
      object.updateMatrix();

      meshRef.current?.setMatrixAt(index, object.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [traceData]);

  useFrame((_, delta) => {
    if (shouldReduceMotion) return;
    if (!meshRef.current) return;

    meshRef.current.rotation.y += delta * 0.0015;
    meshRef.current.rotation.x += delta * 0.0008;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, BLACK_SIGNAL_TRACE_COUNT]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#59f6ff"
        transparent
        opacity={BLACK_SIGNAL_TRACE_OPACITY}
        depthWrite={false}
        depthTest
        side={DoubleSide}
      />
    </instancedMesh>
  );
}

type BlackSignalDashPlanesProps = {
  shouldReduceMotion: boolean;
};

function BlackSignalDashPlanes({
  shouldReduceMotion,
}: BlackSignalDashPlanesProps) {
  const meshRef = useRef<InstancedMesh | null>(null);

  const dashData = useMemo(() => {
    return Array.from({ length: BLACK_SIGNAL_DASH_COUNT }).map((_, index) => {
      const centerBias = seededRandom(index * 311.13);
      const x =
        (seededRandom(index * 317.31) - 0.5) *
        BLACK_SIGNAL_DASH_FIELD_WIDTH *
        (centerBias < 0.72 ? 0.72 : 1);

      const y =
        (seededRandom(index * 331.71) - 0.5) * BLACK_SIGNAL_DASH_FIELD_HEIGHT;

      const z =
        -1.2 - seededRandom(index * 337.41) * BLACK_SIGNAL_DASH_FIELD_DEPTH;

      const width =
        BLACK_SIGNAL_DASH_MIN_WIDTH +
        seededRandom(index * 347.11) *
          (BLACK_SIGNAL_DASH_MAX_WIDTH - BLACK_SIGNAL_DASH_MIN_WIDTH);

      const height =
        BLACK_SIGNAL_DASH_MIN_HEIGHT +
        seededRandom(index * 353.17) *
          (BLACK_SIGNAL_DASH_MAX_HEIGHT - BLACK_SIGNAL_DASH_MIN_HEIGHT);

      const rotationZ = (seededRandom(index * 359.91) - 0.5) * 0.04;

      return {
        x,
        y,
        z,
        width,
        height,
        rotationZ,
      };
    });
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const object = new Object3D();

    dashData.forEach((dash, index) => {
      object.position.set(dash.x, dash.y, dash.z);
      object.rotation.set(0, 0, dash.rotationZ);
      object.scale.set(dash.width, dash.height, 1);
      object.updateMatrix();

      meshRef.current?.setMatrixAt(index, object.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dashData]);

  useFrame((_, delta) => {
    if (shouldReduceMotion) return;
    if (!meshRef.current) return;

    meshRef.current.rotation.y += delta * 0.0015;
    meshRef.current.rotation.x += delta * 0.0015;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, BLACK_SIGNAL_DASH_COUNT]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#59f6ff"
        transparent
        opacity={BLACK_SIGNAL_DASH_OPACITY}
        depthWrite={false}
        depthTest
        side={DoubleSide}
      />
    </instancedMesh>
  );
}

function BlackSignalStreaks({
  shouldReduceMotion,
}: BlackSignalParticlesProps) {
  const pointsRef = useRef<Points | null>(null);

  const positions = useMemo(() => {
    const values = new Float32Array(BLACK_SIGNAL_STREAK_COUNT * 3);

    for (let index = 0; index < BLACK_SIGNAL_STREAK_COUNT; index += 1) {
      const i = index * 3;

      values[i] = (seededRandom(index * 31.3) - 0.5) * 13;
      values[i + 1] = (seededRandom(index * 41.7) - 0.5) * 5;
      values[i + 2] = -1.5 - seededRandom(index * 53.9) * 5;
    }

    return values;
  }, []);

  useFrame((_, delta) => {
    if (shouldReduceMotion) return;
    if (!pointsRef.current) return;

    pointsRef.current.rotation.z += delta * 0.004;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        color="#59f6ff"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={BLACK_SIGNAL_STREAK_OPACITY}
        depthWrite={false}
      />
    </points>
  );
}

type BlackSignalSceneProps = {
  debugControls: boolean;
  shouldReduceMotion: boolean;
};

function BlackSignalScene({
  debugControls,
  shouldReduceMotion,
}: BlackSignalSceneProps) {
  return (
    <>
      <color attach="background" args={['#000000']} />

      <fog attach="fog" args={['#02070a', 3.5, 13]} />

      <ambientLight intensity={0.08} />

      <BlackSignalParticles shouldReduceMotion={shouldReduceMotion} />
      <BlackSignalTracePlanes shouldReduceMotion={shouldReduceMotion} />
      <BlackSignalDashPlanes shouldReduceMotion={shouldReduceMotion} />
      <BlackSignalStreaks shouldReduceMotion={shouldReduceMotion} />

      {debugControls && (
        <OrbitControls enableDamping dampingFactor={0.08} makeDefault />
      )}
    </>
  );
}

export function HollowAtmosphereWebGL({
  scene = 'void',
  debugControls = false,
  reducedMotion,
  className,
}: HollowAtmosphereWebGLProps) {
  const prefersReducedMotion = useReducedMotionPreference();
  const shouldReduceMotion = reducedMotion ?? prefersReducedMotion;

  return (
    <div
      className={['he-hollow-atmosphere-webgl', className]
        .filter(Boolean)
        .join(' ')}
      data-scene={scene}
      data-debug-controls={debugControls || undefined}
      data-reduced-motion={shouldReduceMotion || undefined}
    >
      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        fallback={
          <div className="he-hollow-atmosphere-webgl__fallback">
            WebGL unavailable
          </div>
        }
      >
        {scene === 'void' && (
          <VoidCubeScene
            debugControls={debugControls}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}

        {scene === 'blackSignal' && (
          <BlackSignalScene
            debugControls={debugControls}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}

        {scene === 'blackSignal' && (
          <EffectComposer>
            <Bloom
              intensity={0.08}
              luminanceThreshold={0.82}
              luminanceSmoothing={0.22}
              radius={0.22}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
