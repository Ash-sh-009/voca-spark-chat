import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Play, Gift, Zap, Star, Award, Video } from 'lucide-react';
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
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [spinResult, setSpinResult] = useState(0);
  const [dailyAdsWatched, setDailyAdsWatched] = useState(0);
  const [adType, setAdType] = useState<'banner' | 'interstitial' | 'rewarded'>('rewarded');

  // Your AdMob IDs (from requirements)
  const adMobIds = {
    banner: 'ca-app-pub-4263991206924311/7662596461',
    interstitial: 'ca-app-pub-4263991206924311/9879095061',
    rewarded: 'ca-app-pub-4263991206924311/9879095061'
  };

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

  // Simulate AdMob Rewarded Ad
  const watchRewardedAd = async () => {
    if (dailyAdsWatched >= 10) {
      toast.error('Daily ad limit reached! Come back tomorrow.');
      return;
    }

    setShowAdReward(true);
    setLoading(true);
    
    // Show ad simulation (realistic 30-second ad)
    toast.success(`📺 Loading AdMob Rewarded Ad (ID: ${adMobIds.rewarded})`);
    
    setTimeout(async () => {
      try {
        // Award 5 coins for watching rewarded ad
        await supabase.rpc('update_user_coins', {
          user_id: user?.id,
          coin_amount: 5,
          transaction_type: 'earned',
          reason: 'Watched rewarded video ad'
        });
        
        // Update daily ad count
        const newCount = dailyAdsWatched + 1;
        setDailyAdsWatched(newCount);
        const today = new Date().toDateString();
        localStorage.setItem(`ads_watched_${user?.id}_${today}`, newCount.toString());
        
        setShowAdReward(false);
        setLoading(false);
        loadTransactions();
        toast.success('🪙 +5 Coins earned from AdMob! Thanks for watching!');
      } catch (error) {
        console.error('Error awarding coins:', error);
        toast.error('Failed to award coins');
        setShowAdReward(false);
        setLoading(false);
      }
    }, 5000); // 5 second ad simulation
  };

  // Show Interstitial Ad (between actions)
  const showInterstitialAd = () => {
    toast.success(`📱 AdMob Interstitial Ad shown (ID: ${adMobIds.interstitial})`);
    setTimeout(() => {
      toast.success('✅ Interstitial ad completed');
    }, 3000);
  };

  const spinWheel = async () => {
    if ((profile?.coins || 0) < 5) {
      toast.error('Need 5 coins to spin the wheel!');
      return;
    }

    setLoading(true);
    setShowSpinWheel(true);
    
    // Show interstitial ad 20% of the time
    if (Math.random() < 0.2) {
      showInterstitialAd();
    }
    
    try {
      // Deduct 5 coins for spin
      await supabase.rpc('update_user_coins', {
        user_id: user?.id,
        coin_amount: -5,
        transaction_type: 'spent',
        reason: 'Spin wheel game'
      });

      // Random reward (1-100 coins with weighted distribution)
      const rand = Math.random();
      let reward;
      if (rand < 0.4) reward = Math.floor(Math.random() * 10) + 1; // 1-10 coins (40%)
      else if (rand < 0.7) reward = Math.floor(Math.random() * 20) + 11; // 11-30 coins (30%)
      else if (rand < 0.9) reward = Math.floor(Math.random() * 30) + 31; // 31-60 coins (20%)
      else reward = Math.floor(Math.random() * 40) + 61; // 61-100 coins (10%)
      
      setSpinResult(reward);
      
      // Award the reward after spin animation
      setTimeout(async () => {
        await supabase.rpc('update_user_coins', {
          user_id: user?.id,
          coin_amount: reward,
          transaction_type: 'earned',
          reason: 'Spin wheel reward'
        });

        loadTransactions();
        setShowSpinWheel(false);
        toast.success(`🎉 Wheel spin won you ${reward} coins!`);
      }, 3000);
      
    } catch (error) {
      console.error('Error spinning wheel:', error);
      toast.error('Failed to spin wheel');
      setShowSpinWheel(false);
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
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AdMob Rewarded Ad</h3>
            <p className="text-gray-300 mb-4">Watch this 30-second video to earn 5 coins!</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-yellow-500 h-3 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
            <p className="text-sm text-gray-400">
              Ad ID: {adMobIds.rewarded}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Ads watched today: {dailyAdsWatched}/10
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Spin Wheel Modal
  if (showSpinWheel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <Card className="bg-black/60 backdrop-blur-xl border-purple-500/50 max-w-sm w-full">
          <CardContent className="text-center py-12">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                <Zap className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Spinning...</h3>
            <p className="text-gray-300 mb-4">🎰 Good luck!</p>
            {spinResult > 0 && (
              <div className="text-2xl font-bold text-yellow-400 animate-pulse">
                +{spinResult} Coins!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Coin Store</h1>
        <p className="text-gray-300">Earn coins with ads and games</p>
      </div>

      {/* Current Balance */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-black/40 backdrop-blur-xl rounded-full px-8 py-4 border border-yellow-500/30">
          <Coins className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
          <span className="text-3xl font-bold text-yellow-400">{profile?.coins || 0}</span>
          <span className="text-gray-300 ml-2 text-lg">Coins</span>
        </div>
      </div>

      {/* AdMob Integration Section */}
      <Card className="bg-black/40 backdrop-blur-xl border-red-500/50 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Video className="w-5 h-5 text-red-400" />
            <span>AdMob Ads</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-300 space-y-1">
              <p>🔴 Rewarded: {adMobIds.rewarded}</p>
              <p>📱 Interstitial: {adMobIds.interstitial}</p>
              <p>📊 Banner: {adMobIds.banner}</p>
            </div>
            
            <Button
              onClick={watchRewardedAd}
              disabled={loading || dailyAdsWatched >= 10}
              className="w-full bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Rewarded Ad (+5 Coins)
            </Button>
            
            <p className="text-xs text-gray-400 text-center">
              Daily limit: {dailyAdsWatched}/10 ads watched
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Earn Coins Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        {/* Spin Wheel */}
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Spin Wheel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 mb-1">Cost: 5 coins</p>
                <p className="text-sm text-gray-400">Win 1-100 coins!</p>
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
