
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InterestSelection from './InterestSelection';
import ProfileSetup from './ProfileSetup';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    bio: '',
    profileImage: null as string | null,
  });

  const handleInterestsNext = () => {
    setCurrentStep(1);
  };

  const handleProfileComplete = async () => {
    if (!user) return;

    try {
      // Update profile with all the collected data
      await updateProfile({
        name: profileData.name,
        age: parseInt(profileData.age),
        bio: profileData.bio,
        interest: selectedInterests.join(', '), // Convert array to string for the existing schema
        profile_picture_url: profileData.profileImage,
        mood_tags: selectedInterests.slice(0, 3) // First 3 interests as mood tags
      });

      toast.success('🎉 Profile created successfully!');
      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  const steps = [
    {
      component: (
        <InterestSelection
          selectedInterests={selectedInterests}
          onInterestsChange={setSelectedInterests}
          onNext={handleInterestsNext}
        />
      )
    },
    {
      component: (
        <ProfileSetup
          profileData={profileData}
          onProfileChange={setProfileData}
          onComplete={handleProfileComplete}
        />
      )
    }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        {steps[currentStep].component}
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingFlow;
