import React, { useState, useEffect } from 'react';
import { Clock, Radio } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  variant?: 'badge' | 'compact' | 'prominent';
}

export const LiveClock: React.FC<LiveClockProps> = ({ className = '', variant = 'badge' }) => {
  const [timeStr, setTimeStr] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // HH:MM:SS (e.g. 14:05:32)
  });

  const [dateStr, setDateStr] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-ping" />
        <span className="font-bold">LIVE: {timeStr}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-between gap-2 px-3 py-1 rounded-full bg-black/70 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)] text-white font-mono ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-80" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66]" />
        </span>
        <span className="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
          LIVE
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs font-black tracking-widest text-[#FFD700]">
        <Clock className="w-3.5 h-3.5 text-cyan-300" />
        <span>Current Time: {timeStr}</span>
      </div>
    </div>
  );
};
