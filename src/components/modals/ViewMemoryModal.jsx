import React from 'react';
import { X, Calendar, Share2 } from 'lucide-react';

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

export default ViewMemoryModal;