
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OnboardingCard from './OnboardingCard';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      id: 1,
      icon: '🎙️',
      title: 'Voice & Video Match',
      description: 'Meet new people through real-time voice or video. If both tap "Vibe!", chat gets unlocked.',
      animation: 'pulse-faces'
    },
    {
      id: 2,
      icon: '💬',
      title: 'Anonymous Random Chat',
      description: 'Start a private, anonymous text chat with someone new. Swipe to skip anytime.',
      animation: 'floating-bubbles'
    },
    {
      id: 3,
      icon: '🗣️',
      title: 'Public Voice Rooms',
      description: 'Join or host live topic-based voice rooms. Request mic, react, and vibe with many.',
      animation: 'voice-waves'
    },
    {
      id: 4,
      icon: '🎮',
      title: 'Earn Coins & XP',
      description: 'Spin the wheel, win coins, and level up! Use coins to skip, boost, and unlock features.',
      animation: 'spinning-wheel'
    },
    {
      id: 5,
      icon: '🏆',
      title: 'Build Profile & Leaderboard',
      description: 'Upload a profile pic, voice bio, and vibe tags. Rank on the weekly XP leaderboard!',
      animation: 'rising-bar'
    }
  ];

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const isLastCard = currentCard === cards.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <h1 className="text-white text-xl font-bold">VocaLink Pro</h1>
        </div>
        <div className="flex space-x-2">
          {cards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCard
                  ? 'bg-purple-400 w-6'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <OnboardingCard 
            card={cards[currentCard]} 
            isActive={true}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={prevCard}
          disabled={currentCard === 0}
          className="text-gray-400 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>

        {isLastCard ? (
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 animate-pulse"
          >
            Get Started ✨
          </Button>
        ) : (
          <Button
            onClick={nextCard}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
