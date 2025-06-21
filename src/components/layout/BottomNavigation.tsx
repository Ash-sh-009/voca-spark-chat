
import { Mic, MessageCircle, User, Home, Coins, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'match', icon: Home, label: 'Match' },
    { id: 'rooms', icon: Mic, label: 'Rooms' },
    { id: 'chat', icon: MessageCircle, label: 'Inbox' },
    { id: 'anonymous', icon: Users, label: 'Anon' },
    { id: 'coins', icon: Coins, label: 'Store' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-gray-700/50 z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 relative ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/25"
                  layoutId="activeTab"
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <IconComponent 
                  className={`w-5 h-5 mb-1 transition-all duration-300 ${
                    isActive ? 'animate-pulse' : ''
                  }`} 
                />
              </motion.div>
              
              <span className="text-xs font-medium relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
