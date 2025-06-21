
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileSetupProps {
  profileData: {
    name: string;
    age: string;
    bio: string;
    profileImage: string | null;
  };
  onProfileChange: (data: any) => void;
  onComplete: () => void;
}

const ProfileSetup = ({ profileData, onProfileChange, onComplete }: ProfileSetupProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onProfileChange({ ...profileData, profileImage: result });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const canComplete = profileData.name.trim() && profileData.age.trim() && parseInt(profileData.age) >= 13;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 120 - 10}%`,
              top: `${Math.random() * 120 - 10}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block text-6xl mb-4"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-3">Create Your Profile</h1>
          <p className="text-gray-300 text-lg">Let others know the amazing person you are!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 mb-8 overflow-hidden">
            <CardContent className="p-8">
              {/* Profile Image Upload */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <motion.div
                    className={`w-32 h-32 rounded-full border-4 border-dashed transition-all duration-300 relative overflow-hidden ${
                      dragOver 
                        ? 'border-purple-400 bg-purple-500/20' 
                        : profileData.profileImage 
                        ? 'border-purple-500/50' 
                        : 'border-gray-600 hover:border-purple-500/50'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {uploading ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
                        <motion.div
                          className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    ) : profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">Add Photo</span>
                      </div>
                    )}
                    
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Floating Upload Button */}
                  <motion.button
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <p className="text-gray-400 text-sm mt-4">
                  Drag & drop or click to upload your photo
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-purple-400" />
                    What should we call you?
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={profileData.name}
                    onChange={(e) => onProfileChange({ ...profileData, name: e.target.value })}
                    className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </motion.div>

                {/* Age Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    How old are you?
                  </label>
                  <Input
                    type="number"
                    placeholder="Your age"
                    value={profileData.age}
                    onChange={(e) => onProfileChange({ ...profileData, age: e.target.value })}
                    className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                    min="13"
                    max="100"
                  />
                  {profileData.age && parseInt(profileData.age) < 13 && (
                    <p className="text-red-400 text-sm mt-1">Must be 13 or older to use VocaSpark</p>
                  )}
                </motion.div>

                {/* Bio Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-white font-semibold mb-2">
                    Tell us about yourself (Optional)
                  </label>
                  <Textarea
                    placeholder="Share something interesting about yourself..."
                    value={profileData.bio}
                    onChange={(e) => onProfileChange({ ...profileData, bio: e.target.value })}
                    className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                    rows={3}
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    {profileData.bio.length}/200 characters
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Button */}
          <div className="text-center">
            <Button
              onClick={onComplete}
              disabled={!canComplete}
              className={`px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 ${
                canComplete
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-2xl shadow-purple-500/25 animate-pulse'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canComplete ? '🚀 Start Connecting!' : 'Complete your profile'}
            </Button>
            
            {canComplete && (
              <motion.p
                className="text-gray-400 text-sm mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                You're all set! Let's find your perfect matches ✨
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
