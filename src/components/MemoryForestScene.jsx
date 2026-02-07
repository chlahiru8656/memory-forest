import React, { useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';
import { Vector3 } from 'three';

// --- Helper Component for Loading Trees ---
function ModelTree({ path, position, scale = 3 }) {
  // Load the specific file requested
  const { scene } = useGLTF(path);
  
  // Clone the scene so we can reuse the same model multiple times if needed
  const clone = useMemo(() => scene.clone(), [scene]);
  
  return <primitive object={clone} scale={scale} position={position} />;
}

// --- Camera Controller for Arrow Key Movement ---
function CameraController() {
  const keys = useRef({ 
    ArrowUp: false, 
    ArrowDown: false, 
    ArrowLeft: false, 
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keys.current.hasOwnProperty(e.key)) {
        keys.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (keys.current.hasOwnProperty(e.key)) {
        keys.current[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    const speed = 0.3;
    const direction = new Vector3();

    // Forward/Backward (Arrow Up/Down or W/S)
    if (keys.current.ArrowUp || keys.current.w) {
      direction.z -= speed;
    }
    if (keys.current.ArrowDown || keys.current.s) {
      direction.z += speed;
    }

    // Left/Right (Arrow Left/Right or A/D)
    if (keys.current.ArrowLeft || keys.current.a) {
      direction.x -= speed;
    }
    if (keys.current.ArrowRight || keys.current.d) {
      direction.x += speed;
    }

    // Apply movement to camera
    if (direction.length() > 0) {
      camera.position.add(direction);
    }
  });

  return null;
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
        <ModelTree path="/land2.glb" position={[0, -3, 0]} scale={1.5} />
        
        {/* Tree 2: Background Right (The Second Tree) */}
        {/* Make sure you have 'tree2.glb' in your public folder! */}
        <ModelTree path="/land.glb" position={[30, -1, -5]} scale={1.5} />
        <ModelTree path="/land3.glb" position={[-30, -1, 5]} scale={1.5} />
        /*mushroom*/
        <ModelTree path="/mushroom.glb" position={[-40,15.5, 50]} scale={2.5} />
        <ModelTree path="/mushroom.glb" position={[30,8.5, -55]} scale={2.5} />
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

      {/* 6. Camera Controls - Arrow Keys + Mouse Zoom/Rotate */}
      <CameraController />
      <OrbitControls minDistance={15} maxDistance={100} maxPolarAngle={Math.PI / 2 - 0.1} />
    </Canvas>
  );
};

export default MemoryForestScene;