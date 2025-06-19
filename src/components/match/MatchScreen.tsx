
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Video, MessageCircle, Heart, X, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

const MatchScreen = () => {
  const { user, profile } = useAuth();
  const [isMatching, setIsMatching] = useState(false);
  const [matchType, setMatchType] = useState<'voice' | 'video' | 'text' | null>(null);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentMatch && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSkip();
    }
    return () => clearInterval(interval);
  }, [currentMatch, timer]);

  const startMatching = async (type: 'voice' | 'video' | 'text') => {
    if (!user) return;
    
    setMatchType(type);
    setIsMatching(true);
    
    try {
      // Add user to match pool
      const { error } = await supabase
        .from('match_pool')
        .insert({
          user_id: user.id,
          match_type: type,
          status: 'waiting'
        });

      if (error) throw error;

      // Listen for matches
      const channel = supabase
        .channel('match-updates')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        }, (payload) => {
          if (payload.new.user1_id === user.id || payload.new.user2_id === user.id) {
            setCurrentMatch(payload.new);
            setIsMatching(false);
            setTimer(30);
          }
        })
        .subscribe();

      toast.success('Looking for someone to connect with...');
    } catch (error) {
      console.error('Error starting match:', error);
      toast.error('Failed to start matching');
      setIsMatching(false);
    }
  };

  const handleVibe = async () => {
    if (!currentMatch || !user) return;

    try {
      const isUser1 = currentMatch.user1_id === user.id;
      const updateField = isUser1 ? 'user1_vibed' : 'user2_vibed';
      
      const { error } = await supabase
        .from('matches')
        .update({ [updateField]: true })
        .eq('id', currentMatch.id);

      if (error) throw error;

      // Check if both users vibed
      const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', currentMatch.id)
        .single();

      if (match?.user1_vibed && match?.user2_vibed) {
        await supabase
          .from('matches')
          .update({ chat_unlocked: true })
          .eq('id', currentMatch.id);
        
        toast.success('🎉 It\'s a Vibe! Chat unlocked!');
      } else {
        toast.success('You vibed! Waiting for the other person...');
      }
    } catch (error) {
      console.error('Error vibing:', error);
      toast.error('Failed to vibe');
    }
  };

  const handleSkip = async () => {
    if (!currentMatch || !user) return;

    try {
      await supabase
        .from('matches')
        .update({ status: 'skipped' })
        .eq('id', currentMatch.id);

      // Deduct coin or show ad
      if (profile && profile.coins > 0) {
        await supabase.rpc('update_user_coins', {
          user_id: user.id,
          coin_amount: -1,
          transaction_type: 'spent',
          reason: 'Skip match'
        });
      }

      setCurrentMatch(null);
      setMatchType(null);
      toast.success('Skipped to next person');
    } catch (error) {
      console.error('Error skipping:', error);
      toast.error('Failed to skip');
    }
  };

  if (currentMatch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-purple-400 mb-2 animate-pulse">
              {timer}
            </div>
            <div className="text-gray-400">seconds to decide</div>
          </div>

          {/* Match Card */}
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Anonymous User</h3>
              <p className="text-gray-400">Say hi and see if you vibe!</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full border-red-500 text-red-400 hover:bg-red-500/20"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={handleVibe}
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-pulse"
            >
              <Heart className="w-8 h-8" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full border-gray-500 text-gray-400 hover:bg-gray-500/20"
            >
              <Flag className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Vibe</h1>
          <p className="text-gray-400">Choose how you want to connect</p>
        </div>

        {/* Match Type Buttons */}
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => startMatching('voice')}
            disabled={isMatching}
            className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg"
          >
            <Mic className="w-6 h-6 mr-3" />
            Voice Match
          </Button>
          
          <Button
            onClick={() => startMatching('video')}
            disabled={isMatching}
            className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg"
          >
            <Video className="w-6 h-6 mr-3" />
            Video Match
          </Button>
          
          <Button
            onClick={() => startMatching('text')}
            disabled={isMatching}
            className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-lg"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Anonymous Chat
          </Button>
        </div>

        {/* Loading State */}
        {isMatching && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-400 animate-pulse">Finding someone awesome...</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center space-x-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{profile?.coins || 0}</div>
            <div className="text-xs text-gray-400">Coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{profile?.xp || 0}</div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{profile?.level || 1}</div>
            <div className="text-xs text-gray-400">Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScreen;
