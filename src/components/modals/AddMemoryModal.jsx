import React from 'react';
import { X, Upload, Calendar } from 'lucide-react';

const AddMemoryModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMemory = {
      title: formData.get('title'),
      date: formData.get('date'),
      type: formData.get('type'),
      // Placeholder image for the MVP
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=300", 
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

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition">
            <Upload size={32} className="mb-2 text-gray-400" />
            <span className="text-sm">Click to upload photo</span>
          </div>

          <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg mt-4">
            Plant Memory
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;