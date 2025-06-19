
import { useEffect, useState } from 'react';

interface Card {
  id: number;
  icon: string;
  title: string;
  description: string;
  animation: string;
}

interface OnboardingCardProps {
  card: Card;
  isActive: boolean;
}

const OnboardingCard = ({ card, isActive }: OnboardingCardProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isActive) {
      setAnimationClass('animate-fade-in');
      const timer = setTimeout(() => setAnimationClass(''), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, card.id]);

  const getAnimationComponent = () => {
    switch (card.animation) {
      case 'pulse-faces':
        return (
          <div className="relative flex justify-center items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-2xl">🎙️</span>
            </div>
          </div>
        );
      case 'floating-bubbles':
        return (
          <div className="relative h-20 mb-6 flex justify-center items-center">
            <div className="absolute animate-bounce">
              <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl px-4 py-2 text-white text-sm">
                Hey! 👋
              </div>
            </div>
            <div className="absolute animate-bounce delay-150 ml-8 mt-6">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl px-4 py-2 text-white text-sm">
                Hi there! ✨
              </div>
            </div>
          </div>
        );
      case 'voice-waves':
        return (
          <div className="flex justify-center items-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse`}
                style={{
                  height: `${20 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center ml-4">
              <span className="text-white text-xs">🎤</span>
            </div>
          </div>
        );
      case 'spinning-wheel':
        return (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 rounded-full animate-spin flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-xl">🪙</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <span className="text-yellow-400 text-lg">✨</span>
              </div>
            </div>
          </div>
        );
      case 'rising-bar':
        return (
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 flex items-center justify-center animate-pulse">
              <span className="text-white text-xl">👤</span>
            </div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <div className="mt-2 animate-bounce">
              <span className="text-yellow-400 text-lg">🏆</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`text-center ${animationClass}`}>
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700/50">
        {/* Icon */}
        <div className="text-6xl mb-6 animate-bounce">
          {card.icon}
        </div>

        {/* Animation */}
        {getAnimationComponent()}

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {card.title}
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed">
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default OnboardingCard;
