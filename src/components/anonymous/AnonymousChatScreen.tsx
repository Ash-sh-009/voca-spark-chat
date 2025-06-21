
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, X, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: number;
  nickname: string;
}

const AnonymousChatScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [myNickname] = useState(() => generateNickname());
  const [otherNickname, setOtherNickname] = useState('');
  const [showSaveOption, setShowSaveOption] = useState(false);

  function generateNickname() {
    const adjectives = ['Cool', 'Mystic', 'Bright', 'Swift', 'Silent', 'Bold', 'Wild', 'Calm', 'Free', 'Lucky'];
    const nouns = ['Wolf', 'Star', 'Moon', 'Fire', 'Wave', 'Cloud', 'Storm', 'Dream', 'Song', 'Light'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj}${noun}${num}`;
  }

  const startSearch = () => {
    setIsSearching(true);
    // Simulate finding a match after 2-5 seconds
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      setOtherNickname(generateNickname());
      toast.success('🎉 Connected to someone awesome!');
      
      // Add welcome message
      setMessages([{
        id: '1',
        content: 'Hey there! 👋',
        sender: 'other',
        timestamp: Date.now(),
        nickname: generateNickname()
      }]);
    }, Math.random() * 3000 + 2000);
  };

  const endChat = () => {
    if (messages.length > 3) {
      setShowSaveOption(true);
    } else {
      resetChat();
    }
  };

  const resetChat = () => {
    setIsConnected(false);
    setMessages([]);
    setOtherNickname('');
    setShowSaveOption(false);
    setNewMessage('');
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'me',
      timestamp: Date.now(),
      nickname: myNickname
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate other person's response
    setTimeout(() => {
      const responses = [
        'That\'s interesting! 🤔',
        'I totally agree! 😊',
        'Tell me more about that',
        'Haha, that\'s funny! 😂',
        'I see what you mean',
        'That sounds cool!',
        'What do you think about...',
        'I love that! ❤️'
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        timestamp: Date.now(),
        nickname: otherNickname
      };
      
      setMessages(prev => [...prev, response]);
    }, Math.random() * 2000 + 1000);
  };

  const saveToInbox = () => {
    toast.success('💾 Chat saved to your inbox!');
    resetChat();
  };

  if (showSaveOption) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-8 text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💫
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Great conversation!</h3>
              <p className="text-gray-300 mb-6">
                Would you like to save this chat to your inbox to continue later?
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={saveToInbox}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Chat
                </Button>
                <Button
                  onClick={resetChat}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  End Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-12">
              <motion.div
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">Finding someone to chat...</h3>
              <div className="flex justify-center space-x-1 mb-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-purple-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <p className="text-gray-400">This usually takes a few seconds</p>
              <Button
                onClick={() => setIsSearching(false)}
                variant="outline"
                className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💬
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Anonymous Chat</h1>
            <p className="text-gray-300">Connect with someone random for a text conversation</p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Random nicknames for privacy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Messages auto-delete after chat</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5 text-green-400" />
                    <span className="text-white">Save good conversations to inbox</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Nickname */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-gray-400 mb-2">Your nickname for this session:</p>
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-2">
              <span className="text-purple-300 font-semibold">{myNickname}</span>
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={startSearch}
              className="w-full py-4 text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 rounded-xl shadow-lg shadow-purple-500/25"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Anonymous Chat
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
      {/* Chat Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{otherNickname}</h3>
              <p className="text-green-400 text-sm">● Online</p>
            </div>
          </div>
          <Button
            onClick={endChat}
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <X className="w-4 h-4 mr-2" />
            End Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'me'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-gray-700/50 text-white'
              }`}>
                <p className="text-xs opacity-70 mb-1">{message.nickname}</p>
                <p>{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <div className="bg-black/40 backdrop-blur-xl border-t border-gray-700/50 p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800/50 border-gray-600 text-white"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnonymousChatScreen;
