import React from 'react'
import DeckService from '../services/DeckService';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DeckCard from '../components/decks/DeckCard';

function DecksPage() {
    const [loading, setLoading] = useState(true);
    const [decks, setDecks] = useState([]);

useEffect(() => {
  DeckService.getAllDecks()
    .then(res =>
        {console.log(res.data); 
            setDecks(res.data);})
    .catch(error => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
        <div>
            <p className='text-2xl m-2'>Find public decks here!</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
            {decks.length > 0 ? (
            decks.map(deck => (
                <DeckCard key={deck.id} deck={deck} />
            ))
            ) : (
            <p>No decks found</p>
            )}
       </div>
    </div>
  )
}

export default DecksPage