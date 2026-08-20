import React from 'react';
import { Volume2, VolumeX, Info } from 'lucide-react';
import { sound } from '../utils/audio';
import { LionmaxLogo } from './LionmaxLogo';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenAbout,
}) => {
  return (
    <header className="relative z-30 w-full max-w-md mx-auto pt-2 px-3 sm:px-4 flex flex-col items-center select-none">
      {/* Top Utility Bar */}
      <div className="w-full flex items-center justify-between mb-1">
        {/* Softlogic Badge */}
        <div
          id="badge-softlogic"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-left select-none"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
          <span className="text-[10px] font-bold tracking-wider text-cyan-200 uppercase">
            Softlogic Pharmaceuticals
          </span>
        </div>

        {/* Action buttons (Clean Public Controls) */}
        <div className="flex items-center gap-1.5">
          {/* About Lionmax & How to Mix Info Guide */}
          <button
            id="btn-about-lionmax"
            onClick={() => {
              sound.playClick();
              onOpenAbout();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-amber-200 transition-all cursor-pointer text-[11px] font-bold"
            title="What is Lionmax? & How to Mix"
            aria-label="About Lionmax"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={() => {
              onToggleMute();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-cyan-300 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>
        </div>
      </div>

      {/* Main Official Lionmax Text Logo (Raw Image with drop-shadow only) */}
      <div className="text-center pt-1">
        <LionmaxLogo size="md" />
      </div>
    </header>
  );
};
