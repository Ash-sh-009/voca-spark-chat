
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
      icon: <img src="/lovable-uploads/8e7eb0bb-7f66-4a3a-972e-e59351a53c04.png" alt="VocaLink Pro" className="w-40 h-40 mx-auto mb-8 animate-pulse" />,
      title: "Welcome to VocaLink Pro",
      subtitle: "Connect Through Voice & Vibe",
      description: "Your ultimate voice-first social experience awaits",
      gradient: "from-purple-600 via-blue-600 to-cyan-500"
    },
    {
      icon: <div className="relative w-24 h-24 mx-auto mb-8">
        <Mic className="w-24 h-24 text-purple-400 animate-pulse" />
        <div className="absolute inset-0 w-24 h-24 border-4 border-purple-500/30 rounded-full animate-ping"></div>
        <div className="absolute inset-2 w-20 h-20 border-2 border-blue-400/50 rounded-full animate-ping animation-delay-75"></div>
      </div>,
      title: "Voice & Video Match",
      subtitle: "Tap Vibe to Connect Instantly!",
      description: "Match with people through real-time voice or video calls",
      gradient: "from-pink-600 via-purple-600 to-blue-600"
    },
    {
      icon: <div className="relative w-24 h-24 mx-auto mb-8">
        <MessageCircle className="w-24 h-24 text-blue-400 animate-bounce" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-purple-500 rounded-full animate-pulse animation-delay-100"></div>
      </div>,
      title: "Anonymous Text Chat",
      subtitle: "Chat Without Revealing Identity",
      description: "Connect anonymously and let your personality shine through",
      gradient: "from-blue-600 via-cyan-500 to-green-500"
    },
    {
      icon: <div className="relative w-24 h-24 mx-auto mb-8">
        <Video className="w-24 h-24 text-green-400" />
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
      </div>,
      title: "Public Voice Rooms",
      subtitle: "Join or Create Live Audio Spaces",
      description: "Host your own room or join fascinating conversations worldwide",
      gradient: "from-green-600 via-teal-500 to-blue-500"
    },
    {
      icon: <div className="relative w-24 h-24 mx-auto mb-8">
        <Coins className="w-24 h-24 text-yellow-400 animate-spin" />
        <Trophy className="absolute -top-2 -right-2 w-10 h-10 text-purple-400 animate-bounce" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
      </div>,
      title: "Earn Coins & Compete",
      subtitle: "Level Up & Climb Leaderboards",
      description: "Gain XP, collect coins, and showcase your voice vibe ranking",
      gradient: "from-yellow-500 via-orange-500 to-red-500"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse animation-delay-75"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-cyan-500/10 rounded-full animate-pulse animation-delay-150"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${slides[currentSlide].gradient} p-8 text-center min-h-[400px] flex flex-col justify-center relative overflow-hidden`}>
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              
              <div className="relative z-10">
                {slides[currentSlide].icon}
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{slides[currentSlide].title}</h2>
                <p className="text-white/95 font-semibold mb-3 text-lg">{slides[currentSlide].subtitle}</p>
                <p className="text-white/80 text-sm leading-relaxed px-2">{slides[currentSlide].description}</p>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl">
              {/* Progress Dots */}
              <div className="flex justify-center space-x-3 mb-8">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse' 
                        : 'w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={prevSlide}
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={nextSlide}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  {currentSlide === slides.length - 1 ? (
                    <>
                      Get Started
                      <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
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
