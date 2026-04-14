import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { JitsiVideoCall } from '../../components/meetings/JitsiVideoCall';
import { useSocket } from '../../hooks/useSocket';

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // Use the new custom hook to connect to Socket and emit 'join-room'
  useSocket(apiUrl, roomId);

  if (!roomId) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-black relative">
      <div className="absolute top-4 left-4 z-[999]">
        <button
          onClick={() => navigate('/meetings')}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition shadow-lg backdrop-blur"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Replaced ZegoCloud directly with the requested Jitsi Integration */}
      <JitsiVideoCall 
        roomName={roomId} 
        userName={currentUser?.name || `User-${Math.floor(Math.random() * 1000)}`} 
      />
    </div>
  );
};

export default VideoCallPage;
