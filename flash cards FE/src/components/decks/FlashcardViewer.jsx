import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

export default function FlashcardViewer({ cards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    if (currentIndex >= cards.length) {
      setCurrentIndex(Math.max(0, cards.length - 1));
    }
  }, [cards, currentIndex]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
        This deck has no cards yet.
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center mb-12">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full max-w-xl h-80 bg-white rounded-2xl shadow-md border border-gray-100 cursor-pointer p-8 flex flex-col justify-between relative transition-all duration-300 hover:shadow-lg transform active:scale-[0.99]"
      >
        <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 flex justify-between items-center">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="text-indigo-500 flex items-center gap-1">
            <RotateCw size={12} /> {isFlipped ? "Answer" : "Question"}
          </span>
        </div>

        <div className="text-center my-auto px-4">
          <p className="text-xl md:text-2xl font-medium leading-relaxed">
            {/* Using backend record property keys */}
            {isFlipped ? currentCard.backContent : currentCard.frontContent}
          </p>
        </div>

        <div className="text-xs text-center text-gray-400">
          Click anywhere on the card to flip
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)} 
          className="p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 shadow-sm transition"
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-medium hover:bg-indigo-100 transition text-sm"
        >
          Flip Card
        </button>
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % cards.length)} 
          className="p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 shadow-sm transition"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}