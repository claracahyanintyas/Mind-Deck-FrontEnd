import React from 'react';
import { AlertTriangle, HelpCircle, CheckCircle2, RotateCw, RotateCcw } from 'lucide-react';

export default function ReviewCardWidget({ activeReviewCard, isFlipped, onFlip, onChoice, loading }) {
  return (
    <div className="min-h-[320px] w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative transition-all duration-200">
      
      {/* Box Level Indicator Badge */}
      {activeReviewCard && (
        <span className="absolute top-4 right-4 bg-slate-50 text-slate-400 font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border border-slate-100">
          BOX: {activeReviewCard.box || 1}
        </span>
      )}

      {/* 🃏 Card Content Presentation Layer */}
      <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
        {!isFlipped ? (
          <div className="animate-fade-in w-full my-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 block mb-2">
              Question Prompt
            </span>
            <p className="text-2xl font-semibold text-slate-800 max-w-xs mx-auto leading-snug">
              {activeReviewCard ? activeReviewCard.card.frontContent : "No active card loaded."}
            </p>
          </div>
        ) : (
          <div className="animate-fade-in w-full my-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block mb-2">
              Verified Answer
            </span>
            <p className="text-xl font-medium text-slate-700 max-w-xs mx-auto leading-relaxed">
              {activeReviewCard ? activeReviewCard.card.backContent : "No active card loaded."}
            </p>
          </div>
        )}
      </div>

      {/* 🔄 Primary Toggle Flip Card Action Button */}
      {activeReviewCard && (
        <div className="pb-4 w-full">
          <button
            type="button"
            onClick={() => onFlip(!isFlipped)}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl border text-sm transition shadow-sm active:scale-[0.99] ${
              isFlipped 
                ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' 
                : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100/80'
            }`}
          >
            {isFlipped ? (
              <>
                <RotateCcw size={16} /> Hide Answer (Show Question)
              </>
            ) : (
              <>
                <RotateCw size={16} /> Flip Card to Check Answer
              </>
            )}
          </button>
        </div>
      )}

      {/* 🧠 Core Input Choices (Always Accessible at the Base) */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={() => onChoice('FORGET')}
          disabled={loading || !activeReviewCard}
          className="bg-red-500 hover:bg-red-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium py-3 rounded-xl text-xs transition flex flex-col items-center gap-1 shadow-sm active:scale-[0.97]"
        >
          <AlertTriangle size={14} />
          Forgot
        </button>
        
        <button
          onClick={() => onChoice('UNSURE')}
          disabled={loading || !activeReviewCard}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 font-medium py-3 rounded-xl text-xs transition flex flex-col items-center gap-1 shadow-sm active:scale-[0.97]"
        >
          <HelpCircle size={14} />
          Unsure
        </button>
        
        <button
          onClick={() => onChoice('REMEMBER')}
          disabled={loading || !activeReviewCard}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium py-3 rounded-xl text-xs transition flex flex-col items-center gap-1 shadow-sm active:scale-[0.97]"
        >
          <CheckCircle2 size={14} />
          Got It
        </button>
      </div>

    </div>
  );
}