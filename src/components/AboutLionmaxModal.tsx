import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { LionmaxLogo } from './LionmaxLogo';
import { 
  X, 
  Zap, 
  Flame, 
  Sparkles, 
  Droplet, 
  GlassWater, 
  ShieldCheck, 
  Layers, 
  Activity
} from 'lucide-react';

interface AboutLionmaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutLionmaxModal: React.FC<AboutLionmaxModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'how_to_mix'>('about');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#141940] via-[#0E1235] to-[#07091B] border-2 border-cyan-400/50 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,229,255,0.4)] my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          id="btn-close-about-modal"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header with the Official Text Logo */}
        <div className="text-center pt-1 pb-3 border-b border-cyan-500/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>Marketed by Softlogic Pharmaceuticals</span>
          </div>

          <LionmaxLogo size="sm" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 my-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('about');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-amber-400 to-[#FF9900] text-black shadow-[0_0_15px_rgba(255,153,0,0.4)]'
                : 'bg-black/40 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>About Lionmax</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('how_to_mix');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'how_to_mix'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-black/40 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            <GlassWater className="w-4 h-4" />
            <span>How to Mix</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 max-h-[380px] text-xs">
          {/* TAB 1: WHAT IS LIONMAX */}
          {activeTab === 'about' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Core Brand Message Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-cyan-950/30 to-black/60 border border-amber-400/40">
                <div className="flex items-center gap-1.5 text-amber-300 font-black text-sm uppercase tracking-wide mb-1.5">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Fuel Your Winning Streak!</span>
                </div>
                <p className="text-[12px] text-gray-200 leading-relaxed">
                  Marketed by <strong className="text-cyan-300 font-extrabold">Softlogic Pharmaceuticals</strong>, this powerful <strong className="text-amber-300 font-black">4-gram energy sachet</strong> instantly transforms ordinary water into a high-performance beverage.
                </p>
                <p className="text-[12px] text-gray-300 leading-relaxed mt-2">
                  Packed with <strong className="text-white">caffeine, taurine, and vital B-vitamins</strong>, it delivers rapid stamina and sharp mental focus without the bulk or weight of a heavy can.
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-extrabold text-center">
                  ⚡ Just tear, mix, and unleash the energy you need to win!
                </div>
              </div>

              {/* High-Performance Ingredients Grid */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-black px-1">
                  ENERGY MATRIX HIGHLIGHTS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-500/30 flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-white text-xs">Caffeine Boost</div>
                      <div className="text-[10px] text-gray-400 leading-tight">Instant alertness & stamina</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/30 flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-white text-xs">Taurine Power</div>
                      <div className="text-[10px] text-gray-400 leading-tight">Sustained muscular endurance</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/30 flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-white text-xs">B-Vitamins</div>
                      <div className="text-[10px] text-gray-400 leading-tight">B3, B6 & B12 cellular fuel</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-purple-500/30 flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-white text-xs">4g Portable</div>
                      <div className="text-[10px] text-gray-400 leading-tight">Pocket-friendly sachet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW TO CREATE THE DRINK (INFOGRAPHIC) */}
          {activeTab === 'how_to_mix' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="text-center pb-1">
                <span className="text-[11px] font-black text-cyan-300 tracking-wider uppercase">
                  3 SIMPLE STEPS TO UNLEASH THE ENERGY
                </span>
              </div>

              {/* Step 1 */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-black/60 border border-cyan-400/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                  <span className="text-xl">✂️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black font-black text-[9px] uppercase">
                      STEP 1
                    </span>
                    <span className="font-black text-white text-xs uppercase">
                      Tear Sachet & Pour
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                    Tear open the 4g Lionmax sachet and empty the power powder into a glass or shaker.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/50 to-black/60 border border-blue-400/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                  <Droplet className="w-5 h-5 text-cyan-300 animate-bounce" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-blue-400 text-black font-black text-[9px] uppercase">
                      STEP 2
                    </span>
                    <span className="font-black text-white text-xs uppercase">
                      Add 250 ml Water
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                    Fill with <strong className="text-cyan-200">250 ml of water</strong>. <span className="text-amber-300 font-bold">(Cold/chilled water gives the best crisp taste, normal water is also great!)</span>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-black/60 border border-emerald-400/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,255,102,0.3)]">
                  <GlassWater className="w-5 h-5 text-emerald-300 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-[#00FF66] text-black font-black text-[9px] uppercase">
                      STEP 3
                    </span>
                    <span className="font-black text-white text-xs uppercase">
                      Stir & Drink is Ready!
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                    Stir or shake for 5 seconds. Your high-performance Lionmax energy drink is ready to power you up!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-gray-800 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
          >
            Got It • Close
          </button>
        </div>
      </div>
    </div>
  );
};
