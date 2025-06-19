
import { useState } from 'react';
import OnboardingFlow from '@/components/OnboardingFlow';
import AuthScreen from '@/components/AuthScreen';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return <AuthScreen />;
};

export default Index;
