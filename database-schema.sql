-- Schema del database per Nuvolino UI Chat
-- Esegui questi comandi nel SQL Editor di Supabase

-- Abilita RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Tabella users (profili utente)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella friends (amicizie e richieste)
CREATE TABLE IF NOT EXISTS friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Tabella servers (server creati)
CREATE TABLE IF NOT EXISTS servers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invite_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella server_members (membri dei server)
CREATE TABLE IF NOT EXISTS server_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(server_id, user_id)
);

-- Tabella channels (canali dei server)
CREATE TABLE IF NOT EXISTS channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'voice')),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella messages (messaggi)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'voice', 'file')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella calls (chiamate)
CREATE TABLE IF NOT EXISTS calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'audio' CHECK (type IN ('audio', 'video')),
  status VARCHAR(20) DEFAULT 'calling' CHECK (status IN ('calling', 'active', 'ended')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Tabella notifications (notifiche)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_servers_owner_id ON servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_server_members_server_id ON server_members(server_id);
CREATE INDEX IF NOT EXISTS idx_server_members_user_id ON server_members(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_server_id ON channels(server_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_calls_caller_id ON calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_receiver_id ON calls(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- RLS (Row Level Security) Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Friends table policies
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their friendships" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests" ON friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships" ON friends
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Servers table policies
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all servers" ON servers
  FOR SELECT USING (true);

CREATE POLICY "Users can create servers" ON servers
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Server owners can update their servers" ON servers
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Server owners can delete their servers" ON servers
  FOR DELETE USING (auth.uid() = owner_id);

-- Server members table policies
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view server memberships" ON server_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join servers" ON server_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave servers" ON server_members
  FOR DELETE USING (auth.uid() = user_id);

-- Channels table policies
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view channels" ON channels
  FOR SELECT USING (true);

CREATE POLICY "Server owners can manage channels" ON channels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM servers 
      WHERE servers.id = channels.server_id 
      AND servers.owner_id = auth.uid()
    )
  );

-- Messages table policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in channels they belong to" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM server_members sm
      JOIN channels c ON c.server_id = sm.server_id
      WHERE c.id = messages.channel_id
      AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON messages
  FOR DELETE USING (auth.uid() = user_id);

-- Calls table policies
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their calls" ON calls
  FOR SELECT USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create calls" ON calls
  FOR INSERT WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can update their calls" ON calls
  FOR UPDATE USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

-- Notifications table policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Funzioni per trigger

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funzione per creare il server di default
CREATE OR REPLACE FUNCTION create_default_server()
RETURNS TRIGGER AS $$
BEGIN
  -- Crea il server di default "Nuvolino UI"
  INSERT INTO servers (name, description, owner_id, invite_code)
  VALUES (
    'Nuvolino UI',
    'Il server ufficiale di Nuvolino UI Chat! Qui puoi incontrare nuovi amici e parlare con altri fan di Nuvolino.',
    NEW.id,
    'nuvolino-official'
  );
  
  -- Aggiungi l'utente come membro del server
  INSERT INTO server_members (server_id, user_id, role)
  SELECT id, NEW.id, 'owner'
  FROM servers
  WHERE invite_code = 'nuvolino-official';
  
  -- Crea il canale di benvenuto
  INSERT INTO channels (server_id, name, type, position)
  SELECT id, 'benvenuto', 'text', 0
  FROM servers
  WHERE invite_code = 'nuvolino-official';
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per creare il server di default quando si registra un nuovo utente
CREATE TRIGGER create_default_server_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_default_server();

-- Inserisci il messaggio di benvenuto nel canale di benvenuto
INSERT INTO messages (channel_id, user_id, content, type)
SELECT 
  c.id,
  u.id,
  '🐶 Ciao, benvenuto nella Nuvola! Qui puoi incontrare nuovi amici e parlare con altri fan di Nuvolino!',
  'text'
FROM channels c
JOIN servers s ON s.id = c.server_id
JOIN users u ON u.id = s.owner_id
WHERE c.name = 'benvenuto' AND s.invite_code = 'nuvolino-official'
ON CONFLICT DO NOTHING;

-- ========================================
-- NUOVE TABELLE PER FUNZIONALITÀ AVANZATE
-- ========================================

-- Estensione tabella users per gamification
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nuvo_coins INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_status TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT NOW();

-- Tabella user_levels per sistema XP
CREATE TABLE IF NOT EXISTS user_levels (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  total_xp INTEGER DEFAULT 0,
  prestige INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('social', 'chat', 'games', 'server', 'special')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  points INTEGER DEFAULT 0,
  condition JSONB NOT NULL,
  reward JSONB NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella user_achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, achievement_id)
);

-- Tabella xp_transactions
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella badges
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  color TEXT NOT NULL,
  glow_effect BOOLEAN DEFAULT FALSE,
  animated BOOLEAN DEFAULT FALSE,
  requirements JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, badge_id)
);

-- Tabella daily_streaks
CREATE TABLE IF NOT EXISTS daily_streaks (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login TIMESTAMP DEFAULT NOW(),
  streak_bonus INTEGER DEFAULT 0
);

