
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Crown, Flame } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const LeaderboardScreen = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, xp, level, profile_picture_url')
        .order('xp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50';
      default:
        return 'bg-gray-800/50 border-gray-700/50';
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
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top voices this week</p>
        </div>

        {/* Top 3 Special Display */}
        {leaderboard.length >= 3 && (
          <div className="flex justify-center items-end space-x-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div className="text-sm font-semibold text-white">{leaderboard[1]?.name}</div>
              <div className="text-xs text-gray-400">{leaderboard[1]?.xp} XP</div>
              <Trophy className="w-5 h-5 text-gray-300 mx-auto mt-1" />
            </div>

            {/* 1st Place */}
            <div className="text-center transform scale-110">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse">
                <span className="text-3xl">👑</span>
              </div>
              <div className="text-lg font-bold text-white">{leaderboard[0]?.name}</div>
              <div className="text-sm text-yellow-400 font-semibold">{leaderboard[0]?.xp} XP</div>
              <Crown className="w-6 h-6 text-yellow-400 mx-auto mt-1" />
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div className="text-sm font-semibold text-white">{leaderboard[2]?.name}</div>
              <div className="text-xs text-gray-400">{leaderboard[2]?.xp} XP</div>
              <Trophy className="w-5 h-5 text-amber-600 mx-auto mt-1" />
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="space-y-3">
          {leaderboard.map((player, index) => {
            const rank = index + 1;
            const isCurrentUser = user?.id === player.id;
            
            return (
              <Card 
                key={player.id}
                className={`${getRankStyle(rank)} ${isCurrentUser ? 'ring-2 ring-purple-500' : ''} backdrop-blur-lg transition-all duration-200`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isCurrentUser ? 'text-purple-400' : 'text-white'}`}>
                        {player.name}
                        {isCurrentUser && <span className="text-xs text-purple-400 ml-2">(You)</span>}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Level {player.level}</span>
                        <span className="flex items-center">
                          <Flame className="w-4 h-4 mr-1 text-orange-400" />
                          {player.xp} XP
                        </span>
                      </div>
                    </div>
                    
                    {rank <= 3 && (
                      <div className="flex-shrink-0">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                          'bg-amber-600/20 text-amber-400'
                        }`}>
                          #{rank}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Rankings Yet</h3>
            <p className="text-gray-500">Start earning XP to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
