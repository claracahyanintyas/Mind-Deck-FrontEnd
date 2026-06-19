import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export function useClassroomSocket(roomCode) {
  const [sessionData, setSessionData] = useState({
    currentCardId: null,
    isCardFlipped: false,
    deckId: null, 
    totalConnectedStudents: 0, 
    totalVotesCast: 0,         
    currentVoteTally: { FORGET: 0, UNSURE: 0, REMEMBER: 0 }
  });
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomCode) return;

    const socket = new SockJS('http://localhost:8080/ws-classroom');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log(`Connected to room streaming channel: ${roomCode}`);
        setIsConnected(true);

        client.subscribe(`/topic/room/${roomCode}`, (message) => {
          const updatedSession = JSON.parse(message.body);

          setSessionData({
            currentCardId: updatedSession.currentCardId,
            isCardFlipped: updatedSession.isCardFlipped || false,
            deckId: updatedSession.deckId,
            totalConnectedStudents: updatedSession.totalConnectedStudents || 0, 
            totalVotesCast: updatedSession.totalVotesCast || 0,                
            currentVoteTally: updatedSession.currentVoteBreakdown 
              ? { ...updatedSession.currentVoteBreakdown } 
              : { FORGET: 0, UNSURE: 0, REMEMBER: 0 }
          });
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      }
    });

    client.activate();
    setStompClient(client);

    return () => { if (client) client.deactivate(); };
  }, [roomCode]);

  const sendMessage = (destination, payload) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({ destination, body: JSON.stringify(payload) });
    }
  };

  return { sessionData, isConnected, sendMessage };
}