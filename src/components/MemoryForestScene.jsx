import React, { useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';
import { Vector3 } from 'three';

// --- Exported Helper Component for Loading 3D Models ---
export function Models({ path, position, scale = 3, onClick }) {
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

// --- Exported Camera Controller for Keyboard Navigation ---
export function CameraController() {
  const velocityRef = useRef(new Vector3(0, 0, 0));
  const keysRef = useRef({ 
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    w: false, a: false, s: false, d: false
  });
  const mouseRef = useRef({ x: 0.1, y: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    const handleKeyDown = (e) => { 
      const key = e.key.toLowerCase();
      if (keysRef.current.hasOwnProperty(key)) {
        keysRef.current[key] = true;
      }
    };
    const handleKeyUp = (e) => { 
      const key = e.key.toLowerCase();
      if (keysRef.current.hasOwnProperty(key)) {
        keysRef.current[key] = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    const speed = 0.1;
    const friction = 0.5;
    
    // Get mouse-based direction (normalized from screen center)
    const mouseDir = new Vector3(
      (mouseRef.current.x - 0.5) * 1,
      0,
      (mouseRef.current.y - 0.5) * 1
    ).normalize();
    
    // Get direction based on keys pressed
    let direction = new Vector3(0, 0, 0);
    if (keysRef.current.w || keysRef.current.ArrowUp) direction.add(mouseDir.clone().multiplyScalar(speed));
    if (keysRef.current.s || keysRef.current.ArrowDown) direction.add(mouseDir.clone().multiplyScalar(-speed));
    if (keysRef.current.a || keysRef.current.ArrowLeft) {
      const leftDir = new Vector3(-mouseDir.z, 0, mouseDir.x);
      direction.add(leftDir.multiplyScalar(speed));
    }
    if (keysRef.current.d || keysRef.current.ArrowRight) {
      const rightDir = new Vector3(mouseDir.z, 0, -mouseDir.x);
      direction.add(rightDir.multiplyScalar(speed));
    }
    
    // Apply velocity
    velocityRef.current.add(direction);
    velocityRef.current.multiplyScalar(friction);
    
    // Update camera position
    camera.position.add(velocityRef.current);
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
    <Canvas camera={{ position: [-50, 0, 60], fov: 50 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />

      <Suspense fallback={null}>
        {/* --- STARTING POINT MARKER --- */}
        <mesh position={[-50, 0, 60]}>
          <cylinderGeometry args={[3, 3, 0.5, 32]} />
          <meshStandardMaterial color="#00ff00" emissive="#00aa00" />
        </mesh>
        
        {/* --- STATIC ENVIRONMENT --- */}
        <Models path="/land.glb" position={[30, -5, -5]} scale={1.5} />
        <Models path="/land2.glb" position={[0, -12, 0]} scale={1.5} />
        <Models path="/land3.glb" position={[-30, -12, 5]} scale={1.5} />
        
        <Models path="/rock.glb" position={[15, 10, 10]} scale={1} />
        <Models path="/potion.glb" position={[0, 1, -20]} scale={0.003} />
        
        {/* Giant Mushrooms */}
        <Models path="/mushroom.glb" position={[-40, 15.5, 50]} scale={2.5} onClick={() => onLeafClick(giantMemory)} />
        <Models path="/mushroom.glb" position={[30, 0, -55]} scale={2.5} onClick={() => onLeafClick(giantMemory)} />

        {/* --- DYNAMIC MEMORIES (Small Mushrooms) --- */}
        {memories.map((mem, i) => {
          // Generate consistent random positions based on memory ID
          const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
          };
          const x = (seededRandom(mem.id * 2) - 0.5) *100;
          const z = (seededRandom(mem.id * 3) - 0.5) * 100;

          return (
            <Models 
              key={mem.id}
              path="/mushroom.glb"  
              position={[x, 10, z]} 
              scale={2.5} 
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