import React from 'react';
import { CheckCircle2, Home } from 'lucide-react';

export default function SessionComplete({ onReturnHome }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
        <CheckCircle2 size={36} />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Review Completed!</h2>
        <p className="text-slate-400 max-w-sm mx-auto text-sm">
          All cards in this collection queue have been successfully archived.
        </p>
      </div>
      <button
        onClick={onReturnHome}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition"
      >
        <Home size={14} /> Back to Dashboard
      </button>
    </div>
  );
}