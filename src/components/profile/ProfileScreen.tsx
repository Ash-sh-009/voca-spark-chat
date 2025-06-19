
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Edit3, Star, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const ProfileScreen = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    mood_tags: profile?.mood_tags || []
  });

  const moodTags = ['Chill', 'Energetic', 'Friendly', 'Creative', 'Funny', 'Deep', 'Adventure', 'Music'];

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleMoodTag = (tag: string) => {
    const currentTags = editData.mood_tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setEditData({ ...editData, mood_tags: updatedTags });
  };

  const levelProgress = profile ? ((profile.xp % 100) / 100) * 100 : 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 mb-6">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <Button
                size="sm"
                className="absolute bottom-0 right-1/2 transform translate-x-8 translate-y-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="bg-gray-700/50 border-gray-600 text-white text-center"
                />
                <Textarea
                  placeholder="Tell others about yourself..."
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">{profile?.name}</h2>
                <p className="text-gray-400 mb-4">{profile?.bio || 'No bio yet'}</p>
              </>
            )}
            
            <div className="flex justify-center space-x-6 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{profile?.followers_count || 0}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{profile?.following_count || 0}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>
            
            {isEditing ? (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Level & XP */}
        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Level {profile?.level || 1}</h3>
              <div className="text-purple-400 font-bold">{profile?.xp || 0} XP</div>
            </div>
            <Progress value={levelProgress} className="mb-2" />
            <p className="text-sm text-gray-400">
              {100 - (profile?.xp || 0) % 100} XP to next level
            </p>
          </CardContent>
        </Card>

        {/* Mood Tags */}
        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Mood Tags</h3>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {moodTags.map((tag) => (
                  <Button
                    key={tag}
                    onClick={() => toggleMoodTag(tag)}
                    variant={editData.mood_tags?.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className="text-sm"
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
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full"
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {profile?.coins || 0}
              </div>
              <div className="text-sm text-gray-400">Coins</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {profile?.level || 1}
              </div>
              <div className="text-sm text-gray-400">Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Star className="w-4 h-4 mr-2" />
            Set Voice Status
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
          >
            Boost Me (50 coins)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
