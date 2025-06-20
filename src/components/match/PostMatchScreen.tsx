
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PostMatchScreenProps {
  match: any;
  onBack: () => void;
  onOpenChat: () => void;
}

const PostMatchScreen = ({ match, onBack, onOpenChat }: PostMatchScreenProps) => {
  const { user } = useAuth();
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    setCelebration(true);
    const timer = setTimeout(() => setCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const otherUser = match.user1_id === user?.id ? match.user2 : match.user1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Celebration Animation */}
      {celebration && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/10 rounded-full animate-pulse animation-delay-75"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse animation-delay-150"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full mb-4 animate-pulse shadow-2xl shadow-purple-500/50">
              <Heart className="w-12 h-12 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-pink-500/30 to-blue-500/30 rounded-full animate-ping"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            It's a Vibe! 🎉
          </h1>
          <p className="text-gray-300 text-lg">
            You both vibed with each other!
          </p>
        </div>

        {/* Match Card */}
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 mb-8 overflow-hidden shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-4xl">👤</span>
              </div>
              {/* Double glow effect for matched state */}
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
              {otherUser?.name || 'Anonymous User'}
            </h3>
            <p className="text-gray-300 mb-6">
              Ready to start an amazing conversation?
            </p>
            
            {/* Mode Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-6 py-3 border border-purple-500/30">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-300 font-medium">Perfect Match</span>
                <Heart className="w-4 h-4 text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onOpenChat}
            size="lg"
            className="w-full h-14 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/25"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Start Chatting
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="w-full h-12 border-gray-500/30 bg-gray-800/30 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-2xl transition-all duration-300"
          >
            Find More Vibes
          </Button>
        </div>

        {/* Celebration Text */}
        <div className="text-center mt-8">
          <div className="text-gray-400 text-sm animate-pulse">
            🎊 Chat is now unlocked! 🎊
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostMatchScreen;
