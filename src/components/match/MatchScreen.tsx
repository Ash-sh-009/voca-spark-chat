
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Video, MessageCircle, Heart, X, Flag, MicOff, VideoOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

const MatchScreen = () => {
  const { user, profile } = useAuth();
  const [isMatching, setIsMatching] = useState(false);
  const [matchType, setMatchType] = useState<'voice' | 'video' | 'text' | null>(null);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [timer, setTimer] = useState(30);
  const [selectedMode, setSelectedMode] = useState<'voice' | 'video' | 'text'>('voice');

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

      toast.success('🔍 Looking for someone awesome to connect with...');
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
        toast.success('💖 You vibed! Waiting for the other person...');
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
      toast.success('⏭️ Skipped to next person');
    } catch (error) {
      console.error('Error skipping:', error);
      toast.error('Failed to skip');
    }
  };

  if (currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full animate-pulse animation-delay-75"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse animation-delay-150"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Report Button */}
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full w-10 h-10 p-0"
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse shadow-lg shadow-purple-500/25">
              <div className="text-2xl font-bold text-white">{timer}</div>
            </div>
            <div className="text-gray-300 font-medium">seconds to decide</div>
          </div>

          {/* Match Card */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 mb-8 overflow-hidden shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/25">
                  <span className="text-4xl">👤</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-ping"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Anonymous User</h3>
              <p className="text-gray-300 mb-4">Say hi and see if you vibe!</p>
              
              {/* Mode Indicator */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
                  {matchType === 'voice' && <Mic className="w-4 h-4 text-purple-400" />}
                  {matchType === 'video' && <Video className="w-4 h-4 text-blue-400" />}
                  {matchType === 'text' && <MessageCircle className="w-4 h-4 text-green-400" />}
                  <span className="text-sm text-gray-300 capitalize">{matchType} Match</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-6">
            <Button
              onClick={handleSkip}
              size="lg"
              className="w-16 h-16 rounded-full bg-gray-700/50 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={handleVibe}
              size="lg"
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-purple-500/25 animate-pulse"
            >
              <Heart className="w-10 h-10 text-white" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full border-gray-500/30 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <Flag className="w-6 h-6" />
            </Button>
          </div>

          {/* Swipe Hint */}
          <div className="text-center mt-8">
            <div className="text-gray-400 text-sm animate-pulse">
              Swipe or tap to interact
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse animation-delay-75"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-cyan-500/10 rounded-full animate-pulse animation-delay-150"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Find Your Vibe</h1>
          <p className="text-gray-300 text-lg">Choose how you want to connect</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-gray-700/50">
          {(['voice', 'video', 'text'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                selectedMode === mode
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                {mode === 'voice' && <Mic className="w-5 h-5" />}
                {mode === 'video' && <Video className="w-5 h-5" />}
                {mode === 'text' && <MessageCircle className="w-5 h-5" />}
                <span className="text-xs font-medium capitalize">{mode}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Match Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => startMatching(selectedMode)}
            disabled={isMatching}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-bold text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMatching ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm">Matching...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                {selectedMode === 'voice' && <Mic className="w-10 h-10" />}
                {selectedMode === 'video' && <Video className="w-10 h-10" />}
                {selectedMode === 'text' && <MessageCircle className="w-10 h-10" />}
                <span>Match Now</span>
              </div>
            )}
          </Button>
        </div>

        {/* Loading State with Animation */}
        {isMatching && (
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-1 mb-4">
              {selectedMode === 'voice' && (
                <>
                  <div className="w-2 h-8 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-12 bg-blue-500 rounded-full animate-pulse animation-delay-75"></div>
                  <div className="w-2 h-6 bg-purple-500 rounded-full animate-pulse animation-delay-150"></div>
                  <div className="w-2 h-10 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
                </>
              )}
              {selectedMode === 'video' && (
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              )}
              {selectedMode === 'text' && (
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce animation-delay-75"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce animation-delay-150"></div>
                </div>
              )}
            </div>
            <p className="text-purple-400 animate-pulse font-medium">
              Finding someone awesome for you...
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center space-x-8 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
              {profile?.coins || 0}
              <div className="w-2 h-2 bg-yellow-400 rounded-full ml-1 animate-pulse"></div>
            </div>
            <div className="text-xs text-gray-400 font-medium">Coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{profile?.xp || 0}</div>
            <div className="text-xs text-gray-400 font-medium">XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{profile?.level || 1}</div>
            <div className="text-xs text-gray-400 font-medium">Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScreen;
