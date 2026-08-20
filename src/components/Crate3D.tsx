import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';

interface Crate3DProps {
  animationState: 'idle' | 'windup' | 'dropping' | 'bursting' | 'hidden';
}

export const Crate3D: React.FC<Crate3DProps> = ({ animationState }) => {
  if (animationState === 'hidden') return null;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Dynamic Aura & Ground Shadow */}
      <div 
        className={`absolute -bottom-6 w-48 h-10 rounded-full bg-cyan-500/20 blur-xl transition-all duration-500 ${
          animationState === 'idle' ? 'scale-100 opacity-60' : 'scale-50 opacity-10'
        }`}
      />

      {/* Outer Crate Wrapper with Phase Specific Animations */}
      <div
        className={`relative transition-all duration-300 ${
          animationState === 'idle' ? 'animate-levitate' : ''
        } ${
          animationState === 'windup'
            ? 'scale-110 -translate-y-8 filter brightness-125 transition-transform duration-300 ease-out'
            : ''
        } ${
          animationState === 'dropping'
            ? 'translate-y-0 scale-100'
            : ''
        } ${
          animationState === 'bursting'
            ? 'scale-0 opacity-0 transition-all duration-300 ease-in'
            : ''
        }`}
      >
        {/* Glowing Energy Ring around crate */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-600 to-amber-500 opacity-40 blur-lg animate-pulse-glow" />

        {/* 3D Stylized Cyber Crate Container */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-3 bg-gradient-to-b from-[#1E265A] via-[#0F1438] to-[#080B21] border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(0,229,255,0.35),inset_0_2px_15px_rgba(0,229,255,0.4)] flex items-center justify-center overflow-hidden">
          {/* Cyber Corner Plates */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#FFD700] rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#FFD700] rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#FFD700] rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#FFD700] rounded-br-lg" />

          {/* Diagonal Hazard Carbon Reinforcements */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 bg-black/40 border-y border-cyan-500/30 flex items-center justify-around overflow-hidden">
            <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,#00E5FF_0,#00E5FF_10px,transparent_10px,transparent_20px)]" />
          </div>

          {/* Central Reactor / Lion Emblem Core */}
          <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#1b0a3d] via-[#101438] to-[#04081c] border-2 border-[#FF9900] shadow-[0_0_25px_rgba(255,153,0,0.5),inset_0_0_15px_rgba(255,153,0,0.4)] flex flex-col items-center justify-center p-2 group">
            {/* Glowing Energy Core Pulse */}
            <div className="absolute inset-2 rounded-xl bg-[#FF9900]/10 animate-ping" style={{ animationDuration: '3s' }} />

            {/* Lion Head / Energy Crest Vector Graphic */}
            <svg 
              className="w-14 h-14 sm:w-16 sm:h-16 text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized geometric lion crest */}
              <path 
                d="M12 2L15.5 5.5L19 4L19.5 8L23 10.5L20 14L21.5 18L17.5 19L15 22L12 19.5L9 22L6.5 19L2.5 18L4 14L1 10.5L4.5 8L5 4L8.5 5.5L12 2Z" 
                fill="url(#lionGold)" 
                stroke="#FFE066" 
                strokeWidth="1.2"
              />
              <path 
                d="M8.5 10L10.5 12L8.5 13M15.5 10L13.5 12L15.5 13" 
                stroke="#170d44" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
              <path 
                d="M12 11V15M10.5 16.5C11 17.2 13 17.2 13.5 16.5" 
                stroke="#170d44" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="lionGold" x1="1" y1="2" x2="23" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF2A3" />
                  <stop offset="0.5" stopColor="#FFB300" />
                  <stop offset="1" stopColor="#FF7700" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Tag */}
            <span className="text-[10px] font-black tracking-widest text-[#FFD700] uppercase mt-1 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
              LOOT CRATE
            </span>
          </div>

          {/* Electric Neon Seams & Rivets */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00E5FF]" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00E5FF]" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00E5FF]" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00E5FF]" />

          {/* Pulsing Corner Status LEDs */}
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
        </div>

        {/* Floating Sparks Indicator */}
        <div className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF9900] to-[#FF3300] text-white text-[10px] font-black tracking-wider uppercase shadow-lg flex items-center gap-1 border border-amber-300/60">
          <Zap className="w-3 h-3 fill-amber-200" />
          <span>100% WIN</span>
        </div>
      </div>
    </div>
  );
};
