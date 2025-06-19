
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  interest TEXT NOT NULL,
  bio TEXT DEFAULT '',
  profile_picture_url TEXT,
  voice_status_url TEXT,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 10,
  level INTEGER DEFAULT 1,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  mood_tags TEXT[] DEFAULT '{}',
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create match pool for random matching
CREATE TABLE public.match_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL CHECK (match_type IN ('voice', 'video', 'text')),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL CHECK (match_type IN ('voice', 'video', 'text')),
  user1_vibed BOOLEAN DEFAULT FALSE,
  user2_vibed BOOLEAN DEFAULT FALSE,
  chat_unlocked BOOLEAN DEFAULT FALSE,
  agora_channel_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'voice', 'emoji')),
  content TEXT,
  voice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice rooms table
CREATE TABLE public.voice_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  coin_entry_cost INTEGER DEFAULT 0,
  agora_channel_id TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room participants table
CREATE TABLE public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.voice_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'listener' CHECK (role IN ('host', 'speaker', 'listener')),
  has_mic BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Create XP transactions table
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coin transactions table
CREATE TABLE public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'purchased')),
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly leaderboard table
CREATE TABLE public.weekly_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Create follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-notes', 'voice-notes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-status', 'voice-status', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for match_pool
CREATE POLICY "Users can manage own match pool entries" ON public.match_pool FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their matches" ON public.matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can update their matches" ON public.matches FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their matches" ON public.chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = chat_messages.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages in their matches" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- RLS Policies for voice_rooms
CREATE POLICY "Anyone can view active voice rooms" ON public.voice_rooms FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create voice rooms" ON public.voice_rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their rooms" ON public.voice_rooms FOR UPDATE USING (auth.uid() = host_id);

-- RLS Policies for room_participants
CREATE POLICY "Users can view room participants" ON public.room_participants FOR SELECT USING (true);
CREATE POLICY "Users can join rooms" ON public.room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave rooms" ON public.room_participants FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for XP and coin transactions
CREATE POLICY "Users can view own transactions" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own coin transactions" ON public.coin_transactions FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for leaderboard
CREATE POLICY "Anyone can view leaderboard" ON public.weekly_leaderboard FOR SELECT USING (true);

-- RLS Policies for follows
CREATE POLICY "Users can view all follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Storage policies
CREATE POLICY "Anyone can view profile pictures" ON storage.objects FOR SELECT USING (bucket_id = 'profile-pictures');
CREATE POLICY "Users can upload their profile pictures" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update their profile pictures" ON storage.objects FOR UPDATE USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view voice notes in their matches" ON storage.objects FOR SELECT USING (bucket_id = 'voice-notes');
CREATE POLICY "Users can upload voice notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'voice-notes');

CREATE POLICY "Anyone can view voice status" ON storage.objects FOR SELECT USING (bucket_id = 'voice-status');
CREATE POLICY "Users can upload their voice status" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'voice-status' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, age, gender, interest)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 18),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'other'),
    COALESCE(NEW.raw_user_meta_data->>'interest', 'General')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update XP and level
CREATE OR REPLACE FUNCTION public.update_user_xp(user_id UUID, xp_gain INTEGER, reason TEXT)
RETURNS void AS $$
DECLARE
  current_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Insert XP transaction
  INSERT INTO public.xp_transactions (user_id, xp_amount, reason)
  VALUES (user_id, xp_gain, reason);
  
  -- Update user's total XP
  UPDATE public.profiles 
  SET xp = xp + xp_gain,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Get current XP and calculate new level
  SELECT xp INTO current_xp FROM public.profiles WHERE id = user_id;
  new_level := FLOOR(current_xp / 100) + 1;
  
  -- Update level if changed
  UPDATE public.profiles 
  SET level = new_level
  WHERE id = user_id AND level != new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update coin balance
CREATE OR REPLACE FUNCTION public.update_user_coins(user_id UUID, coin_amount INTEGER, transaction_type TEXT, reason TEXT)
RETURNS void AS $$
BEGIN
  -- Insert coin transaction
  INSERT INTO public.coin_transactions (user_id, coin_amount, transaction_type, reason)
  VALUES (user_id, coin_amount, transaction_type, reason);
  
  -- Update user's coin balance
  UPDATE public.profiles 
  SET coins = coins + coin_amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for necessary tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_pool;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
