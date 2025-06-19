
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Mic, Video, MessageCircle, Coins, Trophy } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <img src="/lovable-uploads/21c984fb-31a9-430f-9f70-22f433932191.png" alt="VocaLink" className="w-32 h-32 mx-auto mb-6" />,
      title: "Welcome to VocaLink Pro",
      subtitle: "Connect Through Voice & Vibe",
      description: "Your ultimate voice-first social experience",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      icon: <Mic className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse" />,
      title: "Voice & Video Match",
      subtitle: "Tap Vibe to Connect!",
      description: "Instantly match with people through voice or video calls",
      gradient: "from-pink-600 to-purple-600"
    },
    {
      icon: <MessageCircle className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-bounce" />,
      title: "Anonymous Text Chat",
      subtitle: "Chat Without Revealing Info",
      description: "Connect anonymously and let your personality shine",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <Video className="w-20 h-20 text-green-400 mx-auto mb-6 animate-pulse" />,
      title: "Public Voice Rooms",
      subtitle: "Join or Create Live Audio Spaces",
      description: "Host your own room or join interesting conversations",
      gradient: "from-green-600 to-teal-600"
    },
    {
      icon: <Coins className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-spin" />,
      title: "XP & Coins System",
      subtitle: "Earn and Level Up",
      description: "Gain experience points and coins for every interaction",
      gradient: "from-yellow-600 to-orange-600"
    },
    {
      icon: <Trophy className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-bounce" />,
      title: "Leaderboard & Profile",
      subtitle: "Show Off Your Voice Vibe",
      description: "Compete with others and build your reputation",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50 overflow-hidden">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${slides[currentSlide].gradient} p-8 text-center`}>
              {slides[currentSlide].icon}
              <h2 className="text-2xl font-bold text-white mb-2">{slides[currentSlide].title}</h2>
              <p className="text-white/90 font-medium mb-2">{slides[currentSlide].subtitle}</p>
              <p className="text-white/70 text-sm">{slides[currentSlide].description}</p>
            </div>
            
            <div className="p-6">
              {/* Progress Dots */}
              <div className="flex justify-center space-x-2 mb-6">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={prevSlide}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={nextSlide}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                  {currentSlide !== slides.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
