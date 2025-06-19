
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/layout/BottomNavigation';
import MatchScreen from '@/components/match/MatchScreen';
import RoomsScreen from '@/components/rooms/RoomsScreen';
import ChatScreen from '@/components/chat/ChatScreen';
import ProfileScreen from '@/components/profile/ProfileScreen';
import LeaderboardScreen from '@/components/leaderboard/LeaderboardScreen';

const MainApp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('match');

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'match':
        return <MatchScreen />;
      case 'rooms':
        return <RoomsScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      default:
        return <MatchScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="pb-20">
        {renderCurrentScreen()}
      </div>
      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default MainApp;
