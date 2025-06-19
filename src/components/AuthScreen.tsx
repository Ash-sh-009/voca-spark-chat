
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignUpScreen from './auth/SignUpScreen';
import SignInScreen from './auth/SignInScreen';

const AuthScreen = () => {
  const [mode, setMode] = useState<'main' | 'signin' | 'signup'>('main');

  if (mode === 'signup') {
    return <SignUpScreen onBack={() => setMode('main')} />;
  }

  if (mode === 'signin') {
    return <SignInScreen onBack={() => setMode('main')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg border-gray-700/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            VocaLink Pro
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect through voice, video, and chat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setMode('signup')}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Create Account
          </Button>
          
          <Button 
            onClick={() => setMode('signin')}
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-purple-500 bg-transparent"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
