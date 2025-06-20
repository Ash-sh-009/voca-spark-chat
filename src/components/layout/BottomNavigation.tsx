
import { Mic, MessageCircle, User, Home, Coins } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'match', icon: Home, label: 'Match' },
    { id: 'rooms', icon: Mic, label: 'Rooms' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'coins', icon: Coins, label: 'Coins' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-gray-700/50 z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-white bg-gradient-to-t from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/25' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <IconComponent 
                className={`w-6 h-6 mb-1 transition-all duration-300 ${
                  isActive ? 'animate-pulse' : ''
                }`} 
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
