import React from 'react';

const InkBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#fcf9f2]">
      {/* 1. Base Paper Texture with Pale Gold Hint */}
      {/* Texture pattern */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
      
      {/* Pale Gold Gradient Overlay to give the 'Golden' feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffdf5] via-[#fcf5e0] to-[#f3eac8] opacity-60 mix-blend-multiply"></div>

      {/* Subtle Gold Dust/Fibers Effect */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#d4af37_1px,transparent_1px)] [background-size:32px_32px]"></div>

      {/* 2. Right Side Landscape Silhouettes (Ink Mountains) */}
      
      {/* Farthest Mountain (Lightest Ink) */}
      <div className="absolute top-[10%] -right-[15%] w-[80vw] h-[90vh] bg-ink-100 rounded-[100%] opacity-30 blur-3xl transform rotate-12 mix-blend-multiply"></div>

      {/* Mid Mountain (Medium Ink) */}
      <div className="absolute bottom-[-10%] -right-[5%] w-[60vw] h-[70vh] bg-ink-700 rounded-[40%_60%_20%_80%/60%_40%_60%_40%] opacity-15 blur-2xl transform -rotate-6"></div>
      
      {/* Foreground Mountain/Rock (Darkest Ink details) */}
      <div className="absolute bottom-[-5%] right-[-10%] w-[40vw] h-[40vh] bg-ink-900 rounded-[50%_50%_40%_60%/40%_60%_70%_30%] opacity-10 blur-xl mix-blend-overlay"></div>

      {/* 3. Mist & Water Effects */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#fcf9f2] via-[#fcf9f2]/70 to-transparent"></div>

      {/* 4. Bamboo Shadows (Right Side) - Minimalist */}
      <div className="absolute bottom-20 right-10 opacity-20 transform scale-125 origin-bottom-right mix-blend-multiply">
          <div className="absolute w-1 h-64 bg-ink-800 rotate-6 right-16 bottom-0 rounded-full blur-[2px]"></div>
          <div className="absolute w-1 h-48 bg-ink-800 -rotate-3 right-8 bottom-0 rounded-full blur-[2px]"></div>
          {/* Bamboo Leaves */}
          <div className="absolute w-10 h-3 bg-ink-800 rotate-45 right-14 bottom-48 rounded-[50%] blur-[1px]"></div>
          <div className="absolute w-8 h-2 bg-ink-800 -rotate-12 right-20 bottom-36 rounded-[50%] blur-[1px]"></div>
          <div className="absolute w-12 h-3 bg-ink-800 rotate-12 right-4 bottom-56 rounded-[50%] blur-[1px]"></div>
      </div>

      {/* 5. Left Side: Pure "Liu Bai" (Negative Space) */}
      {/* This gradient ensures the text area on the left/center remains readable and feels open */}
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#fcf9f2]/90 via-[#fcf9f2]/50 to-transparent"></div>
    </div>
  );
};

export default InkBackground;