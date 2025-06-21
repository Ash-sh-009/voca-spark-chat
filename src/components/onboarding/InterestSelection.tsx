
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Interest {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

const interests: Interest[] = [
  { id: 'music', name: 'Music', emoji: '🎵', description: 'Share your favorite beats', color: 'from-purple-500 to-pink-500' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮', description: 'Talk about games', color: 'from-blue-500 to-cyan-500' },
  { id: 'roleplay', name: 'Roleplay', emoji: '🎭', description: 'Creative conversations', color: 'from-green-500 to-emerald-500' },
  { id: 'deep-talk', name: 'Deep Talk', emoji: '🧠', description: 'Meaningful discussions', color: 'from-orange-500 to-red-500' },
  { id: 'chill-vibes', name: 'Chill Vibes', emoji: '🧋', description: 'Relaxed conversations', color: 'from-teal-500 to-blue-500' },
  { id: 'language', name: 'Language Exchange', emoji: '🌍', description: 'Practice languages', color: 'from-indigo-500 to-purple-500' },
  { id: 'singing', name: 'Singers', emoji: '🎤', description: 'Sing together', color: 'from-pink-500 to-rose-500' },
  { id: 'peace', name: 'Peace & Meditation', emoji: '🧘', description: 'Mindful conversations', color: 'from-green-400 to-blue-400' },
  { id: 'fun', name: 'Fun & Comedy', emoji: '🤡', description: 'Laugh and have fun', color: 'from-yellow-500 to-orange-500' },
  { id: 'art', name: 'Art & Design', emoji: '🎨', description: 'Creative expressions', color: 'from-purple-400 to-pink-400' },
  { id: 'fitness', name: 'Fitness', emoji: '💪', description: 'Health and wellness', color: 'from-red-500 to-orange-500' },
  { id: 'cooking', name: 'Cooking', emoji: '👨‍🍳', description: 'Food and recipes', color: 'from-amber-500 to-yellow-500' },
  { id: 'travel', name: 'Travel', emoji: '✈️', description: 'Share travel stories', color: 'from-sky-500 to-blue-500' },
  { id: 'movies', name: 'Movies & TV', emoji: '🎬', description: 'Discuss shows and films', color: 'from-violet-500 to-purple-500' },
  { id: 'books', name: 'Books', emoji: '📚', description: 'Literature discussions', color: 'from-emerald-500 to-teal-500' },
  { id: 'tech', name: 'Technology', emoji: '💻', description: 'Tech trends and gadgets', color: 'from-gray-500 to-slate-500' },
  { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Sports and competitions', color: 'from-green-500 to-lime-500' },
  { id: 'fashion', name: 'Fashion', emoji: '👗', description: 'Style and trends', color: 'from-rose-500 to-pink-500' },
  { id: 'photography', name: 'Photography', emoji: '📸', description: 'Capture moments', color: 'from-slate-500 to-gray-500' },
  { id: 'nature', name: 'Nature', emoji: '🌿', description: 'Environment and outdoors', color: 'from-green-600 to-emerald-600' }
];

interface InterestSelectionProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  onNext: () => void;
}

const InterestSelection = ({ selectedInterests, onInterestsChange, onNext }: InterestSelectionProps) => {
  const [hoveredInterest, setHoveredInterest] = useState<string | null>(null);

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else if (selectedInterests.length < 5) {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  const canProceed = selectedInterests.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <motion.div
              className="inline-block text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Choose Your Vibes</h1>
          <p className="text-gray-300 text-lg mb-2">Select 3-5 interests to find your perfect matches</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < selectedInterests.length
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-2">
              {selectedInterests.length}/5 selected
            </span>
          </div>
        </motion.div>

        {/* Interests Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {interests.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest.id);
            const isDisabled = !isSelected && selectedInterests.length >= 5;
            
            return (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    isSelected
                      ? `bg-gradient-to-br ${interest.color} border-white/50 shadow-2xl shadow-purple-500/25`
                      : isDisabled
                      ? 'bg-black/20 border-gray-600/30 opacity-50 cursor-not-allowed'
                      : 'bg-black/40 border-gray-700/50 hover:border-purple-500/50 hover:bg-black/60'
                  } backdrop-blur-xl overflow-hidden relative group`}
                  onClick={() => !isDisabled && toggleInterest(interest.id)}
                  onMouseEnter={() => setHoveredInterest(interest.id)}
                  onMouseLeave={() => setHoveredInterest(null)}
                >
                  <CardContent className="p-4 text-center relative z-10">
                    <div className="relative mb-3">
                      <motion.div
                        className="text-3xl mb-2"
                        animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {interest.emoji}
                      </motion.div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <h3 className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {interest.name}
                    </h3>
                    <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                      {interest.description}
                    </p>
                    
                    {hoveredInterest === interest.id && !isDisabled && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Continue Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className={`px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 ${
              canProceed
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-2xl shadow-purple-500/25 animate-pulse'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? '✨ Continue Your Journey' : `Select ${3 - selectedInterests.length} more interests`}
          </Button>
          
          {canProceed && (
            <motion.p
              className="text-gray-400 text-sm mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Great choices! Let's find people who share your vibes ✨
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InterestSelection;
