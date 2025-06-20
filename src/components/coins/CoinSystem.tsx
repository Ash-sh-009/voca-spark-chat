
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Play, Gift, Zap, Star, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

interface CoinTransaction {
  id: string;
  coin_amount: number;
  transaction_type: string;
  reason: string;
  created_at: string;
}

const CoinSystem = () => {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdReward, setShowAdReward] = useState(false);
  const [dailyAdsWatched, setDailyAdsWatched] = useState(0);

  useEffect(() => {
    if (user) {
      loadTransactions();
      loadDailyAdsCount();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadDailyAdsCount = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem(`ads_watched_${user?.id}_${today}`);
    setDailyAdsWatched(parseInt(storedData || '0'));
  };

  const watchAdForCoins = async () => {
    if (dailyAdsWatched >= 10) {
      toast.error('Daily ad limit reached! Come back tomorrow.');
      return;
    }

    setShowAdReward(true);
    setLoading(true);
    
    // Simulate ad watching (3 seconds)
    setTimeout(async () => {
      try {
        // Award 3 coins for watching ad
        await supabase.rpc('update_user_coins', {
          user_id: user?.id,
          coin_amount: 3,
          transaction_type: 'earned',
          reason: 'Watched advertisement'
        });
        
        // Update daily ad count
        const newCount = dailyAdsWatched + 1;
        setDailyAdsWatched(newCount);
        const today = new Date().toDateString();
        localStorage.setItem(`ads_watched_${user?.id}_${today}`, newCount.toString());
        
        setShowAdReward(false);
        setLoading(false);
        loadTransactions();
        toast.success('🪙 +3 Coins earned! Thanks for watching!');
      } catch (error) {
        console.error('Error awarding coins:', error);
        toast.error('Failed to award coins');
        setShowAdReward(false);
        setLoading(false);
      }
    }, 3000);
  };

  const spinWheel = async () => {
    if ((profile?.coins || 0) < 5) {
      toast.error('Need 5 coins to spin the wheel!');
      return;
    }

    setLoading(true);
    
    try {
      // Deduct 5 coins for spin
      await supabase.rpc('update_user_coins', {
        user_id: user?.id,
        coin_amount: -5,
        transaction_type: 'spent',
        reason: 'Spin wheel game'
      });

      // Random reward (1-20 coins)
      const reward = Math.floor(Math.random() * 20) + 1;
      
      // Award the reward
      await supabase.rpc('update_user_coins', {
        user_id: user?.id,
        coin_amount: reward,
        transaction_type: 'earned',
        reason: 'Spin wheel reward'
      });

      loadTransactions();
      toast.success(`🎉 Wheel spin won you ${reward} coins!`);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      toast.error('Failed to spin wheel');
    } finally {
      setLoading(false);
    }
  };

  const dailyBonus = async () => {
    const today = new Date().toDateString();
    const lastBonus = localStorage.getItem(`daily_bonus_${user?.id}`);
    
    if (lastBonus === today) {
      toast.error('Daily bonus already claimed!');
      return;
    }

    try {
      // Award 10 coins daily bonus
      await supabase.rpc('update_user_coins', {
        user_id: user?.id,
        coin_amount: 10,
        transaction_type: 'earned',
        reason: 'Daily bonus'
      });

      localStorage.setItem(`daily_bonus_${user?.id}`, today);
      loadTransactions();
      toast.success('🎁 +10 Coins daily bonus claimed!');
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      toast.error('Failed to claim bonus');
    }
  };

  // Ad Reward Modal
  if (showAdReward) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <Card className="bg-black/60 backdrop-blur-xl border-yellow-500/50 max-w-sm w-full">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
              <Play className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Watching Ad...</h3>
            <p className="text-gray-300 mb-4">Get ready to earn 3 coins!</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Ads watched today: {dailyAdsWatched}/10
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Coin Store</h1>
        <p className="text-gray-300">Earn and spend coins</p>
      </div>

      {/* Current Balance */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-black/40 backdrop-blur-xl rounded-full px-8 py-4 border border-yellow-500/30">
          <Coins className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
          <span className="text-3xl font-bold text-yellow-400">{profile?.coins || 0}</span>
          <span className="text-gray-300 ml-2 text-lg">Coins</span>
        </div>
      </div>

      {/* Earn Coins Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Watch Ads */}
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Play className="w-5 h-5 text-green-400" />
              <span>Watch Ads</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Watch ads to earn coins</p>
            <p className="text-sm text-gray-400 mb-4">
              Daily limit: {dailyAdsWatched}/10 ads watched
            </p>
            <Button
              onClick={watchAdForCoins}
              disabled={loading || dailyAdsWatched >= 10}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Ad (+3 Coins)
            </Button>
          </CardContent>
        </Card>

        {/* Daily Bonus */}
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Gift className="w-5 h-5 text-blue-400" />
              <span>Daily Bonus</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Free coins every day</p>
            <Button
              onClick={dailyBonus}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Gift className="w-4 h-4 mr-2" />
              Claim Daily Bonus (+10)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Games Section */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Spin the Wheel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 mb-1">Cost: 5 coins</p>
                <p className="text-sm text-gray-400">Win 1-20 coins!</p>
              </div>
              <Button
                onClick={spinWheel}
                disabled={loading || (profile?.coins || 0) < 5}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Zap className="w-4 h-4 mr-2" />
                Spin (-5)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coin Uses */}
      <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>What Can You Do With Coins?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Skip matches (1 coin per skip)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Join premium voice rooms (5-10 coins)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Boost profile visibility (50 coins)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Send voice messages (2 coins each)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-400" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{transaction.reason}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    transaction.transaction_type === 'earned' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="font-bold">
                      {transaction.transaction_type === 'earned' ? '+' : '-'}{Math.abs(transaction.coin_amount)}
                    </span>
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinSystem;
