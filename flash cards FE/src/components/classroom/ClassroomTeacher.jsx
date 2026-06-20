import React, { useEffect, useState, useContext } from 'react'; // 👈 Added useContext here
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ClassroomService } from '../../services/ClassroomService';
import { Presentation, ChevronRight, AlertCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // 👈 Added AuthContext import

export default function ClassroomTeacher({ deckId, cards = [] }) { // 🛡️ Cleaned up unused props
  const { user } = useContext(AuthContext); // 🚀 Safely pull the active user/guest state from the core engine context!

  const [roomCode, setRoomCode] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1); 
  const [sessionData, setSessionData] = useState(null);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  
  const realCardIds = cards.map(card => card.id);

  const handleStartSession = async () => {
    // Check if the current reader session profile is initialized
    if (!user) {
      setShowAuthRequired(true);
      return;
    }

    if (realCardIds.length === 0) {
      alert("Cannot start a live session with an empty deck!");
      return;
    }
    try {
      const data = await ClassroomService.startSession(deckId); 
      setRoomCode(data.roomCode);
      setSessionData(data);
      connectWebSocket(data.roomCode);
    } catch (error) {
      alert("Could not start live session.");
    }
  };

  const connectWebSocket = (code) => {
    const socket = new SockJS('http://localhost:8080/ws-classroom');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/room/${code}`, (message) => {
          const parsedData = JSON.parse(message.body);
          setSessionData(parsedData);
          
          if (parsedData.currentCardId && currentCardIndex === -1) {
            setCurrentCardIndex(0);
          }
        });
      }
    });
    client.activate();
    setStompClient(client);
  };

  const startPresenting = () => {
    if (stompClient?.connected && realCardIds.length > 0) {
      setCurrentCardIndex(0);
      stompClient.publish({
        destination: `/app/room/${roomCode}/next-card`,
        body: JSON.stringify({ cardId: realCardIds[0] })
      });
    }
  };

  const flipCurrentCard = () => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/app/room/${roomCode}/flip-card`
      });
    }
  };

  useEffect(() => {
    return () => { if (stompClient) stompClient.deactivate(); };
  }, [stompClient]);

  const pushNextCard = () => {
    if (stompClient?.connected) {
      const nextIndex = currentCardIndex + 1;
      if (nextIndex < realCardIds.length) {
        setCurrentCardIndex(nextIndex);
        stompClient.publish({
          destination: `/app/room/${roomCode}/next-card`,
          body: JSON.stringify({ cardId: realCardIds[nextIndex] })
        });
      } else {
        alert("End of deck reached!");
      }
    }
  };

  const totalVotesCast = sessionData?.totalVotesCast || 0;
  const breakdown = sessionData?.currentVoteBreakdown || { FORGET: 0, UNSURE: 0, REMEMBER: 0 };

  if (showAuthRequired) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-lg text-gray-800">Authentication Needed</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          You need to be signed in as a registered user or a guest to host a live room session.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link to="/login" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition text-sm">
            Sign In / Register
          </Link>
          <Link to="/login" className="bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-200 transition text-sm">
            Continue as Guest
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Presentation className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-lg text-gray-800">Live Classroom Session</h3>
      </div>

      {!roomCode ? (
        <button
          onClick={handleStartSession}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          🚀 Broadcast Live Session
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-indigo-50/70 p-4 rounded-xl text-center border border-indigo-100">
            <span className="text-xs uppercase font-bold text-indigo-500 tracking-wider">Join Room Code</span>
            <div className="text-3xl font-mono font-black text-indigo-900 tracking-widest">{roomCode}</div>
          </div>

          {currentCardIndex === -1 ? (
            <div className="space-y-4 pt-2">
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-600">Lobby Open</p>
                <p className="text-xs text-slate-400 max-w-[240px] mx-auto mt-1">
                  Students can now type in the code. Click below when you are ready to show the first flashcard.
                </p>
              </div>
              <button
                onClick={startPresenting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
              >
                <Play size={16} fill="currentColor" />
                Start Presenting Deck
              </button>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2 text-gray-600 border border-slate-100">
                <div className="flex justify-between">
                  <span>Card Progression:</span>
                  <span className="font-semibold text-slate-800">{currentCardIndex + 1} / {realCardIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Active Votes:</span>
                  <span className="font-semibold text-indigo-600">{totalVotesCast}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div className="bg-red-50 p-2.5 rounded-lg text-red-700 border border-red-100">Forgot: {breakdown.FORGET || 0}</div>
                <div className="bg-yellow-50 p-2.5 rounded-lg text-yellow-700 border border-yellow-100">Not Sure: {breakdown.UNSURE || 0}</div>
                <div className="bg-green-50 p-2.5 rounded-lg text-green-700 border border-green-100">Got It: {breakdown.REMEMBER || 0}</div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={flipCurrentCard}
                  disabled={sessionData?.isCardFlipped}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-100 disabled:text-indigo-400 disabled:cursor-not-allowed transition flex justify-center items-center gap-2 shadow-sm"
                >
                  {sessionData?.isCardFlipped ? "✓ Answer Revealed" : "👁️ Reveal Answer"}
                </button>

                <button
                  onClick={pushNextCard}
                  disabled={currentCardIndex + 1 >= realCardIds.length}
                  className="w-full bg-slate-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition flex justify-center items-center gap-2"
                >
                  Next Card <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}