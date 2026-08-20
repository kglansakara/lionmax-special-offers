import React, { useState, useEffect } from 'react';
import { GamePhase, ClaimVoucher } from './types';
import { rollWeightedPrize, createClaimVoucher, PRIZES } from './utils/prizes';
import { sound } from './utils/audio';
import { recordGamePlay, recordRedemption } from './lib/supabase';
import { BackgroundFX } from './components/BackgroundFX';
import { Header } from './components/Header';
import { Crate3D } from './components/Crate3D';
import { ScratchCard } from './components/ScratchCard';
import { PrizeRevealCard } from './components/PrizeRevealCard';
import { AboutLionmaxModal } from './components/AboutLionmaxModal';
import { StaffModal } from './components/StaffModal';
import { RedemptionModal } from './components/RedemptionModal';
import { LiveClock } from './components/LiveClock';
import { Zap, Flame, Sparkles, Award, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'lionmax_played';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [voucher, setVoucher] = useState<ClaimVoucher | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState<boolean>(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [goldCardSpin, setGoldCardSpin] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Anti-Refresh: Check localStorage on mount so people cannot replay
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ClaimVoucher = JSON.parse(stored);
        if (parsed && parsed.code && parsed.prize) {
          // Synchronize with updated prize definitions (e.g. BUY 1 GET 1 FREE, graphics)
          const matched = PRIZES.find((p) => p.id === parsed.prize.id);
          if (matched) {
            parsed.prize = matched;
          }
          setVoucher(parsed);
          setPhase('revealed');
          setGoldCardSpin(true);
        }
      }
    } catch (e) {
      console.warn('Could not read saved game state:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Initialize and roll game (Single chance to play)
  const handleStartGame = async () => {
    if (voucher) return; // Prevent multiple plays

    sound.playClick();
    sound.playWindup();

    // 1. Roll the weighted prize and create voucher
    const prize = rollWeightedPrize();
    const newVoucher = createClaimVoucher(prize);
    setVoucher(newVoucher);

    // 2. Save result to localStorage immediately to lock replay
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVoucher));
    } catch (e) {
      console.warn('Could not save game state to localStorage:', e);
    }

    // 3. Record new play in background
    recordGamePlay(newVoucher, 'Visitor');

    // Phase 2 Step 1: The Windup
    setPhase('windup');

    // Phase 2 Step 2: The Drop (after 350ms)
    setTimeout(() => {
      setPhase('dropping');

      // Phase 2 Step 3: The Burst & Impact (after 550ms)
      setTimeout(() => {
        sound.playDropImpact();
        sound.playExplosion();
        setScreenShake(true);
        setPhase('bursting');
        setGoldCardSpin(true);

        // Confetti burst for winning outcomes
        try {
          if (prize.isWin !== false) {
            confetti({
              particleCount: 70,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#00E5FF', '#FFD700', '#00FF66', '#FF9900', '#FFFFFF'],
            });
          }
        } catch {
          // Ignored
        }

        setTimeout(() => setScreenShake(false), 450);

        // Phase 3: Reveal Gold Card ready to scratch (after 500ms)
        setTimeout(() => {
          setPhase('scratching');
        }, 500);

      }, 550);
    }, 350);
  };

  const handleScratchComplete = () => {
    setPhase('revealed');
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  // Staff Submits Redemption with Visitor Name & details
  const handleConfirmRedeem = async (data: {
    visitorName: string;
    visitorPhone?: string;
    notes?: string;
  }) => {
    if (!voucher) return;
    sound.playRedeem();

    const timestampStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const updatedVoucher: ClaimVoucher = {
      ...voucher,
      isRedeemed: true,
      redeemedAt: timestampStr,
      visitorName: data.visitorName,
      visitorPhone: data.visitorPhone,
      notes: data.notes,
    };

    setVoucher(updatedVoucher);
    setIsRedeemModalOpen(false);

    // Save updated claimed state into localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVoucher));
    } catch (e) {
      console.warn('Could not save redeemed state:', e);
    }

    // Sync redemption details in background
    await recordRedemption(voucher.code, {
      visitorName: data.visitorName,
      visitorPhone: data.visitorPhone,
      notes: data.notes,
      redeemedAt: new Date().toISOString(),
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignored
    }
  };

  if (!isInitialized) {
    return <div className="w-full h-screen bg-[#070A1E]" />;
  }

  return (
    <div className={`relative w-full min-h-[100dvh] flex flex-col justify-between overflow-x-hidden ${screenShake ? 'animate-screen-shake' : ''}`}>
      {/* Background Ambience & Energetic Particles */}
      <BackgroundFX phase={phase} />

      {/* Screen Shockwave Ring on Burst */}
      {phase === 'bursting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-48 h-48 rounded-full border-4 border-cyan-400 animate-shockwave" />
          <div className="w-48 h-48 rounded-full border-4 border-[#FFD700] animate-shockwave" style={{ animationDelay: '0.1s' }} />
        </div>
      )}

      {/* Brand Header & Control Bar */}
      <Header 
        isMuted={isMuted} 
        onToggleMute={handleToggleMute}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Center Game Arena */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-2 w-full max-w-md mx-auto">
        {/* Phase 1 & 2: 3D Mystery Crate Visual (Only shown when idle or opening) */}
        {(phase === 'idle' || phase === 'windup' || phase === 'dropping' || phase === 'bursting') && (
          <div className="relative w-full flex flex-col items-center justify-center">
            <Crate3D 
              animationState={
                phase === 'idle' ? 'idle' :
                phase === 'windup' ? 'windup' :
                phase === 'dropping' ? 'dropping' :
                phase === 'bursting' ? 'bursting' : 'hidden'
              } 
            />
          </div>
        )}

        {/* Phase 3: Gold Scratch Card / Revealed Voucher Container */}
        {(phase === 'scratching' || phase === 'revealed' || (phase === 'bursting' && goldCardSpin)) && (
          <div 
            className={`relative w-full max-w-[360px] sm:max-w-[400px] rounded-2xl glass-panel p-1.5 transition-all duration-700 ${
              goldCardSpin ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            {/* Neon Border Glow */}
            <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-md pointer-events-none ${
              voucher?.isRedeemed 
                ? 'bg-red-500/20' 
                : 'bg-gradient-to-r from-cyan-400 via-amber-400 to-[#00FF66] animate-pulse-glow'
            }`} />

            {/* Scratching Phase: Gold Foil Scratch Window */}
            {phase === 'scratching' ? (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a0d26]">
                {/* Background underneath scratch layer */}
                {voucher && (
                  <PrizeRevealCard 
                    voucher={voucher} 
                    isRevealed={false} 
                    onOpenRedeemModal={() => setIsRedeemModalOpen(true)}
                    onOpenStaffModal={() => setIsStaffModalOpen(true)}
                  />
                )}

                {/* Gold Scratch Canvas Layer Overlaid on Top */}
                <ScratchCard 
                  onComplete={handleScratchComplete} 
                  isCompleted={false} 
                />
              </div>
            ) : (
              /* Revealed Phase: Full Prize Reveal Card with Staff Redeem */
              <div className="relative w-full rounded-2xl overflow-hidden">
                {voucher && (
                  <PrizeRevealCard 
                    voucher={voucher} 
                    isRevealed={true} 
                    onOpenRedeemModal={() => setIsRedeemModalOpen(true)}
                    onOpenStaffModal={() => setIsStaffModalOpen(true)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Action Section */}
      <footer className="relative z-30 w-full max-w-md mx-auto pb-4 pt-1 px-3 sm:px-4 flex flex-col items-center">
        {/* Phase 1: Call to Action Play Button */}
        {phase === 'idle' && (
          <div className="w-full flex flex-col items-center gap-2">
            <button
              id="btn-play-trigger"
              onClick={handleStartGame}
              className="w-full py-4 px-6 rounded-2xl btn-3d-energy text-white font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-2.5 animate-pulse cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-amber-200" />
              <span>TAP TO UNLOCK LOOT BOX</span>
              <Flame className="w-5 h-5 fill-amber-200" />
            </button>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-cyan-200/80">
              <Award className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Softlogic Pharmaceuticals Stall Special • 1 Play Per Visitor</span>
            </div>
          </div>
        )}

        {/* Phase 2: Opening In-Progress Indicator */}
        {(phase === 'windup' || phase === 'dropping' || phase === 'bursting') && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-wider uppercase animate-pulse">
            <Sparkles className="w-4 h-4 text-[#FFD700] animate-spin" />
            <span>UNLEASHING LOOT CRATE...</span>
          </div>
        )}

        {/* Phase 3 Scratching Hint */}
        {phase === 'scratching' && (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-black tracking-wider uppercase animate-bounce flex items-center gap-1.5">
              <span>🪙</span>
              <span>SCRATCH THE GOLD FOIL TO CLAIM</span>
            </div>
          </div>
        )}

        {/* Phase 3 Revealed Status & Live Verification */}
        {phase === 'revealed' && (
          <div className="w-full flex flex-col items-center gap-2">
            {/* Live Clock Bar */}
            <div className="w-full flex items-center justify-center">
              <LiveClock variant="badge" />
            </div>

            {voucher?.isRedeemed ? (
              <div className="w-full py-2 px-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-center text-xs font-mono font-bold flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>OFFER RECORDED AS CLAIMED • RE-USE PREVENTED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-emerald-400 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Present screen to stall staff to redeem</span>
              </div>
            )}
          </div>
        )}
      </footer>

      {/* Staff Name & Redemption Modal */}
      {voucher && (
        <RedemptionModal
          isOpen={isRedeemModalOpen}
          onClose={() => setIsRedeemModalOpen(false)}
          voucher={voucher}
          onConfirmRedeem={handleConfirmRedeem}
        />
      )}

      {/* What is Lionmax & Drink Recipe Guide Modal */}
      <AboutLionmaxModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />

      {/* Stall Staff QR Verification Modal */}
      {voucher && (
        <StaffModal
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
          voucher={voucher}
          onRedeemVoucher={() => setIsRedeemModalOpen(true)}
        />
      )}
    </div>
  );
}
