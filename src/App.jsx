import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import LandingPage from './components/LandingPage';
import MemoryForestScene from './components/MemoryForestScene';

// --- 1. NAVBAR COMPONENT ---
const Navbar = ({ onAddClick }) => (
  <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
    <div className="pointer-events-auto">
      <h1 className="text-3xl font-bold text-white tracking-tighter drop-shadow-md">Memory Forest</h1>
      <p className="text-white/70 text-sm">Grow your life story</p>
    </div>
    <div className="flex gap-4 pointer-events-auto">
      <button onClick={onAddClick} className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-lg transition-transform active:scale-95">
        <Plus size={20} /> Add Memory
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">Plant a New Memory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" required placeholder="Title" className="w-full p-3 border rounded-xl" />
          <input name="date" type="date" required className="w-full p-3 border rounded-xl" />
          <select name="type" className="w-full p-3 border rounded-xl bg-white">
            <option value="happy">Happy (Green)</option>
            <option value="sad">Sad (Blue)</option>
          </select>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <div onClick={handleFileSelect} className="border-2 border-dashed p-8 text-center cursor-pointer hover:bg-gray-50 rounded-xl">
            {preview ? <img src={preview} className="h-32 mx-auto object-cover" /> : <span className="text-gray-400">Click to upload photo</span>}
          </div>

          <button className="w-full py-4 bg-green-600 text-white font-bold rounded-xl">Plant Memory</button>
        </form>
        <button onClick={onClose} className="mt-4 text-gray-500 w-full text-center">Cancel</button>
      </div>
    </div>
  );
};

// --- 3. VIEW MEMORY MODAL ---
const ViewMemoryModal = ({ memory, onClose }) => {
  if (!memory) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <img src={memory.image} alt={memory.title} className="w-full h-64 object-cover" />
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">{memory.title}</h2>
          <p className="text-gray-500 mt-2">{memory.date}</p>
          <button onClick={onClose} className="mt-6 text-red-500 font-bold">Close</button>
        </div>
      </div>
    </div>
  );
};

// --- 6. MAIN APP ---
const INITIAL_MEMORIES = [
  { id: 1, title: "First Day", date: "2023-02-15", type: "happy", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300" },
];

export default function App() {
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [hasEnteredForest, setHasEnteredForest] = useState(false);

  const handleAddMemory = (newMemoryData) => {
    setMemories([...memories, { ...newMemoryData, id: Date.now() }]);
  };

  if (!hasEnteredForest) {
    return <LandingPage onEnter={() => setHasEnteredForest(true)} />;
  }

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