
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, Users, Lock, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

const RoomsScreen = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('voice_rooms')
        .select('*, profiles!voice_rooms_host_id_fkey(name)')
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
      
      const { error } = await supabase
        .from('voice_rooms')
        .insert({
          host_id: user.id,
          title: newRoomTitle.trim(),
          agora_channel_id: channelId,
          description: 'Join and have fun!',
          tags: ['General']
        });

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
      // Check if user has enough coins for entry
      if (room.coin_entry_cost > 0) {
        // Implementation for coin check would go here
      }

      const { error } = await supabase
        .from('room_participants')
        .insert({
          room_id: room.id,
          user_id: user.id,
          role: 'listener'
        });

      if (error) throw error;

      toast.success(`Joined ${room.title}!`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Voice Rooms</h1>
          <Button
            onClick={() => setShowCreateRoom(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Create New Room</h3>
              <Input
                placeholder="Room title..."
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white mb-4"
              />
              <div className="flex space-x-2">
                <Button onClick={createRoom} className="flex-1">
                  Create Room
                </Button>
                <Button 
                  onClick={() => setShowCreateRoom(false)}
                  variant="outline"
                  className="flex-1"
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
              className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {room.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Host: {room.profiles?.name || 'Anonymous'}
                    </p>
                    {room.description && (
                      <p className="text-sm text-gray-300 mb-2">
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
                        className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => joinRoom(room)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
          <div className="text-center py-12">
            <Mic className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Rooms</h3>
            <p className="text-gray-500 mb-4">Be the first to create a voice room!</p>
            <Button
              onClick={() => setShowCreateRoom(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Create Room
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsScreen;
