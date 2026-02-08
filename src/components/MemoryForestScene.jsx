import React, { useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';
import { Vector3 } from 'three';

// --- Helper Component ---
function ModelTree({ path, position, scale = 3, onClick }) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive 
      object={clone} 
      scale={scale} 
      position={position}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      onPointerOver={() => { if(onClick) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    />
  );
}

// --- Camera Controller ---
function CameraController() {
  const keys = useRef({ 
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    w: false, a: false, s: false, d: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => { if (keys.current.hasOwnProperty(e.key)) keys.current[e.key] = true; };
    const handleKeyUp = (e) => { if (keys.current.hasOwnProperty(e.key)) keys.current[e.key] = false; };
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
    if (keys.current.ArrowUp || keys.current.w) direction.z -= speed;
    if (keys.current.ArrowDown || keys.current.s) direction.z += speed;
    if (keys.current.ArrowLeft || keys.current.a) direction.x -= speed;
    if (keys.current.ArrowRight || keys.current.d) direction.x += speed;
    if (direction.length() > 0) camera.position.add(direction);
  });
  return null;
}

const MemoryForestScene = ({ memories = [], onLeafClick }) => {
  
  // Special giant memory for background mushrooms
  const giantMemory = {
    id: 'giant',
    title: "The Ancient Guardian",
    date: "Since the Beginning",
    type: "special",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300"
  };

  return (
    <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />

      <Suspense fallback={null}>
        {/* --- STATIC ENVIRONMENT --- */}
        <ModelTree path="/land2.glb" position={[0, -3, 0]} scale={1.5} />
        <ModelTree path="/land.glb" position={[30, -1, -5]} scale={1.5} />
        <ModelTree path="/land3.glb" position={[-30, -1, 5]} scale={1.5} />
        
        <ModelTree path="/rock.glb" position={[15, 10, 10]} scale={1} />
        <ModelTree path="/potion.glb" position={[0, 1, -20]} scale={0.003} />
        
        {/* Giant Mushrooms */}
        <ModelTree path="/mushroom.glb" position={[-40, 15.5, 50]} scale={2.5} onClick={() => onLeafClick(giantMemory)} />
        <ModelTree path="/mushroom.glb" position={[30, 8.5, -55]} scale={2.5} onClick={() => onLeafClick(giantMemory)} />

        {/* --- DYNAMIC MEMORIES (Small Mushrooms) --- */}
        {memories.map((mem, i) => {
          const angle = (i / (memories.length || 1)) * Math.PI * 2;
          const radius = 10; // Spread them out a bit more (Radius 10)
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;

          return (
            <ModelTree 
              key={mem.id}
              path="/mushroom.glb"  
              position={[x, 5.5, z]} 
              scale={1.5} 
              onClick={() => onLeafClick(mem)}
            />
          );
        })}
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.2} />
      </mesh>
      
      <CameraController />
      <OrbitControls minDistance={10} maxDistance={100} maxPolarAngle={Math.PI / 2 - 0.1} />
    </Canvas>
  );
};

export default MemoryForestScene;