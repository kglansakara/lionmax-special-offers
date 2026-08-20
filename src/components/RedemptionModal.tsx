import React, { useState } from 'react';
import { ClaimVoucher } from '../types';
import { sound } from '../utils/audio';
import { 
  User, 
  Phone, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  FileText
} from 'lucide-react';

interface RedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: ClaimVoucher;
  onConfirmRedeem: (data: {
    visitorName: string;
    visitorPhone?: string;
    notes?: string;
  }) => void;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  isOpen,
  onClose,
  voucher,
  onConfirmRedeem,
}) => {
  const [visitorName, setVisitorName] = useState(voucher.visitorName || '');
  const [visitorPhone, setVisitorPhone] = useState(voucher.visitorPhone || '');
  const [notes, setNotes] = useState(voucher.notes || '');
  const [productDelivered, setProductDelivered] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      setError('Please enter the visitor\'s name to record redemption');
      return;
    }

    if (!productDelivered) {
      setError('Please confirm that the product/sample has been provided');
      return;
    }

    sound.playClick();
    onConfirmRedeem({
      visitorName: visitorName.trim(),
      visitorPhone: visitorPhone.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#161B45] via-[#0E1233] to-[#07091B] border-2 border-red-500/60 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="btn-close-redeem-modal"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-3 border-b border-gray-700/60">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Staff Verification</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black italic tracking-wide text-white uppercase leading-tight">
            Redeem Lionmax Reward
          </h3>
          <div className="text-xs font-bold text-amber-300 mt-0.5">
            Code: <span className="font-mono text-cyan-300 font-black">{voucher.code}</span> • {voucher.prize.title}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
          {/* Visitor Name (Required) */}
          <div>
            <label className="block text-[11px] font-extrabold tracking-wider uppercase text-cyan-200 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Visitor Name <span className="text-red-400">*</span>
              </span>
              <span className="text-[9px] text-gray-400 lowercase font-normal">required for record</span>
            </label>
            <input
              id="input-visitor-name"
              type="text"
              required
              autoFocus
              placeholder="e.g. Kasun Perera / Alex Silva"
              value={visitorName}
              onChange={(e) => {
                setVisitorName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border-2 border-cyan-400/50 focus:border-cyan-300 focus:outline-none text-white text-sm font-semibold placeholder:text-gray-500 shadow-inner"
            />
          </div>

          {/* Visitor Contact Number (Optional) */}
          <div>
            <label className="block text-[11px] font-extrabold tracking-wider uppercase text-cyan-200 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                Mobile / WhatsApp <span className="text-gray-400 text-[10px] font-normal">(Optional)</span>
              </span>
              <span className="text-[9px] text-gray-400 lowercase font-normal">contact number</span>
            </label>
            <input
              id="input-visitor-phone"
              type="tel"
              placeholder="e.g. 077 123 4567"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-gray-700 focus:border-cyan-400 focus:outline-none text-white text-sm font-semibold placeholder:text-gray-500"
            />
          </div>

          {/* Optional Staff Notes */}
          <div>
            <label className="block text-[11px] font-extrabold tracking-wider uppercase text-cyan-200 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Notes <span className="text-gray-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              id="input-visitor-notes"
              type="text"
              placeholder="Optional staff remarks"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-gray-700 focus:border-cyan-400 focus:outline-none text-white text-sm font-semibold placeholder:text-gray-500"
            />
          </div>

          {/* Staff Confirmation Checkbox */}
          <div className="pt-1">
            <label 
              onClick={() => setProductDelivered(!productDelivered)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-emerald-500/40 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={productDelivered}
                onChange={(e) => setProductDelivered(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-emerald-300 leading-tight">
                Staff Confirmed: Product / Prize physically handed to visitor
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500 text-red-300 text-xs font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              id="btn-confirm-redeem-submit"
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_0_#7f1d1d,0_8px_20px_rgba(239,68,68,0.45)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all border border-red-400/50"
            >
              <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
              <span>CONFIRM & RECORD REDEMPTION</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full py-2 text-center text-xs font-bold text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
