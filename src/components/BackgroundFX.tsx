import React, { useEffect, useRef } from 'react';

interface BackgroundFXProps {
  phase: string;
}

export const BackgroundFX: React.FC<BackgroundFXProps> = ({ phase }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulse: number;
    }

    const colors = ['#00E5FF', '#4A00E0', '#FF9900', '#FFD700', '#00FF66'];
    const particleCount = window.innerWidth < 640 ? 35 : 65;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.4 - Math.random() * 0.8,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render glowing floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Space Energetic Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, #180a42 0%, #0b1033 50%, #040614 100%)'
        }}
      />

      {/* Cyber Grid Lines at bottom */}
      <div 
        className="absolute inset-x-0 bottom-0 h-64 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Ambient Pulsing Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#00E5FF]/15 blur-[90px] animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-[#4A00E0]/25 blur-[100px] animate-pulse" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#FF9900]/10 blur-[90px]" />

      {/* Canvas for floating energetic sparks */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Burst light rays overlay when bursting */}
      {phase === 'bursting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div 
            className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] rounded-full animate-laser-rays opacity-90"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 229, 255, 0.6) 20deg, transparent 40deg, rgba(255, 215, 0, 0.8) 60deg, transparent 90deg, rgba(0, 255, 102, 0.7) 120deg, transparent 150deg, rgba(0, 229, 255, 0.6) 180deg, transparent 210deg, rgba(255, 153, 0, 0.7) 240deg, transparent 270deg, rgba(255, 215, 0, 0.8) 310deg, transparent 360deg)',
              filter: 'blur(10px)',
            }}
          />
        </div>
      )}
    </div>
  );
};
