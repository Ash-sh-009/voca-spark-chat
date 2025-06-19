
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Edit3, Star, Users, Award, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

const ProfileScreen = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    mood_tags: profile?.mood_tags || []
  });

  const moodTags = ['Chill', 'Energetic', 'Friendly', 'Creative', 'Funny', 'Deep', 'Adventure', 'Music'];

  useEffect(() => {
    if (profile?.profile_picture_url) {
      setProfileImageUrl(profile.profile_picture_url);
    }
  }, [profile]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfileImageUrl(publicUrl);
      
      // Update profile with new image URL
      await updateProfile({ profile_picture_url: publicUrl });
      
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const toggleMoodTag = (tag: string) => {
    const currentTags = editData.mood_tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setEditData({ ...editData, mood_tags: updatedTags });
  };

  const handleBoostProfile = async () => {
    if (!user || !profile) return;
    
    if (profile.coins < 50) {
      toast.error('Not enough coins! You need 50 coins to boost your profile.');
      return;
    }

    try {
      await supabase.rpc('update_user_coins', {
        user_id: user.id,
        coin_amount: -50,
        transaction_type: 'spent',
        reason: 'Profile boost'
      });
      
      toast.success('🚀 Profile boosted! You\'ll be more visible to others for 24 hours.');
    } catch (error) {
      console.error('Error boosting profile:', error);
      toast.error('Failed to boost profile');
    }
  };

  const levelProgress = profile ? ((profile.xp % 100) / 100) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 mb-6 overflow-hidden">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 mx-auto relative">
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover border-4 border-purple-500/50"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                className="absolute bottom-0 right-1/2 transform translate-x-12 translate-y-2 rounded-full w-10 h-10 p-0 bg-purple-500 hover:bg-purple-600"
                disabled={uploading}
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="bg-gray-800/50 border-purple-500/30 text-white text-center"
                  placeholder="Your name"
                />
                <Textarea
                  placeholder="Tell others about yourself..."
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="bg-gray-800/50 border-purple-500/30 text-white"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-2">{profile?.name}</h2>
                <p className="text-gray-300 mb-4">{profile?.bio || 'No bio yet'}</p>
              </>
            )}
            
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{profile?.followers_count || 0}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{profile?.following_count || 0}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>
            
            {isEditing ? (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline" 
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Level & XP */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white">Level {profile?.level || 1}</h3>
              <div className="text-purple-400 font-bold text-lg">{profile?.xp || 0} XP</div>
            </div>
            <Progress value={levelProgress} className="mb-2 h-3" />
            <p className="text-sm text-gray-400">
              {100 - (profile?.xp || 0) % 100} XP to next level
            </p>
          </CardContent>
        </Card>

        {/* Mood Tags */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Mood Tags</h3>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                {moodTags.map((tag) => (
                  <Button
                    key={tag}
                    onClick={() => toggleMoodTag(tag)}
                    variant={editData.mood_tags?.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className={`text-sm transition-all ${
                      editData.mood_tags?.includes(tag)
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
                    }`}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(profile?.mood_tags || []).map((tag: string) => (
                  <span 
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {(!profile?.mood_tags || profile.mood_tags.length === 0) && (
                  <p className="text-gray-400 text-sm">No mood tags set</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-black/40 backdrop-blur-lg border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {profile?.coins || 0}
              </div>
              <div className="text-sm text-gray-300">Coins</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-lg border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {profile?.level || 1}
              </div>
              <div className="text-sm text-gray-300">Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4">
            <Star className="w-5 h-5 mr-2" />
            Set Voice Status
          </Button>
          
          <Button 
            onClick={handleBoostProfile}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4"
          >
            <Award className="w-5 h-5 mr-2" />
            Boost Me (50 coins)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
