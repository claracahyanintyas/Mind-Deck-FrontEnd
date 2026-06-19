import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function ClassroomTest() {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const roomCode = "XYZ123"; // Dummy room code

  useEffect(() => {
    // 1. Initialize SockJS and STOMP Client
    const socket = new SockJS('http://localhost:8080/ws-classroom');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket!');
        
        // 2. Subscribe to the specific room topic
        client.subscribe(`/topic/room/${roomCode}`, (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, `${body.sender}: ${body.content}`]);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected');
      }
    });

    client.activate();
    setStompClient(client);

    // Cleanup connection on unmount
    return () => {
      if (client) client.deactivate();
    };
  }, []);

  const sendTestEvent = () => {
    if (stompClient && stompClient.connected) {
      // 3. Publish an action to the destination path
      stompClient.publish({
        destination: `/app/room/${roomCode}/test`,
        body: JSON.stringify({ sender: 'Alex', content: 'Hello World!' })
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Classroom Test (Room: {roomCode})</h2>
      <button onClick={sendTestEvent}>Send Test Message</button>
      <h3>Logs:</h3>
      <ul>
        {messages.map((msg, index) => <li key={index}>{msg}</li>)}
      </ul>
    </div>
  );
}