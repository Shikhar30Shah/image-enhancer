
"use client";

import { useState, useEffect } from 'react';

export default function ProcessingAnimation() {
  const [cardOrder, setCardOrder] = useState(0);

  // Define the three cards with their data
  const cards = [
    {
      emoji: '🎨',
      text: 'Tip: Warm colors evoke energy and passion in designs',
      bgClass: 'from-blue-500/10 to-blue-500/5',
      borderClass: 'border-blue-500/20'
    },
    {
      emoji: '🎭',
      text: 'Pro tip: Complementary colors create visual harmony',
      bgClass: 'from-pink-500/10 to-pink-500/5',
      borderClass: 'border-pink-500/20'
    },
    {
      emoji: '✨',
      text: 'Design secret: Gradients add depth to palettes',
      bgClass: 'from-purple-500/10 to-purple-500/5',
      borderClass: 'border-purple-500/20'
    }
  ];

  // Define different order permutations
  const orders = [
    [0, 1, 2], // Original order
    [1, 2, 0], // Rotate left
    [2, 0, 1], // Rotate left again
    [0, 2, 1], // Swap last two
    [2, 1, 0], // Reverse
    [1, 0, 2]  // Another variation
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCardOrder(prev => (prev + 1) % orders.length);
    }, 1500); // Shuffle every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentOrder = orders[cardOrder];

  return (
    <div className="flex flex-col items-center justify-center w-full">

      {/* Animated Paintbrush Strokes - Below Progress Bar */}
      <div className="w-full h-32 relative overflow-hidden mt-6 mb-4">
        {/* Paint stroke containers */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 128"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue stroke */}
          <path
            d="M0,64 Q100,30 200,64 T400,64"
            className="paint-stroke stroke-1 animate-paint-stroke-1"
            stroke="url(#gradient-blue)"
            strokeWidth="20"
            fill="none"
            opacity="0.8"
          />
          {/* Pink stroke */}
          <path
            d="M0,80 Q100,50 200,80 T400,80"
            className="paint-stroke stroke-2 animate-paint-stroke-2"
            stroke="url(#gradient-pink)"
            strokeWidth="18"
            fill="none"
            opacity="0.7"
          />
          {/* Purple stroke */}
          <path
            d="M0,48 Q100,70 200,48 T400,48"
            className="paint-stroke stroke-3 animate-paint-stroke-3"
            stroke="url(#gradient-purple)"
            strokeWidth="16"
            fill="none"
            opacity="0.6"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1DA1F2" stopOpacity="0" />
              <stop offset="50%" stopColor="#1DA1F2" stopOpacity="1" />
              <stop offset="100%" stopColor="#1DA1F2" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient-pink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E1306C" stopOpacity="0" />
              <stop offset="50%" stopColor="#E1306C" stopOpacity="1" />
              <stop offset="100%" stopColor="#E1306C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0" />
              <stop offset="50%" stopColor="#7B2FBE" stopOpacity="1" />
              <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Blur effect blobs behind strokes */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-20 animate-paint-blob-1"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500 rounded-full blur-3xl opacity-15 animate-paint-blob-2"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-500 rounded-full blur-3xl opacity-20 animate-paint-blob-3"></div>
        </div>
      </div>

      {/* Processing Insight Cards - Shuffling at Top */}
      <div className="w-full max-w-4xl mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 px-4 animate-shuffle">
        <div className="processing-card">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
            <div className="text-2xl mb-2">🎨</div>
            <p className="text-xs text-gray-300">Tip: Warm colors evoke energy and passion in designs</p>
          </div>
        </div>

        <div className="processing-card">
          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 backdrop-blur-sm">
            <div className="text-2xl mb-2">🎭</div>
            <p className="text-xs text-gray-300">Pro tip: Complementary colors create visual harmony</p>
          </div>
        </div>

        <div className="processing-card">
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 backdrop-blur-sm">
            <div className="text-2xl mb-2">✨</div>
            <p className="text-xs text-gray-300">Design secret: Gradients add depth to palettes</p>
          </div>
        </div>
      </div>

      {/* Processing Tips / Filler Content */}
      <div className="w-full max-w-md mt-6 space-y-3">
        <div className="processing-tip animate-fade-in-up delay-100">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-400/50 backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-300 text-xs font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Image Optimized</p>
              <p className="text-xs text-gray-200">Adjusting colors for best results</p>
            </div>
          </div>
        </div>

        <div className="processing-tip animate-fade-in-up delay-200">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-pink-500/15 to-pink-500/5 border border-pink-400/50 backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-pink-300 text-xs font-bold">◆</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Extracting Palette</p>
              <p className="text-xs text-gray-200">Analyzing dominant colors</p>
            </div>
          </div>
        </div>

        <div className="processing-tip animate-fade-in-up delay-300">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-400/50 backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-300 text-xs font-bold">★</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Generating Variations</p>
              <p className="text-xs text-gray-200">Creating color harmonies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
