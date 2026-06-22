import React, { Suspense, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, Points, PointMaterial, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import ErrorBoundary from './ErrorBoundary';

// --- 3D COMPONENTS ---
const Particles = React.memo(({ count = 1500, color = "#D4AF37", size = 0.01 }) => {
  const isMobile = window.innerWidth < 768;
  const optimizedCount = isMobile ? Math.floor(count / 2) : count;
  
  const points = React.useMemo(() => {
    const p = new Float32Array(optimizedCount * 3);
    for (let i = 0; i < optimizedCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return p;
  }, [optimizedCount]);

  const pointsRef = React.useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.x = time * 0.005;
      pointsRef.current.material.size = size * (1 + Math.sin(time * 0.5) * 0.2);
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.2}
      />
    </Points>
  );
});

const Scene = React.memo(() => {
  const { mouse } = useThree();
  const gemRef = React.useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (gemRef.current) {
      gemRef.current.rotation.y = time * 0.1 + mouse.x * 0.15;
      gemRef.current.rotation.x = mouse.y * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={['#020202']} />
      <ambientLight intensity={0.15} />
      <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={2.5} color="#D4AF37" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={gemRef}>
          <octahedronGeometry args={[1.2, 2]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            metalness={1} 
            roughness={0.02}
            envMapIntensity={1.5}
          />
        </mesh>
      </Float>

      <Particles count={2000} color="#D4AF37" size={0.008} />

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
      
      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={25} blur={4} far={12} />

      <EffectComposer multisampling={4}>
        <Bloom intensity={0.8} luminanceThreshold={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </>
  );
});

const PremiumLuxuryBackground = React.memo(() => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <ErrorBoundary>
        <Canvas shadows dpr={dpr} gl={{ antialias: true, alpha: true }}>
          <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
});

export default PremiumLuxuryBackground;
