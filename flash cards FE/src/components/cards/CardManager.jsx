import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Check, X } from 'lucide-react';

export default function CardManager({ cards = [], onAddCard, onUpdateCard, onDeleteCard }) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!frontContent.trim() || !backContent.trim()) return;

    // Hardcodes 'TEXT' content types based on your ContentType Java enum concept
    onAddCard({
      frontContent,
      frontContentType: 'PLAIN_TEXT',
      backContent,
      backContentType: 'PLAIN_TEXT'
    });
    
    setFrontContent('');
    setBackContent('');
    setIsAddingCard(false);
  };

  const startInlineEdit = (card) => {
    setEditingId(card.id);
    setEditFront(card.frontContent);
    setEditBack(card.backContent);
  };

const handleSaveEdit = (id) => {
  onUpdateCard(id, {
    frontContent: editFront,
    frontContentType: 'PLAIN_TEXT',
    backContent: editBack,
    backContentType: 'PLAIN_TEXT'
  });
};
  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manage Cards</h2>
        {!isAddingCard && (
          <button 
            onClick={() => setIsAddingCard(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={16} /> Add New Card
          </button>
        )}
      </div>

      {isAddingCard && (
        <form onSubmit={handleCreateSubmit} className="bg-white border border-indigo-100 rounded-xl p-6 mb-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-indigo-900">Create New Flashcard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Front Content</label>
              <textarea 
                value={frontContent} 
                onChange={(e) => setFrontContent(e.target.value)}
                placeholder="Question text..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Back Content</label>
              <textarea 
                value={backContent} 
                onChange={(e) => setBackContent(e.target.value)}
                placeholder="Answer text..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAddingCard(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add Card</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            {editingId === card.id ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={editFront} onChange={(e) => setEditFront(e.target.value)} className="border border-gray-300 rounded p-2 text-sm w-full focus:ring-2 focus:ring-indigo-500" />
                <div className="flex gap-2 w-full">
                  <input type="text" value={editBack} onChange={(e) => setEditBack(e.target.value)} className="border border-gray-300 rounded p-2 text-sm flex-1 focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => handleSaveEdit(card.id)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={18} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"><X size={18} /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold text-xs text-gray-400 block uppercase">Front Content</span>
                    <p className="text-gray-900">{card.frontContent}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-gray-400 block uppercase">Back Content</span>
                    <p className="text-gray-700">{card.backContent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                  <button onClick={() => startInlineEdit(card)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition"><Edit3 size={16} /></button>
                  <button onClick={() => onDeleteCard(card.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-50 transition"><Trash2 size={16} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}