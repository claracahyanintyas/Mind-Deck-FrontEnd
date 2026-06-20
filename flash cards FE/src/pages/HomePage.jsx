import React, { useState, useContext } from 'react'; // 👈 Added useContext here
import { useNavigate, Link } from 'react-router-dom';
import { Users, LogIn, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useContext(AuthContext); // 🚀 Directly grab the real-time session payload
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // 🎯 Clean, reliable session indicator matching your application parameters
  const hasSession = !!user;

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      alert("Please enter a room code!");
      return;
    }

    // 🔒 If no active User or Guest profile is detected, send them to login safely
    if (!hasSession) {
      // 💡 NOTE: In your App.jsx, your route path is '/classroom', NOT '/classroom/vote'!
      // Let's redirect them to '/classroom' so your router matches perfectly.
      navigate(`/login?redirect=/classroom?room=${roomCode.trim().toUpperCase()}`);
      return;
    }

    navigate(`/classroom?room=${roomCode.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
      {/* Welcome Message */}
      <div className="text-center max-w-xl mb-8 space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Start your <span className="text-indigo-600">Flash Cards</span> journey here!
        </h1>
        <p className="text-base text-slate-500">
          Study your digital decks independently, or join a live session broadcasted by your teacher.
        </p>
      </div>

      {/* 🔐 Authentication Status Info Banner */}
      {!hasSession && (
        <div className="w-full max-w-md bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex gap-3 items-start shadow-sm animate-fade-in">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-amber-800">Identity Session Required</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              You must identify yourself before hosting or participating in a live classroom group. 
            </p>
            <div className="flex gap-3 pt-1">
              <Link 
                to="/login" 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
              >
                Sign In / Register
              </Link>
              <span className="text-amber-300 text-xs">|</span>
              <Link 
                to="/login" 
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2"
              >
                Go as Guest
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 🏫 Join Classroom Session Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">Join Live Classroom</h3>
            <p className="text-xs text-slate-400">Enter the 6-digit code provided by your instructor</p>
          </div>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-3">
          <div>
            <input
              type="text"
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="e.g., 6E4CBA"
              className="w-full px-4 py-3 text-center text-xl font-mono uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition active:scale-[0.98]"
          >
            <LogIn size={18} />
            Enter Room
          </button>
        </form>
      </div>
    </div>
  );
}