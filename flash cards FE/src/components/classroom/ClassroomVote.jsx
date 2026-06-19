import React, { useState, useEffect } from 'react';
import { useClassroomSocket } from '../../hooks/useClassroomSocket';
import DeckService from '../../services/DeckService';

export default function ClassroomVote() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get('room') || "XYZ123";

const { sessionData, isConnected, sendMessage } = useClassroomSocket(roomCode);
  
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    async function fetchDeckCards() {
      // Once deckId maps correctly via the updated DTO, this fetch payload triggers flawlessly
      if (sessionData?.deckId) {
        try {
          setLoadingCards(true);
          const response = await DeckService.getDeck(sessionData.deckId);
          setCards(response.data.cards || []);
        } catch (err) {
          console.error("Failed to load cards for this live session:", err);
        } finally {
          setLoadingCards(false);
        }
      }
    }
    fetchDeckCards();
  }, [sessionData?.deckId]);

  const castVote = (choice) => {
    sendMessage(`/app/room/${roomCode}/vote`, { choice });
  };

// 🔍 Check your card arrays
const activeCard = cards.find(card => card.id === sessionData.currentCardId);

// Inside ClassroomVote.jsx...


const breakdown = sessionData.currentVoteTally || { FORGET: 0, UNSURE: 0, REMEMBER: 0 };
const forgetCount = breakdown.FORGET ?? 0;
const unsureCount = breakdown.UNSURE ?? 0;
const rememberCount = breakdown.REMEMBER ?? 0;

const totalConnectedStudents = sessionData.totalConnectedStudents || 0; // 👈 Updated naming
const totalVotesCount = sessionData.totalVotesCast || 0;                // 👈 Updated naming
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10 border border-gray-100">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Room: <span className="font-mono text-indigo-600">{roomCode}</span>
        </h2>
        <div className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-4 text-center min-h-[140px] flex flex-col justify-center items-center shadow-inner">
        {sessionData.currentCardId ? (
          <>
            <span className="text-xs uppercase tracking-wider text-indigo-500 font-bold mb-2">
              {sessionData.isCardFlipped ? "🔴 Card Back (Answer)" : "🔵 Card Front (Question)"}
            </span>
            <p className="text-xl font-medium text-slate-800">
              {loadingCards 
                ? "Syncing card text..." 
                : sessionData.isCardFlipped
                  ? (activeCard?.backContent || "No answer text available") // Matches CardPublicData
                  : (activeCard?.frontContent || "Text content not found in deck")}
            </p>
          </>
        ) : (
          <p className="text-gray-400 italic font-medium animate-pulse">
            Waiting for the teacher to present a card...
          </p>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">
        Active Students in Room: <span className="text-slate-600 font-semibold">{totalConnectedStudents}</span>
      </p>
      
<div className="flex justify-between gap-2 my-4">
  <button 
    onClick={() => castVote('FORGET')} 
    disabled={!sessionData.currentCardId}
    className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition flex-1 text-sm disabled:opacity-40"
  >
    Forgot ({forgetCount})
  </button>
  
  <button 
    onClick={() => castVote('UNSURE')} 
    disabled={!sessionData.currentCardId}
    className="bg-yellow-500 text-slate-900 px-4 py-2.5 rounded-lg font-semibold hover:bg-yellow-600 transition flex-1 text-sm disabled:opacity-40"
  >
    Not Sure ({unsureCount})
  </button>
  
  <button 
    onClick={() => castVote('REMEMBER')} 
    disabled={!sessionData.currentCardId}
    className="bg-green-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition flex-1 text-sm disabled:opacity-40"
  >
    Got It ({rememberCount})
  </button>
</div>
      <div className="pt-2 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 font-medium">
          Total Round Votes Cast: <span className="text-indigo-600 font-bold">{totalVotesCount}</span>
        </p>
      </div>
    </div>
  );
}