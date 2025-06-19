
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

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
            {isLogin ? 'Welcome Back' : 'Join VocaLink Pro'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
            <h3 className="text-white text-lg font-semibold mb-2">🔗 Connect Supabase First</h3>
            <p className="text-gray-300 text-sm mb-4">
              To enable authentication and all backend features, please connect your Supabase project using the green button in the top right corner.
            </p>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-3">
              <p className="text-yellow-300 text-xs">
                ⚡ Once connected, you'll have full authentication, real-time chat, profile management, and more!
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-400 hover:text-white hover:border-purple-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
