import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, User, X, Upload, Calendar, Share2, Image as ImageIcon } from 'lucide-react';
import * as THREE from 'three';
// Import OrbitControls. This path works with standard 'npm install three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

// --- 2. ADD MEMORY MODAL (FIXED UPLOAD) ---
const AddMemoryModal = ({ isOpen, onClose, onSave }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Reset preview when modal opens/closes
  useEffect(() => {
    if (!isOpen) setPreview(null);
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake local URL so we can see the image immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMemory = {
      title: formData.get('title'),
      date: formData.get('date'),
      type: formData.get('type'),
      // Use the uploaded preview URL, or fallback to placeholder if none uploaded
      image: preview || "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=300", 
    };
    onSave(newMemory);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Plant a New Memory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" required type="text" placeholder="e.g., Graduation Day" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input name="date" required type="date" className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feeling</label>
              <select name="type" className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white">
                <option value="happy">Happy (Green)</option>
                <option value="sad">Sad (Blue)</option>
                <option value="special">Special (Gold)</option>
              </select>
            </div>
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />

          {/* Clickable Upload Area */}
          <div 
            onClick={handleFileSelect}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${preview ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
            style={{ minHeight: '150px' }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={32} className="mb-2 text-gray-400" />
                <span className="text-sm">Click to upload photo</span>
              </>
            )}
            
            {preview && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white font-medium flex items-center gap-2"><ImageIcon size={16}/> Change Photo</span>
              </div>
            )}
          </div>

          <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg mt-4">
            Plant Memory
          </button>
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
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 bg-gray-200">
          <img src={memory.image} alt={memory.title} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{memory.title}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Calendar size={14} />
                <span className="text-sm">{memory.date}</span>
                <span className="mx-1">•</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  memory.type === 'happy' ? 'bg-green-100 text-green-700' : 
                  memory.type === 'sad' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {memory.type}
                </span>
              </div>
            </div>
            <button className="text-green-600 hover:bg-green-50 p-2 rounded-full">
              <Share2 size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            This is where the caption would go. A beautiful memory stored securely in your forest. 
            Remembering the good times and the growth they brought.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 4. 3D SCENE COMPONENT ---
const MemoryForestScene = ({ memories = [], onLeafClick }) => {
  const mountRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !mountRef.current) return;

    // Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(8, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);
    const spotLight = new THREE.SpotLight(0x4ade80, 1);
    spotLight.position.set(-10, 10, 5);
    scene.add(spotLight);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    scene.add(ground);
    
    const grid = new THREE.GridHelper(100, 100, 0x1e293b, 0x0f172a);
    grid.position.y = -2.99;
    scene.add(grid);

    // Tree
    const treeGroup = new THREE.Group();
    treeGroup.position.y = -3;
    scene.add(treeGroup);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const leafMatHappy = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
    const leafMatSad = new THREE.MeshStandardMaterial({ color: 0x60a5fa });

    treeGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2, 16), trunkMat));

    // Process Memories
    const memoriesByYear = {};
    memories.forEach(mem => {
      const year = mem.date ? mem.date.split('-')[0] : 'Unknown';
      if (!memoriesByYear[year]) memoriesByYear[year] = [];
      memoriesByYear[year].push(mem);
    });

    const clickables = [];
    Object.keys(memoriesByYear).sort().forEach((year, i) => {
      const yPos = 2 + (i * 2);
      const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2.1, 16), trunkMat);
      segment.position.y = yPos;
      treeGroup.add(segment);

      const branchGroup = new THREE.Group();
      branchGroup.position.y = yPos - 0.5;
      branchGroup.rotation.y = (i * Math.PI) / 1.5;
      branchGroup.rotation.z = 0.5;
      treeGroup.add(branchGroup);

      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 3, 8), branchMat);
      branch.position.y = 1.5;
      branchGroup.add(branch);

      // Label
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '60px sans-serif';
        ctx.fillText(year, 10, 50);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
        sprite.position.y = 3.5;
        branchGroup.add(sprite);
      }

      // Leaves
      memoriesByYear[year].forEach((mem, idx) => {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3), mem.type === 'sad' ? leafMatSad : leafMatHappy);
        leaf.position.set((Math.random()-0.5), 0.5 + idx * 0.5, (Math.random()-0.5));
        leaf.userData = { memory: mem, isLeaf: true };
        branchGroup.add(leaf);
        clickables.push(leaf);
      });
    });

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickables);
        if (intersects.length > 0) onLeafClick(intersects[0].object.userData.memory);
    };
    renderer.domElement.addEventListener('click', onClick);

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
    isInitialized.current = true;

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      isInitialized.current = false;
    };
  }, [memories]);

  return <div ref={mountRef} className="w-full h-full min-h-[500px]" />;
};

// --- 5. MAIN APP COMPONENT ---
const INITIAL_MEMORIES = [
  { id: 1, title: "First Day at Uni", date: "2023-02-15", type: "happy", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300" },
  { id: 2, title: "Trip to Ella", date: "2023-08-10", type: "adventurous", image: "https://images.unsplash.com/photo-1588258524675-c62d02c5c9a1?auto=format&fit=crop&q=80&w=300" },
];

export default function App() {
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);

  const handleAddMemory = (newMemoryData) => {
    setMemories([...memories, { ...newMemoryData, id: Date.now() }]);
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden font-sans">
      <Navbar onAddClick={() => setIsAddModalOpen(true)} />
      <AddMemoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddMemory} />
      <ViewMemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
      <div className="absolute inset-0 z-0">
         <MemoryForestScene memories={memories} onLeafClick={setSelectedMemory} />
      </div>
    </div>
  );
}