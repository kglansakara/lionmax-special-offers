import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ onComplete, isCompleted }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const checkThrottleRef = useRef<number>(0);

  // Initialize Canvas Gold Coating
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // 1. Rich Metallic Gold Gradient
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#BF953F');
    grad.addColorStop(0.2, '#FCF6BA');
    grad.addColorStop(0.4, '#B38728');
    grad.addColorStop(0.6, '#FBF5B7');
    grad.addColorStop(0.8, '#AA771C');
    grad.addColorStop(1, '#8A5D11');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 2. Holographic Micro-Pattern & Cyber Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    for (let x = -rect.height; x < rect.width + rect.height; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height, rect.height);
      ctx.stroke();
    }

    // Concentric cyber circles
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height / 2, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height / 2, 85, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Gold Metallic Border Stamp
    ctx.strokeStyle = '#5E4108';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(9, 9, rect.width - 18, rect.height - 18);

    // 4. Scratch Text and Icons
    ctx.fillStyle = '#422800';
    ctx.font = '900 18px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;

    ctx.fillText('⚡ LIONMAX GOLD PASS ⚡', rect.width / 2, rect.height / 2 - 32);

    // Center pill badge
    ctx.fillStyle = '#301B00';
    ctx.font = '800 14px "Montserrat", sans-serif';
    ctx.shadowColor = 'transparent';
    ctx.fillText('🪙 SCRATCH TO REVEAL 🪙', rect.width / 2, rect.height / 2 + 10);

    ctx.fillStyle = '#6E4500';
    ctx.font = '600 11px "Montserrat", sans-serif';
    ctx.fillText('USE COIN OR FINGER', rect.width / 2, rect.height / 2 + 38);

    ctx.restore();
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isCompleted && !isFadingOut) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isCompleted, isFadingOut]);

  // Calculate percentage of transparent pixels
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isCompleted || isFadingOut) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Sample every 12th pixel for extreme 60fps performance
    const step = 12;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let transparentCount = 0;
    let totalSamples = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        totalSamples++;
        if (data[index + 3] < 128) {
          transparentCount++;
        }
      }
    }

    const percent = Math.round((transparentCount / totalSamples) * 100);
    setScratchPercent(percent);

    // Trigger auto-complete when >= 50% cleared
    if (percent >= 50) {
      triggerAutoComplete();
    }
  }, [isCompleted, isFadingOut]);

  const triggerAutoComplete = () => {
    if (isFadingOut || isCompleted) return;
    setIsFadingOut(true);
    setScratchPercent(100);

    // Victory audio + Confetti explosion
    sound.playVictory();
    
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00FF66', '#FFD700', '#00E5FF', '#FF9900', '#FFFFFF']
      });
    } catch {
      // Fallback if canvas-confetti is not loaded
    }

    setTimeout(() => {
      onComplete();
    }, 550);
  };

  // Erase stroke logic using destination-out
  const eraseStroke = (x: number, y: number, isMove = false) => {
    const canvas = canvasRef.current;
    if (!canvas || isCompleted || isFadingOut) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const clientX = (x - rect.left) * dpr;
    const clientY = (y - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    const brushRadius = 24 * dpr;

    if (isMove && lastPointRef.current) {
      // Connect line between points for smooth uninterrupted scratching
      ctx.lineWidth = brushRadius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(clientX, clientY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(clientX, clientY, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    lastPointRef.current = { x: clientX, y: clientY };

    // Play scratch audio
    sound.playScratch();

    // Throttled percentage check
    const now = performance.now();
    if (now - checkThrottleRef.current > 150) {
      checkThrottleRef.current = now;
      checkScratchPercentage();
    }
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCompleted || isFadingOut) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    eraseStroke(e.clientX, e.clientY, false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isCompleted || isFadingOut) return;
    eraseStroke(e.clientX, e.clientY, true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 overflow-hidden rounded-2xl">
      {/* Scratch Canvas */}
      <canvas
        ref={canvasRef}
        id="scratch-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full cursor-grab active:cursor-grabbing touch-none select-none transition-opacity duration-500 ${
          isFadingOut || isCompleted ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ touchAction: 'none' }}
      />

      {/* Real-time Scratch Progress Bar Overlay */}
      {!isCompleted && !isFadingOut && (
        <div className="absolute bottom-2 inset-x-3 z-30 flex items-center justify-between px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-200">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FFD700] animate-spin" style={{ animationDuration: '4s' }} />
            <span>Scratch: {scratchPercent}% / 50%</span>
          </div>

          <div className="w-24 h-2 rounded-full bg-black/60 overflow-hidden border border-amber-500/30">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-[#00FF66] transition-all duration-150"
              style={{ width: `${Math.min(100, scratchPercent * 2)}%` }}
            />
          </div>

          {/* Quick Auto-Scratch Button */}
          <button
            id="btn-auto-scratch"
            onClick={(e) => {
              e.stopPropagation();
              triggerAutoComplete();
            }}
            className="flex items-center gap-1 text-[9px] text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            title="Auto scratch remaining area"
          >
            <Wand2 className="w-2.5 h-2.5" />
            <span>Auto</span>
          </button>
        </div>
      )}
    </div>
  );
};