-- Tabella shop_items
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- in NuvoCoins
  type TEXT NOT NULL CHECK (type IN ('sticker_pack', 'theme', 'badge', 'emoji', 'avatar_frame', 'sound_effect')),
  preview_url TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella user_inventory
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES shop_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);

-- Tabella premium_subscriptions
CREATE TABLE IF NOT EXISTS premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella sticker_packs
CREATE TABLE IF NOT EXISTS sticker_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  price INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella stickers
CREATE TABLE IF NOT EXISTS stickers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id UUID REFERENCES sticker_packs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  animated BOOLEAN DEFAULT FALSE,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella games
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  max_players INTEGER NOT NULL,
  min_players INTEGER NOT NULL,
  estimated_duration INTEGER NOT NULL, -- in seconds
  category TEXT NOT NULL CHECK (category IN ('puzzle', 'action', 'trivia', 'strategy', 'casual')),
  is_multiplayer BOOLEAN DEFAULT FALSE,
  rules TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella game_sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  players UUID[] NOT NULL, -- array user_ids
  game_state JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'active', 'finished', 'cancelled')),
  winner_id UUID REFERENCES users(id),
  score JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Tabella game_leaderboard
CREATE TABLE IF NOT EXISTS game_leaderboard (
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  score INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  games_played INTEGER DEFAULT 0,
  win_rate DECIMAL(3,2) DEFAULT 0,
  best_score INTEGER NOT NULL,
  last_played TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (game_id, user_id)
);

-- Tabella public_posts (feed pubblico)
CREATE TABLE IF NOT EXISTS public_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella post_likes
CREATE TABLE IF NOT EXISTS post_likes (
  post_id UUID REFERENCES public_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Tabella post_comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella message_threads
CREATE TABLE IF NOT EXISTS message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  message_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW()
);

-- Tabella roles (per server)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#87CEEB',
  permissions JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Tabella moderation_logs
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
  moderator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('warn', 'kick', 'ban', 'timeout', 'delete_message', 'mute')),
  reason TEXT,
  duration INTEGER, -- minuti per timeout
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella support_tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'account', 'payment', 'feature', 'other')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Tabella gift_transactions
CREATE TABLE IF NOT EXISTS gift_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES shop_items(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  received_at TIMESTAMP
);

-- ========================================
-- INDICI PER PERFORMANCE
-- ========================================

-- Indici per gamification
CREATE INDEX IF NOT EXISTS idx_user_levels_level ON user_levels(level);
CREATE INDEX IF NOT EXISTS idx_user_levels_total_xp ON user_levels(total_xp);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON user_achievements(is_completed);

-- Indici per shop
CREATE INDEX IF NOT EXISTS idx_shop_items_type ON shop_items(type);
CREATE INDEX IF NOT EXISTS idx_shop_items_category ON shop_items(category);
CREATE INDEX IF NOT EXISTS idx_shop_items_premium ON shop_items(is_premium);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);

-- Indici per giochi
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_leaderboard_game_id ON game_leaderboard(game_id);
CREATE INDEX IF NOT EXISTS idx_game_leaderboard_score ON game_leaderboard(score DESC);

-- Indici per feed pubblico
CREATE INDEX IF NOT EXISTS idx_public_posts_author_id ON public_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_public_posts_created_at ON public_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_posts_pinned ON public_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- Indici per moderazione
CREATE INDEX IF NOT EXISTS idx_moderation_logs_server_id ON moderation_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_target_user_id ON moderation_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- ========================================
-- TRIGGER PER AGGIORNAMENTI
-- ========================================

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_shop_items_updated_at BEFORE UPDATE ON shop_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_posts_updated_at BEFORE UPDATE ON public_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DATI INIZIALI
-- ========================================

-- Inserisci achievement predefiniti
INSERT INTO achievements (name, description, icon, category, rarity, points, condition, reward, is_hidden) VALUES
('Primo Messaggio', 'Invia il tuo primo messaggio', '💬', 'chat', 'common', 10, '{"type": "messages", "value": 1, "description": "Invia 1 messaggio"}', '{"coins": 10}', false),
('Chiacchierone', 'Invia 100 messaggi', '🗣️', 'chat', 'rare', 50, '{"type": "messages", "value": 100, "description": "Invia 100 messaggi"}', '{"coins": 50}', false),
('Amico di Nuvolino', 'Aggiungi il tuo primo amico', '👋', 'social', 'common', 25, '{"type": "friends", "value": 1, "description": "Aggiungi 1 amico"}', '{"coins": 25}', false),
('Social Butterfly', 'Aggiungi 10 amici', '🦋', 'social', 'rare', 100, '{"type": "friends", "value": 10, "description": "Aggiungi 10 amici"}', '{"coins": 100}', false),
('Fondatore', 'Crea il tuo primo server', '🏠', 'server', 'epic', 200, '{"type": "servers", "value": 1, "description": "Crea 1 server"}', '{"coins": 200, "badge": "founder"}', false),
('Livello 10', 'Raggiungi il livello 10', '⭐', 'special', 'rare', 100, '{"type": "level", "value": 10, "description": "Raggiungi il livello 10"}', '{"coins": 100, "title": "Esperto"}', false),
('Gamer', 'Vinci la tua prima partita', '🎮', 'games', 'common', 30, '{"type": "games_won", "value": 1, "description": "Vinci 1 partita"}', '{"coins": 30}', false),
('Campione', 'Vinci 50 partite', '🏆', 'games', 'legendary', 500, '{"type": "games_won", "value": 50, "description": "Vinci 50 partite"}', '{"coins": 500, "badge": "champion"}', false)
ON CONFLICT DO NOTHING;

