
import { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AgoraVoiceRoomProps {
  channelName: string;
  token?: string;
  onLeave: () => void;
}

const AgoraVoiceRoom = ({ channelName, token, onLeave }: AgoraVoiceRoomProps) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);

  // Use the correct Agora App ID
  const APP_ID = '847d6ec057f344aa9feee65779df4986';

  useEffect(() => {
    const initAgora = async () => {
      try {
        // Create Agora client
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);

        // Set up event listeners
        agoraClient.on('user-published', async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          
          if (mediaType === 'audio') {
            user.audioTrack?.play();
            setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
          }
        });

        agoraClient.on('user-unpublished', (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        agoraClient.on('user-left', (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        // Join channel
        await agoraClient.join(APP_ID, channelName, token || null, null);
        setIsJoined(true);

        // Create and publish local audio track
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);
        await agoraClient.publish([audioTrack]);

        toast.success('Joined voice room successfully!');
      } catch (error) {
        console.error('Error initializing Agora:', error);
        toast.error('Failed to join voice room');
      }
    };

    initAgora();

    return () => {
      cleanup();
    };
  }, [channelName, token]);

  const cleanup = async () => {
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    if (client) {
      await client.leave();
    }
  };

  const toggleMute = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setMuted(!isMuted);
      setIsMuted(!isMuted);
      toast.success(isMuted ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  const leaveRoom = async () => {
    await cleanup();
    onLeave();
    toast.success('Left voice room');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Room Status */}
        <div className="text-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Mic className="w-12 h-12 text-white" />
            </div>
            {isJoined && (
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-ping"></div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">{channelName}</h2>
          <p className="text-gray-400">
            {isJoined ? `${remoteUsers.length + 1} people in room` : 'Connecting...'}
          </p>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Local user */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
              isMuted ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/20 border-green-500/50'
            } border-2`}>
              <span className="text-sm">You</span>
            </div>
            <p className="text-xs text-gray-400">
              {isMuted ? 'Muted' : 'Speaking'}
            </p>
          </div>

          {/* Remote users */}
          {remoteUsers.map((user) => (
            <div key={user.uid} className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 border-blue-500/50 border-2 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <p className="text-xs text-gray-400">User {user.uid}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-6">
          <Button
            onClick={toggleMute}
            size="lg"
            className={`w-16 h-16 rounded-full ${
              isMuted 
                ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400'
                : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          <Button
            onClick={leaveRoom}
            size="lg"
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Tap the microphone to mute/unmute
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgoraVoiceRoom;
