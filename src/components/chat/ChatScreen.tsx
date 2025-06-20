
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Heart, Search, MoreVertical, Send, Mic, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ChatScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      // Remove the foreign key hints that don't exist
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('chat_unlocked', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user profiles separately
      const matchesWithProfiles = await Promise.all(
        (data || []).map(async (match) => {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();
          
          return {
            ...match,
            otherUser: profile
          };
        })
      );
      
      setMatches(matchesWithProfiles);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: selectedChat.id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const openChat = (match: any) => {
    setSelectedChat(match);
    fetchMessages(match.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-400 animate-pulse">Loading your vibes...</p>
        </div>
      </div>
    );
  }

  // Chat interface when a conversation is selected
  if (selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
        {/* Chat Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-gray-700/50 p-4">
          <div className="flex items-center space-x-4 max-w-md mx-auto">
            <Button
              onClick={() => setSelectedChat(null)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white rounded-full w-10 h-10 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {selectedChat.otherUser?.name || 'Anonymous'}
                </h3>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
          {messages.map((message) => {
            const isMe = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isMe
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-800/50 text-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-black/40 backdrop-blur-xl border-t border-gray-700/50 p-4">
          <div className="flex items-center space-x-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="bg-gray-800/50 border-gray-600/50 text-white pr-12 rounded-full"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 text-gray-400 hover:text-white"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/5 rounded-full animate-pulse animation-delay-75"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Inbox</h1>
            <p className="text-gray-400">Your voice connections</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white rounded-full w-10 h-10 p-0">
              <Search className="w-5 h-5" />
            </Button>
            <div className="relative">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {matches.map((match) => (
            <Card 
              key={match.id}
              onClick={() => openChat(match)}
              className="bg-black/40 backdrop-blur-xl border-gray-700/50 hover:bg-black/60 transition-all duration-300 cursor-pointer group overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl">👤</span>
                    </div>
                    {/* Online status */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {match.otherUser?.name || 'Anonymous'}
                      </h3>
                      <span className="text-xs text-gray-400">2m ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {match.match_type === 'voice' && <div className="w-2 h-2 bg-purple-400 rounded-full"></div>}
                        {match.match_type === 'video' && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                        {match.match_type === 'text' && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                        <span className="text-xs text-gray-400 capitalize">
                          {match.match_type} match
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 truncate">
                      Tap to start chatting! 😊
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {matches.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <MessageCircle className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">No Vibes Yet</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Start matching to find people who vibe with you!
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              Start Matching
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
