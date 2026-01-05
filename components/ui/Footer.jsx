import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#f0fdf4] text-slate-500 py-3 px-6 shrink-0 border-t border-green-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[2000]">
      <div className="max-w-7xl pb-1 mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs tracking-wide font-medium">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#315E26] opacity-40"></div>
          <p className="opacity-80 uppercase">© {currentYear} Laguna Lake Development Authority</p>
        </div>
        <p className="mt-1 md:mt-0 opacity-60 italic">Online since Jan 2026</p>
      </div>
    </footer>
  );
}