import DeckHeader from '../components/decks/DeckHeader';
import FlashcardViewer from '../components/decks/FlashcardViewer';
import CardManager from '../components/cards/CardManager';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, GraduationCap } from 'lucide-react';
import DeckService from '../services/DeckService';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import CardService from '../services/CardService';
import ClassroomTeacher from '../components/classroom/ClassroomTeacher'; 
import { ReviewService } from '../services/ReviewService';

export default function DeckPage() {
  const { id } = useParams(); 
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Core data states
  const [deck, setDeck] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDeckData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = (await DeckService.getDeck(id));
        setDeck(response.data);

        const isUser = user?.username === response.data.createdBy?.username;
        setIsCreator(isUser);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDeckData();
  }, [id, user]);

  const handleStartReview = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/review-setup/${id}` } });
      return;
    }

    if (!deck?.cards || deck.cards.length === 0) {
      alert("This collection doesn't have any flashcards to review yet!");
      return;
    }
    
    try {
      const sessionData = await ReviewService.startSession(id);
      navigate(`/review/${sessionData.id}`, {
        state: { initialReviewData: sessionData }
      });
    } catch (err) {
      alert("Failed to start review mode session. Make sure you are signed in.");
    }
  };

  const handleSaveDeckDetails = async (updatedFields) => {
    try {
      const response = await DeckService.updateDeck(id, updatedFields);
      setDeck(response.data); 
    } catch (err) {
      alert(`Error saving deck: ${err.message}`);
    }
  };

  const handleAddCard = async (newCardPayload) => {
    try {
      const response = await DeckService.addCardToDeck(id, newCardPayload);
      setDeck(prev => ({
        ...prev,
        cards: [...prev.cards, response.data]
      }));
    } catch (err) {
      alert(`Error creating card: ${err.message}`);
    }
  };

  const handleUpdateCard = async (cardId, updatedFields) => {
    try {
      const response = await CardService.updateCard(cardId, updatedFields);
      setDeck(prev => ({
        ...prev,
        cards: prev.cards.map(card => card.id === cardId ? response.data : card)
      }));
    } catch (err) {
      alert(`Error updating card: ${err.message}`);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to permanently delete this card?")) return;
    try {
      await CardService.deleteCard(cardId);
      setDeck(prev => ({
        ...prev,
        cards: prev.cards.filter(card => card.id !== cardId)
      }));
    } catch (err) {
      alert(`Error deleting card: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-3" data-cy="deck-page-loading">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Fetching your deck from backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center" data-cy="deck-page-error">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 max-w-md shadow-sm">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-1">Backend Sync Failed</h3>
          <p className="text-sm opacity-90 mb-4">{error}</p>
          <Link to="/decks" className="inline-flex items-center gap-2 text-xs font-semibold bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition">
            <ArrowLeft size={14}/> Back to Decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12" data-cy="deck-page-container">
      <div className="max-w-4xl mx-auto space-y-6"> 
        
        <Link to="/decks" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 font-medium transition" data-cy="back-to-dashboard-link">
          <ArrowLeft size={16} /> Back to My Dashboard
        </Link>

        <DeckHeader 
          deck={deck} 
          isCreator={isCreator} 
          onSaveDeck={handleSaveDeckDetails} 
        />

        <FlashcardViewer cards={deck.cards} />

        {/* Action Controls Block Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClassroomTeacher 
            deckId={id} 
            cards={deck.cards} 
            isAuthenticated={isAuthenticated} 
            user={user} 
          />

          {/* Spaced Repetition Launch Container Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between space-y-4" data-cy="review-panel">
            <div className="space-y-2">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-gray-800">Review</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Study alone using our backend buffer tracking priority index system to test your focus weaknesses optimally.
              </p>
            </div>
            
            <button
              onClick={handleStartReview}
              data-cy="start-review-button"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl shadow-sm transition active:scale-[0.99]"
            >
              🎯 Start Review Session
            </button>
          </div>
        </div>

        {isCreator && (
          <CardManager 
            cards={deck.cards} 
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        )}
      </div>
    </div>
  );
}