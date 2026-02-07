import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';

// --- Helper Component for Loading Trees ---
function ModelTree({ path, position, scale = 3 }) {
  // Load the specific file requested
  const { scene } = useGLTF(path);
  
  // Clone the scene so we can reuse the same model multiple times if needed
  const clone = useMemo(() => scene.clone(), [scene]);
  
  return <primitive object={clone} scale={scale} position={position} />;
}

const MemoryForestScene = ({ memories = [], onLeafClick }) => {
  return (
    <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
      {/* 1. Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      
      {/* 2. Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />

      {/* 3. The Trees */}
      <Suspense fallback={null}>
        {/* Tree 1: Center (The Main Tree) */}
        <ModelTree path="/land2.glb" position={[0, -3, 0]} scale={0.5} />
        
        {/* Tree 2: Background Right (The Second Tree) */}
        {/* Make sure you have 'tree2.glb' in your public folder! */}
        <ModelTree path="/land.glb" position={[10, -1, -5]} scale={0.5} />
        <ModelTree path="/land3.glb" position={[-10, -1, 5]} scale={0.5} />
        /*mushroom*/
        <ModelTree path="/mushroom.glb" position={[-13, 4.5, 20]} scale={1} />
        /*rock*/
        <ModelTree path="/rock.glb" position={[15, 10, 10]} scale={1} />
        /potion/
        <ModelTree path="/potion.glb" position={[0, 1, -20]} scale={0.003} />
        
      </Suspense>

      {/* 4. The Memories (Floating Orbs) */}
      {memories.map((mem, i) => (
        <mesh 
          key={mem.id}
          // Simple math to scatter memories in a circle
          position={[
            Math.sin(i) * 4,    // X
            2 + (i * 0.5),      // Y (Height)
            Math.cos(i) * 4     // Z
          ]}
          onClick={(e) => { e.stopPropagation(); onLeafClick(mem); }}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={mem.type === 'happy' ? '#4ade80' : '#60a5fa'} 
            emissive={mem.type === 'happy' ? '#4ade80' : '#60a5fa'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* 5. The Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.2} />
      </mesh>
      <gridHelper args={[100, 100, '#1e293b', '#0f172a']} position={[0, -2.5, 0]} />

      {/* 6. Controls */}
      <OrbitControls minDistance={15} maxDistance={60} maxPolarAngle={Math.PI / 2 - 0.1} />
    </Canvas>
  );
};

export default MemoryForestScene;