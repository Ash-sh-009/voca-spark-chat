
import React from 'react';
import { Dice1, Mic, MessageCircle, User, Trophy } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'match', icon: Dice1, label: 'Match', color: 'text-purple-400' },
    { id: 'rooms', icon: Mic, label: 'Rooms', color: 'text-blue-400' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: 'text-green-400' },
    { id: 'profile', icon: User, label: 'Profile', color: 'text-cyan-400' },
    { id: 'leaderboard', icon: Trophy, label: 'Board', color: 'text-yellow-400' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-gray-800/50 px-2 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ id, icon: Icon, label, color }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 transform ${
                isActive 
                  ? `${color} bg-white/10 scale-110 shadow-lg` 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 hover:scale-105'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-medium tracking-tight">{label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-current rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