-- Inserisci badge predefiniti
INSERT INTO badges (name, description, icon, rarity, color, glow_effect, animated, requirements) VALUES
('Nuvolino Novizio', 'Il primo passo nella Nuvola', '🐶', 'common', '#87CEEB', false, false, '{"level": 1}'),
('Amico di Nuvolino', 'Hai fatto amicizia con Nuvolino', '☁️', 'common', '#A8D8EA', false, false, '{"level": 5}'),
('Esperto Nuvolino', 'Conosci bene la Nuvola', '⭐', 'rare', '#FFD700', true, false, '{"level": 25}'),
('Maestro della Nuvola', 'Sei un maestro della Nuvola', '👑', 'epic', '#FF6B9D', true, true, '{"level": 50}'),
('Leggenda di Nuvolino', 'Una leggenda vivente', '🌟', 'legendary', '#E6E6FA', true, true, '{"level": 100}'),
('Fondatore', 'Uno dei primi nella Nuvola', '🏠', 'epic', '#32CD32', true, false, '{"special_condition": "founder"}'),
('Campione', 'Vincitore di molte partite', '🏆', 'rare', '#FF4500', true, false, '{"achievement_id": "champion"}')
ON CONFLICT DO NOTHING;

-- Inserisci giochi predefiniti
INSERT INTO games (name, description, icon, max_players, min_players, estimated_duration, category, is_multiplayer, rules) VALUES
('Nuvolino Run', 'Aiuta Nuvolino a correre tra le nuvole', '🏃‍♂️', 1, 1, 60, 'action', false, '["Usa le frecce per saltare", "Evita gli ostacoli", "Raccogli le stelle per punti bonus", "Sopravvivi il più a lungo possibile"]'),
('Memory Cloud', 'Gioco di memoria con carte di Nuvolino', '🧠', 4, 2, 120, 'puzzle', true, '["Trova le coppie di carte uguali", "A turno, gira due carte", "Se sono uguali, le tieni", "Vince chi ha più coppie"]'),
('Trivia Time', 'Quiz veloce su Nuvolino e la community', '❓', 8, 2, 180, 'trivia', true, '["Rispondi alle domande il più velocemente possibile", "Ogni risposta corretta vale punti", "Bonus per risposte consecutive", "Vince chi ha più punti alla fine"]'),
('Tic-Tac-Toe', 'Il classico tris con tema Nuvolino', '⭕', 2, 2, 60, 'strategy', true, '["Gioca a turni", "Metti 3 simboli in fila per vincere", "Riga, colonna o diagonale", "Se la griglia si riempie, è pareggio"]'),
('Dadi e Moneta', 'Utilità per giochi di ruolo', '🎲', 10, 1, 30, 'casual', true, '["Lancia dadi virtuali", "Lancia monete per decisioni", "Perfetto per giochi di ruolo", "Risultati condivisi in tempo reale"]')
ON CONFLICT DO NOTHING;

-- Inserisci articoli shop predefiniti
INSERT INTO shop_items (name, description, price, type, preview_url, is_premium, category, tags) VALUES
('Pack Nuvolino Base', '20 sticker gratuiti di Nuvolino', 0, 'sticker_pack', '/shop/nuvolino-base.png', false, 'stickers', '["nuvolino", "gratis", "base"]'),
('Pack Emozioni', 'Sticker per esprimere le tue emozioni', 50, 'sticker_pack', '/shop/emotions.png', false, 'stickers', '["emotions", "feelings", "cute"]'),
('Tema Scuro Premium', 'Tema scuro elegante con accenti azzurro neon', 200, 'theme', '/shop/dark-theme.png', true, 'themes', '["dark", "premium", "elegant"]'),
('Badge Fondatore', 'Badge esclusivo per i primi 100 membri', 0, 'badge', '/shop/founder-badge.png', false, 'badges', '["exclusive", "founder", "rare"]'),
('Cornice Arcobaleno', 'Cornice animata arcobaleno per avatar', 150, 'avatar_frame', '/shop/rainbow-frame.gif', false, 'frames', '["rainbow", "animated", "colorful"]'),
('Suono "Woof"', 'Notifica personalizzata con il verso di Nuvolino', 80, 'sound_effect', '/shop/woof-sound.png', false, 'sounds', '["nuvolino", "woof", "notification"]')
ON CONFLICT DO NOTHING;
