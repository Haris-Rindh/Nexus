import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

interface JitsiVideoCallProps {
  roomName: string;
  userName: string;
}

export const JitsiVideoCall: React.FC<JitsiVideoCallProps> = ({ roomName, userName }) => {
  return (
    <div className="w-full h-full bg-black">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        userInfo={{
          displayName: userName,
          email: 'user@example.com'
        }}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableModeratorIndicator: true,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
        onApiReady={(externalApi: any) => {
          externalApi.addListener('videoConferenceJoined', () => {
            console.log(`User ${userName} successfully joined the room ${roomName}`);
          });
        }}
      />
    </div>
  );
};
