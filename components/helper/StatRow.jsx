import React from 'react';

export default function StatRow({ label, value, unit }) {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="text-right">
        <span className="text-sm font-bold text-[#315E26]">
          {value || "--"} 
        </span>
        <span className="text-[10px] text-gray-400 ml-1 font-semibold uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
}