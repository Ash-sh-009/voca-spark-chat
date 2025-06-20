
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MatchScreen from '@/components/match/MatchScreen';
import ChatScreen from '@/components/chat/ChatScreen';
import ProfileScreen from '@/components/profile/ProfileScreen';
import RoomsScreen from '@/components/rooms/RoomsScreen';
import CoinSystem from '@/components/coins/CoinSystem';
import BottomNavigation from '@/components/layout/BottomNavigation';

const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('match');

  if (!user) {
    return null;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'match':
        return <MatchScreen />;
      case 'rooms':
        return <RoomsScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'coins':
        return <CoinSystem />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <MatchScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {renderActiveScreen()}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default MainApp;
