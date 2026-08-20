import React, { useState } from 'react';

interface LionmaxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const LionmaxLogo: React.FC<LionmaxLogoProps> = ({ className = '', size = 'md' }) => {
  const [srcIndex, setSrcIndex] = useState(0);

  // List of possible PNG image sources in /public
  const imageSources = [
    '/lionmax-logo.png',
    '/lionmax logo pg-01.png',
    '/logo.png',
    '/lionmax-logo.svg',
  ];

  const sizeStyles = {
    sm: 'w-[180px] sm:w-[210px]',
    md: 'w-[240px] sm:w-[280px]',
    lg: 'w-[300px] sm:w-[360px]',
    hero: 'w-[340px] sm:w-[420px]',
  };

  const handleImageError = () => {
    if (srcIndex < imageSources.length - 1) {
      setSrcIndex(srcIndex + 1);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Raw PNG Logo with drop-shadow only */}
      <img
        src={imageSources[srcIndex]}
        alt="Lionmax Logo"
        className={`${sizeStyles[size]} h-auto max-w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]`}
        draggable={false}
        referrerPolicy="no-referrer"
        onError={handleImageError}
      />
    </div>
  );
};
