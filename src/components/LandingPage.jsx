import React from 'react';
import { Leaf, Sparkles, Share2, Lock } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Stars Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20">
          <div className="mb-8 animate-bounce">
            <Leaf size={80} className="text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Memory Forest
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl">
            Grow your life story in an immersive 3D space
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl">
            Transform your precious moments into a beautiful, interactive forest where every memory becomes a glowing orb orbiting your personal tree.
          </p>
          
          <button
            onClick={onEnter}
            className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            Enter Your Forest →
          </button>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Why Memory Forest?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition transform hover:scale-105">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="text-green-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Immersive Experience</h3>
                <p className="text-gray-300 text-center text-sm">
                  Explore your memories in a stunning 3D environment with interactive trees and glowing memory orbs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition transform hover:scale-105">
                <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <Leaf className="text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Organize Memories</h3>
                <p className="text-gray-300 text-center text-sm">
                  Categorize your memories by emotion - happy moments in green, reflective moments in blue.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition transform hover:scale-105">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <Share2 className="text-purple-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Share Stories</h3>
                <p className="text-gray-300 text-center text-sm">
                  Share your memories and stories with friends and loved ones in an elegant, interactive format.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition transform hover:scale-105">
                <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <Lock className="text-yellow-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Keep It Private</h3>
                <p className="text-gray-300 text-center text-sm">
                  Your memories are yours alone. Full control over who sees your personal forest and stories.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Plant a Memory</h3>
                  <p className="text-gray-400">Click "Add Memory" and fill in details about your special moment - title, date, emotion, and optionally a photo.</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Watch It Grow</h3>
                  <p className="text-gray-400">Your memory appears as a glowing orb in your 3D forest, orbiting around your personal tree in a beautiful spiral.</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Explore & Relive</h3>
                  <p className="text-gray-400">Rotate, zoom, and navigate your forest. Click any memory to view details and relive those precious moments.</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Share & Connect</h3>
                  <p className="text-gray-400">Share selected memories with friends or make your entire forest public to inspire others.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Begin?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Start planting your memories and grow your personal forest today.
            </p>
            <button
              onClick={onEnter}
              className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              Enter Your Forest Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 text-center text-gray-400 border-t border-gray-700/30">
          <p>&copy; 2026 Memory Forest. Grow your life story.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
