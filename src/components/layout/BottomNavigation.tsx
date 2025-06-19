
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dice1, Mic, MessageCircle, User, Trophy } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/match', icon: Dice1, label: 'Match' },
    { path: '/rooms', icon: Mic, label: 'Rooms' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/leaderboard', icon: Trophy, label: 'Board' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-purple-400 bg-purple-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
