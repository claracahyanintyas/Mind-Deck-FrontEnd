import { useEffect, useState } from 'react';

export function useClassroomSession(roomCode, deckId) {
  const [cards, setCards] = useState([]);
  const [currentCardId, setCurrentCardId] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  // 1. Prefetch the deck content via HTTP when entering the room
  useEffect(() => {
    fetch(`/api/decks/${deckId}/cards`)
      .then(res => res.json())
      .then(data => setCards(data));
  }, [deckId]);

  // 2. Listen to the WebSocket for real-time navigation
  useEffect(() => {
    if (!stompClient) return;

    const subscription = stompClient.subscribe(`/topic/room/${roomCode}`, (message) => {
      const data = JSON.parse(message.body);
      
      if (data.actionType === "CARD_CHANGED") {
        setCurrentCardId(data.currentCardId);
      }
    });

    return () => subscription.unsubscribe();
  }, [stompClient, roomCode]);

  // 3. Simple helper to find the active card data locally
  const activeCard = cards.find(card => card.id === currentCardId);

  return { activeCard, currentCardId };
}