import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, User, X, Upload, Calendar, Share2 } from 'lucide-react';
import MemoryForestScene from './components/MemoryForestScene';

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

// --- 4. MAIN MEMORY FOREST SCENE ---
const INITIAL_MEMORIES = [];

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
      
      {/* --- MOVEMENT INSTRUCTIONS HUD --- */}
      <div className="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-md p-4 rounded-lg text-white text-xs max-w-xs pointer-events-none">
        <p className="font-semibold mb-2">🎮 Camera Controls:</p>
        <p className="mb-1"><strong>WASD</strong> or <strong>Arrow Keys</strong> - Move camera</p>
        <p className="mb-1"><strong>Mouse</strong> - Orbit around scene</p>
        <p className="text-gray-300">🟢 Green circle = Starting point</p>
      </div>
      
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