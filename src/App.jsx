import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Plus, Search, User, X, Upload, Calendar, Share2, Image as ImageIcon } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';
import { Vector3 } from 'three';

// --- 1. NAVBAR COMPONENT ---
const Navbar = ({ onAddClick }) => (
  <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
    <div className="pointer-events-auto">
      <h1 className="text-3xl font-bold text-white tracking-tighter drop-shadow-md">Memory Forest</h1>
      <p className="text-white/70 text-sm">Grow your life story</p>
    </div>
    <div className="flex gap-4 pointer-events-auto">
      <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition">
        <Search size={20} />
      </button>
      <button 
        onClick={onAddClick}
        className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-lg transition-transform active:scale-95"
      >
        <Plus size={20} /> Add Memory
      </button>
      <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition">
        <User size={20} />
      </button>
    </div>
  </div>
);

// --- 2. ADD MEMORY MODAL ---
const AddMemoryModal = ({ isOpen, onClose, onSave }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { if (!isOpen) setPreview(null); }, [isOpen]);

  if (!isOpen) return null;
  
  const handleFileSelect = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSave({
      title: formData.get('title'),
      date: formData.get('date'),
      type: formData.get('type'),
      image: preview || "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=300", 
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Plant a New Memory</h2>
          <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input name="title" required className="w-full p-3 border rounded-xl" placeholder="e.g. Summer Trip" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input name="date" type="date" required className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" className="w-full p-3 border rounded-xl bg-white">
                <option value="happy">Happy (Green)</option>
                <option value="sad">Sad (Blue)</option>
              </select>
            </div>
          </div>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <div onClick={handleFileSelect} className="border-2 border-dashed p-8 text-center cursor-pointer hover:bg-gray-50 rounded-xl relative overflow-hidden h-32 flex items-center justify-center">
            {preview ? <img src={preview} className="absolute inset-0 w-full h-full object-cover" /> : <div className="text-gray-400 flex flex-col items-center"><Upload className="mb-2"/><span>Upload Photo</span></div>}
          </div>

          <button className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">Plant Memory</button>
        </form>
      </div>
    </div>
  );
};

// --- 3. VIEW MEMORY MODAL ---
const ViewMemoryModal = ({ memory, onClose }) => {
  if (!memory) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"><X size={20} /></button>
        <img src={memory.image} alt={memory.title} className="w-full h-64 object-cover" />
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{memory.title}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Calendar size={16} />
                <span>{memory.date}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${memory.type === 'happy' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{memory.type}</span>
              </div>
            </div>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Share2 size={20} className="text-gray-600" /></button>
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">
            This is where the user's story about this memory would go. It helps to remember the beautiful moments in the forest of life.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 4. 3D SCENE HELPERS ---

// A generic component to load any GLB file
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

// --- 5. MAIN MEMORY FOREST SCENE ---
const MemoryForestScene = ({ memories = [], onLeafClick }) => {
  return (
    <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
      {/* Lighting & Env */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />

      <Suspense fallback={null}>
        {/* --- STATIC ENVIRONMENT (Nadun's World) --- */}
        <ModelTree path="/land2.glb" position={[0, -3, 0]} scale={1.5} />
        <ModelTree path="/land.glb" position={[30, -1, -5]} scale={1.5} />
        <ModelTree path="/land3.glb" position={[-30, -1, 5]} scale={1.5} />
        
        <ModelTree path="/rock.glb" position={[15, 10, 10]} scale={1} />
        <ModelTree path="/potion.glb" position={[0, 1, -20]} scale={0.003} />
        
        {/* Decorative Giant Mushrooms */}
        <ModelTree path="/mushroom.glb" position={[-40, 15.5, 50]} scale={2.5} />
        <ModelTree path="/mushroom.glb" position={[30, 8.5, -55]} scale={2.5} />

        {/* --- INTERACTIVE MEMORIES (Small Mushrooms) --- */}
        {memories.map((mem, i) => {
          // Circle placement logic
          const angle = (i / (memories.length || 1)) * Math.PI * 2;
          const radius = 8; 
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;

          return (
            <ModelTree 
              key={mem.id}
              path="/mushroom.glb" 
              position={[x, -3, z]} 
              scale={1.5} 
              onClick={() => {
                console.log("Found Memory:", mem.title);
                onLeafClick(mem);
              }}
            />
          );
        })}
      </Suspense>

      {/* Backup Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.2} />
      </mesh>
      
      <CameraController />
      <OrbitControls minDistance={10} maxDistance={100} maxPolarAngle={Math.PI / 2 - 0.1} />
    </Canvas>
  );
};

// --- 6. APP COMPONENT ---
const INITIAL_MEMORIES = [
  { id: 1, title: "First Day at Uni", date: "2023-02-15", type: "happy", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300" },
  { id: 2, title: "Trip to Ella", date: "2023-08-10", type: "adventurous", image: "https://images.unsplash.com/photo-1588258524675-c62d02c5c9a1?auto=format&fit=crop&q=80&w=300" },
  { id: 3, title: "Graduation Party", date: "2024-01-20", type: "happy", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=300" },
];

export default function App() {
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);

  const handleAddMemory = (newMemoryData) => {
    setMemories([...memories, { ...newMemoryData, id: Date.now() }]);
  };

  const handleMushroomClick = (memory) => {
    setSelectedMemory(memory);
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden font-sans">
      <Navbar onAddClick={() => setIsAddModalOpen(true)} />
      
      <AddMemoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddMemory} 
      />
      
      <ViewMemoryModal 
        memory={selectedMemory} 
        onClose={() => setSelectedMemory(null)} 
      />
      
      <div className="absolute inset-0 z-0">
         <MemoryForestScene 
            memories={memories} 
            onLeafClick={handleMushroomClick} 
         />
      </div>
    </div>
  );
}