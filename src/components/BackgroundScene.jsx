import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function DriftField() {
  const group = useRef(null);
  const shapes = useMemo(
    () => [
      { position: [-6, 2.2, -6], scale: 1.2, color: "#caa86a" },
      { position: [5.2, -1.4, -5.5], scale: 1.65, color: "#6fb3a7" },
      { position: [0.8, 3.6, -7], scale: 0.9, color: "#f4ede1" },
      { position: [-2.2, -3.4, -5.8], scale: 1.5, color: "#8b6b38" },
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) {
      return;
    }

    group.current.rotation.y += 0.0015;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.1, 0.025);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.35, 0.02);
  });

  return (
    <group ref={group}>
      {shapes.map((shape, index) => (
        <Float
          key={shape.position.join("-")}
          speed={1.5 + index * 0.2}
          rotationIntensity={0.35}
          floatIntensity={0.9}
        >
          <mesh position={shape.position} scale={shape.scale}>
            <torusKnotGeometry args={[0.75, 0.16, 160, 18]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.12}
              metalness={0.7}
              roughness={0.28}
            />
          </mesh>
        </Float>
      ))}

      <Line
        points={[
          [-7, -2, -8],
          [-2, 2, -7],
          [3, -1, -8],
          [7, 2, -7.2],
        ]}
        color="#6fb3a7"
        lineWidth={1}
        transparent
        opacity={0.35}
      />
      <Line
        points={[
          [-6, 4, -9],
          [-1, 0, -8.6],
          [4, 3, -9],
        ]}
        color="#caa86a"
        lineWidth={1}
        transparent
        opacity={0.28}
      />
    </group>
  );
}

function ParticleField() {
  const points = useMemo(() => {
    const data = [];
    for (let index = 0; index < 160; index += 1) {
      data.push((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, -Math.random() * 10);
    }
    return new Float32Array(data);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#f4ede1" size={0.03} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

export function BackgroundScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Canvas dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={46} />
          <color attach="background" args={["#070605"]} />
          <fog attach="fog" args={["#070605", 8, 18]} />
          <ambientLight intensity={0.85} />
          <directionalLight position={[3, 5, 4]} intensity={1.2} color="#f4ede1" />
          <pointLight position={[-5, 2, 3]} intensity={10} color="#caa86a" />
          <pointLight position={[5, -3, 4]} intensity={8} color="#6fb3a7" />
          <DriftField />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}
