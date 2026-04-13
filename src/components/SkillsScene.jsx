import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls, Sphere } from "@react-three/drei";

function SkillNode({ label, position, color }) {
  return (
    <Float speed={2.2} floatIntensity={1.8} rotationIntensity={0.7}>
      <group position={position}>
        <Sphere args={[0.36, 32, 32]}>
          <meshStandardMaterial color={color} metalness={0.55} roughness={0.18} emissive={color} emissiveIntensity={0.18} />
        </Sphere>
        <Html center distanceFactor={8}>
          <div className="rounded-full border border-white/10 bg-stone-950/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            {label}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function OrbitRig({ labels }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) {
      return;
    }

    group.current.rotation.y += 0.0024;
    group.current.rotation.x = state.pointer.y * 0.15;
  });

  return (
    <group ref={group}>
      {labels.map((item, index) => {
        const angle = (index / labels.length) * Math.PI * 2;
        const radius = index % 2 === 0 ? 2.3 : 1.55;
        return (
          <SkillNode
            key={item.label}
            label={item.label}
            color={item.color}
            position={[Math.cos(angle) * radius, Math.sin(angle * 1.4) * 1.1, Math.sin(angle) * radius]}
          />
        );
      })}
    </group>
  );
}

export function SkillsScene({ skills }) {
  const labels = skills.flatMap((group, groupIndex) =>
    group.items.slice(0, 3).map((item, itemIndex) => ({
      label: item,
      color: ["#caa86a", "#6fb3a7", "#f4ede1", "#92724a"][(groupIndex + itemIndex) % 4],
    })),
  );

  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }}>
      <Suspense fallback={null}>
        <color attach="background" args={["#090807"]} />
        <ambientLight intensity={0.9} />
        <pointLight position={[4, 4, 4]} intensity={8} color="#caa86a" />
        <pointLight position={[-4, -3, 4]} intensity={6} color="#6fb3a7" />
        <OrbitRig labels={labels} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Suspense>
    </Canvas>
  );
}
