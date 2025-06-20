
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, Users, Lock, Plus, MicOff, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

const RoomsScreen = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [inRoom, setInRoom] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Remove foreign key hint that doesn't exist
      const { data, error } = await supabase
        .from('voice_rooms')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!user || !newRoomTitle.trim()) return;

    try {
      const channelId = `room_${Date.now()}`;
      
      const { data, error } = await supabase
        .from('voice_rooms')
        .insert({
          host_id: user.id,
          title: newRoomTitle.trim(),
          agora_channel_id: channelId,
          description: 'Join and have fun!',
          tags: ['General'],
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Room created successfully!');
      setNewRoomTitle('');
      setShowCreateRoom(false);
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
  };

  const joinRoom = async (room: any) => {
    if (!user) return;

    try {
      // Add user to room participants
      const { error } = await supabase
        .from('room_participants')
        .insert({
          room_id: room.id,
          user_id: user.id,
          role: 'listener'
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      // Update room participant count
      await supabase
        .from('voice_rooms')
        .update({ 
          current_participants: (room.current_participants || 0) + 1 
        })
        .eq('id', room.id);

      setCurrentRoom(room);
      setInRoom(true);
      toast.success(`Joined ${room.title}!`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  const leaveRoom = async () => {
    if (!currentRoom || !user) return;

    try {
      await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', currentRoom.id)
        .eq('user_id', user.id);

      // Update room participant count
      await supabase
        .from('voice_rooms')
        .update({ 
          current_participants: Math.max(0, (currentRoom.current_participants || 1) - 1)
        })
        .eq('id', currentRoom.id);

      setCurrentRoom(null);
      setInRoom(false);
      toast.success('Left the room');
      fetchRooms();
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error('Failed to leave room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-400 animate-pulse">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // Room interface when user is inside a room
  if (inRoom && currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
        <div className="max-w-md mx-auto">
          {/* Room Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{currentRoom.title}</h1>
              <p className="text-gray-400">{currentRoom.current_participants || 0} people</p>
            </div>
            <Button
              onClick={leaveRoom}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Leave
            </Button>
          </div>

          {/* Voice Room Interface */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 mb-6">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                  <Mic className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-ping"></div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">You're Live!</h3>
              <p className="text-gray-400 mb-6">Tap the mic to speak</p>
              
              {/* Room Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                >
                  <MicOff className="w-6 h-6 text-red-400" />
                </Button>
                
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Mic className="w-8 h-8 text-white" />
                </Button>
                
                {currentRoom.host_id === user?.id && (
                  <Button
                    size="lg"
                    className="w-16 h-16 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                  >
                    <Settings className="w-6 h-6 text-gray-400" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emoji Reactions */}
          <div className="flex justify-center space-x-4 mb-6">
            {['❤️', '😂', '🔥', '👏', '😮'].map((emoji) => (
              <button
                key={emoji}
                className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-xl hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Voice Rooms</h1>
            <p className="text-gray-400">Join live conversations</p>
          </div>
          <Button
            onClick={() => setShowCreateRoom(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Room</h3>
              <Input
                placeholder="Enter room title..."
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                className="bg-gray-800/50 border-gray-600/50 text-white mb-4 focus:border-purple-500"
              />
              <div className="flex space-x-3">
                <Button 
                  onClick={createRoom} 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Create Room
                </Button>
                <Button 
                  onClick={() => setShowCreateRoom(false)}
                  variant="outline"
                  className="flex-1 border-gray-600/50 text-gray-400 hover:bg-gray-800/50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rooms List */}
        <div className="space-y-4">
          {rooms.map((room) => (
            <Card 
              key={room.id}
              className="bg-black/40 backdrop-blur-xl border-gray-700/50 hover:bg-black/60 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {room.title}
                    </h3>
                    {room.description && (
                      <p className="text-sm text-gray-400 mb-3">
                        {room.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{room.current_participants || 0}</span>
                    {room.coin_entry_cost > 0 && (
                      <>
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">{room.coin_entry_cost}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {room.tags?.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => joinRoom(room)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full px-6"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No Active Rooms</h3>
            <p className="text-gray-400 mb-8">Be the first to create a voice room!</p>
            <Button
              onClick={() => setShowCreateRoom(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsScreen;
