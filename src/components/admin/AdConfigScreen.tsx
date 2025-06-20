
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Settings, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

const AdConfigScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [adConfig, setAdConfig] = useState({
    admob_app_id: '',
    admob_banner_id: '',
    admob_interstitial_id: '',
    admob_rewarded_id: '',
    facebook_app_id: '',
    facebook_banner_id: '',
    facebook_interstitial_id: '',
    unity_game_id: '',
    unity_banner_id: '',
    unity_interstitial_id: '',
    custom_ad_network: '',
    ad_refresh_rate: 30,
    ad_placement_rules: ''
  });

  useEffect(() => {
    loadAdConfig();
  }, []);

  const loadAdConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'ad_config')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setAdConfig({ ...adConfig, ...JSON.parse(data.setting_value) });
      }
    } catch (error) {
      console.error('Error loading ad config:', error);
    }
  };

  const saveAdConfig = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'ad_config',
          setting_value: JSON.stringify(adConfig),
          updated_by: user.id
        });

      if (error) throw error;

      toast.success('Ad configuration saved successfully!');
    } catch (error) {
      console.error('Error saving ad config:', error);
      toast.error('Failed to save ad configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string | number) => {
    setAdConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Ad Configuration</h1>
            <p className="text-gray-400">Manage your app's advertising settings</p>
          </div>
          <Button
            onClick={() => setShowKeys(!showKeys)}
            variant="outline"
            className="border-gray-600/50 text-gray-400"
          >
            {showKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showKeys ? 'Hide' : 'Show'} Keys
          </Button>
        </div>

        <div className="grid gap-6">
          {/* AdMob Configuration */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Google AdMob
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admob_app_id" className="text-gray-300">App ID</Label>
                  <Input
                    id="admob_app_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.admob_app_id}
                    onChange={(e) => handleInputChange('admob_app_id', e.target.value)}
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="admob_banner_id" className="text-gray-300">Banner ID</Label>
                  <Input
                    id="admob_banner_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.admob_banner_id}
                    onChange={(e) => handleInputChange('admob_banner_id', e.target.value)}
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="admob_interstitial_id" className="text-gray-300">Interstitial ID</Label>
                  <Input
                    id="admob_interstitial_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.admob_interstitial_id}
                    onChange={(e) => handleInputChange('admob_interstitial_id', e.target.value)}
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="admob_rewarded_id" className="text-gray-300">Rewarded ID</Label>
                  <Input
                    id="admob_rewarded_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.admob_rewarded_id}
                    onChange={(e) => handleInputChange('admob_rewarded_id', e.target.value)}
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facebook Ads Configuration */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Facebook Audience Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="facebook_app_id" className="text-gray-300">App ID</Label>
                  <Input
                    id="facebook_app_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.facebook_app_id}
                    onChange={(e) => handleInputChange('facebook_app_id', e.target.value)}
                    placeholder="xxxxxxxxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_banner_id" className="text-gray-300">Banner ID</Label>
                  <Input
                    id="facebook_banner_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.facebook_banner_id}
                    onChange={(e) => handleInputChange('facebook_banner_id', e.target.value)}
                    placeholder="xxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_interstitial_id" className="text-gray-300">Interstitial ID</Label>
                  <Input
                    id="facebook_interstitial_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.facebook_interstitial_id}
                    onChange={(e) => handleInputChange('facebook_interstitial_id', e.target.value)}
                    placeholder="xxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unity Ads Configuration */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Unity Ads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="unity_game_id" className="text-gray-300">Game ID</Label>
                  <Input
                    id="unity_game_id"
                    type={showKeys ? 'text' : 'password'}
                    value={adConfig.unity_game_id}
                    onChange={(e) => handleInputChange('unity_game_id', e.target.value)}
                    placeholder="xxxxxxx"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="unity_banner_id" className="text-gray-300">Banner Placement</Label>
                  <Input
                    id="unity_banner_id"
                    value={adConfig.unity_banner_id}
                    onChange={(e) => handleInputChange('unity_banner_id', e.target.value)}
                    placeholder="banner"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="unity_interstitial_id" className="text-gray-300">Interstitial Placement</Label>
                  <Input
                    id="unity_interstitial_id"
                    value={adConfig.unity_interstitial_id}
                    onChange={(e) => handleInputChange('unity_interstitial_id', e.target.value)}
                    placeholder="interstitial"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ad_refresh_rate" className="text-gray-300">Ad Refresh Rate (seconds)</Label>
                  <Input
                    id="ad_refresh_rate"
                    type="number"
                    value={adConfig.ad_refresh_rate}
                    onChange={(e) => handleInputChange('ad_refresh_rate', parseInt(e.target.value) || 30)}
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_ad_network" className="text-gray-300">Custom Ad Network URL</Label>
                  <Input
                    id="custom_ad_network"
                    value={adConfig.custom_ad_network}
                    onChange={(e) => handleInputChange('custom_ad_network', e.target.value)}
                    placeholder="https://your-ad-network.com/api"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ad_placement_rules" className="text-gray-300">Ad Placement Rules (JSON)</Label>
                <Textarea
                  id="ad_placement_rules"
                  value={adConfig.ad_placement_rules}
                  onChange={(e) => handleInputChange('ad_placement_rules', e.target.value)}
                  placeholder='{"skip_cost": 1, "boost_cost": 50, "reward_amount": 3}'
                  rows={4}
                  className="bg-gray-800/50 border-gray-600/50 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={saveAdConfig}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdConfigScreen;
