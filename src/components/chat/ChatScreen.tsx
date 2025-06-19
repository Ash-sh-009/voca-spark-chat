
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ChatScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(name, profile_picture_url),
          user2:profiles!matches_user2_id_fkey(name, profile_picture_url)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('chat_unlocked', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-white mb-6">Your Vibes</h1>
        
        <div className="space-y-4">
          {matches.map((match) => {
            const otherUser = match.user1_id === user?.id ? match.user2 : match.user1;
            
            return (
              <Card 
                key={match.id}
                className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {otherUser?.name || 'Anonymous'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {match.match_type === 'voice' && '🎙️ Voice Match'}
                        {match.match_type === 'video' && '📹 Video Match'}
                        {match.match_type === 'text' && '💬 Text Chat'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-pink-400" />
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {matches.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Vibes Yet</h3>
            <p className="text-gray-500">Start matching to find your vibes!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
