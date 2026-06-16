import DeckHeader from '../components/decks/DeckHeader';
import FlashcardViewer from '../components/decks/FlashcardViewer';
import CardManager from '../components/cards/CardManager';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import DeckService from '../services/DeckService';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import CardService from '../services/CardService';

export default function DeckPage() {
  const { id } = useParams(); 
  const { user, isAuthenticated } = useContext(AuthContext);

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
        console.log(response);
        setDeck(response.data);


      const isUser =
        user?.username === response.data.createdBy?.username;
        setIsCreator(isUser);
        console.log(isUser)

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDeckData();
  }, [id]);

  // 2. PUT: UPDATE DECK DETAILS (Maps to DeckPublicData)
  const handleSaveDeckDetails = async (updatedFields) => {
    try {
      const response = await DeckService.updateDeck(id, updatedFields);
      
      const updatedDeck = response.data;
      setDeck(updatedDeck); // Sync local state with fresh server data
    } catch (err) {
      alert(`Error saving deck: ${err.message}`);
    }
  };

  // 3. POST: CREATE A NEW CARD (Maps to CardPublicData)
  const handleAddCard = async (newCardPayload) => {
    try {
      const response = await DeckService.addCardToDeck(id, newCardPayload);

      const savedCard = response.data; // Backend returns full CardPublicData with generated Long id
      
      setDeck(prev => ({
        ...prev,
        cards: [...prev.cards, savedCard]
      }));
    } catch (err) {
      alert(`Error creating card: ${err.message}`);
    }
  };

  const handleUpdateCard = async (cardId, updatedFields) => {
    console.log("Updating card", cardId, updatedFields);

    try {
      const response = await CardService.updateCard(
        cardId,
        updatedFields
      );

      console.log("Response:", response);
      console.log("Response data:", response.data);

      const updatedCard = response.data;

      setDeck(prev => ({
        ...prev,
        cards: prev.cards.map(card =>
          card.id === cardId ? updatedCard : card
        )
      }));
    } catch (err) {
      console.error(err);
      alert(`Error updating card: ${err.message}`);
    }
  };
  // 5. DELETE: REMOVE A CARD
  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to permanently delete this card?")) return;

    try {
      const response = await CardService.deleteCard(cardId);

      setDeck(prev => ({
        ...prev,
        cards: prev.cards.filter(card => card.id !== cardId)
      }));
    } catch (err) {
      alert(`Error deleting card: ${err.message}`);
    }
  };

  // --- RENDERING STATES ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Fetching your deck from backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
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
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Action */}
        <Link to="/decks" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 font-medium mb-6 transition">
          <ArrowLeft size={16} /> Back to My Dashboard
        </Link>

        {/* Modular Child Components using real data states */}
        <DeckHeader 
          deck={deck} 
          isCreator={isCreator} 
          onSaveDeck={handleSaveDeckDetails} 
        />

        <FlashcardViewer cards={deck.cards} />

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