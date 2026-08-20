import React, { useState } from 'react';
import { ClaimVoucher, Prize } from '../types';
import { sound } from '../utils/audio';
import { LiveClock } from './LiveClock';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Crown,
  Gift,
  QrCode,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  Award,
  RotateCcw
} from 'lucide-react';

interface PrizeRevealCardProps {
  voucher: ClaimVoucher;
  isRevealed: boolean;
  onOpenRedeemModal: () => void;
  onOpenStaffModal: () => void;
}

export const PrizeRevealCard: React.FC<PrizeRevealCardProps> = ({
  voucher,
  isRevealed,
  onOpenRedeemModal,
  onOpenStaffModal,
}) => {
  const { prize, code, timestamp, isRedeemed, redeemedAt, visitorName } = voucher;
  const [copied, setCopied] = useState(false);
  const isTryAgain = prize.id === 'try_again' || prize.isWin === false;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStaffRedeemClick = () => {
    sound.playClick();
    onOpenRedeemModal();
  };

  // Render actual graphical icon / figure based on prize
  const renderPrizeGraphic = (p: Prize) => {
    switch (p.id) {
      case 'offer_100':
        return <Crown className="w-8 h-8 text-[#00FF66] fill-[#00FF66]/20 animate-pulse" />;
      case 'offer_50':
        return <Zap className="w-8 h-8 text-[#FFD700] fill-[#FFD700]/30 animate-pulse" />;
      case 'offer_buy':
        return <Flame className="w-8 h-8 text-[#00E5FF] fill-[#00E5FF]/30 animate-pulse" />;
      case 'offer_20_next':
        return <Sparkles className="w-8 h-8 text-[#FF9900] fill-[#FF9900]/30 animate-pulse" />;
      case 'try_again':
      default:
        return <RotateCcw className="w-8 h-8 text-slate-300" />;
    }
  };

  // REDEEMED / CLAIMED STATE
  if (isRedeemed) {
    return (
      <div className="relative w-full p-3.5 sm:p-4.5 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#180909] via-[#0D0404] to-[#050000] border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.3)] select-none min-h-[360px] sm:min-h-[380px]">
        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b border-red-500/30">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-500/60 text-red-400 text-[10px] font-black uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span>OFFER ALREADY CLAIMED</span>
          </div>

          <LiveClock variant="compact" />
        </div>

        {/* Diagonal Large Stamped Watermark */}
        <div className="relative z-10 my-auto text-center py-3">
          {/* Official Claim Stamp */}
          <div className="inline-block transform -rotate-3 border-4 border-red-500/90 bg-red-950/90 px-4 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.35)] mb-2">
            <div className="flex items-center justify-center gap-1.5 text-red-400 font-black text-xl sm:text-2xl tracking-widest uppercase">
              <CheckCircle2 className="w-6 h-6 text-red-400" />
              <span>OFFER CLAIMED</span>
            </div>
            <div className="text-[11px] text-gray-200 font-mono tracking-wider mt-0.5">
              REDEEMED • {redeemedAt || 'VERIFIED'}
            </div>
          </div>

          {/* Visitor Name & Claim details */}
          <div className="bg-black/60 rounded-xl p-2.5 border border-gray-800 max-w-xs mx-auto text-left mt-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Visitor: {visitorName || 'Valued Visitor'}</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              Won: <span className="text-gray-200 font-bold">{prize.title}</span>
            </div>
          </div>
        </div>

        {/* Bottom Verification Details */}
        <div className="relative z-10 pt-2 border-t border-gray-800/80 space-y-2">
          <div className="flex items-center justify-between bg-black/70 p-2.5 rounded-xl border border-gray-700">
            <div>
              <div className="text-[8px] font-mono tracking-widest text-gray-400 uppercase">
                CLAIM CODE (USED)
              </div>
              <div className="text-sm sm:text-base font-black font-mono tracking-widest text-gray-300 line-through">
                {code}
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-gray-400">
              <div className="text-red-400 font-bold">LOCKED</div>
              <div className="text-[8px] text-gray-500">Softlogic Booth</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-gray-400 px-1 font-mono">
            <span>Claim recorded</span>
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-red-400" /> 1 Play Per Visitor
            </span>
          </div>
        </div>
      </div>
    );
  }

  // BETTER LUCK NEXT TIME / TRY AGAIN Screen
  if (isTryAgain) {
    return (
      <div className="relative w-full p-3.5 sm:p-4.5 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#090D16] border-2 border-slate-500/50 shadow-[0_0_35px_rgba(148,163,184,0.2)] select-none min-h-[360px] sm:min-h-[380px]">
        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border bg-slate-800 text-slate-300 border-slate-600 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            {prize.badge || 'PARTICIPATION RECORDED'}
          </span>

          <LiveClock variant="compact" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center my-auto py-3">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-slate-800/80 border border-slate-600 flex items-center justify-center text-2xl shadow-inner">
            <RotateCcw className="w-7 h-7 text-slate-300" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase text-slate-200 leading-none">
            {prize.title}
          </h2>

          <div className="inline-block my-2 px-3 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-300 tracking-wider uppercase">
            {prize.subtitle}
          </div>

          <p className="text-[12px] text-slate-300 font-medium max-w-xs mx-auto leading-relaxed mt-1">
            {prize.description}
          </p>
        </div>

        {/* Bottom Lock Status */}
        <div className="relative z-10 pt-2 border-t border-slate-700/40">
          <div className="p-2.5 rounded-xl bg-black/40 border border-slate-700 text-center">
            <div className="text-[11px] font-bold text-cyan-300">
              Softlogic Pharmaceuticals Exhibition Booth
            </div>
            <div className="text-[9px] text-gray-400 font-mono mt-0.5">
              Code: <span className="text-slate-300">{code}</span> • 1 Play per visitor
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE UNREDEEMED PRIZE REVEAL CARD
  return (
    <div className="relative w-full p-3.5 sm:p-4.5 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#141940] via-[#0E1235] to-[#07091B] border-2 border-cyan-400/60 shadow-[0_0_45px_rgba(0,229,255,0.35)] select-none min-h-[360px] sm:min-h-[380px]">
      {/* Top Status & Live Clock Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b border-cyan-500/20">
        <span 
          className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border flex items-center gap-1 shadow-sm"
          style={{
            backgroundColor: `${prize.highlightColor}20`,
            borderColor: prize.highlightColor,
            color: prize.highlightColor,
          }}
        >
          <Award className="w-3 h-3" />
          {prize.badge}
        </span>

        {/* Live Synchronized Security Clock */}
        <LiveClock variant="compact" />
      </div>

      {/* Center Prize Information */}
      <div className="relative z-10 text-center my-auto py-2">
        {/* Dynamic Graphic Icon / Figure */}
        <div 
          className="w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center text-3xl shadow-lg border animate-bounce-subtle"
          style={{
            backgroundColor: `${prize.highlightColor}15`,
            borderColor: prize.highlightColor,
            boxShadow: `0 0 25px ${prize.highlightColor}40`,
          }}
        >
          {renderPrizeGraphic(prize)}
        </div>

        {/* Prize Main Title */}
        <h2 
          className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase leading-none"
          style={{ color: prize.highlightColor }}
        >
          {prize.title}
        </h2>

        {/* Subtitle Badge */}
        {prize.subtitle && (
          <div 
            className="inline-block my-1 px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase border"
            style={{
              backgroundColor: `${prize.highlightColor}15`,
              borderColor: `${prize.highlightColor}40`,
              color: prize.highlightColor,
            }}
          >
            {prize.subtitle}
          </div>
        )}

        {/* Subtitle / Description */}
        <p className="text-xs sm:text-sm text-cyan-100/90 font-bold mt-1 max-w-xs mx-auto leading-snug">
          {prize.description}
        </p>

        {/* Stall Promotion Banner */}
        <div className="inline-block mt-2 px-3 py-1 rounded-xl bg-black/40 border border-cyan-400/30 text-[10px] text-cyan-200 font-semibold">
          ⚡ Redeemable only at Softlogic Stall
        </div>
      </div>

      {/* Bottom Section: Claim Code + STAFF REDEEM CTA */}
      <div className="relative z-10 pt-2 space-y-2 border-t border-cyan-500/20">
        {/* Claim Code Box */}
        <div className="flex items-center justify-between bg-black/70 p-2.5 rounded-xl border border-cyan-500/40">
          <div>
            <div className="text-[8px] font-mono tracking-widest text-cyan-300 uppercase">
              CLAIM CODE
            </div>
            <div className="text-base sm:text-lg font-black font-mono tracking-widest text-amber-300">
              {code}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            <button
              id="btn-copy-code"
              type="button"
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-400/40 transition-all cursor-pointer"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-[#00FF66]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* QR Verification for Staff */}
            <button
              id="btn-open-qr-verify"
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenStaffModal();
              }}
              className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-400/40 transition-all cursor-pointer"
              title="Show QR Code for Staff"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Large Red Button: STAFF ONLY: TAP TO REDEEM */}
        <button
          id="btn-staff-redeem"
          type="button"
          onClick={handleStaffRedeemClick}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_#7f1d1d,0_8px_20px_rgba(239,68,68,0.45)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all border border-red-400/50"
        >
          <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
          <span>STAFF ONLY: TAP TO REDEEM</span>
        </button>

        {/* Footnote */}
        <div className="flex items-center justify-between text-[9px] text-gray-400 px-1 font-mono">
          <span>Issued: {timestamp}</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Live Booth Verification
          </span>
        </div>
      </div>
    </div>
  );
};
