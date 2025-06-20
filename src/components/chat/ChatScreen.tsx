
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Search, Plus, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

interface Chat {
  id: string;
  match_id: string;
  other_user: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  message_type: string;
}

const ChatScreen = () => {
  const { user, profile } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdReward, setShowAdReward] = useState(false);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      // Get matches where chat is unlocked
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .eq('chat_unlocked', true)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (!matches) {
        setChats([]);
        setLoading(false);
        return;
      }

      // Get user profiles for each match
      const chatList: Chat[] = [];
      
      for (const match of matches) {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        
        // Get the other user's profile
        const { data: otherUserProfile } = await supabase
          .from('profiles')
          .select('id, name, profile_picture_url')
          .eq('id', otherUserId)
          .single();

        if (otherUserProfile) {
          chatList.push({
            id: match.id,
            match_id: match.id,
            other_user: {
              id: otherUserProfile.id,
              name: otherUserProfile.name,
              profile_picture_url: otherUserProfile.profile_picture_url
            },
            last_message: 'Start chatting...',
            last_message_time: match.updated_at,
            unread_count: 0
          });
        }
      }

      setChats(chatList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chats');
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          match_id: selectedChat.match_id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedChat.match_id);
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    loadMessages(chat.match_id);
  };

  const watchAdForCoins = async () => {
    setShowAdReward(true);
    
    // Simulate ad watching (3 seconds)
    setTimeout(async () => {
      try {
        // Award 3 coins for watching ad
        await supabase.rpc('update_user_coins', {
          user_id: user.id,
          coin_amount: 3,
          transaction_type: 'earned',
          reason: 'Watched advertisement'
        });
        
        setShowAdReward(false);
        toast.success('🪙 +3 Coins earned! Thanks for watching!');
      } catch (error) {
        console.error('Error awarding coins:', error);
        toast.error('Failed to award coins');
        setShowAdReward(false);
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Ad Reward Modal
  if (showAdReward) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <Card className="bg-black/60 backdrop-blur-xl border-yellow-500/50 max-w-sm w-full">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Watching Ad...</h3>
            <p className="text-gray-300 mb-4">Get ready to earn 3 coins!</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
        {/* Chat Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setSelectedChat(null)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                ←
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {selectedChat.other_user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold">{selectedChat.other_user.name}</h3>
                <p className="text-gray-400 text-sm">Online</p>
              </div>
            </div>
            
            {/* Watch Ad Button */}
            <Button
              onClick={watchAdForCoins}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-1 text-sm rounded-full"
            >
              <Coins className="w-4 h-4 mr-1" />
              Watch Ad
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender_id === user?.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-700/50 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
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
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-300">Your conversations</p>
        </div>
        
        {/* Watch Ad Button - Top Right */}
        <Button
          onClick={watchAdForCoins}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
        >
          <Coins className="w-4 h-4 mr-2" />
          Watch Ad (+3)
        </Button>
      </div>

      {/* Coin Balance Display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-yellow-500/30">
          <Coins className="w-6 h-6 text-yellow-400 mr-2 animate-pulse" />
          <span className="text-2xl font-bold text-yellow-400">{profile?.coins || 0}</span>
          <span className="text-gray-300 ml-2">Coins</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search conversations..."
          className="pl-10 bg-gray-800/50 border-gray-600 text-white"
        />
      </div>

      {/* Chat List */}
      <div className="space-y-4">
        {chats.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
            <CardContent className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Chats Yet</h3>
              <p className="text-gray-400 mb-6">
                Start matching with people to unlock conversations!
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Start Matching
              </Button>
            </CardContent>
          </Card>
        ) : (
          chats.map((chat) => (
            <Card
              key={chat.id}
              className="bg-black/40 backdrop-blur-xl border-gray-700/50 cursor-pointer hover:bg-gray-800/30 transition-all duration-300"
              onClick={() => selectChat(chat)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {chat.other_user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white">{chat.other_user.name}</h3>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.last_message_time).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{chat.last_message}</p>
                  </div>
                  {chat.unread_count > 0 && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{chat.unread_count}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
