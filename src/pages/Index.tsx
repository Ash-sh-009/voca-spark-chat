
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import AuthScreen from '@/components/AuthScreen';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      // If user is logged in but has no profile, show onboarding
      if (!profile?.name) {
        setShowOnboarding(true);
      } else {
        // User is fully set up, go to main app
        navigate('/app');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Show onboarding if user is logged in but profile is incomplete
  if (user && showOnboarding) {
    return <OnboardingFlow onComplete={() => navigate('/app')} />;
  }

  // Show auth screen if no user
  if (!user) {
    return <AuthScreen />;
  }

  return null;
};

export default Index;
