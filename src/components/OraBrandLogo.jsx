import React from 'react';

export function OraBrandLogo({ variant = 'header', onDark = false, className = '' }) {
  if (variant === 'full') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-sm ${
          onDark ? 'bg-white/95 px-5 py-3 shadow-lg' : ''
        } ${className}`}
      >
        <img
          src="/logo.png"
          alt="ORA TRAVEL — Descubre. Viaja. Vive."
          className="h-24 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 select-none transition-all ${
        onDark ? 'bg-white/95 px-3 py-1.5 rounded-sm shadow-md' : ''
      } ${className}`}
    >
      <img
        src="/favicon.png"
        alt="ORA TRAVEL Emblem"
        className="h-10 w-10 object-contain shrink-0"
      />
      <div className="flex flex-col leading-none">
        <div className="font-serif text-lg sm:text-xl tracking-[0.12em] font-bold">
          <span className="text-[#D2A058]">ORA</span>
          <span className="text-[#102355]">TRAVEL</span>
        </div>
        <span className="text-[8.5px] tracking-[0.26em] uppercase text-[#B88346] font-semibold mt-0.5">
          Descubre. Viaja. Vive.
        </span>
      </div>
    </div>
  );
}
