import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string, roomId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    // We expect the token to be read securely (e.g. from localStorage) in consumer or passed inside url
    const token = localStorage.getItem('token');
    socketRef.current = io(url, { 
      transports: ['websocket'],
      auth: { token }
    });

    // Join room if provided
    if (roomId) {
      socketRef.current.emit('join-room', roomId);
    }

    // Listen for real-time notifications
    socketRef.current.on('notification', (data) => {
      console.log('Real-time notification received:', data);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, roomId]);

  return socketRef.current;
};
