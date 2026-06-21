import React from 'react';

export default function ProgressBar({ archived, total, percentage }) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-xs font-semibold text-slate-400">
        <span>Leitner Progress Tracker</span>
        <span>{archived} / {total} Cards Archived</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/40">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}