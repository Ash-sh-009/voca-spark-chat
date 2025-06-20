
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const AdConfigScreen = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
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
    agora_app_id: ''
  });

  // For now, we'll store settings in localStorage since we don't have app_settings table
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('app_ad_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      // Save to localStorage for now
      localStorage.setItem('app_ad_settings', JSON.stringify(settings));
      toast.success('Ad settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Ad Configuration</h1>
          <p className="text-gray-300">Configure your app's monetization settings</p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AdMob Settings */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span>AdMob Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">App ID</Label>
                <Input
                  value={settings.admob_app_id}
                  onChange={(e) => handleInputChange('admob_app_id', e.target.value)}
                  placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Banner ID</Label>
                <Input
                  value={settings.admob_banner_id}
                  onChange={(e) => handleInputChange('admob_banner_id', e.target.value)}
                  placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Interstitial ID</Label>
                <Input
                  value={settings.admob_interstitial_id}
                  onChange={(e) => handleInputChange('admob_interstitial_id', e.target.value)}
                  placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Rewarded ID</Label>
                <Input
                  value={settings.admob_rewarded_id}
                  onChange={(e) => handleInputChange('admob_rewarded_id', e.target.value)}
                  placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Facebook Ads Settings */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span>Facebook Ads</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">App ID</Label>
                <Input
                  value={settings.facebook_app_id}
                  onChange={(e) => handleInputChange('facebook_app_id', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Banner ID</Label>
                <Input
                  value={settings.facebook_banner_id}
                  onChange={(e) => handleInputChange('facebook_banner_id', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXXX_XXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Interstitial ID</Label>
                <Input
                  value={settings.facebook_interstitial_id}
                  onChange={(e) => handleInputChange('facebook_interstitial_id', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXXX_XXXXXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Unity Ads Settings */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-orange-400" />
                <span>Unity Ads</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Game ID</Label>
                <Input
                  value={settings.unity_game_id}
                  onChange={(e) => handleInputChange('unity_game_id', e.target.value)}
                  placeholder="XXXXXXX"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Banner ID</Label>
                <Input
                  value={settings.unity_banner_id}
                  onChange={(e) => handleInputChange('unity_banner_id', e.target.value)}
                  placeholder="Banner_Android"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Interstitial ID</Label>
                <Input
                  value={settings.unity_interstitial_id}
                  onChange={(e) => handleInputChange('unity_interstitial_id', e.target.value)}
                  placeholder="Interstitial_Android"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Agora Settings */}
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <span>Agora Voice/Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">App ID</Label>
                <Input
                  value={settings.agora_app_id}
                  onChange={(e) => handleInputChange('agora_app_id', e.target.value)}
                  placeholder="your-agora-app-id"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <p className="text-sm text-gray-400">
                Get your Agora App ID from{' '}
                <a href="https://console.agora.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                  Agora Console
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold"
          >
            <Save className="w-5 h-5 mr-2" />
            Save All Settings
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-4">How to Update Ad Settings:</h3>
          <div className="space-y-2 text-gray-300">
            <p>• Get your AdMob IDs from Google AdMob console</p>
            <p>• Get Facebook Ads IDs from Facebook Business Manager</p>
            <p>• Get Unity Ads IDs from Unity Dashboard</p>
            <p>• Get Agora App ID from Agora.io Console for voice/video features</p>
            <p>• Save settings and they will be applied across the app</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdConfigScreen;
