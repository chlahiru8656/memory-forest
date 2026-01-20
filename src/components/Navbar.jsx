import React from 'react';
import { Plus, Search, User } from 'lucide-react';

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

export default Navbar;