import React from 'react';
import { ClaimVoucher } from '../types';
import { sound } from '../utils/audio';
import { LiveClock } from './LiveClock';
import { X, CheckCircle2, ShieldCheck, QrCode, Lock, ShieldAlert } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: ClaimVoucher | null;
  onRedeemVoucher: () => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  voucher,
  onRedeemVoucher,
}) => {
  if (!isOpen || !voucher) return null;

  const { prize, code, timestamp, isRedeemed, redeemedAt, visitorName } = voucher;

  const handleRedeem = () => {
    sound.playClick();
    onClose();
    onRedeemVoucher();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#141940] to-[#090C22] border-2 border-cyan-400/50 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,229,255,0.4)] my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="btn-close-staff-modal"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Exhibition Booth Verification</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black italic tracking-wide text-white uppercase">
            Lionmax Reward Validation
          </h3>
          <div className="mt-1 flex justify-center">
            <LiveClock variant="compact" />
          </div>
        </div>

        {/* Verification Card with QR Graphic & Barcode */}
        <div className={`relative p-3.5 rounded-2xl border-2 border-dashed text-center mb-3.5 transition-all ${
          isRedeemed ? 'bg-black/90 border-gray-700' : 'bg-[#090C20] border-cyan-400/40'
        }`}>
          {/* Redeemed Stamp Overlay */}
          {isRedeemed && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-xs rounded-2xl p-3">
              <div className="transform -rotate-6 border-4 border-red-500 bg-black/95 px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)] flex flex-col items-center">
                <CheckCircle2 className="w-7 h-7 text-red-400 mb-1" />
                <span className="text-base sm:text-lg font-black text-red-400 tracking-widest uppercase">
                  OFFER CLAIMED
                </span>
                <span className="text-[10px] text-gray-300 font-mono">
                  {visitorName ? `Attendee: ${visitorName}` : 'Softlogic Stall'} • {redeemedAt || 'VERIFIED'}
                </span>
              </div>
            </div>
          )}

          {/* Reward Summary */}
          <div className="mb-2.5">
            <span 
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block mb-1"
              style={{
                backgroundColor: `${prize.highlightColor}20`,
                borderColor: prize.highlightColor,
                color: prize.highlightColor,
              }}
            >
              {prize.badge}
            </span>
            <div 
              className="text-xl sm:text-2xl font-black italic uppercase tracking-tight"
              style={{ color: prize.highlightColor }}
            >
              {prize.title}
            </div>
            <p className="text-[11px] text-gray-300 font-medium mt-0.5">
              {prize.description}
            </p>
          </div>

          {/* Secure Code Display */}
          <div className="bg-black/60 p-2.5 rounded-xl border border-cyan-500/30 mb-2.5">
            <div className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase">
              VOUCHER VALIDATION ID
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-[0.2em] my-0.5 ${
              isRedeemed ? 'text-gray-400 line-through' : 'text-[#FFD700]'
            }`}>
              {code}
            </div>
            <div className="text-[9px] text-gray-400 font-mono">
              Generated: {timestamp} • Single Use Only
            </div>
          </div>

          {/* Simulated QR Code / Barcode Matrix Graphic */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white text-black max-w-[160px] mx-auto shadow-md">
            <div className="w-28 h-28 flex items-center justify-center p-1 bg-white">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                <rect x="5" y="5" width="28" height="28" fill="none" stroke="black" strokeWidth="4" />
                <rect x="11" y="11" width="16" height="16" />
                <rect x="67" y="5" width="28" height="28" fill="none" stroke="black" strokeWidth="4" />
                <rect x="73" y="11" width="16" height="16" />
                <rect x="5" y="67" width="28" height="28" fill="none" stroke="black" strokeWidth="4" />
                <rect x="11" y="73" width="16" height="16" />
                <rect x="38" y="10" width="8" height="8" />
                <rect x="50" y="10" width="8" height="8" />
                <rect x="38" y="24" width="16" height="8" />
                <rect x="10" y="38" width="8" height="16" />
                <rect x="24" y="38" width="16" height="8" />
                <rect x="42" y="42" width="16" height="16" />
                <rect x="65" y="38" width="8" height="8" />
                <rect x="80" y="38" width="12" height="8" />
                <rect x="65" y="52" width="24" height="8" />
                <rect x="38" y="65" width="8" height="12" />
                <rect x="50" y="75" width="16" height="8" />
                <rect x="70" y="70" width="8" height="16" />
                <rect x="82" y="70" width="8" height="8" />
              </svg>
            </div>
            <span className="text-[8px] font-mono font-bold tracking-widest text-gray-700 mt-0.5">
              SCAN AT BOOTH DESK
            </span>
          </div>
        </div>

        {/* Staff Verification Button */}
        {!isRedeemed ? (
          <button
            id="btn-staff-modal-redeem"
            onClick={handleRedeem}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_#7f1d1d,0_8px_20px_rgba(239,68,68,0.4)] active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer transition-all border border-red-400/50"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>STAFF ONLY: TAP TO REDEEM</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-center text-red-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span>OFFER CLAIMED • RE-USE PREVENTED</span>
          </div>
        )}
      </div>
    </div>
  );
};
