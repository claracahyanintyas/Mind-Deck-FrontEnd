import React, { useState } from 'react';
import { Edit3, Check, Lock, Globe } from 'lucide-react';

export default function DeckHeader({ deck, isCreator, onSaveDeck }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description);
  const [isPrivate, setIsPrivate] = useState(deck.isPrivate);

  const handleSave = () => {
    // Passes exact payload structure back to your API update handler
    onSaveDeck({ name, description, isPrivate });
    setIsEditing(false);
  };

  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      {isEditing ? (
        <div className="space-y-3">
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="text-3xl font-bold bg-white border border-gray-300 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Deck Name"
          />
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="text-gray-600 bg-white border border-gray-300 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
          />
          <div className="flex items-center gap-2 py-1">
            <input 
              type="checkbox" 
              id="isPrivate" 
              checked={isPrivate} 
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700 font-medium select-none flex items-center gap-1">
              {isPrivate ? <Lock size={14}/> : <Globe size={14}/>} Private Deck
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm hover:bg-indigo-700 flex items-center gap-1">
              <Check size={16}/> Save Info
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{deck.name}</h1>
              <span className={`p-1 rounded ${deck.isPrivate ? 'text-amber-600' : 'text-emerald-600'}`} title={deck.isPrivate ? 'Private' : 'Public'}>
                {deck.isPrivate ? <Lock size={18} /> : <Globe size={18} />}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{deck.description || "No description provided."}</p>
            <span className="inline-block mt-3 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {deck.cards?.length || 0} Cards
            </span>
          </div>
          {isCreator && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition"
              title="Edit Deck Details"
            >
              <Edit3 size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}